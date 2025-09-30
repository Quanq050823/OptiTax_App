import { Invoice, InvoiceListResponse, Profile } from "@/src/types/route";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
type DataSetup = {
  mode: "month" | "quarter" | "range";
  selectedDate?: CalendarDate | undefined;
  range: { startDate?: CalendarDate; endDate?: CalendarDate };
  invoicesOuput: Invoice[];
  profile: Profile | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export async function exportInvoiceOutputS1({
  mode,
  selectedDate,
  range,
  invoicesOuput,
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
    if (!invoicesOuput) return;

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

    // --- 1. Lọc hoá đơn ---
    const filtered = invoicesOuput.filter((inv) => {
      const invDate = new Date(inv.ncnhat);
      invDate.setHours(0, 0, 0, 0);
      return invDate >= startDate! && invDate <= endDate!;
    });

    // --- 2. Gom nhóm theo ngày ---
    const grouped: Record<string, number> = {};
    filtered.forEach((inv) => {
      const date = new Date(inv.ncnhat).toLocaleDateString("vi-VN");
      let amount = 0;
      if (Array.isArray(inv.hdhhdvu)) {
        inv.hdhhdvu.forEach((item) => {
          amount += Number(item.thtien ?? 0);
        });
      }
      grouped[date] = (grouped[date] || 0) + amount;
    });
    const grandTotal = Object.values(grouped).reduce(
      (sum, val) => sum + val,
      0
    );

    // --- 3. Render HTML ---
    const rows = Object.entries(grouped)
      .map(([date, total], index) => {
        return `
          <tr>
            <td>${date}</td>
            <td>${index + 1}</td>
            <td>${today.toLocaleDateString("vi-VN")}</td>
            <td>Doanh thu bán hàng ngày ${date}</td>
            <td>${total.toLocaleString("vi-VN")}</td>
            <td></td><td></td><td></td><td></td><td></td>
            <td></td><td></td>
          </tr>
        `;
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
    justify-content: space-between;
    font-size: 13px;
  }
  .sign { text-align: center; width: 40%; }
</style>

      <div class="header">
        <b>HỘ KINH DOANH: ${profile?.businessName ?? ""}</b><br/>
        <b>Địa chỉ: ${profile?.address?.street ?? ""} - ${
      profile?.address?.ward ?? ""
    } - ${profile?.address?.district ?? ""} - ${
      profile?.address?.city ?? ""
    }</b>
      </div>
      <div class="right">Mẫu số S1-HKD</div>
      <h2>SỔ CHI TIẾT DOANH THU BÁN HÀNG, DỊCH VỤ</h2>
      <p style="text-align:center">Tên địa điểm kinh doanh: ${
        profile?.address.street
      } - ${profile?.address.ward} - ${profile?.address.district} - ${
      profile?.address.city
    }</p>
      <p style="text-align:center">Năm: ${startDate.getFullYear()}</p>
      <table>
        <tr>
          <th rowspan="2">Ngày, tháng ghi sổ</th>
          <th colspan="2">Chứng từ</th>
          <th rowspan="2">Diễn giải</th>
      <th colspan="7">Doanh thu bán hàng hóa, dịch vụ chia theo danh mục ngành nghề</th>
          <th rowspan="2">Ghi chú</th>
        </tr>
        <tr>
          <th>Số hiệu</th><th>Ngày</th>
          <th>Phân phối cung cấp hàng hoá</th><th>Dịch vụ, xây dựng không bao thầu nguyên vật liệu</th><th>Sản xuất, vận tải, dịch vụ có gắn với hàng hóa, xây dựng có bao thầu nguyên vật liệu</th><th>Hoạt động kinh doanh khác</th><th>…</th><th>…</th><th>…</th>
        </tr>
        ${rows}
        <tr>
          <td colspan="4">Tổng cộng</td>
          <td><b>${grandTotal.toLocaleString("vi-VN")}</b></td>
          <td colspan="6"></td>
        </tr>
      </table>
      // <div class="note">
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
    await Sharing.shareAsync(uri);
  } catch (error) {
    console.error("Export PDF error:", error);
  } finally {
    setLoading(false);
  }
}
const handleExportPDF = async () => {};
