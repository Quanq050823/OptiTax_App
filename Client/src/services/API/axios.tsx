import axios from "axios";
import { TokenStorage } from "../../utils/tokenStorage";

// const BASE_URL = "http://eonapp.duckdns.org/api/";
const BASE_URL = "http://192.168.1.243:3001/api/";

const axiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true, // nếu backend cần cookie
});

axiosInstance.interceptors.request.use(
	async (config: any) => {
		const accessToken = await TokenStorage.getAccessToken();
		if (accessToken) {
			if (!config.headers) {
				config.headers = {};
			}
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default axiosInstance;

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

axiosPrivate.interceptors.request.use(
	async (config: any) => {
		const accessToken = await TokenStorage.getAccessToken();
		if (accessToken) {
			if (!config.headers) {
				config.headers = {};
			}
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);
