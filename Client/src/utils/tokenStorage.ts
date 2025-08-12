import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const TokenStorage = {
	async saveTokens(accessToken: string, refreshToken: string) {
		try {
			await AsyncStorage.multiSet([
				[ACCESS_TOKEN_KEY, accessToken],
				[REFRESH_TOKEN_KEY, refreshToken],
			]);
		} catch (error) {
			console.error("Error saving tokens:", error);
		}
	},

	async getAccessToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
		} catch (error) {
			console.error("Error getting access token:", error);
			return null;
		}
	},

	async getRefreshToken(): Promise<string | null> {
		try {
			return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
		} catch (error) {
			console.error("Error getting refresh token:", error);
			return null;
		}
	},

	async getTokens(): Promise<{
		accessToken: string | null;
		refreshToken: string | null;
	}> {
		try {
			const tokens = await AsyncStorage.multiGet([
				ACCESS_TOKEN_KEY,
				REFRESH_TOKEN_KEY,
			]);
			return {
				accessToken: tokens[0][1],
				refreshToken: tokens[1][1],
			};
		} catch (error) {
			console.error("Error getting tokens:", error);
			return { accessToken: null, refreshToken: null };
		}
	},

	async removeTokens() {
		try {
			await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
		} catch (error) {
			console.error("Error removing tokens:", error);
		}
	},

	async isLoggedIn(): Promise<boolean> {
		try {
			const { accessToken, refreshToken } = await this.getTokens();
			return !!(accessToken && refreshToken);
		} catch (error) {
			console.error("Error checking login status:", error);
			return false;
		}
	},
};
