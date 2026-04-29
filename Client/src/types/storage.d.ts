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

export type SyncHistoryItem = {
	name: string;
	unit: string;
	stock: number;
	price: number;
	action: 'created' | 'updated';
	invoiceNumber: string;
	invoiceDate?: string;
	sellerName?: string;
};

export type SyncHistoryRecord = {
	_id: string;
	businessOwnerId: string;
	triggeredBy?: string;
	successCount: number;
	failCount: number;
	invoicesProcessed: string[];
	items: SyncHistoryItem[];
	createdAt: string;
	updatedAt: string;
};

export type SyncHistoryResponse = {
	data: SyncHistoryRecord[];
	total: number;
	page: number;
	totalPages: number;
};

export type StockLogChange = {
	field: string;        // "name" | "unit" | "stock" | "price"
	oldValue: any;
	newValue: any;
};

export type StockLog = {
	_id: string;
	businessOwnerId: string;
	storageItemId?: string;
	itemName: string;
	unit?: string;
	quantityChanged?: number;
	stockAfter?: number;
	pricePerUnit?: number;
	source: 'manual_add' | 'manual_update' | 'manual_delete';
	label: string;
	changes?: StockLogChange[];
	note?: string;
	triggeredBy?: string;
	createdAt: string;
	updatedAt: string;
};

export type StockLogResponse = {
	data: StockLog[];
	total: number;
	page: number;
	totalPages: number;
};

export type StockSummaryItem = {
	storageItemId: string;
	itemName: string;
	unit: string;
	totalAdded: number;
	totalDeleted: number;
	netChange: number;
	countAdd: number;
	countUpdate: number;
	countDelete: number;
	lastActivity: string;
};

export type StockSummaryResponse = {
	data: StockSummaryItem[];
};

export type SerpApiProduct = {
	name: string;
	price: number;
	imageUrl: string | null;
	source: 'serpapi' | 'icheck' | 'google_shopping';
	link: string | null;
	rating: number | null;
	brand: string | null;
};

export type SerpApiProductResponse = {
	data: SerpApiProduct[];
};

