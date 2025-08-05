import CustomDrawerItem from "@/src/navigation/components/CustomDrawer/CustomDrawerItem";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

function VoteManager(props: any) {
  return (
    <View style={styles.borderBottom}>
      <View>
        <Text style={styles.title}>Quản lý thu chi</Text>
      </View>
      <View>
        <CustomDrawerItem
          label="Phiếu thu"
          screenName="ReceiptVoucherScreen"
          icon={(focused, color, size) => (
            <MaterialCommunityIcons
              name={"cash-plus"}
              size={size}
              color={color}
            />
          )}
          onPress={() =>
            props.navigation.navigate("HomeLayout", {
              screen: "ReceiptVoucherScreen",
            })
          }
        />
        <CustomDrawerItem
          label="Phiếu chi"
          screenName="PaymentVoucherScreen"
          icon={(focused, color, size) => (
            <MaterialCommunityIcons
              name={"cash-minus"}
              size={size}
              color={color}
            />
          )}
          onPress={() =>
            props.navigation.navigate("HomeLayout", {
              screen: "PaymentVoucherScreen",
            })
          }
        />
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
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: "#9d9d9d",
    borderStyle: "dashed",
    paddingBottom: 10,
  },
});
export default VoteManager;
