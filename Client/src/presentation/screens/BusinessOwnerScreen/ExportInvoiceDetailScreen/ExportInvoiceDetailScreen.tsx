import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Product, RootStackParamList } from "@/src/types/route";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
  ExportInvoiceDetailParams,
  ExportInvoiceProduct,
  InvoiceData,
  InvoiceItem,
} from "@/src/types/invoiceExport";
import { MaterialIcons } from "@expo/vector-icons";
import { exportInvoiceOutput } from "@/src/services/API/invoiceService";
import readNumber from "read-vn-number";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { ColorMain } from "@/src/presentation/components/colors";

type Props = {
  route: {
    params: {
      invoiceDetail: ExportInvoiceDetailParams;
    };
  };
};

export default function ExportInvoiceDetailScreen({ route }: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "Tiền mặt" | "Chuyển khoản" | "Khác"
  >("Tiền mặt");

  const invoiceDetail = route?.params?.invoiceDetail ?? {
    invoiceId: "",
    items: [],
    total: 0,
    tax: 0,
    date: new Date().toISOString(),
    note: "",
  };

  const convertItems = (items: ExportInvoiceProduct[]): InvoiceItem[] => {
    return items.map((item) => ({
      ten: item.name, // hoặc item.ten nếu dữ liệu khác
      dvtinh: item.unit || "Cái", // tuỳ theo Product bạn có field nào
      sluong: String(item.quantity),
      dgia: String(item.price), // nếu Product có price
      thtien: String(item.total),
      tchat: 1, // bạn tự set hoặc map từ dữ liệu
    }));
  };
  // Destructure các giá trị bên trong để tiện dùng
  const { invoiceId, items, total, tax, date, note } = invoiceDetail;
  const safeTax = tax ?? 0;
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    nmmst: "",
    nmten: "",
    nmdchi: "",
    tgtttbso: (total - safeTax).toString().replace(/\D/g, ""),
    tgtttbchu: readNumber(total - safeTax),
    thtttoan: paymentMethod,
    hdhhdvu: convertItems(items),
  });

  const handleExportInvoice = async () => {
    setLoading(true);
    try {
      const res = await exportInvoiceOutput(invoiceData);
      setLoading(false);

      Alert.alert("Xuất thành công", "", [
        {
          text: "OK",
          onPress: () => navigation.pop(2),
        },
      ]);
    } catch (e) {
      Alert.alert("Xuất k thành công");
      console.log(e);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5ff" }}>
      <LoadingScreen visible={loading} />
      <View style={styles.header}>
        <Text style={styles.invoiceId}>Hoá đơn: {invoiceId}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>
              {item.name} x {item.quantity || 1}
            </Text>
            <Text style={styles.itemPrice}>
              {(item.price * (item.quantity || 1)).toLocaleString()}đ
            </Text>
          </View>
        )}
        ListFooterComponent={
          <View style={{ flex: 1 }}>
            <View style={styles.footer}>
              <Text>Phương thức thanh toán</Text>

              <View style={styles.wrPTTT}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    gap: 10,
                    justifyContent: "center",
                  }}
                  onPress={() => setPaymentMethod("Tiền mặt")}
                >
                  <MaterialIcons
                    name={
                      paymentMethod === "Tiền mặt"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color="black"
                  />
                  <Text>Tiền mặt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    gap: 10,
                    justifyContent: "center",
                  }}
                  onPress={() => setPaymentMethod("Chuyển khoản")}
                >
                  <MaterialIcons
                    name={
                      paymentMethod === "Chuyển khoản"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color="black"
                  />
                  <Text>Chuyển khoản</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    gap: 10,
                    justifyContent: "center",
                  }}
                  onPress={() => setPaymentMethod("Khác")}
                >
                  <MaterialIcons
                    name={
                      paymentMethod === "Khác"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={24}
                    color="black"
                  />
                  <Text>Khác</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.footer}>
              <View style={styles.summaryRow}>
                <Text>Tạm tính</Text>
                <Text>{total.toLocaleString()}đ</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Khấu trừ thuế</Text>
                <Text>{((total * safeTax) / 100).toLocaleString()}đ</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Tổng thanh toán</Text>
                <Text style={{ fontWeight: "700" }}>
                  {(total - safeTax).toLocaleString()}đ
                </Text>
              </View>

              {note && (
                <View style={{ marginTop: 10 }}>
                  <Text>Ghi chú:</Text>
                  <Text>{note}</Text>
                </View>
              )}

              <View style={styles.buttonWrapper}>
                <LinearGradient
                  colors={["#4dbf99ff", "#6A7DB3"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 3 }}
                  style={styles.btnShow}
                >
                  <TouchableOpacity
                    style={styles.buttonPrimary}
                    onPress={handleExportInvoice}
                  >
                    <Text style={styles.buttonText}>In hoá đơn</Text>
                  </TouchableOpacity>
                </LinearGradient>

                <TouchableOpacity
                  style={styles.buttonSecondary}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.buttonTextSecondary}>Quay lại</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  invoiceId: { fontWeight: "700", fontSize: 18 },
  date: { color: "#555", marginTop: 5 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  itemName: { fontSize: 16 },
  itemPrice: { fontSize: 16 },
  footer: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  buttonWrapper: {
    marginTop: 20,
  },
  buttonPrimary: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  buttonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonTextSecondary: { color: "#333", fontWeight: "700", fontSize: 16 },
  wrPTTT: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    flex: 1,
    gap: 40,
  },
  btnShow: {
    width: "100%",
    backgroundColor: ColorMain,
    marginTop: 30,
    alignSelf: "center",
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});
