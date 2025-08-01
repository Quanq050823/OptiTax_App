import CustomDrawerItem from "@/src/navigation/components/CustomDrawer/CustomDrawerItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
function InvoiceManageShow(props: any) {
  const [showInvoices, setShowInvoices] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    setShowInvoices(!showInvoices);
    Animated.timing(animation, {
      toValue: showInvoices ? 0 : 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: false, // height không hỗ trợ native driver
    }).start();
  };

  // Height interpolation
  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // 👈 chỉnh theo chiều cao mong muốn
  });
  return (
    <View style={styles.borderBottom}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownHeader}>
        <Text style={styles.title}>Quản lý hoá đơn</Text>
        {showInvoices ? (
          <MaterialIcons name="arrow-drop-up" size={24} color="#9d9d9d" />
        ) : (
          <MaterialIcons name="arrow-drop-down" size={24} color="#9d9d9d" />
        )}
      </TouchableOpacity>

      <Animated.View style={{ overflow: "hidden", height }}>
        <CustomDrawerItem
          label="Hóa đơn đầu vào"
          screenName="InvoiceInputScreen"
          icon={(focused, color, size) => (
            <MaterialCommunityIcons
              name={focused ? "file-import" : "file-import-outline"}
              size={size}
              color={color}
            />
          )}
          onPress={() =>
            props.navigation.navigate("HomeLayout", {
              screen: "InvoiceInputScreen",
            })
          }
        />
        <CustomDrawerItem
          label="Hóa đơn đầu ra"
          screenName="InvoiceOutputScreen"
          icon={(focused, color, size) => (
            <MaterialCommunityIcons
              name={focused ? "file-export" : "file-export-outline"}
              size={size}
              color={color}
            />
          )}
          onPress={() =>
            props.navigation.navigate("HomeLayout", {
              screen: "InvoiceOutputScreen",
            })
          }
        />
      </Animated.View>

      {/* <DrawerItem
          label="Hóa đơn đầu ra"
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name={
                FocusedScreen("InvoiceOutputScreen")
                  ? "file-export"
                  : "file-export-outline"
              }
              size={24}
              color={color}
            />
          )}
          onPress={() => props.navigation.navigate("InvoiceOutputScreen")}
        /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9d9d9d",
    marginVertical: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: "#9d9d9d",
    borderStyle: "dashed",
    paddingBottom: 10,
  },
});
export default InvoiceManageShow;
