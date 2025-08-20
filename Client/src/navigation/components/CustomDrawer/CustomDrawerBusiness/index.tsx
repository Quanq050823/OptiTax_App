// src/components/CustomDrawer.tsx
import CustomDrawerItem from "@/src/navigation/components/CustomDrawer/CustomDrawerItem";
import InvoiceManageShow from "@/src/navigation/components/InvoiceManageShow";
import Setting from "@/src/navigation/components/Setting";
import VoteManager from "@/src/navigation/components/VoteManager/inden";
import { AntDesign } from "@expo/vector-icons";
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
import { logout } from "@/src/services/API/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenStorage } from "@/src/utils/tokenStorage";
type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CustomDrawerBusiness = (props: any) => {
  const navigation = useNavigation<LoginNavigationProp>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const FocusedScreen = (name: string) => {
    return props.state.routeNames[props.state.index] === name;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      // 2. Xóa token trên client
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");

      console.log("Logout thành công, token đã bị xóa.");

      navigation.replace("Login");
    } catch (error: any) {
      setIsLoggingOut(false);
      Alert.alert(
        "Đăng xuất thất bại",
        error?.message || "Có lỗi xảy ra khi đăng xuất."
      );
    }
  };
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
      {/* 🔶 HEADER: Avatar + Tên người dùng */}
      <TouchableOpacity
        style={styles.header}
        onPress={() =>
          props.navigation.navigate("HomeLayout", {
            screen: "ProfileBusiness",
          })
        }
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/100" }} // Avatar giả
          style={styles.avatar}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.name}>Tạp hoá TÚ 230</Text>
          <Text style={styles.position}>Hộ kinh doanh</Text>
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
      <InvoiceManageShow {...props} />
      <VoteManager {...props} />
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
            name={focused ? "user" : "infocirlceo"}
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
      <TouchableOpacity onPress={handleLogout} disabled={isLoggingOut}>
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
  name: {
    color: "#000000ff",
    fontSize: 18,
    fontWeight: "bold",
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
