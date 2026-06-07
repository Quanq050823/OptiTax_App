import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
  CreateEmployeePayload,
  updateEmployee,
} from "@/src/services/API/employeeService";
import { Employee } from "@/src/types/employees";
import { RootStackParamList } from "@/src/types/route";
import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
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

type EmployeeDetailRoute = RouteProp<RootStackParamList, "EmployeeDetailScreen">;

const statusOptions = [
  { label: "Đang làm", value: "active" },
  { label: "Tạm nghỉ", value: "inactive" },
];

const salaryTypeOptions = [
  { label: "Theo tháng", value: "monthly" },
  { label: "Hai tuần/lần", value: "bi-weekly" },
];

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value ?? 0));

const formatMoneyInput = (value: string) =>
  value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const formatDate = (value?: string | Date) => {
  if (!value) return "Chưa có";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa có";
  return date.toLocaleDateString("vi-VN");
};

const getDateValue = (value?: string | Date) => {
  if (!value) return new Date();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const getInitials = (name?: string) => {
  if (!name?.trim()) return "NV";
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

const getSalaryTypeLabel = (value?: string) =>
  value === "bi-weekly" ? "Hai tuần/lần" : "Theo tháng";

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || "Chưa có"}</Text>
  </View>
);

function EmployeeDetailScreen() {
  const navigate = useAppNavigation();
  const { params } = useRoute<EmployeeDetailRoute>();
  const [employee, setEmployee] = useState<Employee>(params.employee);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openHireDatePicker, setOpenHireDatePicker] = useState(false);
  const [openBirthDatePicker, setOpenBirthDatePicker] = useState(false);

  const [form, setForm] = useState({
    code: employee.code ?? "",
    fullname: employee.fullName ?? employee.fullname ?? "",
    position: employee.position ?? "",
    phone: employee.phoneNumber ?? employee.phone ?? "",
    email: employee.email ?? "",
    address: employee.address ?? "",
    status: (employee.status === "inactive" ? "inactive" : "active") as
      | "active"
      | "inactive",
    baseSalary: employee.base_salary
      ? formatMoneyInput(String(employee.base_salary))
      : "",
    salaryType: (employee.salary_info?.salary_type ?? "monthly") as
      | "monthly"
      | "bi-weekly",
    note: employee.note ?? "",
    hireDate: getDateValue(employee.hireDate),
    dateOfBirth: employee.dateOfBirth
      ? getDateValue(employee.dateOfBirth)
      : undefined,
  });

  const isActive = employee.status === "active";
  const salaryNumber = useMemo(
    () => Number(form.baseSalary.replace(/\D/g, "")),
    [form.baseSalary]
  );

  const updateForm = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetFormFromEmployee = () => {
    setForm({
      code: employee.code ?? "",
      fullname: employee.fullName ?? employee.fullname ?? "",
      position: employee.position ?? "",
      phone: employee.phoneNumber ?? employee.phone ?? "",
      email: employee.email ?? "",
      address: employee.address ?? "",
      status: employee.status === "inactive" ? "inactive" : "active",
      baseSalary: employee.base_salary
        ? formatMoneyInput(String(employee.base_salary))
        : "",
      salaryType: (employee.salary_info?.salary_type ?? "monthly") as
        | "monthly"
        | "bi-weekly",
      note: employee.note ?? "",
      hireDate: getDateValue(employee.hireDate),
      dateOfBirth: employee.dateOfBirth
        ? getDateValue(employee.dateOfBirth)
        : undefined,
    });
  };

  const handleCancelEdit = () => {
    resetFormFromEmployee();
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!form.fullname.trim()) {
      Alert.alert("Thiếu họ tên", "Vui lòng nhập họ tên nhân viên.");
      return;
    }
    if (!form.position.trim()) {
      Alert.alert("Thiếu chức vụ", "Vui lòng nhập chức vụ của nhân viên.");
      return;
    }

    const payload: Partial<CreateEmployeePayload> = {
      code: form.code.trim(),
      fullname: form.fullname.trim(),
      position: form.position.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      address: form.address.trim() || undefined,
      hire_date: form.hireDate.toISOString(),
      date_of_birth: form.dateOfBirth?.toISOString(),
      status: form.status,
      base_salary: salaryNumber,
      note: form.note.trim() || undefined,
      salary_info: {
        salary_type: form.salaryType,
      },
    };

    setSaving(true);
    try {
      const updated = await updateEmployee(employee._id, payload);
      setEmployee(updated);
      setIsEditing(false);
      Alert.alert("Đã lưu", "Thông tin nhân viên đã được cập nhật.");
    } catch (error: any) {
      Alert.alert(
        "Cập nhật thất bại",
        error?.message ?? "Vui lòng kiểm tra thông tin và thử lại."
      );
    } finally {
      setSaving(false);
    }
  };

  const renderViewMode = () => (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome5 name="address-book" size={15} color={ColorMain} />
          <Text style={styles.sectionTitle}>Liên hệ</Text>
        </View>
        <InfoRow label="Số điện thoại" value={employee.phoneNumber} />
        <InfoRow label="Email" value={employee.email} />
        <InfoRow label="Địa chỉ" value={employee.address} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="briefcase" size={16} color={ColorMain} />
          <Text style={styles.sectionTitle}>Công việc</Text>
        </View>
        <InfoRow label="Mã nhân viên" value={employee.code} />
        <InfoRow label="Chức vụ" value={employee.position} />
        <InfoRow label="Ngày vào làm" value={formatDate(employee.hireDate)} />
        <InfoRow label="Ngày sinh" value={formatDate(employee.dateOfBirth)} />
        <InfoRow
          label="Hình thức lương"
          value={getSalaryTypeLabel(employee.salary_info?.salary_type)}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="file-text" size={16} color={ColorMain} />
          <Text style={styles.sectionTitle}>Ghi chú</Text>
        </View>
        <Text style={styles.noteText}>{employee.note || "Chưa có ghi chú"}</Text>
      </View>
    </>
  );

  const renderEditMode = () => (
    <>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="edit-3" size={16} color={ColorMain} />
          <Text style={styles.sectionTitle}>Thông tin chính</Text>
        </View>

        <Text style={styles.label}>Mã nhân viên</Text>
        <TextInput
          value={form.code}
          placeholder="Mã nhân viên"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          autoCapitalize="characters"
          onChangeText={(value) => updateForm("code", value)}
        />

        <Text style={styles.label}>
          Họ và tên <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          value={form.fullname}
          placeholder="Họ và tên"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          onChangeText={(value) => updateForm("fullname", value)}
        />

        <Text style={styles.label}>
          Chức vụ <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          value={form.position}
          placeholder="Chức vụ"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          onChangeText={(value) => updateForm("position", value)}
        />

        <Text style={styles.label}>Trạng thái</Text>
        <Dropdown
          style={styles.dropdown}
          data={statusOptions}
          labelField="label"
          valueField="value"
          value={form.status}
          placeholder="Chọn trạng thái"
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          onChange={(item) =>
            updateForm("status", item.value as "active" | "inactive")
          }
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome5 name="address-book" size={15} color={ColorMain} />
          <Text style={styles.sectionTitle}>Liên hệ</Text>
        </View>

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          value={form.phone}
          placeholder="Số điện thoại"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          keyboardType="phone-pad"
          onChangeText={(value) => updateForm("phone", value)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={form.email}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(value) => updateForm("email", value)}
        />

        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          value={form.address}
          placeholder="Địa chỉ"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          onChangeText={(value) => updateForm("address", value)}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="briefcase" size={16} color={ColorMain} />
          <Text style={styles.sectionTitle}>Công việc và lương</Text>
        </View>

        <Text style={styles.label}>Ngày vào làm</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.dateInput}
          onPress={() => setOpenHireDatePicker(true)}
        >
          <Text style={styles.dateText}>{formatDate(form.hireDate)}</Text>
          <Feather name="calendar" size={18} color={ColorMain} />
        </TouchableOpacity>

        <Text style={styles.label}>Ngày sinh</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.dateInput}
          onPress={() => setOpenBirthDatePicker(true)}
        >
          <Text
            style={[styles.dateText, !form.dateOfBirth && { color: "#9CA3AF" }]}
          >
            {form.dateOfBirth ? formatDate(form.dateOfBirth) : "Chọn ngày"}
          </Text>
          <Feather name="calendar" size={18} color={ColorMain} />
        </TouchableOpacity>

        <Text style={styles.label}>Lương cơ bản</Text>
        <TextInput
          value={form.baseSalary}
          placeholder="0 đ"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          keyboardType="number-pad"
          onChangeText={(value) => updateForm("baseSalary", formatMoneyInput(value))}
        />

        <Text style={styles.label}>Hình thức lương</Text>
        <Dropdown
          style={styles.dropdown}
          data={salaryTypeOptions}
          labelField="label"
          valueField="value"
          value={form.salaryType}
          placeholder="Chọn hình thức"
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          onChange={(item) =>
            updateForm("salaryType", item.value as "monthly" | "bi-weekly")
          }
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="file-text" size={16} color={ColorMain} />
          <Text style={styles.sectionTitle}>Ghi chú</Text>
        </View>
        <TextInput
          value={form.note}
          placeholder="Ghi chú nội bộ"
          placeholderTextColor="#9CA3AF"
          style={[styles.input, styles.textArea]}
          multiline
          textAlignVertical="top"
          onChangeText={(value) => updateForm("note", value)}
        />
      </View>
    </>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate.goBack()}>
          <Feather name="arrow-left" size={20} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {isEditing ? "Sửa nhân viên" : "Chi tiết nhân viên"}
          </Text>
          <Text style={styles.subtitle}>#{employee.code}</Text>
        </View>
        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Feather name="edit-2" size={16} color="#fff" />
            <Text style={styles.editButtonText}>Sửa</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(employee.fullName)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nameText}>{employee.fullName}</Text>
            <Text style={styles.positionText}>{employee.position || "Chưa có chức vụ"}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isActive ? "#EAF8F3" : "#F3F4F6" },
            ]}
          >
            <Text style={[styles.statusText, { color: isActive ? ColorMain : "#6B7280" }]}>
              {isActive ? "Đang làm" : "Tạm nghỉ"}
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>
              {isEditing ? "Lương sau chỉnh sửa" : "Lương cơ bản"}
            </Text>
            <Text style={styles.salaryValue}>
              {formatCurrency(
                isEditing
                  ? salaryNumber
                  : employee.base_salary ?? employee.salary
              )}
            </Text>
          </View>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons name="cash-multiple" size={24} color={ColorMain} />
          </View>
        </View>

        {isEditing ? renderEditMode() : renderViewMode()}
      </ScrollView>

      {isEditing && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleCancelEdit}>
            <Text style={styles.secondaryButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.disabledButton]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="check" size={18} color="#fff" />
                <Text style={styles.primaryButtonText}>Lưu thay đổi</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      <DatePickerModal
        locale="vi"
        mode="single"
        visible={openHireDatePicker}
        date={form.hireDate}
        onDismiss={() => setOpenHireDatePicker(false)}
        onConfirm={(params) => {
          if (params.date) updateForm("hireDate", params.date);
          setOpenHireDatePicker(false);
        }}
      />
      <DatePickerModal
        locale="vi"
        mode="single"
        visible={openBirthDatePicker}
        date={form.dateOfBirth}
        onDismiss={() => setOpenBirthDatePicker(false)}
        onConfirm={(params) => {
          if (params.date) updateForm("dateOfBirth", params.date);
          setOpenBirthDatePicker(false);
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
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 14,
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
  editButton: {
    alignItems: "center",
    backgroundColor: ColorMain,
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
  },
  content: {
    padding: 14,
    paddingBottom: 110,
    paddingTop: 0,
  },
  profileCard: {
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
  avatar: {
    alignItems: "center",
    backgroundColor: "#EAF8F3",
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  avatarText: {
    color: ColorMain,
    fontSize: 16,
    fontWeight: "800",
  },
  nameText: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },
  positionText: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  summaryCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 14,
  },
  summaryLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  salaryValue: {
    color: ColorMain,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 3,
  },
  summaryIcon: {
    alignItems: "center",
    backgroundColor: "#EAF8F3",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  section: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  infoRow: {
    borderTopColor: "#F3F4F6",
    borderTopWidth: 1,
    paddingVertical: 11,
  },
  infoLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
  },
  infoValue: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  noteText: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
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
  placeholder: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  selectedText: {
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
    bottom: 0,
    flexDirection: "row",
    gap: 10,
    left: 0,
    padding: 14,
    position: "absolute",
    right: 0,
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
    flex: 1.35,
    flexDirection: "row",
    gap: 8,
    height: 48,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});

export default EmployeeDetailScreen;
