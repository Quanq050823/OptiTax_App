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
};
type Props = NativeStackScreenProps<RootStackParamList>;
type TabType = "Trang chủ" | "Tiện ích" | "Tuỳ chọn";
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
