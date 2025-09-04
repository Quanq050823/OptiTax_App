import axiosInstance from "@/src/services/API/axios";
import { BusinessInfo, FormDataType, UserProfile } from "@/src/types/route";
import { TokenStorage } from "@/src/utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const res = await axiosInstance.get("/user/me"); // endpoint tương đối
    return res.data as UserProfile;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const CreateBusinessAuth = async (infor: FormDataType) => {
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

export const UpdateBusinessAuthStore = async (infor: FormDataType) => {
  try {
    const res = await axiosInstance.put("/business-owner/", infor);
    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
export const BusinessInforAuth = async (): Promise<BusinessInfo> => {
  try {
    const res = await axiosInstance.get("/business-owner/me");
    return res.data as BusinessInfo;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
