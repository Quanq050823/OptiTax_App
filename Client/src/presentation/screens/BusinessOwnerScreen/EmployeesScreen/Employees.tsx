import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
  createEmployee,
  CreateEmployeePayload,
  deleteEmployee,
  getEmployeeList,
} from "@/src/services/API/employeeService";
import { Employee } from "@/src/types/employees";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { DatePickerModal } from "react-native-paper-dates";

type FilterKey = "all" | "active" | "inactive";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "active", label: "Đang làm" },
  { key: "inactive", label: "Tạm nghỉ" },
];

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
  if (!value) return "Chưa có ngày";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Chưa có ngày";
  return date.toLocaleDateString("vi-VN");
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

function EmployeesScreen() {
  const navigate = useAppNavigation();
  const [dataEmployees, setDataEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openHireDatePicker, setOpenHireDatePicker] = useState(false);
  const [hireDate, setHireDate] = useState(new Date());
  const [form, setForm] = useState({
    code: "",
    fullname: "",
    position: "",
    phone: "",
    email: "",
    address: "",
    status: "active" as "active" | "inactive",
    baseSalary: "",
    salaryType: "monthly" as "monthly" | "bi-weekly",
    note: "",
  });

  const fetchDataEmployees = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getEmployeeList();
      setDataEmployees(res.data ?? []);
    } catch (err: any) {
      Alert.alert(
        "Không tải được nhân viên",
        err?.message ?? "Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDataEmployees();
    }, [fetchDataEmployees])
  );

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    return dataEmployees.filter((item) => {
      const matchesFilter =
        activeFilter === "all" || item.status === activeFilter;

      if (!matchesFilter) return false;
      if (!query) return true;

      return [
        item.code,
        item.fullName,
        item.position,
        item.phoneNumber,
        item.email,
        item.address,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [activeFilter, dataEmployees, search]);

  const activeCount = useMemo(
    () => dataEmployees.filter((item) => item.status === "active").length,
    [dataEmployees]
  );

  const totalSalary = useMemo(
    () =>
      filteredEmployees.reduce(
        (sum, item) => sum + Number(item.base_salary ?? item.salary ?? 0),
        0
      ),
    [filteredEmployees]
  );

  const updateForm = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      code: "",
      fullname: "",
      position: "",
      phone: "",
      email: "",
      address: "",
      status: "active",
      baseSalary: "",
      salaryType: "monthly",
      note: "",
    });
    setHireDate(new Date());
  };

  const buildEmployeeCode = () => {
    if (form.code.trim()) return form.code.trim();
    const phoneSuffix = form.phone.replace(/\D/g, "").slice(-4);
    return `NV-${phoneSuffix || Date.now().toString().slice(-5)}`;
  };

  const handleCreateEmployee = async () => {
    if (!form.fullname.trim()) {
      Alert.alert("Thiếu họ tên", "Vui lòng nhập họ tên nhân viên.");
      return;
    }
    if (!form.position.trim()) {
      Alert.alert("Thiếu chức vụ", "Vui lòng nhập chức vụ của nhân viên.");
      return;
    }

    const payload: CreateEmployeePayload = {
      code: buildEmployeeCode(),
      fullname: form.fullname.trim(),
      position: form.position.trim(),
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      address: form.address.trim() || undefined,
      hire_date: hireDate.toISOString(),
      status: form.status,
      note: form.note.trim() || undefined,
      base_salary: Number(form.baseSalary.replace(/\D/g, "")),
      salary_info: {
        salary_type: form.salaryType,
      },
    };

    setSubmitting(true);
    try {
      await createEmployee(payload);
      Alert.alert("Thành công", "Nhân viên đã được tạo.");
      setModalVisible(false);
      resetForm();
      fetchDataEmployees();
    } catch (err: any) {
      Alert.alert(
        "Tạo nhân viên thất bại",
        err?.message ?? "Vui lòng kiểm tra thông tin và thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmployee = (item: Employee) => {
    Alert.alert("Xóa nhân viên", `Bạn có chắc muốn xóa ${item.fullName}?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteEmployee(item._id);
            fetchDataEmployees(true);
          } catch (err: any) {
            Alert.alert(
              "Xóa thất bại",
              err?.message ?? "Vui lòng thử lại sau."
            );
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Employee }) => {
    const isActive = item.status === "active";
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => navigate.navigate("EmployeeDetailScreen", { employee: item })}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.fullName)}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameText} numberOfLines={1}>
                {item.fullName}
              </Text>
              <Text style={styles.codeText} numberOfLines={1}>
                #{item.code} · {item.position || "Chưa có chức vụ"}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isActive ? "#EAF8F3" : "#F3F4F6" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isActive ? ColorMain : "#6B7280" },
                ]}
              >
                {isActive ? "Đang làm" : "Tạm nghỉ"}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Feather name="phone" size={12} color="#6B7280" />
              <Text style={styles.metaText}>
                {item.phoneNumber || "Chưa có SĐT"}
              </Text>
            </View>
            <View style={styles.metaChip}>
              <Feather name="calendar" size={12} color="#6B7280" />
              <Text style={styles.metaText}>{formatDate(item.hireDate)}</Text>
            </View>
          </View>

          <View style={styles.salaryRow}>
            <Text style={styles.salaryLabel}>Lương cơ bản</Text>
            <Text style={styles.salaryValue}>
              {formatCurrency(item.base_salary ?? item.salary)}
            </Text>
          </View>

          {!!item.address && (
            <Text style={styles.addressText} numberOfLines={2}>
              {item.address}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={(event) => {
            event.stopPropagation();
            handleDeleteEmployee(item);
          }}
        >
          <Feather name="trash-2" size={16} color="#EF4444" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Nhân viên</Text>
          <Text style={styles.subtitle}>
            {filteredEmployees.length} nhân viên đang hiển thị
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
        >
          <FontAwesome5 name="user-plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tổng nhân viên</Text>
          <Text style={styles.summaryValue}>{dataEmployees.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Đang làm</Text>
          <Text style={[styles.summaryValue, { color: ColorMain }]}>
            {activeCount}
          </Text>
        </View>
      </View>

      <View style={styles.salarySummary}>
        <View>
          <Text style={styles.summaryLabel}>Tổng lương cơ bản</Text>
          <Text style={styles.totalSalary}>{formatCurrency(totalSalary)}</Text>
        </View>
        <View style={styles.summaryIcon}>
          <MaterialCommunityIcons name="cash-multiple" size={24} color={ColorMain} />
        </View>
      </View>

      <View style={styles.searchBox}>
        <AntDesign name="search" size={16} color="#9CA3AF" />
        <TextInput
          placeholder="Tìm tên, mã NV, SĐT, chức vụ..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <AntDesign name="close" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {filters.map((item) => {
          const active = activeFilter === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setActiveFilter(item.key)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={ColorMain} size="large" />
          <Text style={styles.centerText}>Đang tải nhân viên...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredEmployees}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchDataEmployees(true)}
              colors={[ColorMain]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons
                name="account-hard-hat"
                size={58}
                color="#D1D5DB"
              />
              <Text style={styles.emptyTitle}>Chưa có nhân viên phù hợp</Text>
              <Text style={styles.emptyText}>
                Thêm nhân viên mới hoặc thử đổi bộ lọc tìm kiếm.
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.overlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIcon}>
                  <FontAwesome5 name="user-plus" size={18} color={ColorMain} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>Thêm nhân viên</Text>
                  <Text style={styles.modalSubtitle}>
                    Lưu hồ sơ làm việc và lương cơ bản
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <AntDesign name="close" size={20} color="#111827" />
                </TouchableOpacity>
              </View>

              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalForm}
              >
                <Text style={styles.sectionTitle}>Thông tin chính</Text>

                <Text style={styles.label}>Mã nhân viên</Text>
                <TextInput
                  value={form.code}
                  placeholder="Để trống để tự tạo mã"
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
                  placeholder="VD: Nguyễn Văn A"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  onChangeText={(value) => updateForm("fullname", value)}
                />

                <Text style={styles.label}>
                  Chức vụ <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  value={form.position}
                  placeholder="VD: Nhân viên bán hàng"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  onChangeText={(value) => updateForm("position", value)}
                />

                <View style={styles.twoColumns}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                      value={form.phone}
                      placeholder="0981234567"
                      placeholderTextColor="#9CA3AF"
                      style={styles.input}
                      keyboardType="phone-pad"
                      onChangeText={(value) => updateForm("phone", value)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
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
                </View>

                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={form.email}
                  placeholder="email@gmail.com"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(value) => updateForm("email", value)}
                />

                <Text style={styles.label}>Địa chỉ</Text>
                <TextInput
                  value={form.address}
                  placeholder="Nhập địa chỉ liên hệ"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  onChangeText={(value) => updateForm("address", value)}
                />

                <Text style={styles.sectionTitle}>Công việc và lương</Text>

                <Text style={styles.label}>Ngày vào làm</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.dateInput}
                  onPress={() => setOpenHireDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(hireDate)}</Text>
                  <Feather name="calendar" size={18} color={ColorMain} />
                </TouchableOpacity>

                <View style={styles.twoColumns}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Lương cơ bản</Text>
                    <TextInput
                      value={form.baseSalary}
                      placeholder="0 đ"
                      placeholderTextColor="#9CA3AF"
                      style={styles.input}
                      keyboardType="number-pad"
                      onChangeText={(value) =>
                        updateForm("baseSalary", formatMoneyInput(value))
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
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
                        updateForm(
                          "salaryType",
                          item.value as "monthly" | "bi-weekly"
                        )
                      }
                    />
                  </View>
                </View>

                <Text style={styles.label}>Ghi chú</Text>
                <TextInput
                  value={form.note}
                  placeholder="Ghi chú nội bộ"
                  placeholderTextColor="#9CA3AF"
                  style={[styles.input, styles.textArea]}
                  multiline
                  textAlignVertical="top"
                  onChangeText={(value) => updateForm("note", value)}
                />
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    resetForm();
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.primaryButton, submitting && styles.disabledButton]}
                  onPress={handleCreateEmployee}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Feather name="check" size={18} color="#fff" />
                      <Text style={styles.primaryButtonText}>Lưu</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <DatePickerModal
        locale="vi"
        mode="single"
        visible={openHireDatePicker}
        date={hireDate}
        onDismiss={() => setOpenHireDatePicker(false)}
        onConfirm={(params) => {
          if (params.date) setHireDate(params.date);
          setOpenHireDatePicker(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F6F8FA",
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
  },
  addButton: {
    alignItems: "center",
    backgroundColor: ColorMain,
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  summaryLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  summaryValue: {
    color: "#111827",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 3,
  },
  salarySummary: {
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
  totalSalary: {
    color: ColorMain,
    fontSize: 21,
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
  searchBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: "#111827",
    flex: 1,
    fontSize: 14,
    height: "100%",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  filterChip: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: ColorMain,
    borderColor: ColorMain,
  },
  filterText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    flexGrow: 1,
    paddingBottom: 34,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    padding: 14,
    position: "relative",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#EAF8F3",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  avatarText: {
    color: ColorMain,
    fontSize: 15,
    fontWeight: "800",
  },
  cardBody: {
    flex: 1,
    paddingRight: 24,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
  },
  nameText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  codeText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
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
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  metaChip: {
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  metaText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
  },
  salaryRow: {
    alignItems: "center",
    borderTopColor: "#F3F4F6",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
  },
  salaryLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
  },
  salaryValue: {
    color: ColorMain,
    fontSize: 14,
    fontWeight: "800",
  },
  addressText: {
    color: "#4B5563",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  deleteButton: {
    alignItems: "center",
    borderColor: "#FEE2E2",
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 62,
    width: 34,
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  centerText: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 10,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    textAlign: "center",
  },
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
  modalHeader: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  modalIcon: {
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
  modalForm: {
    padding: 14,
    paddingBottom: 20,
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
  twoColumns: {
    flexDirection: "row",
    gap: 10,
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
  modalFooter: {
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
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});

export default EmployeesScreen;
