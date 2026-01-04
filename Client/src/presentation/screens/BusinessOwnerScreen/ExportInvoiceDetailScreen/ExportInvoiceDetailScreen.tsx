import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

import {
  exportInvoiceOutput,
  exportInvoiceOutputEaseInvoice,
} from "@/src/services/API/invoiceService";
import { ColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import readNumber from "read-vn-number";
import {
  CreateInvoiceRequest,
  EaseInvoiceProduct,
  ExportInvoiceDetailParams,
  ExportInvoiceProduct,
  InvoiceCCT,
  InvoiceData,
  InvoiceItem,
} from "@/src/types/invoiceExport";
import { RootStackParamList } from "@/src/types/route";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import { it } from "react-native-paper-dates";
import { formatAddress } from "@/src/presentation/Controller/FormatAddress";

type Props = {
  route: {
    params: {
      invoiceDetail: ExportInvoiceDetailParams;
    };
  };
};

// Hàm tạo mã hóa đơn duy nhất
const generateUniqueInvoiceCode = () => {
  return `HD${Date.now()}`; // Ví dụ: HD1701234567890
};

// Chuyển phương thức thanh toán sang code backend
const getPaymentCode = (method: string) => {
  switch (method) {
    case "Tiền mặt":
      return "TM";
    case "Chuyển khoản":
      return "CK";
    default:
      return "KHAC";
  }
};
const VALID_VAT_RATES = [-5, -3, -2, -1, 0, 5, 8, 10] as const;
const normalizeVatRate = (vatRate: unknown): number => {
  const rate = Number(vatRate);

  if (!VALID_VAT_RATES.includes(rate as any)) {
    console.warn("VATRate không hợp lệ, set về 0:", vatRate);
    return 0; // fallback an toàn
  }

  return rate;
};
export default function ExportInvoiceDetailScreen({ route }: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { data } = useData();
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
  const mapToEaseInvoiceProducts = (
    items: ExportInvoiceProduct[]
  ): EaseInvoiceProduct[] => {
    return items.map((item) => ({
      name: item.name,
      unit: item.unit || "Cái",
      quantity: Number(item.quantity),
      price: Number(item.price),
      vatRate: [-5, -3, -2, -1, 0, 5, 8, 10].includes(Number(item.vatRate))
        ? Number(item.vatRate)
        : 0,
    }));
  };
  const invoiceExportCCT: CreateInvoiceRequest = {
    invoiceData: {
      customerName: data?.businessName,
      customerAddress: formatAddress(data?.address),
      customerTaxCode: data?.taxCode,
      paymentMethod: getPaymentCode(paymentMethod),
      products: mapToEaseInvoiceProducts(invoiceDetail.items),
    },
  };

  console.log(invoiceExportCCT.invoiceData.products, "invoice");

  const { invoiceId, items, total, tax, date, note } = invoiceDetail;
  const safeTaxPercent = tax ?? 0;
  const totalAfterTax = total - (total * safeTaxPercent) / 100;

  // Chuyển item sang InvoiceItem đúng type
  const convertItems = (items: ExportInvoiceProduct[]): InvoiceItem[] => {
    return items.map((item) => ({
      ten: item.name,
      dvtinh: item.unit || "Cái",
      sluong: Number(item.quantity) || 0, // number
      dgia: Number(item.price) || 0, // number
      thtien: String(item.total || 0), // string
      tchat: Number(item.tchat) || 0, // number
      vatRate: [-5, -3, -2, -1, 0, 5, 8, 10].includes(Number(item.vatRate))
        ? Number(item.vatRate)
        : 0,
    }));
  };

  // Khởi tạo InvoiceData
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    nmmst: "",
    nmten: "",
    nmdchi: "",
    mhdon: generateUniqueInvoiceCode(), // tạo mã hóa đơn mới
    tgtttbso: Math.round(totalAfterTax),
    tgtttbchu: readNumber(Math.round(totalAfterTax)),
    thtttoan: getPaymentCode(paymentMethod),
    hdhhdvu: convertItems(items),
  });

  // Cập nhật invoiceData khi thay đổi paymentMethod
  useEffect(() => {
    setInvoiceData((prev) => ({
      ...prev,
      thtttoan: getPaymentCode(paymentMethod),
      tgtttbso: Math.round(totalAfterTax),
      tgtttbchu: readNumber(Math.round(totalAfterTax)),
      hdhhdvu: convertItems(items),
      mhdon: generateUniqueInvoiceCode(), // mỗi lần in tạo mới mã hóa đơn
    }));
  }, [paymentMethod, items, totalAfterTax]);

  const handleExportInvoice = async () => {
    setLoading(true);
    try {
      await exportInvoiceOutputEaseInvoice(invoiceExportCCT); // CCT trước
      await exportInvoiceOutput(invoiceData);

      setLoading(false);
      Alert.alert("Xuất thành công", "", [
        {
          text: "OK",
          onPress: () => navigation.pop(2),
        },
      ]);
    } catch (e: any) {
      console.log("EXPORT ERROR:", e?.message);
      Alert.alert(
        "Xuất không thành công",
        e?.message ?? "Xuất hóa đơn thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
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
                {["Tiền mặt", "Chuyển khoản", "Khác"].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flex: 1,
                      gap: 10,
                      justifyContent: "center",
                    }}
                    onPress={() => setPaymentMethod(method as any)}
                  >
                    <MaterialIcons
                      name={
                        paymentMethod === method
                          ? "radio-button-checked"
                          : "radio-button-unchecked"
                      }
                      size={24}
                      color="black"
                    />
                    <Text>{method}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.summaryRow}>
                <Text>Tạm tính</Text>
                <Text>{total.toLocaleString()}đ</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Khấu trừ thuế ({safeTaxPercent}%)</Text>
                <Text>
                  {((total * safeTaxPercent) / 100).toLocaleString()}đ
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text>Tổng thanh toán</Text>
                <Text style={{ fontWeight: "700" }}>
                  {totalAfterTax.toLocaleString()}đ
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
  footer: { backgroundColor: "#fff", padding: 15, marginTop: 10 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  buttonWrapper: { marginTop: 20 },
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
