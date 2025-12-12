# Test EasyInvoice API - Tạo hóa đơn bản nháp

## Endpoint

```
POST http://192.168.88.106:3001/api/easyinvoice/draft
```

## Headers

```
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

## Request Body - Ví dụ đơn giản

### Ví dụ 1: Hóa đơn đơn giản với 1 sản phẩm

```json
{
	"businessOwnerId": "675914f2e4b9ec8aa3d5b0d0",
	"xmlData": "<Invoices><Inv><Invoice><Ikey>INV001</Ikey><CusName>Nguyễn Văn A</CusName><CusAddress>Hà Nội</CusAddress><CusTaxCode>0123456789</CusTaxCode><PaymentMethod>TM</PaymentMethod><Products><Product><ProdName>Laptop Dell</ProdName><ProdUnit>Cái</ProdUnit><ProdQuantity>1</ProdQuantity><ProdPrice>15000000</ProdPrice><Total>15000000</Total><VATRate>10</VATRate><VATAmount>1500000</VATAmount><Amount>16500000</Amount></Product></Products><Total>15000000</Total><VATAmount>1500000</VATAmount><Amount>16500000</Amount><AmountInWords>Mười sáu triệu năm trăm nghìn đồng chẵn</AmountInWords></Invoice></Inv></Invoices>",
	"pattern": "01GTKT",
	"serial": "C24TNA"
}
```

### Ví dụ 2: Hóa đơn chi tiết với nhiều sản phẩm

```json
{
	"businessOwnerId": "675914f2e4b9ec8aa3d5b0d0",
	"xmlData": "<Invoices><Inv><Invoice><Ikey>INV002</Ikey><CusCode>KH001</CusCode><Buyer>Nguyễn Văn B</Buyer><CusName>Công ty TNHH ABC</CusName><Email>customer@example.com</Email><CusAddress>123 Đường ABC, Quận 1, TP.HCM</CusAddress><CusPhone>0901234567</CusPhone><CusTaxCode>0123456789</CusTaxCode><PaymentMethod>CK</PaymentMethod><ArisingDate>11/12/2025</ArisingDate><CurrencyUnit>VND</CurrencyUnit><Products><Product><No>1</No><ProdName>Laptop Dell Inspiron</ProdName><ProdUnit>Cái</ProdUnit><ProdQuantity>2</ProdQuantity><ProdPrice>15000000</ProdPrice><Total>30000000</Total><VATRate>10</VATRate><VATAmount>3000000</VATAmount><Amount>33000000</Amount></Product><Product><No>2</No><ProdName>Chuột không dây</ProdName><ProdUnit>Cái</ProdUnit><ProdQuantity>5</ProdQuantity><ProdPrice>200000</ProdPrice><Total>1000000</Total><VATRate>10</VATRate><VATAmount>100000</VATAmount><Amount>1100000</Amount></Product></Products><Total>31000000</Total><VATAmount>3100000</VATAmount><Amount>34100000</Amount><AmountInWords>Ba mươi bốn triệu một trăm nghìn đồng chẵn</AmountInWords></Invoice></Inv></Invoices>",
	"pattern": "01GTKT",
	"serial": "C24TNA"
}
```

### Ví dụ 3: Sử dụng helper để generate XML (trong code)

```javascript
import { buildInvoiceXml } from "../utils/invoiceXmlBuilder.js";

const invoiceData = {
	ikey: "INV003",
	cusCode: "KH002",
	buyer: "Trần Thị C",
	cusName: "Công ty TNHH XYZ",
	email: "xyz@example.com",
	cusAddress: "456 Đường XYZ, Hà Nội",
	cusPhone: "0987654321",
	cusTaxCode: "9876543210",
	paymentMethod: "TM", // TM: Tiền mặt, CK: Chuyển khoản, TM/CK: Cả hai
	arisingDate: "11/12/2025",
	currencyUnit: "VND",
	products: [
		{
			no: 1,
			name: "Máy in HP LaserJet",
			unit: "Cái",
			quantity: 1,
			price: 5000000,
			total: 5000000,
			vatRate: 10,
			vatAmount: 500000,
			amount: 5500000,
		},
		{
			no: 2,
			name: "Mực in HP",
			unit: "Hộp",
			quantity: 3,
			price: 800000,
			total: 2400000,
			vatRate: 10,
			vatAmount: 240000,
			amount: 2640000,
		},
	],
	total: 7400000,
	vatAmount: 740000,
	amount: 8140000,
	amountInWords: "Tám triệu một trăm bốn mươi nghìn đồng chẵn",
};

const xmlData = buildInvoiceXml(invoiceData);

// Sau đó gọi API
const response = await fetch(
	"http://192.168.88.106:3001/api/easyinvoice/draft",
	{
		method: "POST",
		headers: {
			Authorization: "Bearer YOUR_JWT_TOKEN",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			businessOwnerId: "675914f2e4b9ec8aa3d5b0d0",
			xmlData: xmlData,
			pattern: "01GTKT",
			serial: "C24TNA",
		}),
	}
);
```

## Response thành công

```json
{
	"success": true,
	"message": "Draft invoice created successfully",
	"data": {
		"pattern": "01GTKT",
		"serial": "C24TNA",
		"ikeys": ["INV001"],
		"invoices": [
			{
				"InvoiceStatus": 1,
				"Buyer": "Nguyễn Văn A",
				"TaxAmount": 1500000,
				"PublishedBy": "Admin",
				"Type": "01GTKT",
				"Pattern": "01GTKT",
				"Serial": "C24TNA",
				"No": null,
				"LookupCode": null,
				"Ikey": "INV001",
				"ArisingDate": "2025-12-11",
				"IssueDate": null,
				"CustomerName": "Nguyễn Văn A",
				"CustomerCode": null,
				"CustomerTaxCode": "0123456789",
				"Total": 15000000,
				"Amount": 16500000,
				"LinkView": null,
				"ModifiedDate": "2025-12-11T10:00:00",
				"IsSentTCTSummary": false,
				"TCTCheckStatus": null,
				"TCTErrorMessage": null
			}
		]
	}
}
```

## Response lỗi

```json
{
	"Status": 4,
	"Message": "Validation error",
	"ErrorCode": "E001",
	"Data": {
		"KeyInvoiceMsg": {
			"INV001": "Chi tiết lỗi của hóa đơn"
		}
	}
}
```

## Các giá trị quan trọng

### PaymentMethod (Hình thức thanh toán)

- `TM`: Tiền mặt
- `CK`: Chuyển khoản
- `TM/CK`: Cả hai

### VATRate (Thuế suất)

- `0`: 0%
- `5`: 5%
- `8`: 8%
- `10`: 10%
- `-1`: Không chịu thuế GTGT
- `-2`: Không kê khai
- `-3`: Khác (cần VATRateOther)

### InvoiceStatus (Trạng thái hóa đơn)

- `1`: Mới tạo lập (Draft)
- `2`: Đã phát hành
- `3`: Đã gửi CQT
- `4`: CQT đã tiếp nhận
- `5`: Đã hủy
- `6`: Đã thay thế
- `7`: Đã điều chỉnh

## Lưu ý

1. **Ikey** phải là unique cho mỗi hóa đơn
2. **CusTaxCode** bắt buộc với khách hàng là doanh nghiệp
3. **PaymentMethod** là bắt buộc
4. **AmountInWords** nên sử dụng thư viện chuyển đổi số sang chữ
5. **Pattern** và **Serial** chỉ cần khi doanh nghiệp dùng nhiều mẫu/ký hiệu
6. Hóa đơn tạo ra sẽ ở trạng thái Draft (chưa ký số, chưa có số)
