import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import InvoiceInput from "@/src/presentation/screens/BusinessOwnerScreen/InvoiceInput";
import InvoiceOutput from "@/src/presentation/screens/BusinessOwnerScreen/InvoiceOutput";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function Invoice() {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cateWrapper}>
        <TouchableOpacity
          style={[
            styles.cateItem,
            !isActive && {
              borderBottomWidth: 1,
              borderColor: ColorMain,
            },
          ]}
          onPress={() => setIsActive(false)}
        >
          <Text
            style={[
              styles.textCate,
              !isActive && { color: textColorMain, fontWeight: "700" },
            ]}
          >
            Hoá đơn nhập vào
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.cateItem,
            isActive && {
              borderBottomWidth: 1,
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
            Hoá đơn xuất ra
          </Text>
        </TouchableOpacity>
      </View>
      <ScreenContainer>
        {!isActive ? (
          <InvoiceInput />
        ) : (
          <InvoiceOutput loading={loading} setLoading={setLoading} />
        )}
      </ScreenContainer>
      <LoadingScreen visible={loading} />
    </View>
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
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
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

export default Invoice;
