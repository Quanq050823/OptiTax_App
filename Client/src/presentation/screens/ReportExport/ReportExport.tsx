// import React from "react";
// import { View, Button } from "react-native";
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import * as Asset from "expo-asset"; // để load file Excel mẫu
// import XLSX from "xlsx";
// import { SOKETOAN_BASE64 } from "../../../../assets/FileExportXlsx/SOKETOAN";

// export default function ExportInvoice() {
//   const handleExportExcel = async () => {
//     // 1. Parse workbook từ base64
//     const wb = XLSX.read(SOKETOAN_BASE64, { type: "base64" });

//     // 2. Lấy sheet "S1 - HKD"
//     const ws = wb.Sheets["S1-HKD"];

//     // 3. Ghi dữ liệu vào các ô
//     XLSX.utils.sheet_add_aoa(
//       ws,
//       [
//         ["01/10/2021", "02", "Doanh thu ngày 01/10", 10000, "", ""],
//         ["02/10/2021", "03", "Doanh thu ngày 02/10", 3000, 5000, ""],
//         ["03/10/2021", "04", "Doanh thu ngày 03/10", 10000, 10000, ""],
//         ["04/10/2021", "05", "Doanh thu ngày 04/10", 7000, 5000, 10000],
//       ],
//       { origin: "A10" }
//     );

//     console.log(wb.SheetNames);
//     // 4. Xuất workbook mới
//     const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
//     const uri = FileSystem.cacheDirectory + "SoKeToan.xlsx";

//     await FileSystem.writeAsStringAsync(uri, wbout, {
//       encoding: FileSystem.EncodingType.Base64,
//     });

//     // 5. Share file
//     await Sharing.shareAsync(uri);
//   };

//   return (
//     <View style={{ marginTop: 50, padding: 20 }}>
//       <Button title="📊 Xuất Sổ kế toán (S1-HKD)" onPress={handleExportExcel} />
//     </View>
//   );
// }

// import React from "react";
// import { View, Button } from "react-native";
// import * as Print from "expo-print";
// import * as Sharing from "expo-sharing";
// import { useData } from "@/src/presentation/Hooks/useDataStore";

// export default function ExportInvoice() {
//   const { data: profile, invoicesInput, invoicesOuput } = useData();
//   console.log(invoicesOuput);

//   const handleExportPDF = async () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Xác định ngày đầu tháng
//     const reportMonth = 7; // Tháng 8 (JS tính từ 0)
//     const reportYear = 2025;

//     const startOfMonth = new Date(reportYear, reportMonth, 1);
//     // --- 1. Lọc hoá đơn từ đầu tháng tới hôm nay ---
//     const filtered = invoicesOuput.filter((inv) => {
//       const invDate = new Date(inv.ncnhat);
//       invDate.setHours(0, 0, 0, 0);
//       return invDate >= startOfMonth && invDate <= today;
//     });

//     // --- 2. Gom nhóm theo ngày ---
//     const grouped: Record<string, number> = {};
//     filtered.forEach((inv) => {
//       const date = new Date(inv.ncnhat).toLocaleDateString("vi-VN");
//       let amount = 0;
//       if (Array.isArray(inv.hdhhdvu)) {
//         inv.hdhhdvu.forEach((item) => {
//           amount += Number(item.thtien ?? 0);
//         });
//       }
//       grouped[date] = (grouped[date] || 0) + amount;
//     });
//     const grandTotal = Object.values(grouped).reduce(
//       (sum, val) => sum + val,
//       0
//     );

//     const rows = Object.entries(grouped)
//       .map(([date, total], index) => {
//         return `
//           <tr>
//             <td>${date}</td>
//             <td>${index + 1}</td>
//             <td>${today.toLocaleDateString("vi-VN")}</td>
//             <td>Doanh thu bán hàng ngày${date}</td>
//             <td>${total.toLocaleString("vi-VN")}</td>
//             <td></td><td></td><td></td><td></td><td></td>
//             <td></td>
//             <td></td>
//           </tr>
//         `;
//       })
//       .join("");
//     const html = `
//       <style>
//   body { font-family: "Times New Roman", serif; font-size: 13px; }
//   h2, h3 { text-align: center; margin: 4px 0; }
//   .header { text-align: left; font-size: 13px; margin-bottom: 10px; }
//   .right { text-align: right; font-size: 12px; font-style: italic; }
//   table { width: 100%; border-collapse: collapse; font-size: 12px; }
//   th, td {
//     border: 1px solid #000;
//     padding: 4px;
//     text-align: center;
//   }
//   th { font-weight: bold; }
//   .note { margin-top: 8px; font-size: 12px; }
//   .footer {
//     margin-top: 30px;
//     display: flex;
//     justify-content: space-between;
//     font-size: 13px;
//   }
//   .sign { text-align: center; width: 40%; }
// </style>

// <div class="header">
//   <b>HỘ, CÁ NHÂN KINH DOANH: ${profile?.businessName}</b><br/>
//   <b>Địa chỉ: ${profile?.address.street} - ${profile?.address.ward} - ${
//       profile?.address.district
//     } - ${profile?.address.city}</b>
// </div>
// <div class="right">
//   Mẫu số S1-HKD <br/>
//   (Ban hành kèm theo Thông tư số 88/2021/TT-BTC ngày 11/10/2021 của Bộ Tài chính)
// </div>

