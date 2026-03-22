import axiosInstance from "@/src/services/API/axios";
import {
	CreateInvoiceRequest,
	InvoiceCCT,
	InvoiceData,
} from "@/src/types/invoiceExport";
import { InvoiceListResponse } from "@/src/types/route";

type ExportInvoiceOutputResult = {
	easyInvoice: EaseInvoiceResponse;
	savedInvoice?: unknown;
};

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

type EaseInvoiceApiResponse = {
	success?: boolean;
	message?: string;
	data?: EaseInvoiceResponse;
	invoiceData?: CreateInvoiceRequest["invoiceData"];
	savedInvoice?: unknown;
};

const normalizeEaseInvoiceResponse = (
	responseData: EaseInvoiceResponse | EaseInvoiceApiResponse,
): EaseInvoiceResponse => {
	if ("success" in responseData && responseData.success === false) {
		throw new Error(responseData.message ?? "Xuất CCT thất bại");
	}

	if ("data" in responseData && responseData.data) {
		return responseData.data;
	}

	return responseData as EaseInvoiceResponse;
};

const isEaseInvoiceSuccess = (data: EaseInvoiceResponse) =>
	Number(data?.Status) === 1;

export const exportInvoiceOutputEaseInvoice = async (
	invoiceData: CreateInvoiceRequest,
) => {
	try {
		const res = await axiosInstance.post<
			EaseInvoiceResponse | EaseInvoiceApiResponse
		>(
			`easyinvoice/importInvoice`, //XUẤT HÓA ĐƠN CHƯA PHÁT HÀNH
			// 	`easyinvoice/import-and-issue-invoice`,   //XUẤT HÓA ĐƠN VÀ PHÁT HÀNH NGAY
			invoiceData,
		);

		const data = normalizeEaseInvoiceResponse(res.data);

		// ❗❗❗ BẮT BUỘC
		if (!isEaseInvoiceSuccess(data)) {
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

export const exportInvoiceOutputAndSaveDb = async (
	easyInvoiceData: CreateInvoiceRequest,
	dbInvoiceData?: InvoiceData,
): Promise<ExportInvoiceOutputResult> => {
	const res = await axiosInstance.post<EaseInvoiceApiResponse>(
		`easyinvoice/importInvoice`,
		easyInvoiceData,
	);
	const easyInvoice = normalizeEaseInvoiceResponse(res.data);
	let savedInvoice = res.data.savedInvoice;

	if (!savedInvoice && dbInvoiceData) {
		savedInvoice = await exportInvoiceOutput(dbInvoiceData);
	}

	return {
		easyInvoice,
		savedInvoice,
	};
};
