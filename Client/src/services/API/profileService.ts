import axiosInstance from "@/src/services/API/axios";

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
