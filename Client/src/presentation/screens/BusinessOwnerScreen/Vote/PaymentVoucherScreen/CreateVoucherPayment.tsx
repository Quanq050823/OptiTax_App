import { ColorMain } from "@/src/presentation/components/colors";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { createVoucherPayment } from "@/src/services/API/voucherService";
import { PaymentVoucher } from "@/src/types/voucher";
import { Fontisto } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
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

const VoucherType = [
  { label: "Chi phí hàng tháng", value: "1" },
  { label: "Chi phí khác", value: "2" },
];

const CatePayVoucherData = [
  { label: "Chi phí nhân công", value: "1" },
  { label: "Chi phí điện", value: "2" },
  { label: "Chi phí nước", value: "3" },
  { label: "Chi phí viễn thông", value: "4" },
  { label: "Chi phí thuê bãi, mặt bằng kinh doanh", value: "5" },
  { label: "Chi phí quản lý (văn phòng phẩm, dụng cụ,..)", value: "6" },
  { label: "Chi phí khác (hội nghị, công tác phí, thanh lý,...)", value: "7" },
];

const GroupPeopleReceive = [
  { label: "Nhân viên", value: "1" },
  { label: "Đối tác", value: "2" },
  { label: "Khác", value: "3" },
];

const payMethod = [
  { label: "Tiền mặt", value: "1" },
  { label: "Chuyển khoản", value: "2" },
  { label: "Thẻ Visa", value: "3" },
  { label: "Thẻ Master", value: "4" },
  { label: "Thẻ ATM", value: "5" },
];
function CreateVoucherPayment() {
  const navigate = useAppNavigation();

  const [height, setHeight] = useState(40); // chiều cao mặc định
  const [dateStart, setDateStart] = useState<Date | undefined>();
  const [dateEnd, setDateEnd] = useState<Date | undefined>();
  const [openModalDateStart, setOpenModalDateStart] = useState(false);
  const [openModalDateEnd, setOpenModalDateEnd] = useState(false);
  const [voucher, setVoucher] = useState<PaymentVoucher>();
  console.log(voucher);

  const CreateVoucherPayment = async () => {
    try {
      const res = await createVoucherPayment(voucher as PaymentVoucher);
      Alert.alert("Tạo phiếu chi thành công");
      navigate.goBack();
    } catch (error) {
      Alert.alert("Tạo phiếu chi thất bại", " Vui lòng nhập đầy đủ thông tin");
    }
  };
  useEffect(() => {
    const date = new Date();
    setVoucher({
      ...voucher,
      date: date.toLocaleDateString("vi-VN"), // gán thẳng chuỗi đã format
    } as PaymentVoucher);
  }, []);
  return (
    <ScrollView>
      <View
        style={{ flex: 1, padding: 5, paddingBottom: 40, paddingVertical: 10 }}
      >
        <View style={styles.container}>
          <View>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Mã phiếu chi
            </Text>

            <TextInput placeholder="Mã tự động" style={styles.input} />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Loại phiếu chi <Text style={{ color: "red" }}>*</Text>
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={CatePayVoucherData}
              labelField="label"
              valueField="value"
              placeholder={"-- Chọn danh mục chi --"}
              placeholderStyle={{ color: "#9d9d9d" }}
              onChange={(item) => {
                setVoucher({
                  ...voucher,
                  category: String(item.value),
                } as PaymentVoucher);
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Giá trị chi <Text style={{ color: "red" }}>*</Text>
            </Text>

            <TextInput
              placeholder="0 đ"
              style={styles.input}
              keyboardType="number-pad"
              onChangeText={(text) =>
                setVoucher({
                  ...voucher,
                  amount: Number(text),
                } as PaymentVoucher)
              }
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Nhóm người nhận
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={GroupPeopleReceive}
              labelField="label"
              valueField="value"
              placeholder={"-- Chọn nhóm người nhận --"}
              placeholderStyle={{ color: "#9d9d9d" }}
              onChange={(item) => {}}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Tên người nhận
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={GroupPeopleReceive}
              labelField="label"
              valueField="value"
              placeholder={"-- Chọn người nhận --"}
              placeholderStyle={{ color: "#9d9d9d" }}
              onChange={(item) => {}}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Phương thức thanh toán
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={payMethod}
              labelField="label"
              valueField="value"
              placeholder={"-- Chọn người nhận --"}
              placeholderStyle={{ color: "#9d9d9d" }}
              onChange={(item) => {}}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>Mô tả</Text>

            <TextInput
              placeholder="Nhập mô tả"
              style={[styles.input, { minHeight: 50 }]}
              onContentSizeChange={(e) =>
                setHeight(e.nativeEvent.contentSize.height)
              }
              onChangeText={(text) =>
                setVoucher({
                  ...voucher,
                  description: String(text),
                } as PaymentVoucher)
              }
            />
          </View>
        </View>
        <View style={styles.container}>
          <View style={{ marginTop: 10 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Thời gian ghi nhận <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <TextInput
                defaultValue="24/09/2025"
                style={[styles.input, { flex: 1 }]}
                value={(dateStart ?? new Date()).toLocaleDateString("vi-VN")}
                onChange={(item) => {}}
              />
              <TouchableOpacity
                style={styles.btnSelectDate}
                onPress={() => setOpenModalDateStart(true)}
              >
                <Fontisto name="date" size={24} color="#9d9d9d" />
              </TouchableOpacity>
            </View>

            <DatePickerModal
              locale="vi"
              mode="single"
              visible={openModalDateStart}
              date={dateStart}
              onDismiss={() => setOpenModalDateStart(false)}
              onConfirm={(params) => {
                if (!params.date) return;

                const day = String(params.date.getDate()).padStart(2, "0");
                const month = String(params.date.getMonth() + 1).padStart(
                  2,
                  "0"
                );
                const year = params.date.getFullYear();
                const formattedDate = `${day}/${month}/${year}`; // "30/09/2025"
                setOpenModalDateStart(false);
                setDateStart(params.date);
                setVoucher({
                  ...voucher,
                  date: formattedDate, // gán thẳng chuỗi đã format
                } as PaymentVoucher);
              }}
            />
            <View style={{ marginTop: 20 }}>
              <Text style={{ marginBottom: 5, fontWeight: "700" }}>
                Chứng từ gốc
              </Text>

              <TextInput
                placeholder="Nhập mã chứng từ gốc"
                style={styles.input}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnSaveVoucher}
          onPress={CreateVoucherPayment}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Lưu phiếu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    paddingBottom: 40,
  },
  dropdown: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d1d1d1",
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#d1d1d1",
  },
  btnSelectDate: {
    position: "absolute",
    right: 10,
    top: 8,
  },
  btnSaveVoucher: {
    flex: 1,
    alignItems: "center",
    backgroundColor: ColorMain,
    padding: 15,
    borderRadius: 10,
  },
});
export default CreateVoucherPayment;
