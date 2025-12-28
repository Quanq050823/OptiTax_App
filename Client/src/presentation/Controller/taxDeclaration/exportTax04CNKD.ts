import { Invoice, Profile } from "@/src/types/route";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import invoicesData from "../../components/InvoicesData";

type dataToKhai = {
  data: Profile,
  invoicesData: Invoice[]
}

export const formatVND = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) return "0 ₫";

  const number = typeof value === "string"
    ? Number(value.replace(/[^\d]/g, ""))
    : value;

  if (isNaN(number)) return "0 ₫";

  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const tokhaiHTML = (data: any, invoiceOutput: Invoice[], total: number, totalTNCN: number, totalGTGT: number) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  body {
    font-family: "Times New Roman";
    font-size: 14px;
    line-height: 1.4;
  }
  .center { text-align: center; }
  .right { text-align: right; }
  .bold { font-weight: bold; }
  .italic { font-style: italic; }
  .mt-8 { margin-top: 8px; }
  .mt-16 { margin-top: 16px; }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  th, td {
    border: 1px solid black;
    padding: 4px;
    vertical-align: middle;
  }
  th {
    text-align: center;
    font-weight: bold;
  }
  .no-border td {
    border: none;
    padding: 2px 0;
  }
</style>
</head>

<body>

<p class="center bold">Mẫu số: 01/CNKD</p>
<p class="center italic">
(Ban hành kèm theo Thông tư số 40/2021/TT-BTC ngày 01/6/2021 của Bộ Tài chính)
</p>

<br/>

<p class="center bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
<p class="center bold">Độc lập - Tự do - Hạnh phúc</p>
<p class="center">----------------</p>

<br/>

<p class="center bold">
TỜ KHAI THUẾ ĐỐI VỚI HỘ KINH DOANH, CÁ NHÂN KINH DOANH
</p>

<table class="no-border mt-8">
<tr><td>□ HKD, CNKD nộp thuế theo phương pháp khoán</td></tr>
<tr><td>□ CNKD nộp thuế theo từng lần phát sinh</td></tr>
<tr><td>□ Tổ chức, cá nhân khai thuế thay, nộp thuế thay</td></tr>
<tr><td>□ HKD, CNKD nộp thuế theo phương pháp kê khai</td></tr>
<tr><td>□ HKD, CNKD trong lĩnh vực có căn cứ xác định doanh thu</td></tr>
<tr><td>□ Hộ khoán chuyển đổi phương pháp tính thuế</td></tr>
</table>

<p class="mt-8">[01] Kỳ tính thuế: <b>${data.kyTinhThue || ""}</b></p>

<p>[04] Người nộp thuế: <b>${data.name || ""}</b></p>
<p>[05] Tên cửa hàng/thương hiệu: <b>${data.businessName || ""}</b></p>
<p>[06] Tài khoản ngân hàng: <b>${data.taiKhoanNH || ""}</b></p>
<p>[07] Mã số thuế: <b>${data.taxCode || ""}</b></p>
<p>[08] Ngành nghề kinh doanh: <b>${data.businessType || ""}</b></p>
<p>[09] Diện tích kinh doanh: <b>${data.dienTich || ""}</b></p>
<p>[10] Số lao động thường xuyên: <b>${data.soLaoDong || ""}</b></p>
<p>[11] Thời gian hoạt động: <b>${data.thoiGianHD || ""}</b></p>

<p>[12] Địa chỉ kinh doanh: <b>${[
  data.address?.street,
  data.address?.ward,
  data.address?.district,
  data.address?.city,
].filter(Boolean).join(", ")}</b></p>
<p>[13] Địa chỉ cư trú: <b>${data.diaChiCuTru || ""}</b></p>
<p>[14] Điện thoại: <b>${data.phone || ""}</b></p>
<p>[16] Email: <b>${data.email || ""}</b></p>

<!-- A -->
<p class="bold mt-16">
A. KÊ KHAI THUẾ GIÁ TRỊ GIA TĂNG (GTGT), THUẾ THU NHẬP CÁ NHÂN (TNCN)
</p>
<p>Đơn vị tiền: Đồng Việt Nam</p>

