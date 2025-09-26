import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Asset } from "expo-asset";
import * as Sharing from "expo-sharing";
import ExcelJS from "exceljs";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system/legacy";

global.Buffer = Buffer;
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
export async function exportFromTemplate() {
  try {
    // 1. Load template từ assets
    const asset = Asset.fromModule(
      require("../../../../assets/FileExportXlsx/SCTBH.xlsx")
    );
    await asset.downloadAsync();
    const templateUri = asset.localUri || asset.uri;

    // 2. Đọc workbook
    const workbook = new ExcelJS.Workbook();
    const response = await fetch(templateUri);
    const arrayBuffer = await response.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);

    // 3. Chọn worksheet
    const worksheet = workbook.getWorksheet("Báo cáo");
    if (!worksheet) throw new Error("Không tìm thấy worksheet");
    products.map((p) => {
      worksheet.getCell("I4").value = "2025-09-25";
      worksheet.getCell("K4").value = "2025-09-25";

      worksheet.getCell("A6").value = "2025-09-25";
      worksheet.getCell("B6").value = invoiceData.ngayLap;
      worksheet.getCell("C6").value = invoiceData.kyHieu;
      worksheet.getCell("E6").value = invoiceData.soHoaDon;
      worksheet.getCell(
        "F6"
      ).value = `${invoiceData.loaiHoaDon} - ${invoiceData.ghiChu}`;
      worksheet.getCell("G6").value = invoiceData.loaiHoaDon;
      worksheet.getCell("H6").value = invoiceData.soHoaDon;
      worksheet.getCell("I6").value = invoiceData.nguoiMua.ten;
      worksheet.getCell("J6").value = p.id;
      worksheet.getCell("K6").value = p.ten;
      worksheet.getCell("L6").value = p.dvtinh;
      worksheet.getCell("M6").value = p.sluong;
      worksheet.getCell("N6").value = p.dgia;
      worksheet.getCell("O6").value = p.thtien;
    });

    // 4. Xuất workbook ra buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 5. Lưu file bằng legacy API
    const fileUri = FileSystem.cacheDirectory + `BaoCao_${Date.now()}.xlsx`;

    await FileSystem.writeAsStringAsync(
      fileUri,
      Buffer.from(buffer).toString("base64"),
      { encoding: FileSystem.EncodingType.Base64 }
    );

    console.log("✅ File saved:", fileUri);

    // 6. Share
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }
  } catch (err) {
    console.error("❌ Export failed:", err);
  }
}

export default function ExportExcelScreen() {
  return (
    <View>
      <TouchableOpacity onPress={exportFromTemplate}>
        <Text>Xuất</Text>
      </TouchableOpacity>
    </View>
  );
}
