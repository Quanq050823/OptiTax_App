import axiosInstance from "@/src/services/API/axios";
import {
  NamesUnitsResponse,
  NewProductInventory,
  ProductInventory,
  ProductInventoryList,
  UnitsNameProduct,
} from "@/src/types/storage";

export const getProductsInventory = async (): Promise<ProductInventoryList> => {
  try {
    const res = await axiosInstance.get<ProductInventoryList>("storage-item");

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
export const getUnitNameProduct = async (): Promise<UnitsNameProduct> => {
  try {
    const res = await axiosInstance.get<UnitsNameProduct>(
      "storage-item/names-units"
    );

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const searchProductsInventory = async (
  keyword: string
): Promise<ProductInventoryList> => {
  const res = await axiosInstance.get<ProductInventoryList>(
    `storage-item/names-units?q=${keyword}`
  );
  return res.data;
};

export const createProductInventory = async (products: NewProductInventory) => {
  try {
    const res = await axiosInstance.post("storage-item", products);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const deleteProductInventory = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`storage-item/${id}`);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const updateProductInventory = async (
  id: string,
  products: {
    name: string;
    unit: string;
    price: number;
    imageURL: string;
    stock: number;
  }
) => {
  try {
    const res = await axiosInstance.put(`storage-item/${id}`, products);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getProductsInventoryById = async (
  id: string
): Promise<ProductInventory> => {
  try {
    const res = await axiosInstance.get<ProductInventory>(`storage-item/${id}`);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
