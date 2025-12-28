export interface ProductInventory {
	conversionUnit: {
		from?: {
			itemQuantity?: number;
		};
		to?: Array<{
			itemName?: string;
			itemQuantity?: number;
		}>;
		isActive?: boolean;
	};
	_id: string;
	name: string;
	stock: number;
	unit: string;
	imageURL?: string;
	createdAt: string;
	updatedAt: string;
	businessOwnerId: string;
	syncStatus: boolean;
	__v: number;
	category: number;
	price: number;
	tchat: number;
}

export interface ProductInventoryList {
	data: ProductInventory[];
	pagination: {
		limit: number;
		page: number;
		pages: number;
		total: number;
	};
}

export interface NewProductInventory {
	name: string;
	code?: string;
	category?: string;
	units: string;
	price?: number;
	description?: string;
	imageURL?: string;
	stock: number;
	attributes?: any[];
}
export type NamesUnitsResponse = {
	names: string[];
	units: string[];
};

export type UnitsNameProduct = {
	names: string[];
	units: string[];
};

export type SyncProductInventory = {
	message: string;
	successCount: number;
	failCount: number;
};
