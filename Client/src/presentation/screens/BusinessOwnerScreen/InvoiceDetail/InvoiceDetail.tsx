import { ColorMain } from "@/src/presentation/components/colors";
import { InvoiceProduct } from "@/src/types/route";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const InvoiceDetailScreen = ({ route }: any) => {
  const { item, total, label } = route.params; // nhận từ navigate

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
  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cell, { flex: 0.5 }]}>STT</Text>
      <Text style={[styles.cell, { flex: 1 }]}>Tính chất</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>Tên</Text>
      <Text style={[styles.cell, { flex: 1 }]}>ĐVT</Text>
      <Text style={[styles.cell, { flex: 0.7 }]}>SL</Text>
      <Text style={[styles.cell, { flex: 1.5 }]}>Đơn giá</Text>
      <Text style={[styles.cell, { flex: 2 }]}>Thành tiền</Text>
    </View>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: InvoiceProduct;
    index: number;
  }) => (
    <>
      <View
        style={[styles.row, { paddingHorizontal: 15, backgroundColor: "#fff" }]}
      >
        <Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
        <Text style={[styles.cell, { flex: 1 }]}>HHDV</Text>
        <Text style={[styles.cell, { flex: 1.5, fontWeight: "600" }]}>
          {item.ten}
        </Text>
        <Text style={[styles.cell, { flex: 1 }]}>{item.dvtinh}</Text>
        <Text style={[styles.cell, { flex: 1 }]}>
          {Number(item.sluong) % 1 === 0
            ? Number(item.sluong) // nếu là số nguyên thì giữ nguyên
            : Number(item.sluong).toString()}
        </Text>
        <Text style={[styles.cell, { flex: 1.5 }]}>
          {Number(item.dgia).toLocaleString("vi-VN")}
        </Text>
        <Text style={[styles.cell, { flex: 2 }]}>
          {Number(item.thtien).toLocaleString("vi-VN")}
        </Text>
      </View>
    </>
  );
  return (
    <>
      <FlatList
        data={item.hdhhdvu}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.flexLabel}>
                <Text style={styles.label}>Tổng tiền thuế:</Text>
                <Text style={styles.value}></Text>
              </View>
              <View style={styles.flexLabel}>
                <Text style={styles.label}>Tổng tiền phí:</Text>
                <Text style={styles.value}></Text>
              </View>
              <View style={styles.flexLabel}>
                <Text style={styles.label}>Tổng tiền CKTM:</Text>
                <Text style={styles.value}></Text>
              </View>
              <View style={[styles.flexLabel]}>
                <Text style={styles.label}>Tổng tiền thanh toán:</Text>
                <Text style={[styles.value, styles.money]}>
                  {total.toLocaleString("vi-VN")} đ
                </Text>
              </View>
            </View>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.container}>
            {/* Tiêu đề */}
            {/* <Text style={styles.title}>Chi tiết hoá đơn</Text> */}

            {/* Thông tin chung */}
            <View style={styles.card}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 17,
                  marginBottom: 20,
                }}
              >
                {label}
              </Text>
              <View style={styles.flexLabel}>
                <Text style={styles.label}>Mã HĐ:</Text>
                <Text style={styles.value}>{item.mhdon}</Text>
              </View>
              <View style={styles.flexLabel}>
                <Text style={styles.label}>Ngày lập:</Text>
                <Text style={styles.value}>{item.ncnhat.split("T")[0]}</Text>
              </View>
              <View style={styles.flexLabel}>
                <Text style={styles.label}>Tên người bán:</Text>
                <Text style={styles.value}>{item.nbten}</Text>
              </View>
              <View style={styles.flexLabel}>
                <Text style={styles.label}>Mã số thuế:</Text>
                <Text style={styles.value}>{item.nbmst}</Text>
              </View>
              <View style={styles.flexLabel}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <Text style={styles.value}>{item.nbdchi}</Text>
              </View>
              <View style={styles.flexLabel}>
                <Text style={styles.label}>Số điện thoại:</Text>
                <Text style={styles.value}>{item.nbsdthoai}</Text>
              </View>

              {/* <View style={styles.flexLabel}>

          <Text style={styles.label}>Trạng thái:</Text>
          <Text
            style={[styles.value, { color: statusColor, fontWeight: "bold" }]}
          >
            Đã xử lý
          </Text>
        </View> */}
              <View style={styles.line}></View>
              <View style={[styles.flexLabel, { marginTop: 20 }]}>
                <Text style={styles.label}>Tên người mua:</Text>
                <Text style={styles.value}>{item.nmten}</Text>
              </View>
              {item.nmtnmua && (
                <View style={[styles.flexLabel]}>
                  <Text style={styles.label}>Hộ tên người mua:</Text>
                  <Text style={styles.value}>{item.nmtnmua}</Text>
                </View>
              )}
              <View style={[styles.flexLabel]}>
                <Text style={styles.label}>Mã số thuế:</Text>
                <Text style={styles.value}>{item.nmmst}</Text>
              </View>
              <View style={[styles.flexLabel]}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <Text style={styles.value}>{item.nmdchi}</Text>
              </View>
              <View
                style={[styles.flexLabel, { justifyContent: "space-between" }]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                  }}
                >
                  <Text style={[styles.label, { marginRight: 0, flex: 1 }]}>
                    HTTT:
                  </Text>
                  <Text style={[styles.value, { textAlign: "left" }]}>
                    {item.thtttoan}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={[styles.label, { marginRight: 0, flex: 1 }]}>
                    Đơn vị tiền tệ:
                  </Text>
                  <Text style={[styles.value, { textAlign: "left", flex: 1 }]}>
                    {item.dvtte}
                  </Text>
                </View>
              </View>
            </View>

            {/* Chỗ này sau này bạn có thể thêm FlatList sản phẩm */}
            <View style={[styles.card, { marginTop: 20 }]}>
              <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
              {/* {item.hdhhdvu.map((product: any, index: any) => (
          <View key={product.id}>
            <Text>STT: {index + 1}</Text>
            <Text>{product.ten}</Text>
          </View>
        ))} */}
              {renderHeader()}

              {/* <Text style={{ color: "#888" }}>(Chưa có dữ liệu)</Text> */}
            </View>
          </View>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    paddingTop: 15,
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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingBottom: 0,
    alignItems: "center",
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
    marginRight: 6,
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#111",
    fontWeight: "600",
    flex: 2,
    flexShrink: 1,
    textAlign: "right",
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

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  headerRow: {
    backgroundColor: "#f2f2f2",
    marginTop: 15,
  },
  cell: {
    fontSize: 12,
    textAlign: "center",
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#d8d8d8ff",
    width: "100%",
  },
});

export default InvoiceDetailScreen;
