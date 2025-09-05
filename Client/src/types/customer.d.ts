export type Address = {
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  zipCode?: string;
};

export type Customer = {
  _id: string;
  ownerId: string;
  name: string;
  code: string;
  email?: string;
  phoneNumber: string;
  customerType: "individual" | "business"; // có thể mở rộng thêm
  notes?: string;
  creditLimit: number;
  status: "active" | "inactive"; // có thể mở rộng thêm
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  customFields: any[]; // nếu customFields có cấu trúc riêng thì định nghĩa rõ hơn
  address?: Address;
  createdAt: string; // ISO date string
  updatedAt: string;
  __v: number;
};

export type CustomerListResponse = Customer[];
