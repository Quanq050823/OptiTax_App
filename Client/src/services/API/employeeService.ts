import axiosInstance from "@/src/services/API/axios";
import { Employee, EmployeeResponse } from "@/src/types/employees";

export const getEmployeeList = async (): Promise<EmployeeResponse> => {
  try {
    const res = await axiosInstance.get<EmployeeResponse>("employees");
        console.log("API trả về:", res.data);

    return res.data;
  } catch (error: any) {
            console.log("hihihi");

    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};