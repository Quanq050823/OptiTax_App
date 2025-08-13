import axiosInstance from "@/src/services/API/axios";

export const getProducts = async () => {
  try {
    const res = await axiosInstance.get("product");

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
