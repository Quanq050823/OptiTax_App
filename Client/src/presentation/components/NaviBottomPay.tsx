import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";

type NaviBottomPayProps = {
  label: string;
  screen: keyof RootStackParamList;
  selectedItems?: { label: string; price: number }[];
  params?: any;
  selectedInvoice?: any;
};
function NaviBottomPay({
  label,
  screen,
  selectedItems,
  params,
  selectedInvoice,
}: NaviBottomPayProps) {
  const [open, setOpen] = useState(false);

  const navigate = useAppNavigation();

  //   const goNext = () => {
  //     setOpen(false);
  //     navigate.navigate(screen as never);
  //   };
  //   console.log(totalPrice, "số tiền");

  const handlePress = () => {
    if (!params) {
      Alert.alert("Vui lòng chọn một gói chữ ký số!");
      return;
    }
    if (selectedInvoice !== undefined && !selectedInvoice) {
      Alert.alert("Thông báo", "Vui lòng chọn một gói!");
      return;
    }
    if (screen) {
      navigate.navigate(screen, params); // 👈 truyền params khi navigate
    }
  };
  const totalPriceSelect =
    selectedItems?.reduce((sum, item) => sum + item.price, 0) ?? 0;
  return (
    <View style={styles.wrapper}>
      {/* Thanh bottom */}
      <View style={styles.actionBottom}>
        {/* Hàng tổng tiền + mũi tên */}
        <TouchableOpacity
          style={styles.summaryRow}
          onPress={() => setOpen(true)}
          activeOpacity={0.85}
        >
          <View style={styles.summaryLeft}>
            <Text style={{ fontWeight: "600" }}>Tổng các gói đã chọn…</Text>
            {/* Mũi tên hướng lên (tam giác) */}
            <View style={styles.arrowUp} />
          </View>

          <Text style={styles.totalPrice}>
            {(totalPriceSelect ?? 0).toLocaleString("vi-VN")} VND
          </Text>
        </TouchableOpacity>

        {/* Nút tiếp theo */}
        <TouchableOpacity style={styles.btnPay} onPress={handlePress}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>{label}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal slide up */}
      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalContainer}>
          {/* Nền mờ đóng modal */}
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setOpen(false)}
          />

          {/* Tấm sheet trượt từ dưới lên */}
          <View style={styles.sheet}>
            <View style={styles.grabber} />
            <Text style={styles.sheetTitle}>Các mục đã chọn</Text>

            <FlatList
              data={selectedItems}
              keyExtractor={(item, idx) => item.label ?? idx.toString()}
              ListEmptyComponent={
                <Text style={{ color: "#777" }}>Chưa chọn mục nào</Text>
              }
              renderItem={({ item }) => (
                <View style={styles.rowBetween}>
                  <Text style={{ flex: 1 }}>{item.label}</Text>
                  <Text>{item.price.toLocaleString("vi-VN")} VND</Text>
                </View>
              )}
              style={{ marginTop: 8 }}
              contentContainerStyle={{ paddingBottom: 8 }}
            />

            <View style={styles.divider} />

            <View style={styles.rowBetween}>
              <Text style={{ fontWeight: "700" }}>Tổng cộng</Text>
              <Text style={[styles.totalPrice, { marginTop: 0 }]}>
                {totalPriceSelect?.toLocaleString("vi-VN")} VND
              </Text>
            </View>

            <View style={styles.sheetButtons}>
              <TouchableOpacity
                style={styles.sheetClose}
                onPress={() => setOpen(false)}
              >
                <Text style={{ fontWeight: "600" }}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetPay} onPress={handlePress}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {label}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const DROPUP_BG = "#fff";
const styles = StyleSheet.create({
  wrapper: { position: "absolute", width: "100%", bottom: 0 },

  actionBottom: {
    backgroundColor: "#fff",
    padding: 15,
    minHeight: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: "#7e7e7e",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    ...Platform.select({ android: { elevation: 16 } }),
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLeft: { flexDirection: "row", alignItems: "center" },

  // Tam giác hướng lên
  arrowUp: {
    marginLeft: 8,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#999", // có thể đổi ColorMain nếu thích
  },

  totalPrice: {
    fontSize: 20,
    color: ColorMain,
    fontWeight: "700",
    marginTop: 6,
  },

  btnPay: {
    marginTop: 12,
    backgroundColor: ColorMain,
    height: 44,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  // Modal + Sheet
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "70%",
  },
  grabber: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D0D3DA",
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 10,
  },
  sheetButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  sheetClose: {
    height: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#F1F1F4",
  },
  sheetPay: {
    height: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: ColorMain,
  },
});

export default NaviBottomPay;
