export interface ProductInventory {
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
  names: [];
  units: [];
};

export type SyncProductInventory = {
  message: string;
  successCount: number;
  failCount: number;
};
