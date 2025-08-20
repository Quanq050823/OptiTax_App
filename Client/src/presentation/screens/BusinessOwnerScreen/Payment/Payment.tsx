import { RouteProp, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { ColorMain } from "@/src/presentation/components/colors";
import { useState } from "react";

type CheckoutRouteProp = RouteProp<RootStackParamList, "PaymentScreen">;
type CheckoutItem = {
  label: string;
  price: number;
  description?: string;
  timeUse?: string;
  title: string;
};
function PaymentScreen() {
  const route = useRoute<CheckoutRouteProp>();
  const { digitalSignature, invoice } = route.params;
  const [loading, setLoading] = useState(false);
  const [renderQR, setRenderQR] = useState(false);
  // Gom tất cả items đã chọn
  const items: CheckoutItem[] = [
    ...(digitalSignature
      ? [
          {
            label: digitalSignature.label,
            price: digitalSignature.price,
            timeUse: digitalSignature.timeUse,
            title: "Gói chữ ký số ",
          },
        ]
      : []),
    ...(invoice
      ? [
          {
            label: invoice.label,
            price: invoice.price,
            description: invoice.description,
            title: "Gói hoá đơn điện tử",
          },
        ]
      : []),
  ];
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const handleCreateQR = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRenderQR(true);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận đơn hàng</Text>

      <ScrollView style={{ flex: 1 }}>
        {items.map((item, index) => (
          <View key={index} style={{ marginBottom: 50 }}>
            <Text style={{ fontWeight: "800", fontSize: 16, color: ColorMain }}>
              {item.title}
            </Text>

            <View key={index} style={styles.item}>
              <View>
                <Text style={styles.label}>{item.label}</Text>
              </View>
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
            </View>
            <Text style={{ marginTop: 10 }}>
              {item.description ? item.description : item.timeUse}
            </Text>
          </View>
        ))}

        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontWeight: "800",
              fontSize: 17,
              color: ColorMain,
              marginTop: 20,
              textAlign: "center",
            }}
          >
            Chọn phương thức thanh toán
          </Text>
          {renderQR ? (
            <Image
              source={require("../../../../../assets/images/QR.png")}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <TouchableOpacity
              style={styles.QRPayWrapper}
              onPress={handleCreateQR}
            >
              <View style={styles.QRPay}>
                <Text>
                  {loading ? (
                    <ActivityIndicator size="large" color="#3F4E87" />
                  ) : (
                    "Tạo mã QR thanh toán"
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Tổng tiền + nút Thanh toán */}
      <View style={styles.bottom}>
        <Text style={styles.total}>Tổng: {totalPrice.toLocaleString()} đ</Text>
        <TouchableOpacity style={styles.payButton}>
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
            Thanh toán
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 40,
    color: ColorMain,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eaeaea",
  },
  label: { fontSize: 16, fontWeight: "500" },
  desc: { color: "#757575", fontSize: 14, marginTop: 10 },
  price: { fontSize: 16, fontWeight: "600", color: ColorMain },
  bottom: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  total: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "right",
    color: "#000",
  },
  payButton: {
    backgroundColor: ColorMain,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  QRPayWrapper: {
    marginTop: 40,
    alignItems: "center",
  },
  QRPay: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default PaymentScreen;
