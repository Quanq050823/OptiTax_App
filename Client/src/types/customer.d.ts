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
  customerType: "individual" | "business"; // cá nhân hoặc doanh nghiệp
  notes?: string;
  status: "active" | "inactive"; // trạng thái
  tags: string[];
  totalOrders: number;
  totalSpent: number;
  customFields: any[]; // nếu customFields có schema riêng thì define thêm
  address?: Address;
  personalInfo?: PersonalInfo;
  financialInfo?: FinancialInfo;
  createdAt: string; // ISO date string
  updatedAt: string;
  __v: number;
};

export type personalInfo = {
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
};
export type CustomerListResponse = Customer[];
