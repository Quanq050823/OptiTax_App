import HomeScreen from "@/src/presentation/screens/BusinessOwnerScreen/HomeScreen/HomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import React from "react";

import CustomDrawerBusiness from "@/src/navigation/components/CustomDrawer/CustomDrawerBusiness";
import HeaderNavigation from "@/src/navigation/components/HeaderNavigation/HeaderNavigation";
import Layout from "@/src/presentation/components/layout";
import AboutScreen from "@/src/presentation/screens/About";
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
import { View } from "react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();
const HomeLayout = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <HeaderNavigation {...props} />,
      }}
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
        name="AboutScreen"
        options={{ title: "About" }}
        component={AboutScreen}
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
