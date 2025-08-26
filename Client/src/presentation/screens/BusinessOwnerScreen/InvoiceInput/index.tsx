import { ColorMain } from "@/src/presentation/components/colors";
import HeaderScreen from "@/src/presentation/components/layout/Header";
import InvoiInputList from "@/src/presentation/components/List/InvoiInputList";
import ModalSynchronized from "@/src/presentation/components/Modal/ModalSynchronized";
import SearchByName from "@/src/presentation/components/SearchByName";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function InvoiceInput() {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      {/* <HeaderScreen /> */}
      <View style={styles.searchWrapper}>
        <SearchByName label="Tìm kiếm nhà cung cấp" />
        <View style={{ flex: 1, alignItems: "center", paddingRight: 20 }}>
          <TouchableOpacity>
            <FontAwesome5 name="calendar-alt" size={24} color={ColorMain} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.synchronizedWrapper}>
        <TouchableOpacity
          style={styles.btnSyn}
          onPress={() => setVisible(true)}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>
            Đồng bộ <Fontisto name="spinner-refresh" size={13} color="#fff" />
          </Text>
        </TouchableOpacity>
      </View>

      <InvoiInputList />
      <ModalSynchronized visible={visible} setVisible={setVisible} />
    </View>
  );
}
const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#d8d7d7ff",
  },
  synchronizedWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },
  btnSyn: {
    backgroundColor: ColorMain,
    padding: 10,
    borderRadius: 10,
  },
});

export default InvoiceInput;
