import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import React, { useEffect, useState } from "react";

import CustomDrawerBusiness from "@/src/navigation/components/CustomDrawer/CustomDrawerBusiness";
import HeaderNavigation from "@/src/navigation/components/HeaderNavigation/HeaderNavigation";
import Layout from "@/src/presentation/components/layout";
import AboutScreen from "@/src/presentation/screens/BusinessOwnerScreen/Option/Option";
import ChangePasswordScreen from "@/src/presentation/screens/BusinessOwnerScreen/ChangePasswordScreen/ChangePasswordScreen";
import InvoiceInput from "@/src/presentation/screens/BusinessOwnerScreen/InvoiceInput";
import InvoiceOutput from "@/src/presentation/screens/BusinessOwnerScreen/InvoiceOutput";
import ProductManagerScreen from "@/src/presentation/screens/BusinessOwnerScreen/ProductManager/ProductManager";
import ProfileBusiness from "@/src/presentation/screens/BusinessOwnerScreen/ProfileBusiness/ProfileBusiness";
import SearchAccountantScreen from "@/src/presentation/screens/BusinessOwnerScreen/SearchAccountant/SearchAccountantScreen";
import SettingScreen from "@/src/presentation/screens/BusinessOwnerScreen/Setting/index";
import Language from "@/src/presentation/screens/BusinessOwnerScreen/Setting/Languages";
import StoreInformation from "@/src/presentation/screens/BusinessOwnerScreen/Setting/StoreInfomation";
import PaymentVoucherScreen from "@/src/presentation/screens/BusinessOwnerScreen/Vote/PaymentVoucherScreen";
import ReceiptVoucherScreen from "@/src/presentation/screens/BusinessOwnerScreen/Vote/ReceiptVoucherScreen";
import { Alert, View } from "react-native";
import Option from "@/src/presentation/screens/BusinessOwnerScreen/Option/Option";
import CustomerManagerScreen from "@/src/presentation/screens/BusinessOwnerScreen/Customer/CustomerScreen";
import ChooseTaxTypeForHouseholdBusiness from "@/src/presentation/screens/Auth/ChooseTaxTypeForHouseholdBusiness";
import SelectDigitalSignaturePlan from "@/src/presentation/screens/BusinessOwnerScreen/SelectDigitalSignaturePlan/SelectDigitalSignaturePlan";
import SelectElectronicInvoice from "@/src/presentation/screens/BusinessOwnerScreen/SelectElectronicInvoice/SelectElectronicInvoice";
import PaymentScreen from "@/src/presentation/screens/BusinessOwnerScreen/Payment/Payment";
import ReportScreen from "@/src/presentation/screens/BusinessOwnerScreen/ReportScreen/ReportScreen";
import { ColorMain } from "@/src/presentation/components/colors";
import InputProducts from "@/src/presentation/screens/BusinessOwnerScreen/InputProducts/InputProducts";
import CreateVoucherInputProduct from "@/src/presentation/screens/BusinessOwnerScreen/CreateVoucherInputProduct/CreateVoucherInputProduct";
import ScanBarcodeProduct from "@/src/presentation/screens/BusinessOwnerScreen/ScanBarcodeProduct/ScanBarcodeProduct";
import Invoice from "@/src/presentation/screens/BusinessOwnerScreen/Invoice/Invoice";
import InvoiceDetail from "@/src/presentation/screens/BusinessOwnerScreen/InvoiceDetail/InvoiceDetail";
import EditProfileScreen from "@/src/presentation/screens/BusinessOwnerScreen/EditProfileScreen/EditProfileScreen";
import EditProfileBussinessStore from "@/src/presentation/screens/BusinessOwnerScreen/EditProfileBussinessStore/EditProfileBussinessStore";
import CreateVoucherPayment from "@/src/presentation/screens/BusinessOwnerScreen/Vote/PaymentVoucherScreen/CreateVoucherPayment";
import { Profile, RootStackParamList, UserProfile } from "@/src/types/route";
import PaymentVoucherDetail from "@/src/presentation/screens/BusinessOwnerScreen/Vote/PaymentVoucherScreen/PaymentVoucherDetail";
import {
	BusinessInforAuth,
	getUserProfile,
} from "@/src/services/API/profileService";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import CreateCustomerScreen from "@/src/presentation/screens/BusinessOwnerScreen/Customer/CreateCustomerScreen";
import ExportInvoice from "@/src/presentation/screens/ReportExport/ReportExport";
import ReportExport from "@/src/presentation/screens/ReportExport/ReportExport";
import ExportInvoiceOuput from "@/src/presentation/screens/ReportExport/ExportInvoiceOutput";
import ExportInvoiceOutput from "@/src/presentation/screens/ReportExport/ExportInvoiceOutput";
import HomeScreen from "@/src/presentation/screens/BusinessOwnerScreen/HomeScreen/HomeScreen";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";

