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

import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { DatePickerModal, registerTranslation } from "react-native-paper-dates";
import { Provider as PaperProvider } from "react-native-paper";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import SetDataDay from "@/src/presentation/components/SetDataDay";

// ---- Dịch tiếng Việt cho DatePicker ----
const viTranslation = {
  save: "Lưu",
  selectSingle: "Chọn ngày",
  selectMultiple: "Chọn nhiều ngày",
  selectRange: "Chọn khoảng ngày",
  notAccordingToDateFormat: (inputFormat: string) =>
    `Ngày không đúng định dạng (${inputFormat})`,
  mustBeHigherThan: (date: string) => `Phải sau ${date}`,
  mustBeLowerThan: (date: string) => `Phải trước ${date}`,
  mustBeBetween: (startDate: string, endDate: string) =>
    `Phải nằm giữa ${startDate} - ${endDate}`,
  dateIsDisabled: "Ngày này không được chọn",
  previous: "Trước",
  next: "Sau",
  typeInDate: "Nhập ngày",
  pickDateFromCalendar: "Chọn ngày từ lịch",
  close: "Đóng",
  hour: "Giờ",
  minute: "Phút",
};
registerTranslation("vi", viTranslation);

export default function ExportInvoiceOutput() {
  const { data: profile, invoicesOuput } = useData();

  const [mode, setMode] = useState<"month" | "quarter" | "range">("month");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(undefined);
  const [range, setRange] = useState<{
    startDate: CalendarDate;
    endDate: CalendarDate;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

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

  // --- Xuất PDF ---
  const handleExportPDF = async () => {
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
  };

  return (
    <View style={{ flex: 1 }}>
      <SetDataDay
        mode={mode}
        setMode={setMode}
        selectedDate={selectedDate}
        setVisible={setVisible}
        visible={visible}
        range={range}
        onDismiss={onDismiss}
        onConfirmSingle={onConfirmSingle}
        handleExportPDF={handleExportPDF}
        getQuarter={getQuarter}
        onConfirmRange={onConfirmRange}
        loading={loading}
        setLoading={setLoading}
      />
    </View>
  );
}
