import { ColorMain } from "@/src/presentation/components/colors";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function PaymentVoucherScreen() {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {/* <HeaderScreen /> */}
      <View>
        {/* <View style={styles.cateWrapper}>
          <TouchableOpacity
            style={[
              styles.cateItem,
              !isActive && {
                borderBottomWidth: 3,
                borderColor: ColorMain,
              },
            ]}
            onPress={() => setIsActive(false)}
          >
            <Text
              style={[
                styles.textCate,
                !isActive && { color: ColorMain, fontWeight: "700" },
              ]}
            >
              Chi phí hàng tháng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cateItem,
              isActive && {
                borderBottomWidth: 3,
                borderColor: ColorMain,
              },
            ]}
            onPress={() => setIsActive(true)}
          >
            <Text
              style={[
                styles.textCate,
                isActive && { color: ColorMain, fontWeight: "700" },
              ]}
            >
              Khác
            </Text>
          </TouchableOpacity>
        </View> */}
        <View></View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  cateWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    backgroundColor: "#fff",
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
  },
  cateItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  textCate: { fontSize: 16, color: "#9c9c9cff" },
});
export default PaymentVoucherScreen;
