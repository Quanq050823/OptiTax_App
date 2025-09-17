import axiosInstance from "@/src/services/API/axios";
import { Product } from "@/src/types/route";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const res = await axiosInstance.get<Product[]>("product");

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
