import { ColorMain } from "@/src/presentation/components/colors";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { PaymentVoucher } from "@/src/types/voucher";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const voucher: PaymentVoucher[] = [
  {
    id: "73551000000001",
    amount: 500000,
    type: "Chi phí văn phòng",
    recipientGroup: "Nhà cung cấp",
    recipientName: "Công ty ABC",
    paymentMethod: "Chuyển khoản",
    description: "Thanh toán hóa đơn văn phòng phẩm",
    recordDate: new Date("2025-09-04"),
    originalDocumentCode: "HD12345",
    attachmentUrl: "https://example.com/chungtu.pdf",
  },
  {
    id: "73551000000002",
    amount: 500000,
    type: "Chi phí văn phòng",
    recipientGroup: "Nhà cung cấp",
    recipientName: "Công ty ABC",
    paymentMethod: "Chuyển khoản",
    description: "Thanh toán hóa đơn văn phòng phẩm",
    recordDate: new Date("2025-09-04"),
    originalDocumentCode: "HD12345",
    attachmentUrl: "https://example.com/chungtu.pdf",
  },
  {
    id: "73551000000003",
    amount: 500000,
    type: "Chi phí văn phòng",
    recipientGroup: "Nhà cung cấp",
    recipientName: "Công ty ABC",
    paymentMethod: "Chuyển khoản",
    description: "Thanh toán hóa đơn văn phòng phẩm",
    recordDate: new Date("2025-09-04"),
    originalDocumentCode: "HD12345",
    attachmentUrl: "https://example.com/chungtu.pdf",
  },
];
function PaymentVoucherScreen() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useAppNavigation();

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigate.navigate("PaymentVoucherDetail", { voucher: item });
        }}
      >
        <View style={styles.item}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.label}>#{item.id} </Text>
            <Text style={[styles.label, { fontStyle: "normal" }]}>
              {item.recordDate.toLocaleDateString("vi-VN")}
            </Text>
          </View>
          <Text style={styles.type}>{item.recipientName}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 6,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <FontAwesome name="user-plus" size={15} color="#636363ff" />
              <Text style={[styles.label, { marginLeft: 6, color: "#000" }]}>
                The Khang
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.label, { fontStyle: "normal" }]}>
                Loại chi:
              </Text>
              <Text style={[styles.label, { marginLeft: 6, color: "#000" }]}>
                {item.type}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}></View>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={[styles.label, { fontStyle: "normal" }]}>
                Tổng chi:
              </Text>
              <Text
                style={[
                  styles.label,
                  { marginLeft: 6, color: "#ee4b2aff", fontSize: 20 },
                ]}
              >
                {item.amount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}></View>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text style={[styles.label, { color: "#8f8f8fff" }]}>
                {item.paymentMethod}
              </Text>
            </View>
          </View>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <>
      {/* <HeaderScreen /> */}
      <View style={{ flex: 1 }}>
        <ScreenContainer>
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={styles.btnCreateVoucher}
              onPress={() => {}}
            >
              <AntDesign name="filter" size={15} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCreateVoucher}
              onPress={() => {
                navigate.navigate("CreateVoucherPayment");
              }}
            >
              <Text style={{ color: "#fff" }}>
                <AntDesign name="plus" size={15} color="#fff" /> Tạo phiếu mới
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              width: "100%",
              marginTop: 20,
            }}
          >
            <FlatList
              data={voucher}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
          </View>
        </ScreenContainer>
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
  btnCreateVoucher: {
    backgroundColor: ColorMain,
    padding: 10,
    borderRadius: 8,
  },
  item: {
    marginBottom: 12,
    borderBottomWidth: 1,
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    paddingBottom: 0,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#636363ff",
    fontStyle: "italic",
  },
  value: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  type: {
    fontSize: 18,
    color: "#000000ff",
    marginTop: 4,
    fontWeight: "700",
  },
});
export default PaymentVoucherScreen;
