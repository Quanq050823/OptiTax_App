import axiosInstance from "@/src/services/API/axios";
import { InvoiceListResponse, Product } from "@/src/types/route";

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
export const createProduct = async (products: {
  name: string;
  code: string;
  category: string;
  unit: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  attributes: { key: string; value: string }[];
}) => {
  try {
    const res = await axiosInstance.post("product", products);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`product/${id}`);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getProductsById = async (id: string) => {
  try {
    const res = await axiosInstance.get(`product/${id}`);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  products: {
    name: string;
    code: string;
    category: string;
    price: number;
    description: string;
    imageUrl: string;
    stock: number;
  }
) => {
  try {
    const res = await axiosInstance.put(`product/${id}`, products);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
