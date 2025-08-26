import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Searchbar } from "react-native-paper";

function InputProducts() {
  const navigate = useAppNavigation();
  const [dataVoucherInput, setDataVoucherInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styles.shadow,
          { marginTop: 20, paddingHorizontal: 10, flexDirection: "row" },
        ]}
      >
        <Searchbar
          placeholder="Tìm kiếm phiếu nhập"
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon="magnify"
          style={{ backgroundColor: "#fff", width: "80%" }}
          iconColor={ColorMain}
          placeholderTextColor={ColorMain}
        />
        <TouchableOpacity
          style={styles.btnCreate}
          onPress={() => navigate.navigate("CreateVoucherInputProductScreen")}
        >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
            +
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <Image
          source={require("../../../../../assets/images/box.png")}
          style={{ width: 200, height: 200, opacity: 0.5 }}
        />
        <Text style={styles.textBox}>Chưa có dữ liệu nào</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { justifyContent: "center", flex: 1, alignItems: "center" },
  textBox: {
    fontSize: 16,
    color: "#797777ff",
  },
  shadow: {
    shadowColor: ColorMain,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 1 },
  },
  btnCreate: {
    flex: 1,
    backgroundColor: ColorMain,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
});
export default InputProducts;
