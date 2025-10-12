import axiosInstance from "@/src/services/API/axios";
import { AddTax, TaxItem, TaxResponse } from "@/src/types/tax";

export const getTaxList = async (): Promise<TaxResponse> => {
  try {
    const res = await axiosInstance.get<TaxResponse>("employees");
    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const CreateTaxVoucher = async (voucherData: AddTax) => {
  try {
    const res = await axiosInstance.post("tax-submission", voucherData);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error("❌ Lỗi API:", error.response.data);
      throw error.response.data;
    }
    console.error("❌ Lỗi khác:", error);
    throw error;
  }
};