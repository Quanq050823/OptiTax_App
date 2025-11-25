import { InvoiceProduct } from "./invoiceIn";
import { Product } from "./route";
export type ExportInvoiceDetailParams = {
  invoiceId: string;
  items: ExportInvoiceProduct[];
  total: number;
  tax?: number;
  date: string;
  note?: string;
}
export type ExportInvoiceProduct = Product & {
  quantity: number;
  total: number;
};

export interface InvoiceData {
  nmmst: string;        // Mã số thuế người mua
  nmten: string;        // Tên người mua
  nmdchi: string;       // Địa chỉ người mua
  tgtttbso: string;     // Tổng tiền thanh toán (số)
  tgtttbchu: string;    // Tổng tiền thanh toán (chữ)
  thtttoan: string;     // Hình thức thanh toán: "Tiền mặt", "Chuyển khoản", ...
  hdhhdvu: InvoiceItem[]; // Danh sách hàng hóa dịch vụ
}

export interface InvoiceItem {
  ten: string;       // Tên hàng hóa/dịch vụ
  dvtinh: string;    // Đơn vị tính
  sluong: string;    // Số lượng
  dgia: string;      // Đơn giá
  thtien: string;    // Thành tiền
  tchat: number;     // Tính chất (1,2,...)
}
