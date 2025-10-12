interface TaxResponse {
  data: TaxItem[];
  pagination: Pagination;
}

// interface TaxItem {
//   _id: string;
//   businessOwnerId: string;
//   code: string;
//   fullname: string;
//   phone: string;
//   position: string;
//   status: string;
//   base_salary: number;
//   email?: string;
//   address?: string;
//   date_of_birth?: string;
//   hire_date?: string;
//   bank_account?: BankAccount;
//   salary_info?: SalaryInfo;
//   __v?: number;
// }

interface BankAccount {
  bank_name: string;
  account_number: string;
  account_holder: string;
}

interface SalaryInfo {
  salary_type: 'monthly' | 'hourly' | string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}


export type AddTax = {
  code: string;          
  date: string;          
  description: string;   
  amount: number;        
  note?: string;         
};




// Thông tin từng phiếu thuế
export interface TaxItem {
  _id: string;
  businessOwnerId: string;
  code: string;
  date: string; // ISO string dạng "2025-09-04T00:00:00.000Z"
  description: string;
  amount: number;
  note: string;
  __v: number;
}

// Thông tin phân trang (từ backend trả về)
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Response tổng từ API getTaxList()
export interface TaxResponse {
  data: TaxItem[];
  pagination: Pagination;
}
