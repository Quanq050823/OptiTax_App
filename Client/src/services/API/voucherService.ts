import axiosInstance from "@/src/services/API/axios";
import { PaymentVoucher, VoucherPaymentResponse } from "@/src/types/voucher";
export const getVoucherPayment = async (): Promise<VoucherPaymentResponse> => {
  try {
    const res = await axiosInstance.get<VoucherPaymentResponse>(
      "expense-voucher"
    );

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const createVoucherPayment = async (voucher: {
  date: string;
  category: string;
  amount: number;
  description: string;
}) => {
  try {
    const res = await axiosInstance.post("expense-voucher", voucher);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
