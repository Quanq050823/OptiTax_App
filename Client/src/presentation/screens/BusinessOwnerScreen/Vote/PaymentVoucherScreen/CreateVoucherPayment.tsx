import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { createVoucherPayment } from "@/src/services/API/voucherService";
import { Feather, Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { DatePickerModal } from "react-native-paper-dates";

const CatePayVoucherData = [
  { label: "Chi phí nhân công", value: "1" },
  { label: "Chi phí điện", value: "2" },
  { label: "Chi phí nước", value: "3" },
  { label: "Chi phí viễn thông", value: "4" },
  { label: "Chi phí thuê bãi, mặt bằng kinh doanh", value: "5" },
  { label: "Chi phí quản lý", value: "6" },
  { label: "Chi phí khác", value: "7" },
];

const GroupPeopleReceive = [
  { label: "Nhân viên", value: "Nhân viên" },
  { label: "Đối tác", value: "Đối tác" },
  { label: "Khác", value: "Khác" },
];

const payMethod = [
  { label: "Tiền mặt", value: "Tiền mặt" },
  { label: "Chuyển khoản", value: "Chuyển khoản" },
  { label: "Thẻ Visa", value: "Thẻ Visa" },
  { label: "Thẻ Master", value: "Thẻ Master" },
  { label: "Thẻ ATM", value: "Thẻ ATM" },
];

const formatCurrencyInput = (value: string) =>
  value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const formatDate = (date: Date) => date.toLocaleDateString("vi-VN");

function CreateVoucherPayment() {
  const navigate = useAppNavigation();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [amountText, setAmountText] = useState("");
  const [recipientGroup, setRecipientGroup] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [description, setDescription] = useState("");
  const [originalDocumentCode, setOriginalDocumentCode] = useState("");

  const amount = useMemo(() => Number(amountText.replace(/\D/g, "")), [amountText]);
  const selectedCategory = CatePayVoucherData.find((item) => item.value === category);

  const handleCreateVoucherPayment = async () => {
    if (!category) {
      Alert.alert("Thiếu danh mục", "Vui lòng chọn loại chi phí.");
      return;
    }
    if (!amount || amount <= 0) {
      Alert.alert("Thiếu số tiền", "Vui lòng nhập giá trị chi lớn hơn 0.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Thiếu mô tả", "Vui lòng nhập mô tả ngắn cho phiếu chi.");
      return;
    }

    setSubmitting(true);
    try {
      await createVoucherPayment({
        date: date.toISOString(),
        category,
        amount,
        description: description.trim(),
      });
      Alert.alert("Thành công", "Phiếu chi đã được tạo.");
      navigate.goBack();
    } catch (error: any) {
      Alert.alert(
        "Tạo phiếu chi thất bại",
        error?.message ?? "Vui lòng kiểm tra thông tin và thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigate.goBack()}>
            <Feather name="arrow-left" size={20} color="#111827" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Tạo phiếu chi</Text>
            <Text style={styles.subtitle}>Ghi nhận khoản chi vào sổ theo dõi</Text>
          </View>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewIcon}>
            <MaterialCommunityIcons name="cash-minus" size={24} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewLabel}>Số tiền chi</Text>
            <Text style={styles.previewAmount}>
              {amount
                ? amount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                : "0 đ"}
            </Text>
            <Text style={styles.previewMeta}>
              {selectedCategory?.label ?? "Chưa chọn danh mục"} · {formatDate(date)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chính</Text>

          <Text style={styles.label}>
            Loại phiếu chi <Text style={styles.required}>*</Text>
          </Text>
          <Dropdown
            style={styles.dropdown}
            data={CatePayVoucherData}
            labelField="label"
            valueField="value"
            value={category}
            placeholder="Chọn danh mục chi"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            onChange={(item) => setCategory(String(item.value))}
          />

          <Text style={styles.label}>
            Giá trị chi <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={amountText}
            placeholder="0 đ"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={(text) => setAmountText(formatCurrencyInput(text))}
          />

          <Text style={styles.label}>
            Mô tả <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={description}
            placeholder="Ví dụ: Thanh toán tiền điện tháng này"
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Người nhận và chứng từ</Text>

          <Text style={styles.label}>Nhóm người nhận</Text>
          <Dropdown
            style={styles.dropdown}
            data={GroupPeopleReceive}
            labelField="label"
            valueField="value"
            value={recipientGroup}
            placeholder="Chọn nhóm người nhận"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            onChange={(item) => setRecipientGroup(String(item.value))}
          />

          <Text style={styles.label}>Tên người nhận</Text>
          <TextInput
            value={recipientName}
            placeholder="Nhập tên người nhận"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            onChangeText={setRecipientName}
          />

          <Text style={styles.label}>Phương thức thanh toán</Text>
          <Dropdown
            style={styles.dropdown}
            data={payMethod}
            labelField="label"
            valueField="value"
            value={paymentMethod}
            placeholder="Chọn phương thức"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            onChange={(item) => setPaymentMethod(String(item.value))}
          />

          <Text style={styles.label}>Thời gian ghi nhận</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.dateInput}
            onPress={() => setOpenDatePicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(date)}</Text>
            <Fontisto name="date" size={18} color={ColorMain} />
          </TouchableOpacity>

          <Text style={styles.label}>Chứng từ gốc</Text>
          <TextInput
            value={originalDocumentCode}
            placeholder="Nhập mã hóa đơn/chứng từ nếu có"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            onChangeText={setOriginalDocumentCode}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleCreateVoucherPayment}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="check" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>Lưu phiếu chi</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F6F8FA",
    flex: 1,
  },
  content: {
    padding: 14,
    paddingBottom: 110,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  title: {
    color: "#111827",
    fontSize: 23,
    fontWeight: "800",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
  },
  previewCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  previewIcon: {
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  previewLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  previewAmount: {
    color: "#EF4444",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 2,
  },
  previewMeta: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
  },
  section: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  label: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 12,
  },
  required: {
    color: "#EF4444",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
    borderRadius: 8,
    borderWidth: 1,
    height: 46,
    paddingHorizontal: 12,
  },
  placeholder: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  selectedText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
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
    minHeight: 92,
    paddingTop: 12,
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
    bottom: 0,
    left: 0,
    padding: 14,
    position: "absolute",
    right: 0,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: ColorMain,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    height: 50,
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});

export default CreateVoucherPayment;
