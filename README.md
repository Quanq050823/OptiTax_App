# Nền tảng Kết Nối Hộ Kinh Doanh & Kế Toán Viên

> Nền tảng di động + web kết nối hộ kinh doanh cá thể với kế toán viên chuyên nghiệp, giúp quản lý hóa đơn, ghi sổ kế toán, báo cáo thuế và xử lý nghiệp vụ tài chính đơn giản.

[![Status](https://img.shields.io/badge/status-in%20development-yellow)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)

---

## 📌 Giới thiệu
Nền tảng hoạt động theo mô hình **hai chiều**:
- **Hộ kinh doanh** tìm kiếm và thuê kế toán để hỗ trợ quản lý hóa đơn, kê khai thuế, ghi sổ kế toán.
- **Kế toán viên** cung cấp dịch vụ và nhận thanh toán trực tiếp qua nền tảng.

Hệ thống đảm bảo **an toàn, tiện lợi** và **thu phí dịch vụ 20%** từ mỗi giao dịch.

---

## 🎯 Mục tiêu
- Xây dựng ứng dụng **Mobile (iOS/Android)** và **Web App**.
- Đơn giản hóa quy trình quản lý hóa đơn, chứng từ cho hộ kinh doanh nhỏ lẻ.
- Tạo kênh thu nhập cho kế toán viên thông qua dịch vụ kế toán theo đơn.
- Đảm bảo nền tảng trung gian minh bạch, bảo mật và dễ sử dụng.

---

## 👥 Vai trò người dùng

| Vai trò        | Mô tả |
|----------------|-------|
| **Hộ kinh doanh (Client)** | Chủ hộ kinh doanh cá thể, cần quản lý hóa đơn, nộp thuế, ghi sổ kế toán. |
| **Kế toán viên (Accountant)** | Cung cấp dịch vụ kế toán tự do, nhận đơn hàng và tạo thu nhập. |

---

## ⚙️ Tính năng

### Dành cho **Hộ kinh doanh**
- **Xác thực & quản lý tài khoản**
  - Đăng ký, đăng nhập, phân quyền
  - Quản lý hồ sơ cá nhân
- **Quản lý sản phẩm, hàng hóa**
  - Quản lý danh mục sản phẩm
- **Quản lý thu – chi** (*S1*)
  - Ghi nhận thu nhập
  - Ghi nhận chi phí
  - Xuất hóa đơn
- **Kết nối kế toán viên**
  - Tìm kiếm kế toán viên
  - Tạo kết nối và đánh giá dịch vụ
  - Quản lý đơn dịch vụ
- **Hỗ trợ kê khai & nộp thuế**
  - Tự động tính thuế GTGT, TNCN hoặc thuế khoán
  - Báo cáo thuế (sau MVP)
  - Nhắc lịch nộp thuế (sau MVP)

### Dành cho **Kế toán viên**
- **Quản lý thu – chi** (*S1*)
  - Ghi nhận thu nhập
  - Ghi nhận chi phí
  - Xuất hóa đơn
- **Báo cáo kế toán - tài chính**
  - Tổng hợp doanh thu & chi phí theo tháng, quý, năm
  - Lưu trữ nhật ký thu chi
- **Nhập liệu từ ảnh (OCR)** (sau MVP)
- **Tính thuế & hóa đơn tự động**

---

## 🛠 Công nghệ sử dụng
*(Dự kiến, sẽ cập nhật theo thực tế phát triển)*

- **Frontend (Web)**: React.js / Next.js
- **Mobile**: React Native / Flutter
- **Backend**: Node.js (Express) hoặc NestJS
- **Cơ sở dữ liệu**: PostgreSQL / MongoDB
- **Triển khai**: Docker, Kubernetes, CI/CD với GitHub Actions
- **Thanh toán**: Tích hợp cổng thanh toán (VNPay, Momo,...)
- **Bảo mật**: JWT Authentication, HTTPS, Role-based Access Control (RBAC)

---

## 💻 Yêu cầu hệ thống
- Node.js >= 18
- PostgreSQL >= 14 hoặc MongoDB >= 5
- Docker (khuyến nghị)
- Mobile: iOS 14+, Android 10+

---

## 🚀 Cài đặt
```bash
# Clone repository
git clone https://github.com/your-org/your-repo.git
cd your-repo

# Backend setup
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend setup
cd ../frontend
npm install
npm run dev
