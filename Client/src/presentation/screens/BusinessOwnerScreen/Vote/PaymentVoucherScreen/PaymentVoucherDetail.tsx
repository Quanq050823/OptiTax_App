import { ColorMain } from "@/src/presentation/components/colors";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { RootStackParamList } from "@/src/types/route";
import { Fontisto } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
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

type PaymentVoucherDetailRouteProp = RouteProp<
  RootStackParamList,
  "PaymentVoucherDetail"
>;
function PaymentVoucherDetail() {
  const route = useRoute<PaymentVoucherDetailRouteProp>();
  const { voucher } = route.params;
  console.log(voucher);

  const [height, setHeight] = useState(40); // chiều cao mặc định
  const [dateStart, setDateStart] = useState<Date | undefined>();
  const [dateEnd, setDateEnd] = useState<Date | undefined>();
  const [openModalDateStart, setOpenModalDateStart] = useState(false);
  const [openModalDateEnd, setOpenModalDateEnd] = useState(false);

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

            <TextInput
              value={voucher._id}
              style={styles.input}
              editable={false}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Loại phiếu chi
            </Text>
            <Dropdown
              style={styles.dropdown}
              data={CatePayVoucherData}
              labelField="label"
              valueField="value"
              placeholder={voucher.type}
              placeholderStyle={{ color: "#545454ff" }}
              onChange={(item) => {}}
              disable
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Giá trị chi
            </Text>

            <TextInput
              placeholder="0 đ"
              style={styles.input}
              keyboardType="number-pad"
              value={voucher.amount.toString()}
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
              placeholder={voucher.recipientGroup}
              placeholderStyle={{ color: "#545454ff" }}
              onChange={(item) => {}}
              disable
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
              placeholder={voucher.recipientName}
              placeholderStyle={{ color: "#545454ff" }}
              onChange={(item) => {}}
              disable
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
              placeholder={voucher.paymentMethod}
              placeholderStyle={{ color: "#545454ff" }}
              onChange={(item) => {}}
              disable
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
              editable={false}
              value={voucher.description}
            />
          </View>
        </View>
        <View style={styles.container}>
          <View style={{ marginTop: 10 }}>
            <Text style={{ marginBottom: 5, fontWeight: "700" }}>
              Thời gian ghi nhận
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
                value={voucher.recordDate}
                editable={false}
              />
              <TouchableOpacity style={styles.btnSelectDate}>
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
                setOpenModalDateStart(false);
                setDateStart(params.date);
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
        <TouchableOpacity style={styles.btnSaveVoucher}>
          <Text style={{ color: "#fff", fontWeight: "600" }}>Huỷ phiếu</Text>
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
    backgroundColor: "#c96f6fff",
    padding: 15,
    borderRadius: 10,
  },
});
export default PaymentVoucherDetail;
