// src/components/CustomDrawer.tsx
import CustomDrawerItem from "@/src/navigation/components/CustomDrawer/CustomDrawerItem";
import InvoiceManageShow from "@/src/navigation/components/InvoiceManageShow";
import Setting from "@/src/navigation/components/Setting";
import VoteManager from "@/src/navigation/components/VoteManager/inden";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
} from "react-native";
import { RootStackParamList } from "@/src/types/route";
import Employees from "../../Employees/Employees";
import { useLogout } from "@/src/presentation/Hooks/useLogout";
import { useData } from "@/src/presentation/Hooks/useDataStore";
type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const getInitials = (value?: string) => {
	if (!value) return "EO";
	return value
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((word) => word.charAt(0).toUpperCase())
		.join("");
};

const CustomDrawerBusiness = (props: any) => {
	const navigation = useNavigation<LoginNavigationProp>();
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const { data } = useData();
	const displayName = data?.businessName || data?.name || "Tài khoản EON";
	const userRole = data?.userType === 2 ? "Kế toán viên" : "Hộ kinh doanh";

	const FocusedScreen = (name: string) => {
		return props.state.routeNames[props.state.index] === name;
	};

	const { handleLogout, loading: logoutLoading } = useLogout();

	return (
		<DrawerContentScrollView
			{...props}
			contentContainerStyle={{ flex: 1, paddingHorizontal: 0, paddingTop: 30 }}
		>
			<View style={styles.headerNameApp}>
				<Text style={{ fontSize: 18, fontWeight: "bold", color: "#9d9d9d" }}>
					INVOICE
				</Text>
				<Text style={{ color: "#9d9d9d" }}>MKH - 1234</Text>
			</View>
			<TouchableOpacity
				style={styles.header}
				onPress={() =>
					props.navigation.navigate("HomeLayout", {
						screen: "ProfileBusiness",
					})
				}
			>
				{data?.avatar ? (
					<Image source={{ uri: data.avatar }} style={styles.avatar} />
				) : (
					<View style={styles.avatarFallback}>
						<Text style={styles.avatarText}>{getInitials(displayName)}</Text>
					</View>
				)}
				<View style={{ marginLeft: 10 }}>
					<Text style={styles.name} numberOfLines={1}>
						{displayName}
					</Text>
					<Text style={styles.position}>{userRole}</Text>
				</View>
			</TouchableOpacity>

			{/* 📋 DANH SÁCH MỤC */}
			{/* <View style={{ paddingTop: 10 }}>
        <DrawerItemList {...props} />
      </View> */}
			<View>
				{/* <CustomDrawerItem
          label="Trang chủ"
          screenName="HomeScreen"
          icon={(focused, color, size) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          )}
          onPress={() =>
            props.navigation.navigate("HomeLayout", {
              screen: "HomeScreen",
            })
          }
        />
        <CustomDrawerItem
          label="Giới thiệu"
          screenName="AboutScreen"
          icon={(focused, color, size) => (
            <AntDesign
              name={focused ? "infocirlce" : "infocirlceo"}
              size={size}
              color={color}
            />
          )}
          onPress={() => props.navigation.navigate("AboutScreen")}
        /> */}
			</View>
			{/* <InvoiceManageShow {...props} /> */}
			{/* <VoteManager {...props} /> */}
			<Employees {...props} />
			<Setting {...props} />
			<CustomDrawerItem
				label="Tài khoản"
				screenName="ProfileBusiness"
				icon={(focused, color, size) => (
					<FontAwesome6 name="circle-user" size={24} color={color} />
				)}
				onPress={() =>
					props.navigation.navigate("HomeLayout", {
						screen: "ProfileBusiness",
					})
				}
			/>

			<CustomDrawerItem
				label="Quản lý sản phẩm"
				screenName="ProductManager"
				icon={(focused, color, size) => (
					<AntDesign
						name={focused ? "user" : "info-circle"}
						size={size}
						color={color}
					/>
				)}
				onPress={() =>
					props.navigation.navigate("HomeLayout", {
						screen: "ProductManager",
					})
				}
			/>
			<CustomDrawerItem
				label="Quản lý kho hàng"
				screenName="InventoryManagementScreen"
				icon={(focused, color, size) => (
					<MaterialCommunityIcons
						name="package-variant-closed"
						size={size}
						color={color}
					/>
				)}
				onPress={() =>
					props.navigation.navigate("HomeLayout", {
						screen: "InventoryManagementScreen",
					})
				}
			/>
			<CustomDrawerItem
				label="Tài khoản EasyInvoice"
				screenName="EasyInvoiceSettings"
				icon={(focused, color, size) => (
					<MaterialCommunityIcons
						name="invoice-text"
						size={size}
						color={color}
					/>
				)}
				onPress={() =>
					props.navigation.navigate("HomeLayout", {
						screen: "EasyInvoiceSettings",
					})
				}
			/>
			<TouchableOpacity onPress={handleLogout} disabled={logoutLoading}>
				<View style={styles.logoutContainer}>
					<AntDesign
						name="logout"
						size={20}
						color={isLoggingOut ? "#ccc" : "black"}
						style={{ height: 100 }}
					/>
					<Text
						style={{
							height: 100,
							marginLeft: 10,
							color: isLoggingOut ? "#ccc" : "black",
						}}
					>
						{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
					</Text>
				</View>
			</TouchableOpacity>
		</DrawerContentScrollView>
	);
};

export default CustomDrawerBusiness;

const styles = StyleSheet.create({
	header: {
		alignItems: "center",
		flexDirection: "row",
		marginTop: 20,
	},
	headerNameApp: {
		width: "100%",
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	avatar: {
		width: 70,
		height: 70,
		borderRadius: 35,
		marginBottom: 10,
		borderWidth: 2,
		borderColor: "#fff",
	},
	avatarFallback: {
		width: 70,
		height: 70,
		borderRadius: 35,
		marginBottom: 10,
		borderWidth: 2,
		borderColor: "#fff",
		backgroundColor: "#e8f3f1",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		color: "#1f7a70",
		fontSize: 20,
		fontWeight: "800",
	},
	name: {
		color: "#000000ff",
		fontSize: 18,
		fontWeight: "bold",
		maxWidth: 170,
	},
	position: {
		color: "#3b3b3bff",
		fontSize: 14,
		marginTop: 5,
	},
	logoutContainer: {
		flexDirection: "row",
		alignItems: "center",
		padding: 20,
		borderTopColor: "#ddd",
		borderTopWidth: 1,
		marginTop: 10,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#9d9d9d",
		marginVertical: 10,
	},
	dropdownHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});
