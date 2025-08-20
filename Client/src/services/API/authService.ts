import axios from "./axios";
import { TokenStorage } from "../../utils/tokenStorage";

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

export const login = async (data: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const payload = { email: data.username, password: data.password };
    const response = await axios.post("auth/login", payload, {
      withCredentials: true,
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

export const logout = async () => {
  try {
    {
      await axios.get("auth/logout", {
        withCredentials: true,
      });
      await TokenStorage.removeTokens();
    }
  } catch (error: any) {
    throw error;
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
