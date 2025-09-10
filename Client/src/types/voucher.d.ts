export interface PaymentVoucher {
  _id: string; // Mã phiếu chi (mã sinh tự động, vd: "735510000000xx")
  amount: number; // Giá trị chi
  type: string; // Loại phiếu chi
  recipientGroup: string; // Nhóm người nhận
  recipientName: string; // Tên người nhận
  paymentMethod: string; // Phương thức thanh toán
  description: string; // Mô tả (có thể để trống)
  category: string; // Danh mục chi
  date: string; // Ngày chi
  recordDate: Date; // Thời gian ghi nhận
  originalDocumentCode?: string; // Mã chứng từ gốc (optional)
  attachmentUrl?: string; // File chứng từ tải lên (optional)
  businessOwnerId: string;
  createdAt: strng;
}

export interface VoucherPaymentResponse {
  data: PaymentVoucher[];
  pagination: {
    limit: number;
    page: number;
    pages: number;
    total: number;
  };
}
