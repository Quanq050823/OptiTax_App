// useLogin.ts
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { login, checkLogin } from "@/src/services/API/authService";
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
			const loginStatus = await checkLogin();
			console.log("Login status check:", loginStatus);

			if (loginStatus.isAuthenticated) {
				console.log("User already logged in, navigating to app...");
				navigation.reset({
					index: 0,
					routes: [{ name: "NavigationBusiness" }],
				});
				return;
			}
			const result = await login({ username, password });
			console.log("Login result:", result);
			if (result?.accessToken) {
				await AsyncStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
				await AsyncStorage.setItem(USERNAME_KEY, username);

				if (result.refreshToken) {
					await AsyncStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
				}

				const successMessage = result.messages;
				if (successMessage) {
					Alert.alert("Thành công", successMessage);
				}

				navigation.reset({
					index: 0,
					routes: [{ name: "NavigationBusiness" }],
				});
			} else {
				Alert.alert("Lỗi", "Không nhận được token từ server");
			}
		} catch (error: any) {
			const errorMessage = error?.message || "Có lỗi xảy ra";
			Alert.alert("Đăng nhập thất bại", errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { handleLogin, loading };
};
