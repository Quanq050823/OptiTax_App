type RootStackParamList = {
  HomeScreen: undefined;
  AboutScreen: undefined;
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
};
type Props = NativeStackScreenProps<RootStackParamList>;
type TabType = "home" | "invoice" | "about";
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
