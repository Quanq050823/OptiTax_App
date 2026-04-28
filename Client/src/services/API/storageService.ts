import axiosInstance from "@/src/services/API/axios";
import {
	NamesUnitsResponse,
	NewProductInventory,
	ProductInventory,
	ProductInventoryList,
	StockLogResponse,
	StockSummaryResponse,
	SyncHistoryResponse,
	SyncProductInventory,
	UnitsNameProduct,
} from "@/src/types/storage";
import { Alert } from "react-native";

export const getProductsInventory = async (): Promise<ProductInventoryList> => {
	try {
		const res = await axiosInstance.get<ProductInventoryList>("storage-item");

		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};
export const getUnitNameProduct = async (): Promise<UnitsNameProduct> => {
	try {
		const res = await axiosInstance.get<UnitsNameProduct>(
			"storage-item/names-units"
		);

		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const searchProductsInventory = async (
	keyword: string
): Promise<ProductInventoryList> => {
	const res = await axiosInstance.get<ProductInventoryList>(
		`storage-item/names-units?q=${keyword}`
	);
	return res.data;
};

export const createProductInventory = async (products: NewProductInventory) => {
	try {
		const { units, ...rest } = products;
		const payload = {
			...rest,
			unit: units,
			syncStatus: true,
			category: rest.category ? Number(rest.category) : 1,
		};
		const res = await axiosInstance.post("storage-item", payload);

		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};
export const syncProduct = async (): Promise<SyncProductInventory> => {
	try {
		const res = await axiosInstance.post<SyncProductInventory>(
			"storage-item/sync-from-invoices"
		);

		const data = res.data;

		Alert.alert(
			"Đồng bộ sản phẩm thành công",
			data.successCount > 0
				? `Đã thêm ${data.successCount} sản phẩm mới từ hóa đơn`
				: "Không có sản phẩm nào mới"
		);

		return data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const getSyncHistory = async (page = 1, limit = 20): Promise<SyncHistoryResponse> => {
	try {
		const res = await axiosInstance.get<SyncHistoryResponse>(
			`storage-item/sync-history?page=${page}&limit=${limit}`
		);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const getStockLogs = async (page = 1, limit = 50): Promise<StockLogResponse> => {
	try {
		const res = await axiosInstance.get<StockLogResponse>(
			`storage-item/stock-logs?page=${page}&limit=${limit}`
		);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const getStockSummary = async (startDate?: string, endDate?: string): Promise<StockSummaryResponse> => {
	try {
		const params = new URLSearchParams();
		if (startDate) params.append('startDate', startDate);
		if (endDate) params.append('endDate', endDate);
		const res = await axiosInstance.get<StockSummaryResponse>(
			`storage-item/stock-summary?${params.toString()}`
		);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const deleteProductInventory = async (id: string) => {
	try {
		const res = await axiosInstance.delete(`storage-item/${id}`);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const updateProductInventory = async (
	id: string,
	products: {
		name: string;
		unit: string;
		price: number;
		imageURL: string;
		stock: number;
	}
) => {
	try {
		const res = await axiosInstance.put(`storage-item/${id}`, products);

		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const getProductsInventoryById = async (
	id: string
): Promise<ProductInventory> => {
	try {
		const res = await axiosInstance.get<ProductInventory>(`storage-item/${id}`);

		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const assignCategoryForProducts = async (
	products: ProductInventory[],
	category: number
) => {
	if (!products.length) {
		Alert.alert("⚠️ Chưa có sản phẩm nào được chọn!");
		return;
	}

	try {
		const requests = products.map((item) => {
			// 🧭 Log endpoint trước khi gọi
			console.log("📦 Dữ liệu gửi lên:", JSON.stringify({ category }, null, 2));

			console.log(
				"🔗 Endpoint:",
				axiosInstance.defaults.baseURL + `storage-item/${item._id}/gen-type`
			);
			console.log("📦 Payload:", { category });

			return axiosInstance.post(`storage-item/${item._id}/gen-type`, {
				category,
			});
		});

		await Promise.all(requests);

		Alert.alert(
			"Phân loại Thành công",
			`Đã cập nhật ${products.length} sản phẩm!`
		);
	} catch (error: any) {
		console.error(
			"❌ Lỗi cập nhật category:",
			error.response?.status,
			error.response?.data || error.message
		);
		Alert.alert("Lỗi", "Không thể cập nhật category. Vui lòng thử lại!");
	}
};

export const getListItemStorageSynced = async () => {
	try {
		const res = await axiosInstance.get<ProductInventoryList>(
			"storage-item/synced"
		);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const getListItemStorageNew = async () => {
	try {
		const res = await axiosInstance.get<ProductInventoryList>(
			"storage-item/new-sync"
		);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};

export const updateUnitConversion = async (
	id: string,
	conversionData: {
		from: { itemQuantity: number };
		to: Array<{ itemName: string; itemQuantity: number }>;
	}
) => {
	try {
		const res = await axiosInstance.put(
			`storage-item/${id}/unit-conversion`,
			conversionData
		);
		return res.data;
	} catch (error: any) {
		if (error.response) {
			throw error.response.data;
		}
		throw error;
	}
};
