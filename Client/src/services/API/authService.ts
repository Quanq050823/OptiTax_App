import axios, { axiosInstance } from "./axios";
import { TokenStorage } from "../../utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  messages?: string;
  role?: number;
  [key: string]: any;
}

export interface LogoutResponse {
  message: string;
}
export interface CheckLoginResponse {
  isAuthenticated: boolean;
  accessToken?: string;
  refreshToken?: string;
}
export const login = async (data: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const payload = { email: data.username, password: data.password };
    const response = await axios.post("auth/login", payload, {
      withCredentials: true, // phải true để backend set cookie
    });

    const loginData = response.data as LoginResponse;

    if (loginData.accessToken && loginData.refreshToken) {
      await TokenStorage.saveTokens(
        loginData.accessToken,
        loginData.refreshToken
      );
      console.log("Tokens saved successfully");
      console.log("Access Token: --", loginData.accessToken);
      console.log("Refresh Token: --", loginData.refreshToken);
    }

    return loginData;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const logout = async (): Promise<LogoutResponse> => {
  try {
    // Lấy token từ AsyncStorage (nếu backend xác thực bằng JWT)
    const accessToken = await AsyncStorage.getItem("access_token");
    if (!accessToken) {
      // Token không có, coi như đã logout
      await TokenStorage.removeTokens();
      return { message: "Logout successful (no token found)" };
    }

    // Gọi API logout
    const res = await axiosInstance.get<LogoutResponse>("auth/logout", {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true, // gửi cookie nếu backend dùng session
    });

    // Xóa token ở client
    await TokenStorage.removeTokens();

    console.log("Logout response from backend:", res.data);

    return { message: res.data?.message || "Logout successful" };
  } catch (error: any) {
    console.error("Logout failed:", error);
    // Dù API thất bại, cũng xóa token để tránh bị login nhầm
    await TokenStorage.removeTokens();
    return { message: "Logout failed, but tokens removed" };
  }
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  userType: number;
}): Promise<LoginResponse> => {
  try {
    // Payload gửi cho API
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      userType: data.userType,
    };

    // Gửi request đăng ký
    const response = await axios.post("auth/register", payload, {
      withCredentials: true,
    });

    // Lấy dữ liệu trả về
    const registerData = response.data as LoginResponse;

    // Nếu API trả token thì lưu lại luôn
    if (registerData.accessToken && registerData.refreshToken) {
      await TokenStorage.saveTokens(
        registerData.accessToken,
        registerData.refreshToken
      );
      console.log("Tokens saved successfully after register");
    }

    return registerData;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const checkLogin = async (): Promise<CheckLoginResponse> => {
  try {
    const accessToken = await AsyncStorage.getItem("access_token");
    console.log("Checking token:", accessToken);
    if (!accessToken) return { isAuthenticated: false };

    const res = await axiosInstance.get<CheckLoginResponse>("auth/is-login", {
      withCredentials: true,
    });

    console.log("Response from backend:", res.data);
    return { isAuthenticated: res.data?.isAuthenticated === true };
  } catch (error) {
    console.error("Check login failed:", error);
    return { isAuthenticated: false };
  }
};
