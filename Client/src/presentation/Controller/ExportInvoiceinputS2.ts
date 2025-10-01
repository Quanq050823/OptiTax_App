import { InvoiceProduct, InvoiceSummary } from "@/src/types/invoiceIn";
import { Invoice, InvoiceListResponse, Profile } from "@/src/types/route";
import * as FileSystem from "expo-file-system/legacy";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
type DataSetup = {
  mode: "month" | "quarter" | "range";
  selectedDate?: CalendarDate | undefined;
  range: { startDate?: CalendarDate; endDate?: CalendarDate };
  invoiceInputDataSync: InvoiceSummary[];
  profile: Profile | null;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function mergeProducts(products: InvoiceProduct[]): InvoiceProduct[] {
  const map = new Map<string, InvoiceProduct>();

  for (const p of products) {
    // key để xác định sản phẩm giống nhau
    const key = `${p.name}-${p.price}-${p.unit}-${p.vatRate}`;

    if (!map.has(key)) {
      map.set(key, { ...p });
    } else {
      const existing = map.get(key)!;
      const sluongNew = (existing.quantity ?? 0) + (p.quantity ?? 0);
      const thtienNew = (existing.amount ?? 0) + (p.amount ?? 0);

      map.set(key, {
        ...existing,
        quantity: sluongNew,
        amount: thtienNew,
      });
    }
  }

  return Array.from(map.values());
}

function normalizeProducts(raw: any[]): InvoiceProduct[] {
  return raw
    .map((p) => ({
      _id: p._id,
      id: p.id,
      name: p.ten,
      unit: p.dvtinh,
      quantity: p.sluong,
      price: p.dgia,
      amount: p.thtien,
      vatRate: p.tsuat,
      vatLabel: p.ltsuat,
      meta: p.ttkhac,
    }))
    .filter((p) => {
      const qty = Number(p.quantity ?? 0);
      const price = Number(p.price ?? 0);
      return qty > 0 && price > 0;
    });
}
export async function exportInvoiceInputS2({
  mode,
  selectedDate,
  range,
  invoiceInputDataSync,
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
    if (!invoiceInputDataSync) return;

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
    const filtered = invoiceInputDataSync.filter((inv) => {
      const invDate = new Date(inv.ngayLap ?? "");
      invDate.setHours(0, 0, 0, 0);
      return invDate >= startDate! && invDate <= endDate!;
    });

    // --- 2. Gom nhóm theo ngày ---
    const grouped: Record<string, number> = {};
    filtered.forEach((inv) => {
      const date = new Date(inv.ngayLap ?? "").toLocaleDateString("vi-VN");
      // let amount = 0;
      // if (Array.isArray(inv.hdhhdvu)) {
      //   inv.tgtttbso.forEach((item) => {
      //     amount += Number(item.thtien ?? 0);
      //   });
      // }
      grouped[date] = (grouped[date] || 0) + inv.tien?.tong!;
    });
    const grandTotal = Object.values(grouped).reduce(
      (sum, val) => sum + val,
      0
    );

    // --- 3. Render HTML ---
    // --- 3. Render HTML ---
    // --- 3. Render HTML ---
    // --- 3. Render HTML ---
    const rows = filtered
      .map((inv) => {
        const merged = mergeProducts(
          normalizeProducts(inv.hdhhdvu ?? [])
        ).filter((p) => (p.price ?? 0) > 0 && (p.quantity ?? 0) > 0);

        if (merged.length === 0) return "";

        return merged
          .map(
            (p, idx) => `
          <tr>
            ${
              idx === 0
                ? `<td rowspan="${merged.length}">${inv.soHoaDon || ""}</td>
                   <td rowspan="${merged.length}">
                     ${new Date(inv.ngayLap ?? "").toLocaleDateString("vi-VN")}
                   </td>`
                : ""
            }
            <td>${p.name || ""}</td>
            <td>${p.unit || ""}</td>
            <td>${p.price?.toLocaleString("vi-VN") || ""}</td>
            <td>${p.quantity ?? ""}</td>
            <td>${p.amount?.toLocaleString("vi-VN") || ""}</td>

            <td></td>
            <td></td>

            <td></td>
            <td></td>

            <td></td>
          </tr>
        `
          )
          .join("");
      })
      .join("");

    //Tính tổng toàn bộ ---
    const allProducts = filtered.flatMap((inv) =>
      mergeProducts(normalizeProducts(inv.hdhhdvu ?? [])).filter(
        (p) => (p.price ?? 0) > 0 && (p.quantity ?? 0) > 0
      )
    );

    const totalQuantity = allProducts.reduce(
      (sum, p) => sum + (p.quantity ?? 0),
      0
    );
    const totalAmount = allProducts.reduce(
      (sum, p) => sum + (p.amount ?? 0),
      0
    );

    // --- 4. Dòng tổng ---
    const totalRow = `
      <tr style="font-weight:bold; background:#f2f2f2;">
        <td colspan="5" style="text-align:center;">TỔNG CỘNG</td>
        <td>${totalQuantity}</td>
        <td>${totalAmount.toLocaleString("vi-VN")}</td>
        <td colspan="5"></td>
      </tr>
    `;

    // --- 3. HTML xuất ra ---
    const html = `
<style>
  body { font-family: "Times New Roman", serif; font-size: 13px; }
  h2 { text-align: center; margin: 4px 0; }
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
    } - 
  ${profile?.address?.district ?? ""} - ${profile?.address?.city ?? ""}</b>
</div>
<div class="right">Mẫu số S2-HKD</div>
<h2>SỔ CHI TIẾT VẬT LIỆU, DỤNG CỤ, SẢN PHẨM, HÀNG HÓA</h2>
<p style="text-align:center">Năm: ${startDate.getFullYear()}</p>

<table>
  <tr>
    <th colspan="2">Chứng từ</th>
    <th rowspan="2">Diễn giải</th>
    <th rowspan="2">Đơn vị tính</th>
    <th rowspan="2">Đơn giá</th>
    <th colspan="2">Nhập</th>
    <th colspan="2">Xuất</th>
    <th colspan="2">Tồn</th>
    <th rowspan="2">Ghi chú</th>
  </tr>
  <tr>
    <th>Số hiệu</th>
    <th>Ngày, tháng</th>
    <th>Số lượng</th><th>Thành tiền</th>
    <th>Số lượng</th><th>Thành tiền</th>
    <th>Số lượng</th><th>Thành tiền</th>
  </tr>
  ${rows}
  ${totalRow}
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

    // Tạo path mới trong documentDirectory
    const newPath =
      (FileSystem as any).documentDirectory +
      `SoChiTietVatLieu_S2_${
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
