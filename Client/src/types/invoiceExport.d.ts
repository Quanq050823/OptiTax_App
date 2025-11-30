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
  mhdon: string,
  nmmst: string;        // Mã số thuế người mua
  nmten: string;        // Tên người mua
  nmdchi: string;       // Địa chỉ người mua
  tgtttbso: number;     // Tổng tiền thanh toán (số)
  tgtttbchu: string;    // Tổng tiền thanh toán (chữ)
  thtttoan: string;     // Hình thức thanh toán: "Tiền mặt", "Chuyển khoản", ...
  hdhhdvu: InvoiceItem[]; // Danh sách hàng hóa dịch vụ
}
export interface InvoiceItem {
  ten: string;
  dvtinh: string;
  sluong: number;
  dgia: number;
  thtien: string;  // một số API VN vẫn yêu cầu string
  tchat: number;
}