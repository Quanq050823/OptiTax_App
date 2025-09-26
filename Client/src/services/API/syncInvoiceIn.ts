import axiosInstance from "@/src/services/API/axios";

export const syncInvoiceIn = async (data: {
  dateto: string;
  datefrom: string;
  username: string;
  password: string;
}) => {
  try {
    const res = await axiosInstance.post(
      "invoices-out/sync-from-third-party",
      data
    );

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
export const getInvoiceIn = async () => {
  try {
    const res = await axiosInstance.get("invoices-out");

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
