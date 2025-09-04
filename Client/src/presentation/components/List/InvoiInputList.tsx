import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const invoices: Invoice[] = [
  {
    id: "HD001",
    date: "2025-08-20",
    supplier: "Công ty ABC",
    total: 1500000,
    status: 1,
  },
  {
    id: "HD002",
    date: "2025-08-21",
    supplier: "Nhà cung cấp XYZ",
    total: 2800000,
    status: 0,
  },
  {
    id: "HD003",
    date: "2025-08-22",
    supplier: "Siêu thị Metro",
    total: 560000,
    status: 2,
  },
];

function InvoiInputList() {
  const navigate = useAppNavigation();
  // const getStatusInfo = (status: number) => {
  //   switch (status) {
  //     case 0:
  //       return { text: "Chưa xử lý", color: "red" };
  //     case 1:
  //       return { text: "Đã xử lý", color: "green" };
  //     case 2:
  //       return { text: "Đang xử lý", color: ColorMain };
  //     default:
  //       return { text: "Không xác định", color: "gray" };
  //   }
  // };

  const renderItem = ({ item }: { item: Invoice }) => {
    // const { text, color } = getStatusInfo(item.status);
    return (
      <TouchableOpacity
        onPress={() => navigate.navigate("InvoiceDetailScreen", { item })}
      >
        <View style={styles.card}>
          <View style={styles.headerItem}>
            <Text style={styles.supplier}>{item.supplier}</Text>
            <Text style={{ color: "#4f4f4fff" }}>{item.date}</Text>
          </View>
          <Text style={styles.id}>Mã HĐ: {item.id}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              alignItems: "center",
            }}
          >
            {/* <Text style={[styles.status, { color: color }]}>{text}</Text> */}
            <Text style={{ fontSize: 18, fontWeight: "600", color: ColorMain }}>
              {item.total.toLocaleString()} đ
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={invoices}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2, // bóng trên Android
    shadowColor: "#000", // bóng trên iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: "#d3d3d3ff",
  },
  headerItem: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  id: {
    fontSize: 13,
    marginBottom: 5,
    marginTop: 5,
  },
  status: {
    fontStyle: "italic",
    color: "#3b5998",
    fontWeight: "600",
  },
  supplier: {
    fontSize: 17,
    fontWeight: "700",
    width: "70%",
  },
});
export default InvoiInputList;
