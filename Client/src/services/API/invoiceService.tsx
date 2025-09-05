import axiosInstance from "@/src/services/API/axios";
import { InvoiceListResponse } from "@/src/types/route";

export const getInvoiceInputList = async () => {
  try {
    const res = await axiosInstance.get<InvoiceListResponse>("input-invoice");

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
export const getInvoiceOutputList = async () => {
  try {
    const res = await axiosInstance.get<InvoiceListResponse>("output-invoice");

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
