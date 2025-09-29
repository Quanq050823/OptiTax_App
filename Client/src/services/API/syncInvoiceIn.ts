import { LoginResponse } from "@/src/services/API/authService";
import axiosInstance from "@/src/services/API/axios";
import { InvoiceSummary } from "@/src/types/invoiceIn";
import axios from "axios";

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
    console.log(loginData, "Login data");

    return loginData;
  } catch (error: any) {
    console.log(error.response?.data); // log chi tiết
    throw error.response?.data || error;
  }
};
const mapInvoiceToSummary = (raw: any): InvoiceSummary => ({
  // 1. Thông tin chung
  kyHieu: raw.khhdon,
  soHoaDon: raw.shdon,
  mauSo: raw.khmshdon,
  ngayLap: new Date(raw.tdlap).toISOString().split("T")[0], // yyyy-mm-dd
  loaiHoaDon: raw.tlhdon || raw.thdon,
  maCQT: raw.cqt,
  maTraCuu: raw.mtdtchieu || raw.mhdon,

  // 2. Bên bán
  nguoiBan: {
    ten: raw.nbten,
    mst: raw.nbmst,
    diaChi: raw.nbdchi,
    stk: raw.nbstkhoan,
  },

  // 3. Bên mua
  nguoiMua: {
    ten: raw.nmten,
    mst: raw.nmmst,
    diaChi: raw.nmdchi,
  },

  // 4. Thông tin thanh toán
  thanhToan: {
    hinhThuc: raw.httttoan,
    trangThai: raw.ttkhac?.dlieu || "",
  },

  // 5. Thông tin tiền thuế
  tien: {
    truocThue: Number(raw.tgtcthue) || 0,
    thue: Number(raw.tgtthue) || 0,
    tong: Number(raw.tgtttbso) || 0,
    bangChu: raw.tgtttbchu,
    thueSuat: raw.thttltsuat?.[0]?.tsuat ? `${raw.thttltsuat[0].tsuat}%` : "",
  },

  // 6. Khác
  ngayKy: raw.nky,
  trangThaiHoaDon: raw.tthaibchu || raw.tthai,
});

export const syncInvoiceIn = async (data: {
  dateto: string;
  datefrom: string;
}) => {
  try {
    const url = "invoices-in/sync-from-third-party";
    console.log("👉 Gọi API:", axiosInstance.defaults.baseURL + url);

    const res = await axiosInstance.post(url, data);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
export const getInvoiceIn = async (): Promise<InvoiceSummary[]> => {
  try {
    const res = await axiosInstance.get<InvoiceSummary>("invoices-in");
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
