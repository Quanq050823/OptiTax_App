import { ColorMain } from "@/src/presentation/components/colors";
import { phieuThu } from "@/src/types/route";
import { AntDesign, Feather, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { DatePickerModal } from "react-native-paper-dates";

const payerGroups = [
  { label: "Khách hàng", value: "Khách hàng" },
  { label: "Đối tác", value: "Đối tác" },
  { label: "Khác", value: "Khác" },
];

const receiptTypes = [
  { label: "Doanh thu bán hàng", value: "Doanh thu bán hàng" },
  { label: "Thu dịch vụ", value: "Thu dịch vụ" },
  { label: "Thu khác", value: "Thu khác" },
];

const payMethods = [
  { label: "Tiền mặt", value: "Tiền mặt" },
  { label: "Chuyển khoản", value: "Chuyển khoản" },
  { label: "Thẻ", value: "Thẻ" },
];

const formatCurrencyInput = (value: string) =>
  value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const formatDate = (date: Date) => date.toLocaleDateString("vi-VN");

function ModalAddReceiptVourcher({
  voteReceipt,
  setVoteReceipt,
  visible,
  setVisible,
}: {
  voteReceipt: phieuThu[];
  setVoteReceipt: Dispatch<SetStateAction<phieuThu[]>>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [typeVoucher, setTypeVoucher] = useState("");
  const [submitter, setSubmitter] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const numericAmount = useMemo(() => Number(amount.replace(/\D/g, "")), [amount]);

  const resetForm = () => {
    setReceiver("");
    setAmount("");
    setDocumentNumber("");
    setTypeVoucher("");
    setSubmitter("");
    setPaymentMethod("Tiền mặt");
    setNote("");
    setDate(new Date());
  };

  const handleCreateReceipt = () => {
    if (!typeVoucher) {
      Alert.alert("Thiếu loại phiếu", "Vui lòng chọn loại phiếu thu.");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      Alert.alert("Thiếu số tiền", "Vui lòng nhập giá trị phiếu thu lớn hơn 0.");
      return;
    }
    if (!submitter.trim()) {
      Alert.alert("Thiếu người nộp", "Vui lòng nhập tên người nộp tiền.");
      return;
    }

    const nextIndex = voteReceipt.length + 1;
    const receipt: phieuThu = {
      id: `PT-${String(nextIndex).padStart(5, "0")}`,
      name: typeVoucher,
      date: formatDate(date),
      paymentMethod,
      price: numericAmount,
      receiver,
      documentNumber,
      note,
      submitter: submitter.trim(),
      typeVoucher,
    };

    setVoteReceipt((prev) => [receipt, ...prev]);
    resetForm();
    setVisible(false);
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <View style={styles.headerIcon}>
                  <MaterialCommunityIcons name="cash-plus" size={22} color={ColorMain} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>Tạo phiếu thu</Text>
                  <Text style={styles.modalSubtitle}>Ghi nhận khoản tiền vào</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={styles.closeButton}
                >
                  <AntDesign name="close" size={20} color="#111827" />
                </TouchableOpacity>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}
              >
                <View style={styles.previewCard}>
                  <Text style={styles.previewLabel}>Giá trị phiếu thu</Text>
                  <Text style={styles.previewAmount}>
                    {numericAmount
                      ? numericAmount.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "0 đ"}
                  </Text>
                  <Text style={styles.previewMeta}>
                    {typeVoucher || "Chưa chọn loại phiếu"} · {formatDate(date)}
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>Thông tin khoản thu</Text>

                <Text style={styles.label}>
                  Loại phiếu thu <Text style={styles.required}>*</Text>
                </Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={receiptTypes}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn loại phiếu thu"
                  value={typeVoucher}
                  onChange={(item) => setTypeVoucher(String(item.value))}
                />

                <Text style={styles.label}>
                  Giá trị phiếu thu <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="0 đ"
                  placeholderTextColor="#9CA3AF"
                  value={amount}
                  style={styles.input}
                  keyboardType="number-pad"
                  onChangeText={(text) => setAmount(formatCurrencyInput(text))}
                />

                <Text style={styles.label}>Ngày thu</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.dateInput}
                  onPress={() => setOpenDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
                  <Fontisto name="date" size={18} color={ColorMain} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Người nộp và chứng từ</Text>

                <Text style={styles.label}>Nhóm người nộp</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={payerGroups}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn nhóm người nộp"
                  value={receiver}
                  onChange={(item) => setReceiver(String(item.value))}
                />

                <Text style={styles.label}>
                  Người nộp <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="Nhập tên người nộp"
                  placeholderTextColor="#9CA3AF"
                  value={submitter}
                  style={styles.input}
                  onChangeText={setSubmitter}
                />

                <Text style={styles.label}>Phương thức thanh toán</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={payMethods}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn phương thức"
                  value={paymentMethod}
                  onChange={(item) => setPaymentMethod(String(item.value))}
                />

                <Text style={styles.label}>Số chứng từ</Text>
                <TextInput
                  placeholder="Nhập số chứng từ nếu có"
                  placeholderTextColor="#9CA3AF"
                  value={documentNumber}
                  style={styles.input}
                  onChangeText={setDocumentNumber}
                />

                <Text style={styles.label}>Ghi chú</Text>
                <TextInput
                  placeholder="Nhập ghi chú"
                  placeholderTextColor="#9CA3AF"
                  value={note}
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                  onChangeText={setNote}
                />
              </ScrollView>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    resetForm();
                    setVisible(false);
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryButton} onPress={handleCreateReceipt}>
                  <Feather name="check" size={18} color="#fff" />
                  <Text style={styles.primaryButtonText}>Tạo phiếu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <DatePickerModal
        locale="vi"
        mode="single"
        visible={openDatePicker}
        date={date}
        onDismiss={() => setOpenDatePicker(false)}
        onConfirm={(params) => {
          if (params.date) setDate(params.date);
          setOpenDatePicker(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    alignItems: "center",
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F6F8FA",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: "92%",
    overflow: "hidden",
    width: "100%",
  },
  header: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  headerIcon: {
    alignItems: "center",
    backgroundColor: "#EAF8F3",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  modalTitle: {
    color: "#111827",
    fontSize: 19,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 2,
  },
  closeButton: {
    alignItems: "center",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  formContent: {
    padding: 14,
    paddingBottom: 20,
  },
  previewCard: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  previewLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  previewAmount: {
    color: ColorMain,
    fontSize: 23,
    fontWeight: "800",
    marginTop: 2,
  },
  previewMeta: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
    marginTop: 8,
  },
  label: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 10,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111827",
    fontSize: 14,
    height: 46,
    paddingHorizontal: 12,
  },
  textArea: {
    minHeight: 84,
    paddingTop: 12,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
    borderRadius: 8,
    borderWidth: 1,
    height: 46,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  selectedTextStyle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  dateInput: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    height: 46,
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  dateText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
  footer: {
    backgroundColor: "#fff",
    borderTopColor: "#E5E7EB",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 14,
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#D1D5DB",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "800",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: ColorMain,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 48,
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});

export default ModalAddReceiptVourcher;