import InventoryManagementScreen from "@/src/presentation/screens/BusinessOwnerScreen/InventoryManagementScreen/InventoryManagementScreen";
import ExportExcel from "@/src/presentation/screens/ReportExport/ExportExcel";
import TaxScreen from "../presentation/screens/BusinessOwnerScreen/TaxScreen/TaxScreen";
import EmployeesScreen from "../presentation/screens/BusinessOwnerScreen/EmployeesScreen/Employees";
import NewIngredientList from "../presentation/screens/BusinessOwnerScreen/NewIngredientList/NewIngredientList";
import ExportInvoicePayment from "../presentation/screens/BusinessOwnerScreen/ExportInvoicePayment/ExportInvoicePayment";
import PaymentInvoiceScreen from "@/src/presentation/screens/BusinessOwnerScreen/PaymentInvoice/PaymentInvoice";
import ChooseReportItem from "@/src/presentation/screens/BusinessOwnerScreen/ChooseReportItemScreen/ChooseReportItem";
import ChartExport from "@/src/presentation/screens/BusinessOwnerScreen/ChartExportSceen";
import ExportInvoiceDetailScreen from "../presentation/screens/BusinessOwnerScreen/ExportInvoiceDetailScreen/ExportInvoiceDetailScreen";
import { createProduct } from "../services/API/productService";
import CreateProductScreen from "../presentation/screens/BusinessOwnerScreen/CreateProduct/CreateProduct";

