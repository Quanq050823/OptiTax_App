export interface Employee {
  _id: string;                  // ID duy nhất của nhân viên
  businessOwnerId: string;      // ID của chủ doanh nghiệp hoặc công ty
  code: string;                 // Mã nhân viên (Employee Code)
  fullName: string;             // Họ tên nhân viên
  position: string;             // Chức vụ (VD: Kế toán, Nhân viên bán hàng)
  department?: string;          // Phòng ban (tùy chọn)
  dateOfBirth?: string;         // Ngày sinh (ISO format)
  phoneNumber?: string;         // Số điện thoại
  email?: string;               // Email
  address?: string;             // Địa chỉ
  hireDate: string;             // Ngày bắt đầu làm việc
  salary?: number;              // Mức lương (tùy chọn)
  note?: string;                // Ghi chú khác
  status?: "active" | "inactive" | "resigned"; // Trạng thái nhân viên
  __v?: number;                 // Version (MongoDB)
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