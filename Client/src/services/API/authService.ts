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
		}
	} catch (error: any) {
		throw error;
	}
};
