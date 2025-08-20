type RootStackParamList = {
  HomeScreen: undefined;
  OptionScreen: undefined;
  Login: undefined;
  Register: undefined;
  NavigationBusiness: undefined;
  NavigationAccountant: undefined;
  BusinessRegistrationStepTwo: undefined;
  ProfileBusiness: undefined;
  LanguagesScreen: undefined;
  InvoiceInputScreen: undefined;
  InvoiceOutputScreen: undefined;
  ReceiptVoucherScreen: undefined;
  PaymentVoucherScreen: undefined;
  SettingScreen: undefined;
  ProductManager: undefined;
  Layout: undefined;
  SearchAccountantScreen: undefined;
  ChangePasswordScreen: undefined;
  StoreInformationScreen: undefined;
  BusinessRegistrationStepThree: { taxCode: string | null };
  CustomerManagerScreen: undefined;
  ChooseTaxTypeForHouseholdBusiness: undefined;
  SelectDigitalSignaturePlan: undefined;
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
type TabType = "Trang chủ" | "Tiện ích" | "Tuỳ chọn" | "Thông báo";
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
  code: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  category: string;
  unit: string;
  attributes;
};

type FormDataType = {
  businessName: string;
  businessType: string;
  taxCode: string;
  address: {
    street: string;
    ward: string;
    district: string | null;
    city: string | null;
  };
  phoneNumber: string;
  industry: string;
};