// <h2>SỔ CHI TIẾT DOANH THU BÁN HÀNG, DỊCH VỤ</h2>
// <p style="text-align:center">Tên địa điểm kinh doanh: ${
//       profile?.address.street
//     } - ${profile?.address.ward} - ${profile?.address.district} - ${
//       profile?.address.city
//     }</p>
// <p style="text-align:center">Năm: 2025</p>

// <table>
//   <tr>
//     <th rowspan="2">Ngày, tháng ghi sổ<br/>A</th>
//     <th colspan="2">Chứng từ</th>
//     <th rowspan="2">Diễn giải<br/>D</th>
//     <th colspan="7">Doanh thu bán hàng hóa, dịch vụ chia theo danh mục ngành nghề</th>
//     <th rowspan="2">Ghi chú<br/>12</th>
//   </tr>
//   <tr>
//     <th>Số hiệu<br/>B</th>
//     <th>Ngày, tháng<br/>C</th>
//     <th>Phân phối, cung cấp hàng hóa<br/>1</th>
//     <th>Dịch vụ, xây dựng không bao thầu NVL<br/>4</th>
//     <th>Sản xuất, vận tải, dịch vụ có gắn với hàng hóa, XD có bao thầu NVL<br/>7</th>
//     <th>Hoạt động KD khác<br/>10</th>
//     <th>…</th>
//     <th>…</th>
//     <th>…</th>
//   </tr>
//           ${rows}
//           <tr>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td>Tổng cộng</td>
//             <td><b>${grandTotal.toLocaleString("vi-VN")}</b></td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//             <td></td>
//           </tr>

// </table>

// <div class="note">
//   - Sổ này có … trang, đánh số từ trang 01 đến trang … <br/>
//   - Ngày mở sổ: …
// </div>

// <div class="footer">
//   <div class="sign">
//     <b>NGƯỜI LẬP BIỂU</b><br/>
//     (Ký, họ tên)
//   </div>
//   <div class="sign">
//     Ngày ${today.getDate()} tháng ${
//       today.getMonth() + 1
//     } năm ${today.getFullYear()} <br/><br/>
//     <b>NGƯỜI ĐẠI DIỆN HỘ KINH DOANH</b><br/>
//     (Ký, họ tên, đóng dấu)
//   </div>
// </div>
// `;

//     const { uri } = await Print.printToFileAsync({ html });
//     await Sharing.shareAsync(uri);
//   };

//   return (
//     <View style={{ marginTop: 50, padding: 20 }}>
//       {/* <Button title="📄 Xuất PDF từ Excel mẫu" onPress={handleExportPDF} /> */}
//     </View>
//   );
// }

import { ColorMain } from "@/src/presentation/components/colors";
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
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

type Feature = {
  key: string;
  label: string;
  navigate: () => void;
};
export default function ReportExport() {
  const navigate = useAppNavigation();
  const features = [
    {
      key: "InvoiceOuput",
      label: "Doanh thu bán hàng hoá, dịch vụ",
      navigate: () => navigate.navigate("ExportInvoiceOuputScreen"),
    },
    {
      key: "InvoiceInput",
      label: "Phí vật liệu, dụng cụ, sản phẩm, hàng hoá",
      navigate: () => navigate.navigate("ExportExcelScreen"),
    },
    {
      key: "VoucherOutput",
      label: "Chi phí sản xuất kinh doanh",
      navigate: () => navigate.navigate("ExportInvoiceOuputScreen"),
    },
    {
      key: "Tax",
      label: "Tình hình thực hiện nghĩa vụ thuế",
      navigate: () => navigate.navigate("ExportInvoiceOuputScreen"),
    },
    {
      key: "Pay",
      label: "Thanh toán lương lao động",
      navigate: () => navigate.navigate("ExportInvoiceOuputScreen"),
    },
    {
      key: "Quỹ tiền mặt - Báo cáo",
      label: "Quỹ tiền mặt - Báo cáo",
      navigate: () => navigate.navigate("ExportInvoiceOuputScreen"),
    },
  ];

  const renderItem = ({ item, index }: { item: Feature; index: number }) => {
    return (
      <Animated.View
        style={{
          transform: [{ translateY: animations[index] }],
          opacity: opacities[index],
          flex: 1,
        }}
      >
        <TouchableOpacity
          key={item.key}
          style={styles.item}
          onPress={item.navigate}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>{item.label}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const animations = useRef(features.map(() => new Animated.Value(50))).current; // bắt đầu ở Y=50 (dịch xuống)
  const opacities = useRef(features.map(() => new Animated.Value(0))).current;

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
  return (
    <View style={styles.gridContainer}>
      {/* {features.map((item, index) => (
        <TouchableOpacity key={index} style={styles.item}></TouchableOpacity>
      ))} */}
      <FlatList data={features} renderItem={renderItem} numColumns={1} />
    </View>
  );
}
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {},
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingTop: 20,
  },
  item: {
    alignItems: "center",
    height: 80,
    flex: 1,
    margin: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    backgroundColor: ColorMain,
    shadowColor: "#9d9d9d",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 0 },
    justifyContent: "center",
  },
});
