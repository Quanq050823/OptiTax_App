# 📋 OptiTax API Testing Guide for Postman

## 🚀 Quick Setup

### Base Configuration

- **Base URL**: `http://localhost:3001`
- **Environment Variables**:
  ```json
  {
  	"baseUrl": "http://localhost:3001",
  	"accessToken": "",
  	"refreshToken": ""
  }
  ```

---

## 🔐 Authentication APIs

**Base URL**: `{{baseUrl}}/api/auth`

### 1. Register User

- **Method**: `POST`
- **Endpoint**: `/register`
- **Body** (JSON):

```json
{
	"username": "testuser",
	"email": "test@example.com",
	"password": "Test123A",
	"firstName": "Test",
	"lastName": "User",
	"phone": "0123456789"
}
```

- **Expected Response**: `201 Created`

```json
{
	"message": "Please verify your email"
}
```

### 2. Verify Email

- **Method**: `GET`
- **Endpoint**: `/verify-email?token={{token}}`
- **Query Params**:
  - `token`: Email verification token from email
- **Expected Response**: Redirect to frontend confirmation page

### 3. Login

- **Method**: `POST`
- **Endpoint**: `/login`
- **Body** (JSON):

```json
{
	"email": "test@example.com",
	"password": "Test123A"
}
```

- **Expected Response**: `200 OK`

```json
{
	"accessToken": "eyJhbGciOiJIUzI1NiIs...",
	"refreshToken": "eyJhbGciOiJIUzI1NiIs...",
	"messages": "Login successful"
}
```

- **Postman Tests**:

```javascript
pm.test("Set tokens from response", function () {
	var jsonData = pm.response.json();
	if (jsonData.accessToken) {
		pm.environment.set("accessToken", jsonData.accessToken);
	}
	if (jsonData.refreshToken) {
		pm.environment.set("refreshToken", jsonData.refreshToken);
	}
});
```

### 4. Check Login Status

- **Method**: `GET`
- **Endpoint**: `/is-login`
- **Headers**: Include cookies from login
- **Expected Response**: `200 OK`

```json
{
	"isAuthenticated": true,
	"accessToken": "...",
	"refreshToken": "..."
}
```

### 5. Refresh Token

- **Method**: `POST`
- **Endpoint**: `/refresh`
- **Body** (JSON):

```json
{
	"refreshToken": "{{refreshToken}}"
}
```

- **Expected Response**: `200 OK`

```json
{
	"refreshToken": "new_refresh_token",
	"accessToken": "new_access_token",
	"message": "Refresh successful"
}
```

### 6. Logout

- **Method**: `GET`
- **Endpoint**: `/logout`
- **Headers**: Include cookies from login
- **Expected Response**: `204 No Content`

### 7. Forgot Password

- **Method**: `POST`
- **Endpoint**: `/forgot-password`
- **Body** (JSON):

```json
{
	"email": "test@example.com"
}
```

- **Expected Response**: `200 OK`

```json
{
	"message": "Please check your email."
}
```

### 8. Verify OTP

- **Method**: `POST`
- **Endpoint**: `/verify-otp?email=test@example.com`
- **Query Params**:
  - `email`: User email
- **Body** (JSON):

```json
{
	"otp": "123456"
}
```

- **Expected Response**: `200 OK`

```json
{
	"message": true
}
```

### 9. Change Password with OTP

- **Method**: `POST`
- **Endpoint**: `/change-pw-otp?email=test@example.com&otp=123456`
- **Query Params**:
  - `email`: User email
  - `otp`: Valid OTP
- **Body** (JSON):

```json
{
	"password": "NewPass123A"
}
```

- **Expected Response**: `200 OK`

```json
{
	"message": "Password has been changed successfully"
}
```

---

## 🔑 Google OAuth APIs

### 1. Google Login

- **Method**: `GET`
- **Endpoint**: `/google`
- **Description**: Redirects to Google OAuth consent screen

### 2. Google Callback

- **Method**: `GET`
- **Endpoint**: `/google/callback`
- **Description**: Handles Google OAuth callback (automatic)

---

## 👤 User Management APIs

**Base URL**: `{{baseUrl}}/api/user`

**Required Headers for all endpoints**:

```
Authorization: Bearer {{accessToken}}
```

### 1. Get All Users (Admin only)

- **Method**: `GET`
- **Endpoint**: `/`
- **Query Params** (optional):
  - `page`: Page number (default: 1)
  - `pageSize`: Items per page (default: 10)
- **Example**: `/?page=1&pageSize=5`
- **Expected Response**: `200 OK`

```json
[
	{
		"_id": "user_id",
		"username": "testuser",
		"email": "test@example.com",
		"firstName": "Test",
		"lastName": "User",
		"phone": "0123456789",
		"role": "user",
		"createdDate": "2025-08-06T04:00:00.000Z"
	}
]
```

### 2. Get Current User Profile

