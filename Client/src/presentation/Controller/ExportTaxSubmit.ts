import { Invoice, Profile } from "@/src/types/route";
import { TaxItem } from "@/src/types/tax";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

type DataSetup = {
  mode: "month" | "quarter" | "range";
  selectedDate?: CalendarDate | undefined;
  range: { startDate?: CalendarDate; endDate?: CalendarDate };
  profile: Profile | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  invoicesOutput: Invoice[];
  taxList: TaxItem[]
};

export async function ExportTaxSubmitS4({
  mode,
  selectedDate,
  range,
  profile,
  setLoading,
  invoicesOutput,
  
}: DataSetup) {
      console.log(invoicesOutput, "invoice");

  const getQuarter = (month: number) => {
    if (month <= 3) return 1;
    if (month <= 6) return 2;
    if (month <= 9) return 3;
    return 4;
  };

  try {
    setLoading(true);
    
    if (!invoicesOutput || invoicesOutput.length === 0) {
      alert("Không có hóa đơn nào để xuất");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    // --- Lấy thời gian lọc ---
if (mode === "month" && selectedDate) {
  const d = new Date(selectedDate);
  startDate = new Date(d.getFullYear(), d.getMonth(), 1);       // 01/08
  endDate = new Date(d.getFullYear(), d.getMonth() + 1, 1);     // 01/09
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
const filtered = invoicesOutput.filter((inv) => {
  const invDate = new Date(inv.ncnhat);
  return invDate >= startDate! && invDate < endDate!;
});

        console.log(filtered, "Hoas ddon");

    
    if (filtered.length === 0) {
      alert("Không có hóa đơn trong khoảng thời gian này");
      return;
    }

    

    // --- Tính thuế phải nộp từng hóa đơn ---
    // giả sử thuế GTGT 10% của tổng tiền
    const taxRate = 0.1;

    const rows = filtered
      .map((inv, index) => {
        const invDate = new Date(inv.ncnhat).toLocaleDateString("vi-VN");
        const total = Number(inv.tgtttbso ?? 0);
        const tax = Math.round(total * taxRate);

        return `
          <tr>
            <td>HD${String(index + 1).padStart(4, "0")}</td>
            <td>${invDate}</td>
            <td>${inv.nmten ?? "Không rõ người mua"}</td>
            <td>${inv.mhdon ?? ""}</td>
            <td>${total.toLocaleString("vi-VN")}</td>
            <td>${tax.toLocaleString("vi-VN")}</td>
            <td></td>
          </tr>`;
      })
      .join("");

    const tongPhaiNop = filtered.reduce(
      (sum, inv) => sum + Math.round((Number(inv.tgtttbso ?? 0)) * taxRate),
      0
    );

    // --- HTML in ra file PDF ---
    const html = `
      <style>
        body { font-family: "Times New Roman"; font-size: 13px; }
        .header { display: flex; justify-content: space-between; font-size: 13px; }
        h3 { text-align: center; margin: 6px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 4px; text-align: center; font-size: 12px; }
        .note { font-size: 12px; margin-top: 10px; }
        .sign { width: 45%; text-align: center; font-size: 13px; }
        .footer { display: flex; justify-content: space-between; margin-top: 30px; }
      </style>

      <div class="header">
        <div>
          <b>HỘ KINH DOANH ${profile?.businessName ?? ""}</b><br/>
          Địa chỉ: ${profile?.address?.street ?? ""}, ${profile?.address?.ward ?? ""}, ${profile?.address?.district ?? ""}, ${profile?.address?.city ?? ""}
        </div>
        <div style="text-align:right">
          <b>Mẫu số: S4-HKD</b><br/>
          <i>(Ban hành kèm theo Thông tư số 88/2021/TT-BTC<br/>
          ngày 11/10/2021 của Bộ Tài chính)</i>
        </div>
      </div>

      <h3>SỔ THEO DÕI TÌNH HÌNH THỰC HIỆN NGHĨA VỤ THUẾ VỚI NSNN</h3>
      <p style="text-align:center">
        Loại thuế: Thuế GTGT, ${
          mode === "quarter"
            ? `Quý ${getQuarter(startDate.getMonth() + 1)} năm ${startDate.getFullYear()}`
            : `Tháng ${startDate.getMonth() + 1} năm ${startDate.getFullYear()}`
        }
      </p>

      <table>
        <tr>
          <th>Số HĐ</th>
          <th>Ngày, tháng</th>
          <th>Tên người mua</th>
          <th>Mã hóa đơn</th>
          <th>Tổng tiền (VNĐ)</th>
          <th>Thuế GTGT (10%)</th>
          <th>Ghi chú</th>
        </tr>
        <tr><td colspan="7" style="text-align:left"><b>Số dư đầu kỳ</b></td></tr>
        ${rows}
        <tr>
          <td colspan="5" style="text-align:right"><b>Cộng số phát sinh trong kỳ</b></td>
          <td><b>${tongPhaiNop.toLocaleString("vi-VN")}</b></td>
          <td></td>
        </tr>
        <tr><td colspan="5" style="text-align:right"><b>Số dư cuối kỳ</b></td>
          <td><b>${tongPhaiNop.toLocaleString("vi-VN")}</b></td>
          <td></td>
        </tr>
      </table>

      <div class="note">
        - Sổ này có 01 trang, đánh số từ trang 01 đến trang 01<br/>
        - Ngày mở sổ: ........................................
      </div>

      <div class="footer">
        <div class="sign">
          <b>Người lập biểu</b><br/>(Ký, họ tên)<br/><br/><br/>
        </div>
        <div class="sign">
          Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}<br/><br/>
          <b>Người đại diện hộ kinh doanh / cá nhân kinh doanh</b><br/>(Ký, họ tên, đóng dấu)<br/><br/><br/>
        </div>
      </div>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  } catch (err) {
    console.error("❌ Lỗi xuất PDF S4-HKD:", err);
  } finally {
    setLoading(false);
  }
}
