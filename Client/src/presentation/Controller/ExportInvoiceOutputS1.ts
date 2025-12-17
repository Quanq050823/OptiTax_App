import { Invoice, InvoiceListResponse, Profile } from "@/src/types/route";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import * as FileSystem from "expo-file-system/legacy";

type DataSetup = {
  mode: "month" | "quarter" | "range";
  selectedDate?: CalendarDate | undefined;
  range: { startDate?: CalendarDate; endDate?: CalendarDate };
  invoicesOutput: Invoice[];
  profile: Profile | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
type DetailRow = {
  date: string;
  soHieu: string;
  ngayChungTu: string;
  dienGiai: string;
  doanhThu: number
  // 7 cột doanh thu chuẩn S1
  col1: number; // Phân phối
  col2: number; // Dịch vụ
  col3: number; // Sản xuất - vận tải
  col4: number; // Hoạt động khác
  col5: number; // …
  col6: number; // …
  col7: number; // …

  // Nếu bạn vẫn muốn giữ tổng, thì thêm:
  // doanhThu: number;
};
type GroupedRow = {
    tchat: number; // Tính chất (1: Phân phối, 2: Dịch vụ, ...)
    groupTitle: string;
    totalAmount: number;
    totalTNCN: number;
    totalGTGT: number;
    details: {
        date: string; // Ngày (A)
        soHieu: string; // Số hiệu (B)
        dienGiai: string; // Tên sản phẩm/dịch vụ (C)
        doanhThu: number; // Số tiền (1)
        taxRateTNCN: number; // Thuế suất TNCN (2)
        taxAmountTNCN: number; // Thuế phải nộp TNCN (3)
        taxRateGTGT: number; // Thuế suất GTGT (4)
        taxAmountGTGT: number; // Thuế phải nộp GTGT (5)
    }[];
};
export async function exportInvoiceOutputS1({
  mode,
  selectedDate,
  range,
  invoicesOutput,
  profile,
  setLoading,
}: DataSetup) {
  const getQuarter = (month: number) => {
    if (month <= 3) return 1;
    if (month <= 6) return 2;
    if (month <= 9) return 3;
    return 4;
  };
  try {
    setLoading(true);
    if (!invoicesOutput) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (mode === "month" && selectedDate) {
      const d = new Date(selectedDate);
      startDate = new Date(d.getFullYear(), d.getMonth(), 1);
      endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }

    if (mode === "quarter" && selectedDate) {
      const d = new Date(selectedDate);
      const q = getQuarter(d.getMonth() + 1);
      const startMonth = (q - 1) * 3;
      startDate = new Date(d.getFullYear(), startMonth, 1);
      endDate = new Date(d.getFullYear(), startMonth + 3, 0);
    }

    if (mode === "range" && range.startDate && range.endDate) {
      startDate = new Date(range.startDate);
      endDate = new Date(range.endDate);
    }

    if (!startDate || !endDate) {
      alert("Vui lòng chọn thời gian hợp lệ");
      return;
    }
const parseLocalDate = (str: string) => {
  const [datePart] = str.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  return new Date(y, m - 1, d);
};
    // --- 1. Lọc hoá đơn ---
   const filtered = invoicesOutput.filter((inv) => {
    const invDate = parseLocalDate(inv.ncnhat);
    invDate.setHours(0, 0, 0, 0);
    return invDate >= startDate! && invDate <= endDate!;
}); 
function getTaxRate(tchat: number) {
  switch (tchat) {
    case 1:
      return { tncnRate: 0.005, gtgtRate: 0.01 };
    case 2:
      return { tncnRate: 0.02, gtgtRate: 0.05 };
    default:
      return { tncnRate: 0, gtgtRate: 0 };
  }
}
    // --- 2. Gom nhóm theo ngày ---
    const detailRows: DetailRow[] = [];
const mapColumns = (tchat: number, amount: number) => {
  const cols = {
    col1: 0, col2: 0, col3: 0, col4: 0,
    col5: 0, col6: 0, col7: 0,
  };

  if (tchat === 1) cols.col1 = amount;
  else if (tchat === 2) cols.col2 = amount;
  else if (tchat === 3) cols.col3 = amount;
  else if (tchat === 4) cols.col4 = amount;

  return cols;
};

const groupedData: Record<number, {
  tchat: number;
  groupTitle: string;
  totalAmount: number;
  totalTNCN: number;
  totalGTGT: number;
  details: {
    day: string;
    soHieuList: string[];
    dienGiaiList: string[];
    amount: number;
    tncn: number;
    gtgt: number;
    taxRateTNCN: number;
    taxRateGTGT: number;
  }[];
}> = {};
let grandTotal = {
    amount: 0,
    totalTNCN: 0,
    totalGTGT: 0,
};
filtered.forEach(inv => {
  const day = new Date(inv.ncnhat).toLocaleDateString("vi-VN");

  inv.hdhhdvu?.forEach(item => {
    const amount = Number(item.thtien ?? 0);
    const tchat = Number(item.tchat ?? 0);
    if (tchat === 0) return;

    const { tncnRate, gtgtRate } = getTaxRate(tchat);

    if (!groupedData[tchat]) {
      groupedData[tchat] = {
        tchat,
        groupTitle:
          tchat === 1
            ? "1. Ngành nghề: Phân phối, cung cấp hàng hóa"
            : tchat === 2
            ? "2. Ngành nghề: Dịch vụ, xây dựng"
            : "3. Nhóm khác",
        totalAmount: 0,
        totalTNCN: 0,
        totalGTGT: 0,
        details: [],
      };
    }

    groupedData[tchat].details.push({
      day,
      soHieuList: [inv.khmshdon],
      dienGiaiList: [item.ten || ""],
      amount,
      tncn: amount * tncnRate,
      gtgt: amount * gtgtRate,
      taxRateTNCN: tncnRate * 100,
      taxRateGTGT: gtgtRate * 100,
    });

    groupedData[tchat].totalAmount += amount;
    groupedData[tchat].totalTNCN += amount * tncnRate;
    groupedData[tchat].totalGTGT += amount * gtgtRate;

    grandTotal.amount += amount;
    grandTotal.totalTNCN += amount * tncnRate;
    grandTotal.totalGTGT += amount * gtgtRate;
  });
});

const sortedGroups = Object.values(groupedData).sort((a, b) => a.tchat - b.tchat);

    // --- 3. Render HTML ---
const rows = Object.values(groupedData)
  .sort((a, b) => a.tchat - b.tchat)
  .map(group => {
    const groupHeaderRow = `
      <tr>
        <td colspan="3" style="text-align:left;"><b>${group.groupTitle}</b></td>
        <td></td>
        <td colspan="4"></td>
      </tr>
    `;

    const detailRows = group.details
      .map(d => {
        return `
          <tr>
            <td>${d.soHieuList.join("<br/>")}</td>
            <td>${d.day}</td>
            <td>${d.dienGiaiList.join("<br/>")}</td>
            <td>${d.amount.toLocaleString("vi-VN")}</td>

            <td>${d.taxRateTNCN}%</td>
            <td>${d.tncn.toLocaleString("vi-VN")}</td>

            <td>${d.taxRateGTGT}%</td>
            <td>${d.gtgt.toLocaleString("vi-VN")}</td>
          </tr>
        `;
      })
      .join("");

    const groupTotalRow = `
      <tr>
        <td colspan="3"><b>Tổng cộng (${group.tchat})</b></td>
        <td><b>${group.totalAmount.toLocaleString("vi-VN")}</b></td>
        <td></td>
        <td><b>${group.totalTNCN.toLocaleString("vi-VN")}</b></td>
        <td></td>
        <td><b>${group.totalGTGT.toLocaleString("vi-VN")}</b></td>
      </tr>
    `;

    return groupHeaderRow + detailRows + groupTotalRow;
  })
  .join("");

    const html = `
      <style>
  body { font-family: "Times New Roman", serif; font-size: 13px; }
  h2, h3 { text-align: center; margin: 4px 0; }
  .header { text-align: left; font-size: 13px; margin-bottom: 10px; }
  .right { text-align: right; font-size: 12px; font-style: italic; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td {
    border: 1px solid #000;
    padding: 4px;
    text-align: center;
  }
  th { font-weight: bold; }
  .note { margin-top: 8px; font-size: 12px; }
  .footer {
    margin-top: 30px;
      display: flex;

    font-size: 13px;
  }
  .sign { text-align: center;
  margin-left: auto; 
  width: 200px;  }
</style>

      <div class="header">
        <b>HỘ, CÁ NHÂN KINH DOANH: ${profile?.businessName ?? ""}</b><br/>
        <b>Địa chỉ: ${profile?.address?.street ?? ""} - ${
      profile?.address?.ward ?? ""
    } - ${profile?.address?.district ?? ""} - ${
      profile?.address?.city ?? ""
    }</b>
     <b>Mã số thuế: </b>
      </div>
      <div class="right">Mẫu số S1-HKD</div>
      <h2>SỔ CHI TIẾT DOANH THU BÁN HÀNG, DỊCH VỤ</h2>
      <p style="text-align:center">Địa điểm kinh doanh: ${
        profile?.address.street
      } - ${profile?.address.ward} - ${profile?.address.district} - ${
      profile?.address.city
    }</p>
      <p style="text-align:center">Kỳ kê khai: </p>
     <table>
  <tr>
    <th colspan="2">Hóa đơn</th>
    <th rowspan="2">Giao dịch</th>
    <th rowspan="2">Số tiền</th>
    <th colspan="2">Thuế TNCN</th>
    <th colspan="2">Thuế GTGT</th>
  </tr>
  <tr>
    <th>Số hiệu</th>
    <th>Ngày, tháng</th>
    <th>Thuế suất</th>
    <th>Thuế phải nộp</th>
    <th>Thuế suất</th>
    <th>Thuế phải nộp</th>
  </tr>
  
        ${rows}
        
        <tr>
    <td colspan="3" style="text-align:center;"><b>Tổng cộng tất cả</b></td>
    <td><b>${grandTotal.amount.toLocaleString("vi-VN")}</b></td>
    <td></td>
    <td><b>${grandTotal.totalTNCN.toLocaleString("vi-VN")}</b></td>
    <td></td>
    <td><b>${grandTotal.totalGTGT.toLocaleString("vi-VN")}</b></td>
  </tr>
      </table>
  
<div class="footer">
  
  <div class="sign">
    Ngày ${today.getDate()} tháng ${
      today.getMonth() + 1
    } năm ${today.getFullYear()} <br/><br/>
    <b>NGƯỜI ĐẠI DIỆN HỘ KINH DOANH</b><br/>
    (Ký, họ tên, đóng dấu)
  </div>
</div>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    // Tạo path mới trong documentDirectory
    const newPath =
      (FileSystem as any).documentDirectory +
      `So_Chi_Tiet_Doanh_Thu_Ban_Hang_Hoa_Dich_Vu_S1_${
        startDate.getMonth() + 1
      }_${startDate.getFullYear()}.pdf`;
    await FileSystem.moveAsync({
      from: uri,
      to: newPath,
    });
    await Sharing.shareAsync(newPath);
  } catch (error) {
    console.error("Export PDF error:", error);
  } finally {
    setLoading(false);
  }
}
const handleExportPDF = async () => {};
