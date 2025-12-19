import { LoginResponse } from "@/src/services/API/authService";
import axiosInstance from "@/src/services/API/axios";
import { CapchaInfo, FormGetCapcha, InvoiceListResponse, InvoiceSummary, InvoiceSyncResponse, RawInvoice } from "@/src/types/invoiceIn";
import axios from "axios";
import { Alert } from "react-native";

const token = "3J/EhtxvsAO74hsLC6PtTdSKM0VleDskquWltIl8SlM=";
export const loginCCT = async (data: {
	username: string;
	password: string;
}) => {
	try {
		const payload = { username: data.username, password: data.password };
		const response = await axios.post(
			"https://vuat-api.vitax.one/api/partner/Invoices/login_tct_client",
			payload,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		const loginData = response.data;

		return loginData;
	} catch (error: any) {
		console.log(error.response?.data); // log chi tiết
		throw error.response?.data || error;
	}
};
const mapInvoiceToSummary = (item: any): InvoiceSummary => ({
	kyHieu: item.khhdon,
	soHoaDon: item.shdon,
	mauSo: item.khmshdon,
	ngayLap: item.tdlap,
	loaiHoaDon: item.thdon,
	maCQT: item.cqt,
	maTraCuu: item.mhdon,
	mhdon: item.mhdon,
	nguoiBan: {
		ten: item.nbten,
		mst: item.nbmst,
		diaChi: item.nbdchi,
		stk: item.nbstkhoan,
	},

	nguoiMua: {
		ten: item.nmten,
		mst: item.nmmst,
		diaChi: item.nmdchi,
	},

	thanhToan: {
		hinhThuc: item.thtttoan,
		trangThai:
			item.ttkhac?.find((x: any) => x.ttruong === "Trạng thái thanh toán")
				?.dlieu ?? "",
	},

	tien: {
		truocThue: item.tgtcthue,
		thue: item.tgtthue,
		tong: item.tgtttbso,
		bangChu: item.tgtttbchu,
		thueSuat: item.thttltsuat?.[0]?.tsuat ?? "",
		dvtte: item.dvtte,
	},

	// ✅ giữ nguyên danh sách hàng hóa dịch vụ
	hdhhdvu: item.hdhhdvu,
	createdAt: item.ncnhat,
	ngayKy: item.nky,
	trangThaiHoaDon: item.tthaibchu,
});

export const syncInvoiceIn = async (): Promise<InvoiceListResponse> => {
	try {
		const url = "invoices-in/sync-list-invoice-detail";

		const res = await axiosInstance.post<InvoiceListResponse>(url);


		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};
export const getInvoiceIn = async (): Promise<RawInvoice[]> => {
	try {
		const res = await axiosInstance.get<RawInvoice>("invoices-in");
		const data = Array.isArray(res.data) ? res.data : [];
		return data.map(mapInvoiceToSummary);
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const getInvoiceOut = async (): Promise<RawInvoice[]> => {
	try {
		const res = await axiosInstance.get<RawInvoice>("output-invoices");
		const data = Array.isArray(res.data) ? res.data : [];
		return data.map(mapInvoiceToSummary);
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};
export const getInvoiceInById = async (
	id: string
): Promise<InvoiceSummary[]> => {
	try {
		const res = await axiosInstance.get<InvoiceSummary>(`invoices-in/${id}`);
		const data = Array.isArray(res.data) ? res.data : [];
		return data.map(mapInvoiceToSummary);
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};


export const getCapcha = async (username: string, password: string): Promise<CapchaInfo> => {
	try{
		
		const res = await axiosInstance.post<CapchaInfo>(`invoice-sync/captcha`, {username, password})

		return res.data
	}catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
}	

export const verifyCapchaInput = async (
  sessionId: string,
  captcha: string,
  invoiceType: string
): Promise<InvoiceSyncResponse> => {
  try {
    const res = await axiosInstance.post<InvoiceSyncResponse>(
      "invoice-sync/login",
      {
        sessionId,
        captcha,
        invoiceType,
      }
    );

    console.log("VERIFY SUCCESS:", res.data);
    return res.data;
  } catch (error: any) {
    console.log("VERIFY ERROR FULL:", error);
    console.log("VERIFY ERROR RESPONSE:", error?.response?.data);
    console.log("VERIFY ERROR STATUS:", error?.response?.status);

    // ✅ LUÔN throw error gốc
    throw error;
  }
};