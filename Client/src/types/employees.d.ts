export interface EmployeeServerItem {
  _id: string;
  businessOwnerId: string;
  code: string;
  fullname?: string;
  fullName?: string;
  position?: string;
  department?: string;
  date_of_birth?: string;
  dateOfBirth?: string;
  phone?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  hire_date?: string;
  hireDate?: string;
  base_salary?: number;
  salary?: number;
  note?: string;
  status?: "active" | "inactive" | "resigned";
  bank_account?: {
    bank_name?: string;
    account_number?: string;
    account_holder?: string;
  };
  salary_info?: {
    salary_type?: "monthly" | "bi-weekly";
  };
  __v?: number;
}

export interface Employee extends EmployeeServerItem {
  fullName: string;
  fullname: string;
  phoneNumber: string;
  phone: string;
  hireDate: string;
  hire_date: string;
  dateOfBirth?: string;
  salary?: number;
  base_salary?: number;
}

export interface EmployeeResponse {
  data: Employee[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
