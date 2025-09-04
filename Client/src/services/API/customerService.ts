import axiosInstance from "@/src/services/API/axios";
import { CustomerListResponse } from "@/src/types/customer";
import { InvoiceListResponse } from "@/src/types/route";

export const getCustomerList = async (): Promise<CustomerListResponse> => {
  try {
    const res = await axiosInstance.get<CustomerListResponse>("customer");

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
