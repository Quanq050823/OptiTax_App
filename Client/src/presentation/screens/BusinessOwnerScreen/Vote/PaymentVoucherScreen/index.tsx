import { ColorMain } from "@/src/presentation/components/colors";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import TagItem from "@/src/presentation/components/TagItem";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import { BusinessInforAuth } from "@/src/services/API/profileService";
import { getVoucherPayment } from "@/src/services/API/voucherService";
import { PaymentVoucher, VoucherPaymentResponse } from "@/src/types/voucher";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CatePayVoucherData = [
  { label: "Chi phí nhân công", value: "1" },
  { label: "Chi phí điện", value: "2" },
  { label: "Chi phí nước", value: "3" },
  { label: "Chi phí viễn thông", value: "4" },
  { label: "Chi phí thuê bãi, mặt bằng kinh doanh", value: "5" },
  { label: "Chi phí quản lý (văn phòng phẩm, dụng cụ,..)", value: "6" },
  { label: "Chi phí khác (hội nghị, công tác phí, thanh lý,...)", value: "7" },
];
// const voucher: PaymentVoucher[] = [
//   {
//     _id: "73551000000001",
//     amount: 500000,
//     type: "Chi phí văn phòng",
//     recipientGroup: "Nhà cung cấp",
//     recipientName: "Công ty ABC",
//     paymentMethod: "Chuyển khoản",
//     description: "Thanh toán hóa đơn văn phòng phẩm",
//     recordDate: new Date("2025-09-04"),
//     originalDocumentCode: "HD12345",
//     attachmentUrl: "https://example.com/chungtu.pdf",

//   },
//   {
//     _id: "73551000000002",
//     amount: 500000,
//     type: "Chi phí văn phòng",
//     recipientGroup: "Nhà cung cấp",
//     recipientName: "Công ty ABC",
//     paymentMethod: "Chuyển khoản",
//     description: "Thanh toán hóa đơn văn phòng phẩm",
//     recordDate: new Date("2025-09-04"),
//     originalDocumentCode: "HD12345",
//     attachmentUrl: "https://example.com/chungtu.pdf",
//   },
//   {
//     _id: "73551000000003",
//     amount: 500000,
//     type: "Chi phí văn phòng",
//     recipientGroup: "Nhà cung cấp",
//     recipientName: "Công ty ABC",
//     paymentMethod: "Chuyển khoản",
//     description: "Thanh toán hóa đơn văn phòng phẩm",
//     recordDate: new Date("2025-09-04"),
//     originalDocumentCode: "HD12345",
//     attachmentUrl: "https://example.com/chungtu.pdf",
//   },
// ];
function PaymentVoucherScreen() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useAppNavigation();
  const [voucherPayList, setVoucherPayList] = useState<PaymentVoucher[]>([]);
  const [bussinessInfo, setBussinessInfo] = useState<any>(null);
  const { data } = useData();

  const fetchDataVoucherPay = async () => {
    try {
      const res: VoucherPaymentResponse = await getVoucherPayment();
      setVoucherPayList(res.data);
      console.log(res.data, "res.data");
    } catch (error) {
      console.error("Error fetching voucher payment data:", error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchDataVoucherPay();
    }, [])
  );

  console.log(voucherPayList);

  const getCategoryLabel = (value: string) => {
    const found = CatePayVoucherData.find((item) => item.value === value);
    return found ? found.label : "Không xác định";
  };
  const renderItem = ({ item }: { item: PaymentVoucher }) => {
    // getBussinessOwnerById(item.businessOwnerId);
    return (
      <TouchableOpacity
        onPress={() => {
          navigate.navigate("PaymentVoucherDetail", { voucher: item });
        }}
      >
        <View style={styles.item}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.label}>#{item._id} </Text>
          </View>
          {/* <Text style={styles.type}>{item.recipientName}</Text> */}
          <View
            style={{
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              {/* <FontAwesome name="user-plus" size={15} color="#636363ff" /> */}
              <Text style={[styles.label, { fontStyle: "normal" }]}>
                Người tạo:
              </Text>
              <Text
                style={[styles.value, { marginLeft: 6, fontStyle: "normal" }]}
              >
                {data?.businessName}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                alignItems: "flex-end",
              }}
            >
              <Text style={[styles.label, { fontStyle: "normal" }]}>
                Mô tả:
              </Text>
              <Text
                style={[styles.value, { marginLeft: 6, fontWeight: "500" }]}
              >
                {item.description}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              marginTop: 10,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                alignItems: "flex-end",
                flexShrink: 1,
                flex: 1,
              }}
            >
              <Text
                style={[
                  styles.value,
                  {
                    fontWeight: "400",
                    fontSize: 13,
                    color: ColorMain,
                    flexShrink: 1, // Cho text co lại
                    flexWrap: "wrap", // Cho phép xuống dòng
                  },
                ]}
              >
                {getCategoryLabel(item.category)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                flex: 2,
                justifyContent: "flex-end",
              }}
            >
              <Text style={[styles.label, { fontStyle: "normal" }]}>
                Tổng chi:
              </Text>
              <Text
                style={[
                  styles.label,
                  {
                    marginLeft: 6,
                    color: "#ee4b2aff",
                    fontSize: 20,
                  },
                ]}
              >
                {item.amount?.toLocaleString("vi-VN", {
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
        </View>
        <TagItem content={item.createdAt.split("T")[0]} />
      </TouchableOpacity>
    );
  };
  return (
    <>
      {/* <HeaderScreen /> */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 10,
            paddingTop: 30,
          }}
        >
          <TouchableOpacity
            style={[styles.btnCreateVoucher, { marginRight: 10 }]}
            onPress={() => {}}
          >
            <AntDesign name="filter" size={17} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCreateVoucher}
            onPress={() => {
              navigate.navigate("CreateVoucherPayment");
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500" }}>
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
            data={voucherPayList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false} // ẩn thanh cuộn dọc
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  textCate: { fontSize: 16, color: "#9c9c9cff" },
  btnCreateVoucher: {
    backgroundColor: ColorMain,
    padding: 10,
    borderRadius: 8,
  },
  item: {
    marginBottom: 20,
    borderBottomWidth: 1,
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    paddingBottom: 0,
    marginTop: 10,
    position: "relative",
    marginHorizontal: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#636363ff",
    fontStyle: "italic",
  },
  value: {
    fontSize: 16,
    color: ColorMain,
    fontWeight: "700",
    fontStyle: "italic",
  },
  type: {
    fontSize: 18,
    color: "#000000ff",
    marginTop: 4,
    fontWeight: "700",
  },
});
export default PaymentVoucherScreen;
