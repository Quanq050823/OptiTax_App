import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { InvoiceSummary } from "@/src/types/invoiceIn";
import { Invoice } from "@/src/types/route";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const invoices: any = [
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
type invoice = {
  invoicesData: InvoiceSummary[];
};
function InvoiInputList({ invoicesData }: invoice) {
  const navigate = useAppNavigation();
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return { text: "Chưa xử lý", color: "red" };
      case 1:
        return { text: "Đã xử lý", color: "green" };
      case 2:
        return { text: "Đang xử lý", color: ColorMain };
      default:
        return { text: "Không xác định", color: "gray" };
    }
  };

  const renderItem = ({ item }: { item: InvoiceSummary }) => {
    const total = item.tien.tong;
    // const { text, color } = getStatusInfo(item.status);

    const label = "Hoá đơn mua vào";

    return (
      <TouchableOpacity
        onPress={() =>
          navigate.navigate("InvoiceDetailScreen", { item, total, label })
        }
      >
        <View style={styles.card}>
          <View style={styles.headerItem}>
            <Text style={styles.supplier}>{item.loaiHoaDon}</Text>
            <Text style={{ color: "#4f4f4fff" }}>
              {item.ngayKy.split("T")[0]}
            </Text>
          </View>
          <Text style={styles.id}>Mã HĐ: {item.soHoaDon}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 10,
              alignItems: "center",
            }}
          >
            {/* <Text style={[styles.status, { color: "#333" }]}>hihi</Text> */}

            <Text style={{ fontSize: 18, fontWeight: "600", color: ColorMain }}>
              {total.toLocaleString("vi-VN")} đ
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={invoicesData}
      keyExtractor={(item) => item.soHoaDon}
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
