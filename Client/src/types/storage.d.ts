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
	syncAliases?: Array<{
		name: string;
		unit: string;
		conversionFactor: number;
	}>;
	_id: string;
	code?: string;
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
	stockBefore?: number;
	stockAfter?: number;
	signedQuantity?: number;
	direction?: 'in' | 'out' | 'neutral';
	amount?: number;
	pricePerUnit?: number;
	source: 'opening_balance' | 'manual_add' | 'manual_update' | 'manual_delete' | 'invoice_in' | 'invoice_out' | 'merge';
	documentType?: string;
	documentNumber?: string;
	documentDate?: string;
	counterpartyName?: string;
	reportable?: boolean;
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

export type InventoryReportCategory = 'all' | '1' | '2';

export type InventoryReportRow = {
	itemId: string;
	itemCode: string;
	itemName: string;
	unit: string;
	unitPrice: number;
	openingQuantity: number;
	openingValue: number;
	inQuantity: number;
	inValue: number;
	outQuantity: number;
	outValue: number;
	closingQuantity: number;
	closingValue: number;
};

export type InventoryReportTotals = {
	openingQuantity: number;
	openingValue: number;
	inQuantity: number;
	inValue: number;
	outQuantity: number;
	outValue: number;
	closingQuantity: number;
	closingValue: number;
};

export type InventoryReportResponse = {
	profile: {
		businessName?: string;
		taxCode?: string;
		address?: any;
		addressText?: string;
	};
	period: {
		startDate: string;
		endDate: string;
	};
	accountCodes: string;
	rows: InventoryReportRow[];
	totals: InventoryReportTotals;
	generatedAt: string;
};

export type OpeningBalanceItemInput = {
	storageItemId?: string;
	code?: string;
	name: string;
	unit: string;
	openingQuantity: number;
	unitPrice: number;
	category?: number;
};

export type OpeningBalanceResponse = {
	message: string;
	documentDate: string;
	data: Array<{
		storageItemId: string;
		name: string;
		unit: string;
		openingQuantity: number;
		currentStock: number;
	}>;
};