- **Method**: `GET`
- **Endpoint**: `/profile`
- **Expected Response**: `200 OK`

```json
{
	"_id": "user_id",
	"username": "testuser",
	"email": "test@example.com",
	"firstName": "Test",
	"lastName": "User",
	"phone": "0123456789",
	"avatar": "avatar_url",
	"role": "user"
}
```

### 3. Update Current User Profile

- **Method**: `PUT`
- **Endpoint**: `/profile`
- **Body** (JSON):

```json
{
	"firstName": "Updated",
	"lastName": "Name",
	"phone": "0987654321"
}
```

- **Expected Response**: `200 OK`

```json
{
	"_id": "user_id",
	"username": "testuser",
	"email": "test@example.com",
	"firstName": "Updated",
	"lastName": "Name",
	"phone": "0987654321"
}
```

### 4. Change Password

- **Method**: `PUT`
- **Endpoint**: `/change-password`
- **Body** (JSON):

```json
{
	"oldPassword": "Test123A",
	"newPassword": "NewPass123B"
}
```

- **Expected Response**: `200 OK`

```json
{
	"message": "Password changed successfully"
}
```

### 5. Toggle User Status (Admin only)

- **Method**: `PUT`
- **Endpoint**: `/:id/toggle-status`
- **Body** (JSON):

```json
{
	"userId": "user_id_to_toggle",
	"isDeleted": false
}
```

- **Expected Response**: `200 OK`

```json
{
	"message": "User has been enabled"
}
```

---

## 📊 HTTP Status Codes

| Code | Status          | Description               |
| ---- | --------------- | ------------------------- |
| 200  | OK              | Request successful        |
| 201  | Created         | User created successfully |
| 204  | No Content      | Logout successful         |
| 400  | Bad Request     | Invalid data/parameters   |
| 401  | Unauthorized    | Invalid credentials/token |
| 404  | Not Found       | User/Resource not found   |
| 408  | Request Timeout | OTP expired               |
| 500  | Server Error    | Internal server error     |

---

## 🔧 Password Validation Rules

**All passwords must meet these requirements:**

- Minimum 6 characters
- At least 1 number
- At least 1 uppercase letter
- New password must be different from old password

**Valid Password Examples**: `Test123A`, `MyPass456`, `NewPass789B`

**Invalid Password Examples**: `test123` (no uppercase), `TEST123` (no lowercase), `TestABC` (no number)

---

## 🧪 Testing Scenarios

### Scenario 1: Complete User Registration Flow

1. **POST** `/api/auth/register` ✅
2. Check email for verification link 📧
3. **GET** `/api/auth/verify-email?token=...` ✅
4. **POST** `/api/auth/login` ✅
5. **GET** `/api/user/profile` ✅

### Scenario 2: Password Reset Flow

1. **POST** `/api/auth/forgot-password` ✅
2. Check email for OTP 📧
3. **POST** `/api/auth/verify-otp?email=...` ✅
4. **POST** `/api/auth/change-pw-otp?email=...&otp=...` ✅
5. **POST** `/api/auth/login` (with new password) ✅

### Scenario 3: Token Management

1. **POST** `/api/auth/login` ✅
2. **GET** `/api/auth/is-login` ✅
3. **POST** `/api/auth/refresh` ✅
4. **GET** `/api/auth/logout` ✅

### Scenario 4: Profile Management

1. **POST** `/api/auth/login` ✅
2. **GET** `/api/user/profile` ✅
3. **PUT** `/api/user/profile` ✅
4. **PUT** `/api/user/change-password` ✅

---

## 🛠️ Postman Collection Setup

### Pre-request Script (Collection Level)

```javascript
// Auto-set Authorization header if accessToken exists
if (pm.environment.get("accessToken")) {
	pm.request.headers.add({
		key: "Authorization",
		value: "Bearer " + pm.environment.get("accessToken"),
	});
}
```

### Test Script Template

```javascript
pm.test("Status code is successful", function () {
	pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);
});

pm.test("Response time is less than 2000ms", function () {
	pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response has expected structure", function () {
	const jsonData = pm.response.json();
	pm.expect(jsonData).to.be.an("object");
});
```

---

## 🔗 Useful Postman Environment Variables

```json
{
	"baseUrl": "http://localhost:3001",
	"accessToken": "",
	"refreshToken": "",
	"testEmail": "test@example.com",
	"testPassword": "Test123A",
	"testUserId": "",
	"lastOTP": ""
}
```

---

## 📝 Notes

1. **Environment Setup**: Make sure to run `npm run dev` in the server directory
2. **Database**: Ensure MongoDB Atlas connection is working
3. **Email Service**: Check email configuration for verification/OTP emails
4. **CORS**: Frontend should be running on `http://localhost:3000`
5. **Cookies**: Some endpoints use HTTP-only cookies for token management
6. **File Upload**: Avatar upload requires `multipart/form-data` content type
