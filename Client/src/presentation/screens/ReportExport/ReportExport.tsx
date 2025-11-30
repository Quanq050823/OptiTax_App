import { ColorMain } from "@/src/presentation/components/colors";
import SetDataDay from "@/src/presentation/components/SetDataDay";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import { PaperProvider, Portal } from "react-native-paper";
import { Asset } from "expo-asset";
import ExcelJS from "exceljs/dist/exceljs.bare.min.js";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system/legacy";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import InvoiInputList from "@/src/presentation/components/List/InvoiInputList";
import InvoiceOutput from "@/src/presentation/screens/BusinessOwnerScreen/InvoiceOutput";
import { exportInvoiceOutputS1 } from "@/src/presentation/Controller/ExportInvoiceOutputS1";
import { exportInvoiceInputS2 } from "@/src/presentation/Controller/ExportInvoiceinputS2";
import { exportCulateTotalCost } from "@/src/presentation/Controller/ExportalCulateTotalCost";
import { ExportTaxSubmitS4 } from "../../Controller/ExportTaxSubmit";

type Feature = {
  key: string;
  label: string;
  action?: () => void | Promise<void>;
  exportExcel?: () => void | Promise<void>;
};

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
    {
      idhdon: "e8fa8ab3-1d96-49e7-9446-54303406edec",
      id: "e8291a30-ef75-4c07-88dd-dd7fafbbbc32",
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
    {
      idhdon: "123",
      id: "22",
      stt: 1,
      ten: "Kem dâu",
      sluong: 1,
      dvtinh: "Gói",
      dgia: 2300000,
      thtien: 2300000,
      tsuat: 0,
      ltsuat: "KCT",
      tthue: 0,
      sotienckhau: 0,
    },
    {
      idhdon: "12",
      id: "23",
      stt: 1,
      ten: "Kem dâu",
      sluong: 1,
      dvtinh: "Gói",
      dgia: 2300000,
      thtien: 2300000,
      tsuat: 0,
      ltsuat: "KCT",
      tthue: 0,
      sotienckhau: 0,
    },
    {
      idhdon: "23",
      id: "24",
      stt: 1,
      ten: "Kem dâu",
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

function flattenInvoices(invoice: Invoice) {
  return invoice.products.map((p) => ({
    ...p,
    soHoaDon: invoice.soHoaDon,
    kyHieu: invoice.kyHieu,
    ngayLap: invoice.ngayLap,
    nguoiBanTen: invoice.nguoiBan.ten,
    nguoiBanMst: invoice.nguoiBan.mst,
    nguoiMuaTen: invoice.nguoiMua.ten,
    nguoiMuaMst: invoice.nguoiMua.mst,
    loaiHoaDon: invoice.loaiHoaDon,
    ghiChu: invoice.ghiChu,
  }));
}

async function fillProductsChunked(
  ws: ExcelJS.Worksheet,
  startRow: number,
  invoice: Invoice,
  chunkSize = 50
) {
  const products = invoice.products;
  const total = products.length;

  for (let idx = 0; idx < total; idx += chunkSize) {
    const chunk = products.slice(idx, idx + chunkSize);

    chunk.forEach((p, index) => {
      const rowIndex = startRow + idx + index;
      const row = ws.getRow(rowIndex);

      // Thông tin hóa đơn (lặp lại cho mỗi sản phẩm)
      row.getCell("A").value = "2025-09-25"; // Ngày hạch toán (demo cứng)
      row.getCell("B").value = invoice.ngayLap;
      row.getCell("C").value = invoice.kyHieu;
      row.getCell("D").value = new Date().toLocaleDateString("vi-VN");
      row.getCell("E").value = invoice.soHoaDon;
      row.getCell("F").value = `${invoice.loaiHoaDon} - ${
        invoice.ghiChu ?? ""
      }`;
      row.getCell("G").value = invoice.loaiHoaDon;
      row.getCell("H").value = invoice.soHoaDon;
      row.getCell("I").value = invoice.nguoiMua.ten;

      // Thông tin sản phẩm
      row.getCell("J").value = p.id;
      row.getCell("K").value = p.ten;
      row.getCell("L").value = p.dvtinh;
      row.getCell("M").value = p.sluong;
      row.getCell("N").value = p.dgia;
      row.getCell("O").value = p.thtien;
      row.getCell("P").value = p.ltsuat;
      row.getCell("Q").value = p.tthue;
      row.font = {
        name: "Microsoft Sans Serif",
        size: 8, // bạn có thể chỉnh size
      };
      row.commit();
    });

    // tránh block UI
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  // 👉 Trả về dòng tổng cộng (ngay sau sản phẩm cuối)
  return startRow + total;
}

export async function exportFromTemplate(invoiceData: Invoice) {
  try {
    // 1. Load template Excel từ assets
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

    // 3. Lấy worksheet
    const worksheet = workbook.getWorksheet("Báo cáo");
    if (!worksheet) throw new Error("❌ Không tìm thấy worksheet 'Báo cáo'");

    // 4. Gán thông tin chung (1 lần, ví dụ header)
    worksheet.getCell("I4").value = "2025-09-25";
    worksheet.getCell("K4").value = "2025-09-25";
    worksheet.getCell("E6").font = {
      bold: true,
      italic: true,
      name: "Times New Roman", // nên set tên font
      size: 12,
    };

    // 5. Ghi từng sản phẩm ra từng dòng
    const totalRowIndex = await fillProductsChunked(worksheet, 6, invoiceData);

    // 6. Tính tổng thủ công
    const totalBeforeTax = invoiceData.products.reduce(
      (sum, p) => sum + (p.thtien ?? 0),
      0
    );
    const totalTax = invoiceData.products.reduce(
      (sum, p) => sum + (p.tthue ?? 0),
      0
    );
    const grandTotal = totalBeforeTax + totalTax;

    // 7. Ghi dòng tổng ngay sau sản phẩm cuối
    const totalRow = worksheet.getRow(totalRowIndex);
    totalRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFB4C6E7" },
      };
      cell.font = { bold: true }; // ví dụ in đậm luôn
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    const totalCell = totalRow.getCell("N");
    totalCell.value = "TỔNG CỘNG";
    totalCell.font = { name: "Times New Roman", size: 12 };
    totalRow.getCell("O").value = totalBeforeTax;
    totalRow.getCell("Q").value = totalTax;
    totalRow.getCell("R").value = grandTotal;
    totalRow.commit();

    const footerRowIndex = totalRowIndex + 2;
    const footerRow = worksheet.getRow(footerRowIndex);

    worksheet.mergeCells(`C${footerRowIndex}:E${footerRowIndex}`);
    worksheet.mergeCells(`G${footerRowIndex}:I${footerRowIndex}`);
    worksheet.mergeCells(`K${footerRowIndex}:M${footerRowIndex}`);
    worksheet.mergeCells(`C${footerRowIndex + 1}:E${footerRowIndex + 1}`);
    worksheet.mergeCells(`G${footerRowIndex + 1}:I${footerRowIndex + 1}`);
    worksheet.mergeCells(`K${footerRowIndex + 1}:M${footerRowIndex + 1}`);

    const cellC = worksheet.getCell(`C${footerRowIndex}`);
    cellC.value = "Người ghi sổ";
    cellC.alignment = { horizontal: "center", vertical: "middle" };
    cellC.font = { name: "Times New Roman", size: 12, bold: true };

    const cellC1 = worksheet.getCell(`C${footerRowIndex + 1}`);
    cellC1.value = "(Ký, họ tên)";
    cellC1.alignment = { horizontal: "center", vertical: "middle" };

    const cellG = worksheet.getCell(`G${footerRowIndex}`);
    cellG.value = "Kế toán trưởng";
    cellG.alignment = { horizontal: "center", vertical: "middle" };
    cellG.font = { name: "Times New Roman", size: 12, bold: true };

    const cellG1 = worksheet.getCell(`G${footerRowIndex + 1}`);
    cellG1.value = "(Ký, họ tên)";
    cellG1.alignment = { horizontal: "center", vertical: "middle" };

    const cellK = worksheet.getCell(`K${footerRowIndex}`);
    cellK.value = "Giám đốc";
    cellK.alignment = { horizontal: "center", vertical: "middle" };
    cellK.font = { name: "Times New Roman", size: 12, bold: true };

    const cellK1 = worksheet.getCell(`K${footerRowIndex + 1}`);
    cellK1.value = "(Ký, họ tên)";
    cellK1.alignment = { horizontal: "center", vertical: "middle" };
    footerRow.commit();
    // 8. Xuất workbook ra buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 9. Lưu file
    const fileUri = FileSystem.cacheDirectory + `BaoCao_${Date.now()}.xlsx`;
    await FileSystem.writeAsStringAsync(
      fileUri,
      Buffer.from(buffer).toString("base64"),
      { encoding: FileSystem.EncodingType.Base64 }
    );

    // 10. Share
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }
  } catch (err) {
    console.error("❌ Export failed:", err);
  }
}

export default function ReportExport() {
  const navigate = useAppNavigation();
  const features: Feature[] = [
    {
      key: "InvoiceOuput",
      label: "Doanh thu bán hàng hoá, dịch vụ",
      action: () =>
        exportInvoiceOutputS1({
          mode,
          selectedDate,
          range,
          invoicesOutput,
          profile,
          setLoading,
        }),
    },
    // {
    //   key: "InvoiceInput",
    //   label: "Phí vật liệu, dụng cụ, sản phẩm, hàng hoá",
    //   action: () =>
    //     exportInvoiceInputS2({
    //       mode,
    //       selectedDate,
    //       range,
    //       invoiceInputDataSync,
    //       profile,
    //       setLoading,
    //     }),
    //   exportExcel: () => exportFromTemplate(invoiceData),
    // },
    // {
    //   key: "VoucherOutput",
    //   label: "Chi phí sản xuất kinh doanh",
    //   action: () =>
    //     exportCulateTotalCost({
    //       mode,
    //       selectedDate,
    //       range,
    //       voucherPayList,
    //       profile,
    //       setLoading,
    //     }),
    // },
    // {
    //   key: "Tax",
    //   label: "Tình hình thực hiện nghĩa vụ thuế",
    //   action: () =>
    //     ExportTaxSubmitS4({
    //       mode,
    //       selectedDate,
    //       range,
    //       taxList,
    //       profile,
    //       setLoading,
    //       invoicesOutput,
    //     }),
    // },
    // {
    //   key: "Pay",
    //   label: "Thanh toán lương lao động",
    //   // action: handleExportPDF,
    // },
    // {
    //   key: "Cash",
    //   label: "Quỹ tiền mặt - Báo cáo",
    //   // action: handleExportPDF,
    // },
  ];
  const [selectedKey, setSelectedKey] = useState<Feature | null>(
    features.find((f) => f.key === "InvoiceOuput") || null
  );
  const {
    data: profile,
    invoicesOutput,
    invoicesInput,
    invoiceInputDataSync,
    voucherPayList,
    fetchData,
    taxList,
  } = useData();

  useEffect(() => {
    fetchData();
  }, [selectedKey]);

  const [mode, setMode] = useState<"month" | "quarter" | "range">("month");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(new Date());
  const [range, setRange] = useState<{
    startDate: CalendarDate;
    endDate: CalendarDate;
  }>({
    startDate: undefined,
    endDate: undefined,
  });
  console.log(range);

  const renderRadio = (checked: boolean) => (
    <View
      style={[
        styles.radioOuter,
        { borderColor: checked ? "#fff" : "#a4a4a4ff" },
      ]}
    >
      {checked && <View style={[styles.radioInner]} />}
    </View>
  );

  useEffect(() => {
    const animationsArray = features.map((_, i) =>
      Animated.parallel([
        Animated.timing(animations[i], {
          toValue: 0,
          duration: 400,
          delay: i * 150, // lần lượt
          useNativeDriver: true,
        }),
        Animated.timing(opacities[i], {
          toValue: 1,
          duration: 1000,
          delay: i * 150,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(100, animationsArray).start();
  }, []);

  const onDismiss = () => setVisible(false);
  const onConfirmSingle = (params: { date: CalendarDate }) => {
    setVisible(false);
    setSelectedDate(params.date);
  };
  const onConfirmRange = ({
    startDate,
    endDate,
  }: {
    startDate?: CalendarDate;
    endDate?: CalendarDate;
  }) => {
    if (startDate && endDate) {
      setRange({ startDate, endDate });
      console.log("Chọn khoảng:", startDate, "->", endDate);
    } else {
      console.log("Chưa chọn đủ ngày");
    }
    setVisible(false);
  };

  // --- Xác định quý ---
  const getQuarter = (month: number) => {
    if (month <= 3) return 1;
    if (month <= 6) return 2;
    if (month <= 9) return 3;
    return 4;
  };

  const animations = useRef(features.map(() => new Animated.Value(50))).current; // bắt đầu ở Y=50 (dịch xuống)
  const opacities = useRef(features.map(() => new Animated.Value(0))).current;

  const renderItem = ({ item, index }: { item: Feature; index: number }) => {
    const isSelected = selectedKey?.key === item.key;

    return (
      <Animated.View
        style={{
          transform: [{ translateY: animations[index] }],
          opacity: opacities[index],
          flex: 1,
          position: "relative",
        }}
      >
        <TouchableOpacity
          style={[
            styles.item,
            {
              backgroundColor: isSelected ? ColorMain : "#fff",
              position: "relative",
            },
          ]}
          onPress={() => setSelectedKey(item)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              width: "100%",
              justifyContent: "center",
            }}
          >
            {renderRadio(isSelected)}
            <Text
              style={{
                color: isSelected ? "#fff" : "#000",
                fontWeight: "700",
              }}
            >
              {item.label}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <>
      <ImageBackground
        style={[styles.container]}
        source={require("@/assets/images/background.png")}
        resizeMode="cover"
      >
        <PaperProvider>
          <View style={{ flex: 1 }}>
            <Portal>
              <LoadingScreen visible={loading} />
            </Portal>

            <SetDataDay
              mode={mode}
              setMode={setMode}
              selectedDate={selectedDate}
              setVisible={setVisible}
              visible={visible}
              range={range}
              onDismiss={onDismiss}
              onConfirmSingle={onConfirmSingle}
              getQuarter={getQuarter}
              onConfirmRange={onConfirmRange}
              loading={loading}
              setLoading={setLoading}
            />
            <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <Text
                style={{ fontSize: 18, fontWeight: "600", color: "#494949ff" }}
              >
                Mẫu báo cáo
              </Text>
            </View>
            <View style={styles.gridContainer}>
              <FlatList
                data={features}
                renderItem={renderItem}
                numColumns={1}
              />
            </View>
            <View
              style={{
                marginBottom: 20,
                width: "100%",
                justifyContent: "center",
                flexDirection: "row",
                gap: 20,
              }}
            >
              <TouchableOpacity
                // onPress={() => {
                //   if (!selectedKey) {
                //     alert("Vui lòng chọn chức năng");
                //     return;
                //   }
                //   // selectedKey.action?.(); // 👉 Gọi đúng function đã gắn
                //   handleExportPDF();
                // }}
                onPress={() => {
                  if (!selectedKey) {
                    Alert.alert("Thông báo", "Vui lòng chọn một mục để xuất");
                    return;
                  }
                  selectedKey.action?.();
                }}
                style={[
                  styles.btnExportExcel,
                  { borderWidth: 0.5, borderColor: "#b51919ff" },
                ]}
              >
                <Image
                  source={require("@/assets/images/pdf.png")}
                  height={10}
                  width={10}
                  style={{ width: 20, height: 20, marginLeft: 5 }}
                />
                <Text style={{ color: "#b51919ff", fontWeight: "600" }}>
                  &nbsp; Xuất PDF
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (!selectedKey) {
                    alert("Vui lòng chọn chức năng");
                    return;
                  }
                  selectedKey.exportExcel?.(); // 👉 Gọi đúng function đã gắn
                }}
                style={[
                  styles.btnExportExcel,
                  { borderWidth: 0.5, borderColor: "#0e7237ff" },
                ]}
              >
                <Image
                  source={require("@/assets/images/xls.png")}
                  height={10}
                  width={10}
                  style={{ width: 20, height: 20, marginLeft: 5 }}
                />
                <Text style={{ color: "#0e7237ff", fontWeight: "600" }}>
                  &nbsp; Xuất Excel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </PaperProvider>
      </ImageBackground>
    </>
  );
}
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  item: {
    height: 60,
    flex: 1,
    margin: 15,
    borderRadius: 10,
    backgroundColor: ColorMain,
    shadowColor: "#9d9d9d",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: "center",
    position: "relative",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    position: "absolute",
    left: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  btnExport: {
    padding: 10,
    backgroundColor: "#b51919ff",
    borderRadius: 10,
  },
  btnExportExcel: {
    padding: 10,
    // backgroundColor: "#0e7237ff",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
});