<table>
<tr>
  <th rowspan="2">STT</th>
  <th rowspan="2">Nhóm ngành nghề</th>
  <th rowspan="2">Mã</th>
  <th colspan="2">Thuế GTGT</th>
  <th colspan="2">Thuế TNCN</th>
</tr>
<tr>
  <th>Doanh thu</th>
  <th>Số thuế</th>
  <th>Doanh thu</th>
  <th>Số thuế</th>
</tr>

<tr>
  <td align="center">1</td>
  <td>Phân phối, cung cấp hàng hóa</td>
  <td align="center">[28]</td>
  <td>${formatVND(total)}</td>
  <td>${formatVND(totalTNCN)}</td>
  <td>${data.A?.hangHoa?.dtTNCN || ""}</td>
  <td>${formatVND(totalGTGT)}</td>
</tr>

<tr>
  <td align="center">2</td>
  <td>Dịch vụ, xây dựng không bao thầu NVL</td>
  <td align="center">[29]</td>
  <td>${data.A?.dichVu?.dtGTGT || ""}</td>
  <td>${data.A?.dichVu?.thueGTGT || ""}</td>
  <td>${data.A?.dichVu?.dtTNCN || ""}</td>
  <td>${data.A?.dichVu?.thueTNCN || ""}</td>
</tr>

<tr>
  <td align="center">3</td>
  <td>Sản xuất, vận tải, xây dựng có bao thầu NVL</td>
  <td align="center">[30]</td>
  <td>${data.A?.sanXuat?.dtGTGT || ""}</td>
  <td>${data.A?.sanXuat?.thueGTGT || ""}</td>
  <td>${data.A?.sanXuat?.dtTNCN || ""}</td>
  <td>${data.A?.sanXuat?.thueTNCN || ""}</td>
</tr>

<tr>
  <td align="center">4</td>
  <td>Hoạt động kinh doanh khác</td>
  <td align="center">[31]</td>
  <td>${data.A?.khac?.dtGTGT || ""}</td>
  <td>${data.A?.khac?.thueGTGT || ""}</td>
  <td>${data.A?.khac?.dtTNCN || ""}</td>
  <td>${data.A?.khac?.thueTNCN || ""}</td>
</tr>

<tr class="bold">
  <td colspan="3" align="center">Tổng cộng</td>
  <td colspan="4" align="center">[32]</td>
</tr>
</table>

<p class="mt-16">
Tôi cam đoan số liệu khai trên là đúng và chịu trách nhiệm trước pháp luật về những số liệu đã khai.
</p>

<p class="right mt-16">
…, ngày … tháng … năm …<br/>
<b>NGƯỜI NỘP THUẾ</b><br/>
(Ký, ghi rõ họ tên)
</p>

</body>
</html>
`;



const exportTax04CNKD = async (data: any,   invoicesOutput: Invoice[], totalGTGT: number, totalTNCN: number) => {
  //   const [u, setU] = useState();
const sumInvoiceAmount = (invoices: Invoice[]) =>
  invoices.reduce(
    (sum, i) => sum + Number(i.tgtttbso || 0),
    0
  );
const total = sumInvoiceAmount(invoicesOutput);

  try {
    console.log("CLICK EXPORT 04/CNKD");

    const canShare = await Sharing.isAvailableAsync();
    console.log("CAN SHARE:", canShare);

    if (!canShare) {
      alert("Thiết bị không hỗ trợ chia sẻ file");
      return;
    }

 

    const html = tokhaiHTML(data, invoicesOutput, total,totalGTGT,totalTNCN);

    const baseDir = FileSystem.cacheDirectory;
    if (!baseDir) return;

    const fileUri = baseDir + "04_CNKD.doc";

    await FileSystem.writeAsStringAsync(fileUri, html, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: "application/msword",
    });
    console.log("SHARE OPENED");
  } catch (err) {
    console.log("EXPORT ERROR:", err);
  }
};

export { exportTax04CNKD };

