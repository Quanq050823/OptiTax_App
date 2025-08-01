import CustomDrawerItem from "@/src/navigation/components/CustomDrawer/CustomDrawerItem";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
function Setting(props: any) {
  return (
    <View>
      <View>
        <Text style={styles.title}>Cài đặt hệ thống</Text>
      </View>
      <View>
        <TouchableOpacity>
          <CustomDrawerItem
            label="Cài đặt bán hàng"
            screenName="SettingSreen"
            icon={(focused, color, size) => (
              <Ionicons
                name={focused ? "settings-sharp" : "settings-outline"}
                size={24}
                color={color}
              />
            )}
            onPress={() =>
              props.navigation.navigate("HomeLayout", {
                screen: "SettingScreen",
              })
            }
          />
          <CustomDrawerItem
            label="Ngôn ngữ"
            screenName="LanguagesScreen"
            icon={(focused, color, size) => (
              <Ionicons
                name={focused ? "language" : "language"}
                size={size}
                color={color}
              />
            )}
            onPress={() =>
              props.navigation.navigate("HomeLayout", {
                screen: "LanguagesScreen",
              })
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9d9d9d",
    marginVertical: 10,
  },
});
export default Setting;
