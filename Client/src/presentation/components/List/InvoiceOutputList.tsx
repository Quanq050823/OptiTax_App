import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
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
  invoicesData: Invoice[];
};
function InvoiceOutputList({ invoicesData }: invoice) {
  const navigate = useAppNavigation();
  const getStatusInfo = (status?: number | string | null) => {
    const s = Number(status); // ép string -> number

    switch (s) {
      case 1:
        return { text: "Nháp", color: "red" };
      case 8:
        return { text: "Đã cấp mã", color: "green" };
      default:
        return { text: "Không xác định", color: "gray" };
    }
  };
  const totalInvoice = (invoice: Invoice) => {
    return invoice.hdhhdvu.reduce((sum, p) => sum + Number(p.thtien), 0);
  };

  const totals = invoicesData.map((inv) => ({
    id: inv._id,
    total: totalInvoice(inv),
  }));

  const renderItem = ({ item }: { item: Invoice }) => {
    // const { text, color } = getStatusInfo(item.status);
    const total = item.hdhhdvu.reduce(
      (sum, p) => sum + Number(p.thtien || 0),
      0
    );

    const statusInfo = getStatusInfo(item.ttxly ?? 0);
    console.log(item.ttxly);
    const label = "Hoá đơn bán ra";
    return (
      <TouchableOpacity
        onPress={() =>
          navigate.navigate("InvoiceDetailScreen", { item, total, label })
        }
      >
        <View style={styles.card}>
          <View style={styles.headerItem}>
            <Text style={styles.supplier}>{item.nbten}</Text>
            <Text style={{ color: "#4f4f4fff" }}>
              {item.ncnhat.split("T")[0]}
            </Text>
          </View>
          <Text style={styles.id}>Mã HĐ: {item.mhdon}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              alignItems: "center",
            }}
          >
            <Text style={[styles.status, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
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
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
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
export default InvoiceOutputList;
