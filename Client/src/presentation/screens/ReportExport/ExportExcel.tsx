import * as XLSX from "xlsx";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";

type Invoice = {
  soHoaDon: number;
  kyHieu: string;
  ngayLap: string;
  nguoiBan: { ten: string; mst: string; diaChi?: string };
  nguoiMua: { ten: string; mst: string; diaChi?: string };
  loaiHoaDon: string;
  tienTruocThue: number;
  thueGTGT: number;
  tongThanhToan: number;
  ghiChu?: string;
  products: Product[];
};

export type Product = {
  idhdon: string;
  id: string;
  stt: number;
  ten: string;
  sluong: number;
  dvtinh: string;
  dgia: number;
  thtien: number;
  tsuat: number;
  ltsuat: string;
  tthue: number;
  sotienckhau?: number;
};

const invoiceData: Invoice = {
  soHoaDon: 37974,
  kyHieu: "C25TSD",
  ngayLap: "2025-09-05",
  nguoiBan: {
    ten: "CÔNG TY CỔ PHẦN ĐẦU TƯ CÔNG NGHỆ VÀ THƯƠNG MẠI SOFTDREAMS",
    mst: "0105987432",
  },
  nguoiMua: { ten: "Huỳnh Thị Minh Lý", mst: "0310711010" },
  loaiHoaDon: "Hóa đơn giá trị gia tăng",
  tienTruocThue: 2300000,
  thueGTGT: 0,
  tongThanhToan: 2300000,
  ghiChu: "Thuế suất KCT (không chịu thuế)",
  products: [
    {
      idhdon: "e8fa8ab3-1d96-49e7-9446-54303406edef",
      id: "e8291a30-ef75-4c07-88dd-dd7fafbbbc31",
      stt: 1,
      ten: "PHẦN MỀM HÓA ĐƠN ĐIỆN TỬ 3000 HÓA ĐƠN - GOLD GIA HẠN",
      sluong: 1,
      dvtinh: "Gói",
      dgia: 2300000,
      thtien: 2300000,
      tsuat: 0,
      ltsuat: "KCT",
      tthue: 0,
      sotienckhau: 0,
    },
  ],
};

const products: Product[] = [
  {
    idhdon: "e8fa8ab3-1d96-49e7-9446-54303406edef",
    id: "e8291a30-ef75-4c07-88dd-dd7fafbbbc31",
    stt: 1,
    ten: "PHẦN MỀM HÓA ĐƠN ĐIỆN TỬ 3000 HÓA ĐƠN - GOLD GIA HẠN",
    sluong: 1,
    dvtinh: "Gói",
    dgia: 2300000,
    thtien: 2300000,
    tsuat: 0,
    ltsuat: "KCT",
    tthue: 0,
    sotienckhau: 0,
  },
];
type ProductRow = Product & {
  soHoaDon: number;
  kyHieu: string;
  ngayLap: string;
  nguoiBanTen: string;
  nguoiBanMst: string;
  nguoiMuaTen: string;
  nguoiMuaMst: string;
  loaiHoaDon: string;
};

function flattenInvoices(invoices: Invoice[]): ProductRow[] {
  return invoices.flatMap((inv) =>
    inv.products.map((p) => ({
      ...p,
      soHoaDon: inv.soHoaDon,
      kyHieu: inv.kyHieu,
      ngayLap: inv.ngayLap,
      nguoiBanTen: inv.nguoiBan.ten,
      nguoiBanMst: inv.nguoiBan.mst,
      nguoiMuaTen: inv.nguoiMua.ten,
      nguoiMuaMst: inv.nguoiMua.mst,
      loaiHoaDon: inv.loaiHoaDon,
    }))
  );
}
async function exportFromTemplate() {
  try {
    // 1. Load file template Excel
    const asset = Asset.fromModule(
      require("../../../../assets/FileExportXlsx/SCTBH.xlsx")
    );
    await asset.downloadAsync();

    const templateUri = asset.localUri || asset.uri;
    const b64 = await FileSystem.readAsStringAsync(templateUri, {
      encoding: "base64",
    });

    // 2. Parse workbook
    const wb = XLSX.read(b64, { type: "base64" });
    const wsName = wb.SheetNames[0];
    const ws = wb.Sheets[wsName];

    // 3. Điền thông tin hóa đơn (ví dụ: ô B2 = Số HĐ, B3 = Ngày, B4 = Người mua,...)
    ws["B2"] = { t: "s", v: `${invoiceData.kyHieu}-${invoiceData.soHoaDon}` };
    ws["B3"] = { t: "s", v: invoiceData.ngayLap };
    ws["B4"] = { t: "s", v: invoiceData.nguoiMua.ten };
    ws["B5"] = { t: "s", v: invoiceData.nguoiMua.mst };
    ws["B6"] = { t: "s", v: invoiceData.nguoiBan.ten };
    ws["B7"] = { t: "s", v: invoiceData.nguoiBan.mst };
    ws["B8"] = { t: "s", v: invoiceData.loaiHoaDon };

    // Tổng cộng
    ws["E20"] = { t: "n", v: invoiceData.tienTruocThue };
    ws["E21"] = { t: "n", v: invoiceData.thueGTGT };
    ws["E22"] = { t: "n", v: invoiceData.tongThanhToan };

    // 4. Điền bảng sản phẩm, bắt đầu từ dòng 10
    const startRow = 10;
    products.forEach((p, index) => {
      const r = startRow + index;
      ws[`A${r}`] = { t: "n", v: p.stt };
      ws[`B${r}`] = { t: "s", v: p.ten };
      ws[`C${r}`] = { t: "n", v: p.sluong };
      ws[`D${r}`] = { t: "s", v: p.dvtinh };
      ws[`E${r}`] = { t: "n", v: p.dgia };
      ws[`F${r}`] = { t: "n", v: p.thtien };
      ws[`G${r}`] = { t: "s", v: p.ltsuat };
    });

    // 5. Ghi workbook ra base64
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    // 6. Lưu file mới
    const fileUri =
      ((FileSystem as any).cacheDirectory ?? "") + `HoaDon_${Date.now()}.xlsx`;
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: "base64",
    });

    // 7. Share
    await Sharing.shareAsync(fileUri, {
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      dialogTitle: "Chia sẻ hóa đơn",
      UTI: "com.microsoft.excel.xlsx",
    });
  } catch (err) {
    console.error("❌ Export failed:", err);
  }
}

export default exportFromTemplate;
