import axiosInstance from "@/src/services/API/axios";
import { AddTax, TaxItem, TaxResponse } from "@/src/types/tax";

export const getTaxList = async (): Promise<TaxResponse> => {
	try {
		const res = await axiosInstance.get<TaxResponse>("employees");
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const CreateTaxVoucher = async (voucherData: AddTax) => {
	try {
		const res = await axiosInstance.post("tax-submission", voucherData);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			console.error("❌ Lỗi API:", error.response.data);
			throw error.response.data;
		}
		console.error("❌ Lỗi khác:", error);
		throw error;
	}
};

export interface TotalTaxesResponse {
	totalGTGT: number;
	totalTNCN: number;
	invoiceCount: number;
}

export const getTotalTaxes = async (
	periodType?: "month" | "quarter" | "all",
	year?: number,
	period?: number,
	startDate?: string,
	endDate?: string
): Promise<TotalTaxesResponse> => {
	try {
		const params: any = {};

		if (periodType && year) {
			params.periodType = periodType;
			params.year = year;
			if (period) params.period = period;
		} else {
			if (startDate) params.startDate = startDate;
			if (endDate) params.endDate = endDate;
		}

		const res = await axiosInstance.get<TotalTaxesResponse>(
			"output-invoices/taxes/total",
			{ params }
		);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export interface TaxSummaryByPeriodResponse {
	periodType: string;
	year: number;
	period?: number;
	data: Array<{
		_id: { year: number; month?: number; quarter?: number };
		totalAmount: number;
		count: number;
		submissions: any[];
	}>;
}

export const getTaxSummaryByPeriod = async (
	periodType: "month" | "quarter" | "all" = "month",
	year?: number,
	period?: number
): Promise<TaxSummaryByPeriodResponse> => {
	try {
		const params: any = { periodType };
		if (year) params.year = year;
		if (period) params.period = period;

		const res = await axiosInstance.get<TaxSummaryByPeriodResponse>(
			"tax-submission/summary",
			{ params }
		);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};
