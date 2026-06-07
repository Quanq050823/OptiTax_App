import axiosInstance from "@/src/services/API/axios";
import { Customer, CustomerListResponse } from "@/src/types/customer";

export const getCustomerList = async (): Promise<CustomerListResponse> => {
  try {
    const res = await axiosInstance.get<CustomerListResponse>("customer");

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export type CreateCustomerPayload = {
  name: string;
  code: string;
  email?: string;
  phoneNumber: string;
  address?: {
    street?: string;
    ward?: string;
    district?: string;
    city?: string;
    zipCode?: string;
  };
  customerType: "individual" | "business";
  taxCode?: string;
  companyName?: string;
  contactPerson?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  notes?: string;
  creditLimit?: number;
  paymentTerms?: string;
  status?: "active" | "inactive" | "blacklisted";
  tags?: string[];
};

export const createCustomer = async (
  customer: CreateCustomerPayload
): Promise<Customer> => {
  try {
    const res = await axiosInstance.post<Customer>("customer", customer);

    return res.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
