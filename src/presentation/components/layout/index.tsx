import HeaderScreen from "@/src/presentation/components/layout/Header";
import NavigationBottom from "@/src/presentation/components/layout/NavigationBottom";
import AboutScreen from "@/src/presentation/screens/About";
import HomeScreen from "@/src/presentation/screens/BusinessOwnerScreen/HomeScreen/HomeScreen";
import Invoice from "@/src/presentation/screens/BusinessOwnerScreen/HomeScreen/invoice";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
function Layout() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  return (
    <View style={{ flex: 1 }}>
      <HeaderScreen />
      <ImageBackground
        style={[styles.container]}
        source={require("@/assets/images/themeLogin.jpg")}
        resizeMode="cover"
      >
        {activeTab === "home" && <HomeScreen />}
        {activeTab === "invoice" && <Invoice />}
        {activeTab === "about" && <AboutScreen />}
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
