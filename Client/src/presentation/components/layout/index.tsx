import HeaderScreen from "@/src/presentation/components/layout/Header";
import NavigationBottom from "@/src/presentation/components/layout/NavigationBottom";
import AboutScreen from "@/src/presentation/screens/BusinessOwnerScreen/Option/Option";
import React, { useState } from "react";
import { ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import Option from "@/src/presentation/screens/BusinessOwnerScreen/Option/Option";
import Dashboard from "@/src/presentation/screens/BusinessOwnerScreen/Dashboard/Dashboard";
import NotificationScreen from "@/src/presentation/screens/BusinessOwnerScreen/Notifycation/Notifycation";
import HomeScreen from "@/src/presentation/screens/BusinessOwnerScreen/HomeScreen/HomeScreen";
import { TabType } from "@/src/types/route";
function Layout() {
  const [activeTab, setActiveTab] = useState<TabType>("Trang chủ");
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={"default"} />
      <HeaderScreen activeTab={activeTab} />
      <ImageBackground
        style={[styles.container]}
        source={require("@/assets/images/background.png")}
        resizeMode="cover"
      >
        <View style={{ flex: 1, width: "100%" }}>
          {activeTab === "Trang chủ" && <Dashboard />}
          {activeTab === "Tiện ích" && <HomeScreen />}
          {activeTab === "Tuỳ chọn" && <Option />}
          {activeTab === "Thông báo" && <NotificationScreen />}
        </View>
      </ImageBackground>

      <NavigationBottom setActiveTab={setActiveTab} activeTab={activeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
export default Layout;
