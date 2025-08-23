import axiosInstance from "@/src/services/API/axios";
import { TokenStorage } from "@/src/utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserProfile = async () => {
  try {
    const res = await axiosInstance.get("/user/me"); // endpoint tương đối
    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const BusinessInforAuth = async (infor: FormDataType) => {
  try {
    const res = await axiosInstance.post("/business-owner/", infor);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
