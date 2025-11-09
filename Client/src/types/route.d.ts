type RootStackParamList = {
  VerifyAuth: undefined;
  HomeScreen: undefined;
  OptionScreen: undefined;
  Login: undefined;
  Register: undefined;
  NavigationBusiness: undefined;
  NavigationAccountant: undefined;
  BusinessRegistrationStepTwo: undefined;
  ProfileBusiness: undefined;
  LanguagesScreen: undefined;
  InvoiceScreen: undefined;
  InvoiceDetailScreen: { item: InvoiceSummary; total: number; label: string };
  InvoiceInputScreen: undefined;
  InvoiceOutputScreen: undefined;
  ReceiptVoucherScreen: undefined;
  PaymentVoucherScreen: undefined;
  SettingScreen: undefined;
  ProductManager: { scannedProduct?: any };
  Layout: undefined;
  SearchAccountantScreen: undefined;
  ChangePasswordScreen: undefined;
  StoreInformationScreen: undefined;
  BusinessRegistrationStepThree: { taxCode: string | null };
  CustomerManagerScreen: undefined;
  CreateCustomerScreen: undefined;
  ChooseTaxTypeForHouseholdBusiness: undefined;
  SelectDigitalSignaturePlan: undefined;
  ReportScreen: undefined;
  InputProductsScreen: undefined;
  CreateVoucherInputProductScreen: undefined;
  ScanBarcodeProductScreen: undefined;
  EditProfileScreen: undefined;
  EditProfileBussinessStore: undefined;
  CreateVoucherPayment: undefined;
  ReportExportScreen: undefined;
  ExportInvoiceOuputScreen: undefined;
  ExportExcelScreen: undefined;
  TaxScreen: undefined;
  EmployeesScreen: undefined;
  NewIngredientList: undefined;
  ChooseReportItemScreen: undefined;
  ChartExportScreen: undefined;
  PaymentVoucherDetail: {
    voucher: PaymentVoucher;
  };
  PaymentInvoiceScreen: {
    items: (Product & { quantity: number; total: number })[];
  };
  ExportInvoicePayment: { items?: Product[] } | undefined;
  SelectElectronicInvoice: {
    digitalSignature: {
      label: string;
      value: string;
      timeUse: string;
      price: number;
    };
  };
  PaymentScreen: {
    digitalSignature?: {
      label: string;
      value: string;
      timeUse: string;
      price: number;
    };
    invoice: { id: number; label: string; price: number; description: string };
  };
};
type Props = NativeStackScreenProps<RootStackParamList>;
type TabType = "Trang chủ" | "Tiện ích" | "Tuỳ chọn" | "Thông báo" | "Xuất HĐ";
type phieuThu = {
  id: string;
  name: string;
  date: string;
  paymentMethod: string;
  price: number;
  receiver: string;
  documentNumber: string;
  note: string;
  submitter: string;
  typeVoucher: string;
};
//paymentMethod: phương thức thanh toán
//  receiver: người nhận
//  documentNumber: số chứng từ
//submitter: người nộp

type Product = {
  _id: string;
  name: string;
  code: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  description: string;
  category: string;
  unit: string | null;
  attributes: any;
};
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isDeleted: boolean;
  role: string;
  isVerified: boolean;
  userType: number;
  createDate: string;
  __v: number;
}

export interface Profile extends UserProfile {
  businessName?: string;
  address?: any;
  phoneNumber?: string;
}

export interface BusinessInfo {
  businessName: string;
  address: Address;
  phoneNumber: string;
  taxCode: string;
  businessType: string;
}
type FormDataType = {
  businessName: string;
  businessType: string;
  taxCode: string;
  taxType: string;
  address: Address;
  phoneNumber: string;
  industry: string;
};

export interface InvoiceItemExtra {
  ttruong: string;
  kdlieu: string;
  dlieu: string;
}

export interface InvoiceProduct {
  id: string;
  _id: string;
  dgia: string;
  dvtinh: string;
  ltsuat: string | null;
  sluong: string;
  stbchu: string | null;
  stckhau: string | null;
  stt: string;
  tchat: string;
  ten: string;
  thtcthue: string | null;
  thtien: string;
  tlckhau: string | null;
  tsuat: string | null;
  tthue: string | null;
  sxep: string;
  ttkhac: InvoiceItemExtra[];
}

export interface Invoice {
  _id: string;
  nbmst: string;
  khmshdon: string;
  khhdon: string;
  shdon: string;
  ncnhat: string;
  mhdon: string;
  nbten: string;
  nbdchi: string;
  nbsdthoai: string;
  nmten: string;
  nmtnmua: string;
  nmmst: string;
  nmdchi: string;
  thtttoan: string;
  dvtte: string;
  hdhhdvu: InvoiceProduct[];
  ttxly?: number | null;
  tgtttbso: number;
}

export interface InvoicePagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface InvoiceListResponse {
  data: Invoice[];
  pagination: InvoicePagination;
}

export interface Address {
  city: string | null;
  cityCode?: string; // VD: "79"
  district: string | null; // VD: "Quận 1"
  districtCode?: string;
  ward: string;
  street: string;
}
