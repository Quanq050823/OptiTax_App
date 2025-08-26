import { ColorMain } from "@/src/presentation/components/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InvoiceDetailScreen = ({ route }: any) => {
  const { item } = route.params; // nhận từ navigate

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

  const { text: statusText, color: statusColor } = getStatusInfo(item.status);

  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.title}>Chi tiết hoá đơn</Text>

      {/* Thông tin chung */}
      <View style={styles.card}>
        <View style={styles.flexLabel}>
          <Text style={styles.label}>Mã hoá đơn:</Text>
          <Text style={styles.value}>{item.id}</Text>
        </View>
        <View style={styles.flexLabel}>
          <Text style={styles.label}>Ngày lập:</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>
        <View style={styles.flexLabel}>
          <Text style={styles.label}>Nhà cung cấp:</Text>
          <Text style={styles.value}>{item.supplier}</Text>
        </View>
        <View style={styles.flexLabel}>
          <Text style={styles.label}>Tổng tiền:</Text>
          <Text style={[styles.value, styles.money]}>
            {item.total.toLocaleString()} đ
          </Text>
        </View>
        <View style={styles.flexLabel}>
          <Text style={styles.label}>Trạng thái:</Text>
          <Text
            style={[styles.value, { color: statusColor, fontWeight: "bold" }]}
          >
            {statusText}
          </Text>
        </View>
      </View>

      {/* Chỗ này sau này bạn có thể thêm FlatList sản phẩm */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
        <Text style={{ color: "#888" }}>(Chưa có dữ liệu)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f6f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  flexLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#111",
    marginBottom: 4,
    fontWeight: "600",
  },
  money: {
    color: "#e67e22",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
});

export default InvoiceDetailScreen;