import { logout as apiLogout } from "@/src/services/API/authService";
import EditProductScreen from "../presentation/screens/BusinessOwnerScreen/EditProduct/EditProduct";
import InvoiceDetailScreenInp from "../presentation/screens/BusinessOwnerScreen/InvoiceDetailScreenInp/InvoiceDetailScreenInp";
import FilterDateTotalTaxScreen from "../presentation/screens/BusinessOwnerScreen/FilterDateTotalTaxScreen/FilterDateTotalTaxScreen";
import StoreScreen from "@/src/presentation/screens/BusinessOwnerScreen/StoreScreen/StoreScreen";
import EasyInvoiceSettings from "@/src/presentation/screens/BusinessOwnerScreen/EasyInvoiceSettings/EasyInvoiceSettings";
import EasyInvoiceListScreen from "@/src/presentation/screens/BusinessOwnerScreen/EasyInvoiceListScreen";
import EasyInvoiceDetailScreen from "@/src/presentation/screens/BusinessOwnerScreen/EasyInvoiceDetailScreen";
const Stack = createNativeStackNavigator<RootStackParamList>();
const HomeLayout = () => {
	const { data, setData } = useData(); // lấy data từ context

	const [profile, setProfile] = useState<Profile | null>(null);
	const navigate = useAppNavigation();
	const fetchProfile = async () => {
		try {
			const data: UserProfile = await getUserProfile();
			const dataBussiness = await BusinessInforAuth();
			setProfile({
				...data,
				businessName: dataBussiness?.businessName,
				address: dataBussiness?.address,
				phoneNumber: dataBussiness?.phoneNumber,
			});
			setData({ ...data, ...dataBussiness });
		} catch (error) {
			// Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại!");
			Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại", [
				{
					text: "Đăng nhập lại",
					onPress: async () => {
						// Xử lý điều hướng về màn Login
						const result = await apiLogout();
						console.log("Logout result:", result);

						// Chuyển về trang login sau khi logout
						navigate.reset({
							index: 0,
							routes: [{ name: "Login" }],
						});
					},
					style: "default", // hoặc "cancel", "destructive"
				},
			]);
		}
	};
	useEffect(() => {
		fetchProfile();
	}, []);
	return (
		<Stack.Navigator
			screenOptions={({ route }) => ({
				header:
					route.name === "ReportScreen"
						? undefined // 👉 dùng header mặc định
						: (props) => <HeaderNavigation {...props} />,
			})}
		>
			<Stack.Screen
				name="Layout"
				options={{ title: "Home", headerShown: false }}
				component={Layout}
			/>
			<Stack.Screen
				name="HomeScreen"
				options={{ title: "Home", headerShown: false }}
				component={HomeScreen}
			/>
			<Stack.Screen
				name="OptionScreen"
				options={{ title: "About" }}
				component={Option}
			/>
			<Stack.Screen
				name="ProfileBusiness"
				component={ProfileBusiness}
				options={{
					title: "Tài khoản",
				}}
			/>
			<Stack.Screen
				name="LanguagesScreen"
				options={{
					title: "Ngôn ngữ",
				}}
				component={Language}
			/>
			<Stack.Screen
				name="InvoiceInputScreen"
				options={{
					title: "Hoá đơn nhập vào",
				}}
				component={InvoiceInput}
			/>
			<Stack.Screen
				name="InvoiceOutputScreen"
				options={{
					title: "Hoá đơn xuất ra",
				}}
				component={InvoiceOutput}
			/>
			<Stack.Screen
				name="ReceiptVoucherScreen"
				options={{
					title: "Phiếu thu",
				}}
				component={ReceiptVoucherScreen}
			/>
			<Stack.Screen
				name="PaymentVoucherScreen"
				options={{
					title: "Phiếu chi",
				}}
				component={PaymentVoucherScreen}
			/>
			<Stack.Screen
				name="SettingScreen"
				options={{
					title: "Cài đặt",
				}}
				component={SettingScreen}
			/>
			<Stack.Screen
				name="ProductManager"
				options={{
					title: "Quản lý sản phẩm",
				}}
				component={ProductManagerScreen}
			/>
			<Stack.Screen
				name="SearchAccountantScreen"
				options={{
					title: "Tìm kiếm kế toán viên",
				}}
				component={SearchAccountantScreen}
			/>
			<Stack.Screen
				name="ChangePasswordScreen"
				options={{
					title: "Thay đổi mật khẩu",
				}}
				component={ChangePasswordScreen}
			/>
			<Stack.Screen
				name="StoreInformationScreen"
				options={{
					title: "Thông tin cửa hàng",
				}}
				component={StoreInformation}
			/>
			<Stack.Screen
				name="CustomerManagerScreen"
				options={{
					title: "Danh sách khách hàng",
				}}
				component={CustomerManagerScreen}
			/>
			<Stack.Screen
				name="ChooseTaxTypeForHouseholdBusiness"
				options={{
					title: "Chọn hình thức khai báo thuế",
				}}
				component={ChooseTaxTypeForHouseholdBusiness}
			/>
			<Stack.Screen
				name="SelectDigitalSignaturePlan"
				options={{
					title: "Chọn gói Chứng thư số",
				}}
				component={SelectDigitalSignaturePlan}
			/>
			<Stack.Screen
				name="SelectElectronicInvoice"
				options={{
					title: "Chọn gói Hoá đơn điện tử",
				}}
				component={SelectElectronicInvoice}
			/>
			<Stack.Screen
				name="PaymentScreen"
				options={{
					title: "Chọn gói Hoá đơn điện tử",
				}}
				component={PaymentScreen}
			/>
			<Stack.Screen
				name="ReportScreen"
				options={{
					title: "Báo cáo",
					headerShown: true,
					headerStyle: {
						backgroundColor: "#3F4E87",
					},
					headerTintColor: "#fff",
					headerTitleStyle: {
						fontWeight: "bold",
					},
					headerBackTitle: "Trở lại ",
				}}
				component={ReportScreen}
			/>
			<Stack.Screen
				name="InputProductsScreen"
				options={{
					title: "Nhập hàng",
				}}
				component={InputProducts}
			/>

			<Stack.Screen
				name="ScanBarcodeProductScreen"
				options={{
					title: "Quét mã sản phẩm",
				}}
				component={ScanBarcodeProduct}
			/>
			<Stack.Screen
				name="CreateVoucherInputProductScreen"
				options={{
					title: "Tạo phiếu nhập",
				}}
				component={CreateVoucherInputProduct}
			/>
			<Stack.Screen
				name="InvoiceScreen"
				options={{
					title: "Hoá đơn",
				}}
				component={Invoice}
			/>
			<Stack.Screen
				name="InvoiceDetailScreen"
				options={{
					title: "Chi tiết hoá đơn",
				}}
				component={InvoiceDetail}
			/>
			<Stack.Screen
				name="EditProfileScreen"
				options={{
					title: "Chỉnh sửa thông tin",
				}}
				component={EditProfileScreen}
			/>
			<Stack.Screen
				name="EditProfileBussinessStore"
				options={{
					title: "Chỉnh sửa thông tin cửa hàng",
				}}
				component={EditProfileBussinessStore}
			/>
			<Stack.Screen
				name="CreateVoucherPayment"
				options={{
					title: "Tạo phiếu chi",
				}}
				component={CreateVoucherPayment}
			/>
			<Stack.Screen
				name="PaymentVoucherDetail"
				options={{
					title: "Chi tiết phiếu chi",
				}}
				component={PaymentVoucherDetail}
			/>
			<Stack.Screen
				name="CreateCustomerScreen"
				options={{
					title: "Tạo khách hàng",
				}}
				component={CreateCustomerScreen}
			/>
			<Stack.Screen
				name="ReportExportScreen"
				options={{
					title: "Xuất báo cáo",
				}}
				component={ReportExport}
			/>
			<Stack.Screen
				name="ExportInvoiceOuputScreen"
				options={{
					title: "Xuất báo cáo",
				}}
				component={ExportInvoiceOutput}
			/>
			<Stack.Screen
				name="InventoryManagementScreen"
				options={{
					title: "Kho hàng",
				}}
				component={InventoryManagementScreen}
			/>
			<Stack.Screen
				name="EasyInvoiceSettings"
				options={{
					title: "Tài khoản EasyInvoice",
				}}
				component={EasyInvoiceSettings}
			/>
			<Stack.Screen
				name="NewIngredientList"
				options={{
					title: "Nguyên liệu mới",
				}}
				component={NewIngredientList}
			/>
			<Stack.Screen
				name="ExportExcelScreen"
				options={{
					title: "Kho hàng",
				}}
				component={ExportExcel}
			/>
			<Stack.Screen
				name="TaxScreen"
				options={{
					title: "Thuế",
				}}
				component={TaxScreen}
			/>
			<Stack.Screen
				name="EmployeesScreen"
				options={{
					title: "Nhân viên",
				}}
				component={EmployeesScreen}
			/>
			<Stack.Screen
				name="ExportInvoicePayment"
				options={{
					title: "Hóa đơn mới",
				}}
				component={ExportInvoicePayment}
			/>
			<Stack.Screen
				name="PaymentInvoiceScreen"
				options={{
					title: "Thanh toán hoá đơn",
				}}
				component={PaymentInvoiceScreen}
			/>
			<Stack.Screen
				name="ChooseReportItemScreen"
				options={{
					title: "Chọn báo cáo",
				}}
				component={ChooseReportItem}
			/>
			<Stack.Screen
				name="ChartExportScreen"
				options={{
					title: "Doanh thu",
				}}
				component={ChartExport}
			/>
			<Stack.Screen
				name="ExportInvoiceDetailScreen"
				options={{
					title: "Xác nhận thanh toán",
				}}
				component={ExportInvoiceDetailScreen}
			/>
			<Stack.Screen
				name="CreateProductScreen"
				options={{
					title: "Sản phẩm mới",
				}}
				component={CreateProductScreen}
			/>
			<Stack.Screen
				name="InvoiceDetailScreenInp"
				options={{
					title: "Chi tiết hóa đơn",
				}}
				component={InvoiceDetailScreenInp}
			/>
			<Stack.Screen
				name="EditProductScreen"
				options={{
					title: "Chỉnh sửa sản phẩm",
				}}
				component={EditProductScreen}
			/>
			<Stack.Screen
				name="FilterDateTotalTaxScreen"
				options={{
					title: "Chọn ngày hiển thị",
				}}
				component={FilterDateTotalTaxScreen}
			/>
			<Stack.Screen
				name="StoreScreen"
				options={{
					title: "Cửa hàng",
				}}
				component={StoreScreen}
			/>
			<Stack.Screen
				name="EasyInvoiceListScreen"
				options={{
					title: "Quản lý hóa đơn EasyInvoice",
				}}
				component={EasyInvoiceListScreen}
			/>
			<Stack.Screen
				name="EasyInvoiceDetailScreen"
				options={{
					title: "Chi tiết hóa đơn",
				}}
				component={EasyInvoiceDetailScreen}
			/>
		</Stack.Navigator>
	);
};

const NavigationBusiness = () => {
	const Drawer = createDrawerNavigator();
	return (
		// <SafeAreaView
		//   style={{
		//     flex: 1,
		//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
		//     paddingBottom: 0,
		//   }}
		// >
		<View
			style={{
				flex: 1,
			}}
		>
			<Drawer.Navigator
				screenOptions={{
					drawerStyle: { width: 300 },
					headerStyle: { height: 100 },
					drawerActiveTintColor: "#000",
					headerTintColor: "black",
					headerShown: false,
					drawerPosition: "right",
				}}
				drawerContent={(props) => <CustomDrawerBusiness {...props} />}
			>
				<Drawer.Screen
					name="HomeLayout"
					options={{
						title: "Trang cá nhân",
					}}
					component={HomeLayout}
				/>
				<Drawer.Screen
					name="AboutScreen"
					options={{
						title: "Giới Thiệu",
					}}
					component={AboutScreen}
				/>
			</Drawer.Navigator>
		</View>
		// </SafeAreaView>
	);
};

export default NavigationBusiness;
