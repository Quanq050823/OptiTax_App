import axiosInstance from "@/src/services/API/axios";
import {
  Employee,
  EmployeeResponse,
  EmployeeServerItem,
} from "@/src/types/employees";

export type CreateEmployeePayload = {
  code: string;
  fullname: string;
  email?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  position?: string;
  hire_date?: string;
  status?: "active" | "inactive";
  note?: string;
  base_salary?: number;
  bank_account?: {
    bank_name?: string;
    account_number?: string;
    account_holder?: string;
  };
  salary_info?: {
    salary_type?: "monthly" | "bi-weekly";
  };
};

const normalizeEmployee = (item: EmployeeServerItem): Employee => ({
  ...item,
  fullName: item.fullName ?? item.fullname ?? "",
  fullname: item.fullname ?? item.fullName ?? "",
  phoneNumber: item.phoneNumber ?? item.phone ?? "",
  phone: item.phone ?? item.phoneNumber ?? "",
  hireDate: item.hireDate ?? item.hire_date ?? "",
  hire_date: item.hire_date ?? item.hireDate ?? "",
  dateOfBirth: item.dateOfBirth ?? item.date_of_birth,
  date_of_birth: item.date_of_birth ?? item.dateOfBirth,
  salary: item.salary ?? item.base_salary,
  base_salary: item.base_salary ?? item.salary,
});

export const getEmployeeList = async (): Promise<EmployeeResponse> => {
  try {
    const res = await axiosInstance.get<EmployeeResponse>("employees");

    return {
      ...res.data,
      data: (res.data.data ?? []).map(normalizeEmployee),
    };
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const createEmployee = async (
  employee: CreateEmployeePayload
): Promise<Employee> => {
  try {
    const res = await axiosInstance.post<EmployeeServerItem>("employees", employee);

    return normalizeEmployee(res.data);
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const updateEmployee = async (
  id: string,
  employee: Partial<CreateEmployeePayload>
): Promise<Employee> => {
  try {
    const res = await axiosInstance.put<EmployeeServerItem>(`employees/${id}`, employee);

    return normalizeEmployee(res.data);
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`employees/${id}`);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
