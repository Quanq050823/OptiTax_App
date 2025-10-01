import { InvoiceProduct, InvoiceSummary } from "@/src/types/invoiceIn";
import { Invoice, InvoiceListResponse, Profile } from "@/src/types/route";
import { PaymentVoucher } from "@/src/types/voucher";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

type DataSetup = {
  mode: "month" | "quarter" | "range";
  selectedDate?: CalendarDate | undefined;
  range: { startDate?: CalendarDate; endDate?: CalendarDate };
  voucherPayList: PaymentVoucher[];
  profile: Profile | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const CatePayVoucherData = [
  { label: "Chi phí nhân công", value: "1" },
  { label: "Chi phí điện", value: "2" },
  { label: "Chi phí nước", value: "3" },
  { label: "Chi phí viễn thông", value: "4" },
  { label: "Chi phí thuê bãi, mặt bằng kinh doanh", value: "5" },
  { label: "Chi phí quản lý (văn phòng phẩm, dụng cụ,..)", value: "6" },
  { label: "Chi phí khác (hội nghị, công tác phí, thanh lý,...)", value: "7" },
];

function renderVoucherRow(v: PaymentVoucher, idx: number) {
  const costCols = Array(7).fill("");
  const catIndex = CatePayVoucherData.findIndex(
    (c) => c.value === String(v.category)
  );

  if (catIndex !== -1) {
    costCols[catIndex] = v.amount.toLocaleString("vi-VN");
  }

  return `
    <tr>
      <td>${idx + 1}</td>
      <td>${v._id}</td>
      <td>${new Date(v.createdAt.split("T")[0]).toISOString().slice(0, 10)}</td>
      <td>${v.description || ""}</td>
      <td>${v.recipientGroup || ""}</td>
      <td>${v.amount.toLocaleString("vi-VN")}</td>
      ${costCols.map((c) => `<td>${c}</td>`).join("")}
    </tr>
  `;
}

// ✅ Render hàng tổng cuối bảng
function renderTotalRow(vouchers: PaymentVoucher[]) {
  let grandTotal = 0;
  const categoryTotals = Array(7).fill(0);

  vouchers.forEach((v) => {
    const amount = Number(v.amount ?? 0);
    grandTotal += amount;

    const catIndex = CatePayVoucherData.findIndex(
      (c) => c.value === String(v.category)
    );
    if (catIndex !== -1) {
      categoryTotals[catIndex] += amount;
    }
  });

  return `
    <tr style="font-weight:bold; background:#f2f2f2;">
      <td colspan="5" style="text-align:center">TỔNG CỘNG</td>
      <td>${grandTotal.toLocaleString("vi-VN")}</td>
      ${categoryTotals
        .map((t) => `<td>${t > 0 ? t.toLocaleString("vi-VN") : ""}</td>`)
        .join("")}
    </tr>
  `;
}

export async function exportCulateTotalCost({
  mode,
  selectedDate,
  range,
  voucherPayList,
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
    if (!voucherPayList) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (mode === "month" && selectedDate) {
      const d = new Date(selectedDate as any);
      startDate = new Date(d.getFullYear(), d.getMonth(), 1);
      endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      console.log({ startDate, endDate });
    }

    if (mode === "quarter" && selectedDate) {
      const d = new Date(selectedDate as any);
      const q = getQuarter(d.getMonth() + 1);
      const startMonth = (q - 1) * 3;
      startDate = new Date(d.getFullYear(), startMonth, 1);
      endDate = new Date(d.getFullYear(), startMonth + 3, 0);
    }

    if (mode === "range" && range.startDate && range.endDate) {
      startDate = new Date(range.startDate as any);
      endDate = new Date(range.endDate as any);
    }

    if (!startDate || !endDate) {
      alert("Vui lòng chọn thời gian hợp lệ");
      return;
    }

    // --- 1. Lọc hoá đơn ---
    const filtered = voucherPayList.filter((inv) => {
      const invDate = new Date(inv.createdAt.split("T")[0] ?? "");
      invDate.setHours(0, 0, 0, 0);
      return invDate >= startDate! && invDate <= endDate!;
    });

    // --- 2. Gom nhóm theo ngày ---
    // const grouped: Record<string, number> = {};
    // filtered.forEach((inv) => {
    //   const date = new Date(inv.date ?? "").toISOString().slice(0, 10); // yyyy-mm-dd
    //   grouped[date] = (grouped[date] || 0) + inv.amount;
    // });

    const sortedVouchers = filtered.sort(
      (a, b) =>
        new Date(a.createdAt.split("T")[0]).getTime() -
        new Date(b.createdAt.split("T")[0]).getTime()
    );

    // --- 3. Render HTML ---
    const rows =
      sortedVouchers.map(renderVoucherRow).join("") +
      renderTotalRow(sortedVouchers);

    const html = `
<style>
  body { font-family: "Times New Roman", serif; font-size: 13px; }
  h2 { text-align: center; margin: 4px 0; }
  .header { text-align: left; font-size: 13px; margin-bottom: 10px; }
  .right { text-align: right; font-size: 12px; font-style: italic; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { border: 1px solid #000; padding: 4px; text-align: center; }
  th { font-weight: bold; }
  .note { margin-top: 8px; font-size: 12px; }
  .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 13px; }
  .sign { text-align: center; width: 40%; }
</style>

<div class="header">
  <b>HỘ KINH DOANH: ${profile?.businessName ?? ""}</b><br/>
  <b>Địa chỉ: ${profile?.address?.street ?? ""} - ${
      profile?.address?.ward ?? ""
    } - 
  ${profile?.address?.district ?? ""} - ${profile?.address?.city ?? ""}</b>
</div>
<div class="right">Mẫu số S3-HKD</div>
<h2>SỔ CHI PHÍ SẢN XUẤT KINH DOANH</h2>
<p style="text-align:center">Năm: ${startDate.getFullYear()}</p>

<table>
  <thead>
    <tr>
      <th rowspan="2">STT</th>
      <th colspan="2">CHỨNG TỪ</th>
      <th rowspan="2">DIỄN GIẢI</th>
      <th rowspan="2">TK ĐỐI ỨNG</th>
      <th rowspan="2">TỔNG SỐ TIỀN</th>
      <th colspan="7">CHIA RA</th>
    </tr>
    <tr>
      <th>Số hiệu</th>
      <th>Ngày, tháng</th>
      <th>Chi phí nhân công</th>
      <th>Chi phí điện</th>
      <th>Chi phí nước</th>
      <th>Chi phí viễn thông</th>
      <th>Chi phí thuê kho bãi, mặt bằng kinh doanh</th>
      <th>Chi phí quản lý<br/>(văn phòng phẩm, công cụ, dụng cụ...)</th>
      <th>Chi phí khác<br/>(hội nghị, công tác phí, thanh lý, nhượng bán TSCĐ, thuê ngoài khác...)</th>
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>

<div class="note">
  - Sổ này có … trang, đánh số từ trang 01 đến trang … <br/>
  - Ngày mở sổ: …
</div>

<div class="footer">
  <div class="sign">
    <b>NGƯỜI LẬP BIỂU</b><br/>
    (Ký, họ tên)
  </div>
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

    const newPath =
      (FileSystem as any).documentDirectory +
      `SoChiTietVatLieu_S2_${
        startDate.getMonth() + 1
      }_${startDate.getFullYear()}.pdf`;

    await FileSystem.moveAsync({ from: uri, to: newPath });
    await Sharing.shareAsync(newPath);
  } catch (error) {
    console.error("Export PDF error:", error);
  } finally {
    setLoading(false);
  }
}

export const handleExportPDF = async () => {};
