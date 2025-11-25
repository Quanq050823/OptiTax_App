export interface Product {
	name: string;
	code: string | null;
	price: number;
	stock: number;
	imageUrl: string | null;
	description: string;
	category: string;
	unit: string | null;
	materials: materials[];
	
};

type materials = {
    component: string,
    quantity: string,
    unit: string
}