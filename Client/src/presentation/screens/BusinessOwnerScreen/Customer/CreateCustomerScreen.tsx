import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
  createCustomer,
  CreateCustomerPayload,
} from "@/src/services/API/customerService";
import { Feather, Fontisto, FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
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
import provinces from "vietnam-provinces";

const dataCustomerType = [
  { label: "Cá nhân", value: "individual" },
  { label: "Doanh nghiệp", value: "business" },
];

const genderOptions = [
  { label: "Nam", value: "male" },
  { label: "Nữ", value: "female" },
  { label: "Khác", value: "other" },
];

const statusOptions = [
  { label: "Hoạt động", value: "active" },
  { label: "Không hoạt động", value: "inactive" },
];

const tagOptions = [
  { label: "VIP", value: "VIP" },
  { label: "Thân thiết", value: "Thân thiết" },
  { label: "Công nợ", value: "Công nợ" },
  { label: "Tiềm năng", value: "Tiềm năng" },
];

const formatMoneyInput = (value: string) =>
  value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const formatDate = (date?: Date) => (date ? date.toLocaleDateString("vi-VN") : "");

function CreateCustomerScreen() {
  const navigate = useAppNavigation();
  const [submitting, setSubmitting] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [provinceList, setProvinceList] = useState<{ label: string; value: string }[]>([]);
  const [districtList, setDistrictList] = useState<{ label: string; value: string }[]>([]);
  const [wardList, setWardList] = useState<{ label: string; value: string }[]>([]);
  const [openBirthPicker, setOpenBirthPicker] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | undefined>();

  const [form, setForm] = useState({
    name: "",
    code: "",
    phoneNumber: "",
    email: "",
    customerType: "individual" as "individual" | "business",
    taxCode: "",
    companyName: "",
    contactPerson: "",
    street: "",
    gender: "male" as "male" | "female" | "other",
    creditLimit: "",
    paymentTerms: "",
    status: "active" as "active" | "inactive",
    tag: "",
    notes: "",
  });

  useEffect(() => {
    const provs = provinces.getProvinces();
    setProvinceList(
      provs.map((p: any) => ({
        label: p.name,
        value: String(p.code),
      }))
    );
  }, []);

  useEffect(() => {
    if (!selectedProvince) {
      setDistrictList([]);
      setSelectedDistrict(null);
      return;
    }

    const dists = provinces.getDistricts(String(selectedProvince));
    setDistrictList(
      dists.map((d: any) => ({
        label: d.name,
        value: String(d.code),
      }))
    );
    setSelectedDistrict(null);
    setSelectedWard(null);
  }, [selectedProvince]);

  useEffect(() => {
    if (!selectedDistrict) {
      setWardList([]);
      setSelectedWard(null);
      return;
    }

    const wards = provinces.getWards(String(selectedDistrict));
    setWardList(
      wards.map((w: any) => ({
        label: w.name,
        value: String(w.code),
      }))
    );
    setSelectedWard(null);
  }, [selectedDistrict]);

  const selectedProvinceLabel = provinceList.find((item) => item.value === selectedProvince)?.label;
  const selectedDistrictLabel = districtList.find((item) => item.value === selectedDistrict)?.label;
  const selectedWardLabel = wardList.find((item) => item.value === selectedWard)?.label;
  const creditLimit = useMemo(
    () => Number(form.creditLimit.replace(/\D/g, "")),
    [form.creditLimit]
  );
  const displayName = form.customerType === "business"
    ? form.companyName || form.name || "Khách hàng doanh nghiệp"
    : form.name || "Khách hàng cá nhân";

  const updateForm = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildCustomerCode = () => {
    if (form.code.trim()) return form.code.trim();
    const phoneSuffix = form.phoneNumber.replace(/\D/g, "").slice(-4);
    return `KH-${phoneSuffix || Date.now().toString().slice(-5)}`;
  };

  const handleSave = async () => {
    if (!form.name.trim() && form.customerType === "individual") {
      Alert.alert("Thiếu tên khách hàng", "Vui lòng nhập họ tên khách hàng.");
      return;
    }
    if (form.customerType === "business" && !form.companyName.trim()) {
      Alert.alert("Thiếu tên doanh nghiệp", "Vui lòng nhập tên doanh nghiệp.");
      return;
    }
    if (!form.phoneNumber.trim()) {
      Alert.alert("Thiếu số điện thoại", "Vui lòng nhập số điện thoại khách hàng.");
      return;
    }

    const payload: CreateCustomerPayload = {
      name: form.customerType === "business"
        ? form.companyName.trim()
        : form.name.trim(),
      code: buildCustomerCode(),
      phoneNumber: form.phoneNumber.trim(),
      email: form.email.trim() || undefined,
      customerType: form.customerType,
      taxCode: form.taxCode.trim() || undefined,
      companyName: form.customerType === "business" ? form.companyName.trim() : undefined,
      contactPerson: form.contactPerson.trim() || undefined,
      dateOfBirth: birthDate?.toISOString(),
      gender: form.customerType === "individual" ? form.gender : undefined,
      notes: form.notes.trim() || undefined,
      creditLimit,
      paymentTerms: form.paymentTerms.trim() || undefined,
      status: form.status,
      tags: form.tag ? [form.tag] : [],
      address: {
        street: form.street.trim() || undefined,
        ward: selectedWardLabel,
        district: selectedDistrictLabel,
        city: selectedProvinceLabel,
      },
    };

    setSubmitting(true);
    try {
      await createCustomer(payload);
      Alert.alert("Thành công", "Khách hàng đã được tạo.");
      navigate.goBack();
    } catch (error: any) {
      Alert.alert(
        "Tạo khách hàng thất bại",
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
            <Text style={styles.title}>Thêm khách hàng</Text>
            <Text style={styles.subtitle}>Lưu thông tin liên hệ và thanh toán</Text>
          </View>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewAvatar}>
            <FontAwesome5
              name={form.customerType === "business" ? "building" : "user"}
              size={20}
              color={ColorMain}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.previewName} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={styles.previewMeta} numberOfLines={1}>
              {form.phoneNumber || "Chưa có SĐT"} · {buildCustomerCode()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin chính</Text>

          <Text style={styles.label}>Loại khách hàng</Text>
          <Dropdown
            style={styles.dropdown}
            data={dataCustomerType}
            labelField="label"
            valueField="value"
            value={form.customerType}
            placeholder="Chọn loại khách hàng"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            onChange={(item) =>
              updateForm("customerType", item.value as "individual" | "business")
            }
          />

          {form.customerType === "business" ? (
            <>
              <Text style={styles.label}>
                Tên doanh nghiệp <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={form.companyName}
                placeholder="Nhập tên doanh nghiệp"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                onChangeText={(value) => updateForm("companyName", value)}
              />

              <Text style={styles.label}>Người liên hệ</Text>
              <TextInput
                value={form.contactPerson}
                placeholder="VD: Nguyễn Văn A"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                onChangeText={(value) => updateForm("contactPerson", value)}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>
                Họ và tên <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={form.name}
                placeholder="VD: Nguyễn Văn A"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                onChangeText={(value) => updateForm("name", value)}
              />
            </>
          )}

          <Text style={styles.label}>Mã khách hàng</Text>
          <TextInput
            value={form.code}
            placeholder="Để trống để tự tạo mã"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            autoCapitalize="characters"
            onChangeText={(value) => updateForm("code", value)}
          />

          <Text style={styles.label}>
            Số điện thoại <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={form.phoneNumber}
            placeholder="VD: 0981234567"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            keyboardType="phone-pad"
            onChangeText={(value) => updateForm("phoneNumber", value)}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={form.email}
            placeholder="VD: email@gmail.com"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(value) => updateForm("email", value)}
          />

          <Text style={styles.label}>Mã số thuế</Text>
          <TextInput
            value={form.taxCode}
            placeholder="Nhập mã số thuế nếu có"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            keyboardType="number-pad"
            onChangeText={(value) => updateForm("taxCode", value)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ</Text>

          <Text style={styles.label}>Tỉnh / Thành phố</Text>
          <Dropdown
            style={styles.dropdown}
            data={provinceList}
            labelField="label"
            valueField="value"
            placeholder="Chọn tỉnh/thành phố"
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            value={selectedProvince}
            onChange={(item) => setSelectedProvince(item.value)}
          />

          <View style={styles.twoColumns}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Quận / Huyện</Text>
              <Dropdown
                style={styles.dropdown}
                data={districtList}
                labelField="label"
                valueField="value"
                placeholder="Chọn quận/huyện"
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                value={selectedDistrict}
                onChange={(item) => setSelectedDistrict(item.value)}
                disable={!selectedProvince}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Phường / Xã</Text>
              <Dropdown
                style={styles.dropdown}
                data={wardList}
                labelField="label"
                valueField="value"
                placeholder="Chọn phường/xã"
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                value={selectedWard}
                onChange={(item) => setSelectedWard(item.value)}
                disable={!selectedDistrict}
              />
            </View>
          </View>

          <Text style={styles.label}>Số nhà, tên đường</Text>
          <TextInput
            value={form.street}
            placeholder="VD: 12 Nguyễn Huệ"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            onChangeText={(value) => updateForm("street", value)}
          />
        </View>

        {form.customerType === "individual" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

            <View style={styles.twoColumns}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Ngày sinh</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.dateInput}
                  onPress={() => setOpenBirthPicker(true)}
                >
                  <Text style={[styles.dateText, !birthDate && { color: "#9CA3AF" }]}>
                    {formatDate(birthDate) || "Chọn ngày"}
                  </Text>
                  <Fontisto name="date" size={17} color={ColorMain} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Giới tính</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={genderOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Chọn giới tính"
                  placeholderStyle={styles.placeholder}
                  selectedTextStyle={styles.selectedText}
                  value={form.gender}
                  onChange={(item) =>
                    updateForm("gender", item.value as "male" | "female" | "other")
                  }
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thanh toán và ghi chú</Text>

          <View style={styles.twoColumns}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Hạn mức tín dụng</Text>
              <TextInput
                value={form.creditLimit}
                placeholder="0 đ"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                keyboardType="number-pad"
                onChangeText={(value) => updateForm("creditLimit", formatMoneyInput(value))}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Hạn thanh toán</Text>
              <TextInput
                value={form.paymentTerms}
                placeholder="VD: 30 ngày"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                onChangeText={(value) => updateForm("paymentTerms", value)}
              />
            </View>
          </View>

          <View style={styles.twoColumns}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Trạng thái</Text>
              <Dropdown
                style={styles.dropdown}
                data={statusOptions}
                labelField="label"
                valueField="value"
                placeholder="Chọn trạng thái"
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                value={form.status}
                onChange={(item) => updateForm("status", item.value as "active" | "inactive")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Nhãn khách hàng</Text>
              <Dropdown
                style={styles.dropdown}
                data={tagOptions}
                labelField="label"
                valueField="value"
                placeholder="Chọn nhãn"
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                value={form.tag}
                onChange={(item) => updateForm("tag", item.value)}
              />
            </View>
          </View>

          <Text style={styles.label}>Ghi chú</Text>
          <TextInput
            value={form.notes}
            placeholder="Thói quen mua hàng, lưu ý thanh toán..."
            placeholderTextColor="#9CA3AF"
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
            onChangeText={(value) => updateForm("notes", value)}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather name="check" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>Lưu khách hàng</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <DatePickerModal
        locale="vi"
        mode="single"
        visible={openBirthPicker}
        date={birthDate}
        onDismiss={() => setOpenBirthPicker(false)}
        onConfirm={(params) => {
          if (params.date) setBirthDate(params.date);
          setOpenBirthPicker(false);
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
    paddingBottom: 112,
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
  previewAvatar: {
    alignItems: "center",
    backgroundColor: "#EAF8F3",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  previewName: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "800",
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
  twoColumns: {
    flexDirection: "row",
    gap: 10,
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

export default CreateCustomerScreen;
