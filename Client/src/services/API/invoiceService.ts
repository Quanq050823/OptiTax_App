import axiosInstance from "@/src/services/API/axios";
import { InvoiceData } from "@/src/types/invoiceExport";
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
			`output-invoice/ ${userId}`
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
