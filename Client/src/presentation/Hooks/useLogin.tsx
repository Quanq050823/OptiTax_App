// useLogin.ts
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { login } from "@/src/services/API/authService";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USERNAME_KEY = "username";

export const useLogin = () => {
	const [loading, setLoading] = useState(false);
	const navigation = useAppNavigation();

	const handleLogin = async (username: string, password: string) => {
		if (!username || !password) {
			Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
			return;
		}

		setLoading(true);
		try {
			const result = await login({ username, password });
			console.log("Login result:", result);

			if (result?.accessToken && result?.refreshToken) {
				await AsyncStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
				await AsyncStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
				await AsyncStorage.setItem(USERNAME_KEY, username);

				console.log("Tokens saved:", {
					access: result.accessToken,
					refresh: result.refreshToken,
				});

				navigation.reset({
					index: 0,
					routes: [{ name: "NavigationBusiness" }],
				});
			} else {
				Alert.alert("Lỗi", "Không nhận được token từ server");
			}
		} catch (error: any) {
			Alert.alert("Đăng nhập thất bại", error?.message || "Có lỗi xảy ra");
		} finally {
			setLoading(false);
		}
	};

	return { handleLogin, loading };
};
