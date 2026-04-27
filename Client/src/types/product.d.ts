export interface Product {
	_id: string;
	name: string;
	code: string | null;
	price: number;
	stock: number;
	imageUrl: string | null;
	description: string;
	category: string;
	unit: string | null;
	materials?: materials[];
	attributes?: any[];
};

type materials = {
    component: string,
    quantity: string,
    unit: string
}