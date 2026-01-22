import axiosInstance from "@/src/services/API/axios";
import {
	CreateInvoiceRequest,
	InvoiceCCT,
	InvoiceData,
} from "@/src/types/invoiceExport";
import { InvoiceListResponse } from "@/src/types/route";

export const getInvoiceInputList = async () => {
	try {
		const res = await axiosInstance.get<InvoiceListResponse>("input-invoice");

		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};
export const getInvoiceOutputList = async () => {
	try {
		const res = await axiosInstance.get<InvoiceListResponse>("output-invoices");

		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};
export const getInvoiceOutputById = async (userId: string) => {
	try {
		const res = await axiosInstance.get<InvoiceListResponse>(
			`output-invoice/ ${userId}`,
		);

		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const exportInvoiceOutput = async (invoiceData: InvoiceData) => {
	try {
		const res = await axiosInstance.post(`output-invoices`, invoiceData);

		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		console.log(error);

		throw error;
	}
};

type EaseInvoiceResponse = {
	Status: number;
	Message?: string;
	ErrorCode?: number;
	Data?: {
		Pattern?: string;
		Serial?: string;
		KeyInvoiceMsg?: Record<string, string>;
	};
};

export const exportInvoiceOutputEaseInvoice = async (
	invoiceData: CreateInvoiceRequest,
) => {
	try {
		const res = await axiosInstance.post<EaseInvoiceResponse>(
			`easyinvoice/import-and-issue-invoice`,
			invoiceData,
		);

		const data = res.data;

		// ❗❗❗ BẮT BUỘC
		if (data?.Status !== 1) {
			const message = data?.Data?.KeyInvoiceMsg
				? Object.values(data.Data.KeyInvoiceMsg)[0]
				: (data?.Message ?? "Xuất CCT thất bại");

			throw new Error(message);
		}
		return data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		console.log(error);

		throw error;
	}
};
