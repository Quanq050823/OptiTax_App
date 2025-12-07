import { ColorMain } from "@/src/presentation/components/colors";
import {
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { useCallback, useEffect, useState } from "react";
import { CreateTaxVoucher, getTaxList } from "@/src/services/API/taxService";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import TagItem from "@/src/presentation/components/TagItem";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ModalAddVoucherTax from "@/src/presentation/components/Modal/ModalAddVoucherTax";
import { AddTax, TaxItem } from "@/src/types/tax";
import { DatePickerModal, registerTranslation } from "react-native-paper-dates";

// Đăng ký ngôn ngữ tiếng Việt cho date picker
registerTranslation("vi", {
  saveLabel: "Chọn",
  selectSingle: "Chọn ngày",
  selectMultiple: "Chọn nhiều ngày",
  selectRange: "Chọn khoảng ngày",
  notAccordingToDateFormat: (inputFormat) =>
    `Định dạng ngày nên là ${inputFormat}`,
  mustBeHigherThan: (date) => `Sau ngày ${date}`,
  mustBeLowerThan: (date) => `Trước ngày ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Trong khoảng ${startDate} - ${endDate}`,
  dateIsDisabled: "Ngày này không hợp lệ",
  previous: "Trước",
  next: "Sau",
  typeInDate: "Nhập ngày",
  pickDateFromCalendar: "Chọn ngày từ lịch",
  close: "Đóng",
});

function TaxScreen() {
  const [dataTaxGet, setDataTaxGet] = useState<TaxItem[]>([]);
  const [filteredList, setFilteredList] = useState<TaxItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newVoucherTax, setNewVoucherTax] = useState<AddTax>({
    code: "",
    date: new Date().toString(),
    description: "",
    amount: 0,
    note: "",
  });

  const [filterType, setFilterType] = useState<"day" | "month" | "year">(
    "month"
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);

  // 🎯 Hàm lọc theo ngày / tháng / năm
  const filterTaxByDate = (
    list: TaxItem[],
    type: "day" | "month" | "year",
    selectedDate: Date
  ): TaxItem[] => {
    return list.filter((item) => {
      const taxDate = new Date(item.date);

      if (type === "day") {
        return (
          taxDate.getDate() === selectedDate.getDate() &&
          taxDate.getMonth() === selectedDate.getMonth() &&
          taxDate.getFullYear() === selectedDate.getFullYear()
        );
      }

      if (type === "month") {
        return (
          taxDate.getMonth() === selectedDate.getMonth() &&
          taxDate.getFullYear() === selectedDate.getFullYear()
        );
      }

      if (type === "year") {
        return taxDate.getFullYear() === selectedDate.getFullYear();
      }

      return true;
    });
  };

  // 📅 Khi nhấn nút lọc
  const handleFilter = async () => {
    setLoadingFetch(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!selectedDate) return; // chưa chọn ngày thì thoát sớm
      const result = filterTaxByDate(dataTaxGet, filterType, selectedDate);
      setFilteredList(result);
      setOpenFilter(false);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lọc dữ liệu, vui lòng thử lại!");
    } finally {
      setLoadingFetch(false);
    }
  };

  const fetchDataTaxList = async () => {
    setLoadingFetch(true);
    try {
      const data = await getTaxList();
      setDataTaxGet(data.data);
      setFilteredList(data.data);
    } catch (err) {
      return;
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchDataTaxList();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDataTaxList();
    setRefreshing(false);
  }, []);

  // 📅 Xử lý chọn ngày từ DatePickerModal
  const onConfirmDate = ({ date }: { date: Date }) => {
    setSelectedDate(date);
    setOpenDatePicker(false);
    const result = filterTaxByDate(dataTaxGet, filterType, date);
    setFilteredList(result);
  };

  const handleCreateVoucherTax = async () => {
    if (!newVoucherTax.code || !newVoucherTax.amount) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin hợp lệ.");
      return;
    }
    try {
      await CreateTaxVoucher(newVoucherTax);
      fetchDataTaxList();
      setVisible(false);
    } catch {
      Alert.alert("Không thể tạo", "Vui lòng kiểm tra lại hoặc thử lại sau.");
    }
  };

  const renderItem = ({ item }: { item: TaxItem }) => (
    <View style={styles.card}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          backgroundColor: "#fff",
          padding: 10,
        }}
      >
        <Text style={styles.title}>Mã phiếu: {item.code}</Text>
        <Text style={styles.subText}>
          📄
          <Text style={{ fontStyle: "italic" }}>
            {item.description || "Không có mô tả"}
          </Text>
        </Text>
        {item.note ? (
          <Text style={styles.subText}>📝 Ghi chú: {item.note}</Text>
        ) : null}
        <Text style={[styles.subText, styles.amount]}>
          💰 {item.amount.toLocaleString("vi-VN")} ₫
        </Text>
      </View>
      <TagItem content={new Date(item.date).toLocaleDateString("vi-VN")} />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ModalAddVoucherTax
        visible={visible}
        setVisible={setVisible}
        newVoucherTax={newVoucherTax}
        setNewVoucherTax={setNewVoucherTax}
        onAddVoucherTax={handleCreateVoucherTax}
      />

      <LoadingScreen visible={refreshing || loadingFetch} />

      <View
        style={{
          paddingVertical: 10,
          alignItems: "flex-start",
          flexDirection: "row",
          justifyContent: "space-between",
          shadowColor: "#9d9d9d",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
        }}
      >
        {/* Nút thêm phiếu */}
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={() => setVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={{ color: "#fff" }}>Thêm phiếu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnAdd,
            {
              backgroundColor: "#fff",
              borderColor: ColorMain,
              borderWidth: 0.5,
            },
          ]}
          onPress={() => setOpenFilter(true)}
        >
          {selectedDate ? (
            <>
              <FontAwesome name="filter" size={24} color={ColorMain} />
              <Text style={{ color: ColorMain }}>
                {selectedDate
                  ? selectedDate.toLocaleDateString("vi-VN")
                  : "Lọc"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedDate(null);
                  fetchDataTaxList();
                }}
              >
                <MaterialIcons name="cancel" size={24} color={ColorMain} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <FontAwesome name="filter" size={24} color={ColorMain} />
              <Text style={{ color: ColorMain }}>Lọc</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Danh sách phiếu thuế */}
      {filteredList.length === 0 && !loadingFetch ? (
        <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>
          <Text style={{ fontSize: 16, color: "#888" }}>Không có dữ liệu</Text>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#FF6B00"]}
              tintColor="#FF6B00"
              title="Đang tải dữ liệu..."
            />
          }
        />
      )}

      {/* Modal chọn ngày */}

      <Modal
        visible={openFilter}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
        style={{ zIndex: 100 }}
      >
        <Pressable style={styles.overlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setOpenFilter(false)}
              style={{ position: "absolute", right: 10, top: 10 }}
            >
              <MaterialIcons name="cancel" size={24} color={ColorMain} />
            </TouchableOpacity>
            {/* Bộ lọc */}
            <View style={{ marginTop: 10, alignItems: "center" }}>
              <Text style={{ fontSize: 16 }}>Chọn kiểu lọc:</Text>
              <View style={styles.filterRow}>
                {["day", "month", "year"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterButton,
                      filterType === type && styles.filterButtonActive,
                    ]}
                    onPress={() => setFilterType(type as any)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        filterType === type && { color: "#fff" },
                      ]}
                    >
                      {type === "day"
                        ? "Ngày"
                        : type === "month"
                        ? "Tháng"
                        : "Năm"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.filterRow}>
                <Text style={styles.label}>Ngày chọn:</Text>
                <Button
                  title={
                    selectedDate
                      ? selectedDate.toLocaleDateString("vi-VN")
                      : "Chọn ngày"
                  }
                  onPress={() => {
                    setOpenFilter(false);
                    setTimeout(() => setOpenDatePicker(true), 300);
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  handleFilter(); // thực hiện lọc
                }}
                style={[
                  styles.btnAdd,
                  { paddingHorizontal: 20, marginTop: 20 },
                ]}
              >
                <Text style={{ color: "#fff" }}>Áp dụng lọc</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      <DatePickerModal
        locale="vi"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={selectedDate ?? undefined}
        onConfirm={onConfirmDate as any}
        saveLabel="Chọn"
        label="Chọn ngày lọc"
      />

      <LoadingScreen visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    height: 300,
    padding: 10,
    paddingTop: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    color: ColorMain,
    fontWeight: "700",
  },
  btnAdd: {
    backgroundColor: ColorMain,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#222",
  },
  subText: {
    fontSize: 15,
    color: "#000",
    marginTop: 6,
  },
  amount: {
    fontWeight: "600",
    color: "#2B8A3E",
    textAlign: "right",
    fontSize: 17,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 10,
    marginTop: 20,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: ColorMain,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: ColorMain,
  },
  filterText: {
    color: ColorMain,
    fontWeight: "600",
  },
});

export default TaxScreen;
