import { useData } from "@/src/presentation/Hooks/useDataStore";
import { Address } from "@/src/types/route";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

const color = "#1e1e1eff";
function StoreScreen() {
  const { data } = useData();

  const formatAddress = (address?: Address | null): string => {
    if (!address) return "";

    const { street, ward, district, city } = address;

    return [street, ward, district, city]
      .filter(Boolean) // loại bỏ null / undefined
      .join(", ");
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#f1f1f1ff", padding: 10 }}>
      <View style={styles.wrInfo}>
        <>
          <View style={styles.wrField}>
            {/* <FontAwesome5 name="store-alt" size={15} color={color} /> */}
            <Text style={styles.name}>{data?.businessName}</Text>
          </View>
          <View style={styles.wrFieldOther}>
            <Text style={styles.mst}>MST:</Text>
            <Text style={styles.value}>{data?.taxCode}</Text>
          </View>
          <View style={[styles.wrFieldOther, { gap: 30 }]}>
            <Text style={styles.mst}>Trạng thái hoạt động:</Text>
            <View style={{ alignItems: "center", flexWrap: "wrap", flex: 1 }}>
              <View style={styles.status}></View>
              <Text style={styles.value}>Đang hoạt động</Text>
            </View>
          </View>
          <View style={[styles.wrFieldOther, { gap: 30 }]}>
            <Text style={styles.mst}>SĐT:</Text>
            <Text style={styles.value}>{data?.phoneNumber}</Text>
          </View>
          <View style={[styles.wrFieldOther, { gap: 30 }]}>
            <Text style={styles.mst}>Địa chỉ:</Text>
            <Text style={styles.value}>{formatAddress(data?.address)}</Text>
          </View>
          <TouchableOpacity style={styles.btnEdit}>
            <AntDesign name="edit" size={20} color="black" />
          </TouchableOpacity>
        </>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrInfo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: color,
  },
  btnEdit: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  wrField: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  wrFieldOther: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  mst: {
    fontSize: 16,
    color: "#000000ff",
  },
  value: {
    fontSize: 16,
    color: "#4c4c4cff",
    flexWrap: "wrap",
    flex: 1,
    textAlign: "right",
    fontWeight: "500",
  },
  status: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4caf50ff",
    marginBottom: 5,
  },
});
export default StoreScreen;
