import axiosInstance from "@/src/services/API/axios";
import {
	BusinessInfo,
	FormDataType,
	UserProfile,
	TaxDeadlineInfo,
} from "@/src/types/route";
import { TokenStorage } from "@/src/utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
export type UpdateProfilePayload = Pick<UserProfile, "_id" | "name" | "email">;
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
export type UpdateProfileResponse = UserProfile;

export const UpdateUserProfile = async (
	payload: UpdateProfilePayload,
): Promise<UserProfile> => {
	try {
		const res = await axiosInstance.put("/user/update-info", payload);
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

export const getTaxDeadline = async (): Promise<TaxDeadlineInfo> => {
	try {
		const res = await axiosInstance.get("/business-owner/tax-deadline");
		return res.data as TaxDeadlineInfo;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export interface EasyInvoiceInfo {
	account: string;
	password: string;
	mst: string;
	serial: string;
}

export const UpdateEasyInvoiceInfo = async (
	payload: EasyInvoiceInfo,
): Promise<{ message: string }> => {
	try {
		const res = await axiosInstance.put(
			"/business-owner/easy-invoice-info",
			payload,
		);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};
