import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import { syncDataInvoiceIn } from "@/src/types/syncData";
import {
  AntDesign,
  Fontisto,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, PaperProvider, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import CaptchaView from "../CaptchaView";
import { LinearGradient } from "expo-linear-gradient";

type ModalOpen = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSyncInvoiceOut: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sourceImg?: string;
  setCapchacode: React.Dispatch<React.SetStateAction<string>>;
  capchaCode: string;
  onGetCaptcha: () => Promise<void>;
  selectDateCpn: boolean;
  setSelecDateCpn: React.Dispatch<React.SetStateAction<boolean>>;
};
function ModalSynchronized({
  visible,
  setVisible,
  onSyncInvoiceOut,
  loading,
  setLoading,
  sourceImg,
  setCapchacode,
  capchaCode,
  onGetCaptcha,
  selectDateCpn,
  setSelecDateCpn,
}: ModalOpen) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [open, setOpen] = useState<"start" | "end" | null>(null);
  const onDismiss = () => {
    setVisible(false);
  };
  const [range, setRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});
  const isDisableSync = !startDate || !endDate || loading;

  const getMonthRange = (date: Date) => {
    return {
      startDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    };
  };

  const onConfirm = ({ date }: { date?: Date }) => {
    if (!date || !open) return;

    if (open === "start") {
      setStartDate(date);
      setEndDate(undefined); // reset end khi đổi tháng
    } else {
      if (!startDate) return;

      const { start, end } = getMonthRange(startDate);
      if (date < start || date > end) return;

      setEndDate(date);
    }

    setOpen(null);
  };

  const validRange = range.startDate
    ? getMonthRange(range.startDate)
    : undefined;

  const formatDate = (date?: Date) =>
    date
      ? `${date.getDate().toString().padStart(2, "0")}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`
      : "";

  const getEndDateRange = (startDate: Date) => {
    const today = new Date();

    const monthStart = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      1
    );

    const monthEnd = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    );

    // nếu tháng đang chọn là tháng hiện tại
    const maxEnd = monthEnd > today ? today : monthEnd;

    return {
      startDate, // không trước ngày bắt đầu
      endDate: maxEnd, // không sau hôm nay & không vượt tháng
    };
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <LoadingScreen visible={loading} />
          {selectDateCpn ? (
            <>
              {/* <View style={styles.grabber} /> */}
              <View>
                <Text style={{ fontSize: 17, fontWeight: "500" }}>
                  Xác thực mã bên dưới
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 30 }}>
                <CaptchaView captchaImage={sourceImg} />
                <TextInput
                  placeholder="Nhập mã capcha..."
                  style={styles.input}
                  value={capchaCode}
                  onChangeText={(value) => setCapchacode(value)}
                />
              </View>
              <MaterialIcons
                name="cancel"
                size={24}
                color={ColorMain}
                style={{ position: "absolute", right: 20, top: 20 }}
                onPress={() => {
                  setVisible(false);
                  setSelecDateCpn(false);
                }}
              />
              <LinearGradient
                colors={["#4dbf99ff", "#6A7DB3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 3 }}
                style={styles.btnShow}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "transparent",
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    paddingVertical: 15,
                  }}
                  onPress={onSyncInvoiceOut}
                >
                  <Text style={{ color: "#fff" }}>Đồng bộ hóa đơn đầu vào</Text>
                </TouchableOpacity>
              </LinearGradient>
            </>
          ) : (
            <>
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={{ fontSize: 17, fontWeight: "500" }}>
                  Ngày lập hóa đơn<Text style={{ color: "red" }}>*</Text>
                </Text>
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: -10,
                    padding: 10,
                    top: -20,
                  }}
                  onPress={() => setVisible(false)}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <DatePickerModal
                locale="vi"
                mode="single"
                visible={!!open}
                date={open === "start" ? startDate : endDate}
                onConfirm={onConfirm}
                onDismiss={() => setOpen(null)}
                validRange={
                  open === "end" && startDate
                    ? getEndDateRange(startDate)
                    : undefined
                }
              />
              <View style={{ flexDirection: "row", gap: 50, marginTop: 30 }}>
                {/* START DATE */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: "#888" }}>Từ ngày</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      value={formatDate(startDate)}
                      placeholder="dd/mm/yyyy"
                      underlineColor="#ccc"
                      activeUnderlineColor="#3F4E87"
                      editable={false}
                      style={styles.input}
                    />
                    <MaterialIcons
                      name="date-range"
                      size={22}
                      color="#555"
                      onPress={() => setOpen("start")}
                    />
                  </View>
                </View>

                {/* END DATE */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: "#888" }}>Đến ngày</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      value={formatDate(endDate)}
                      placeholder="dd/mm/yyyy"
                      underlineColor="#ccc"
                      activeUnderlineColor="#3F4E87"
                      editable={false}
                      style={styles.input}
                    />
                    <MaterialIcons
                      name="date-range"
                      size={22}
                      color="#555"
                      onPress={() => startDate && setOpen("end")}
                    />
                  </View>
                </View>
              </View>
              <LinearGradient
                colors={
                  isDisableSync
                    ? ["#bdbdbd", "#bdbdbd"] // màu xám khi disable
                    : ["#4dbf99ff", "#6A7DB3"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 3 }}
                style={styles.btnShow}
              >
                <TouchableOpacity
                  disabled={isDisableSync}
                  onPress={async () => {
                    await onGetCaptcha();
                    setSelecDateCpn(true);
                  }}
                  style={{ backgroundColor: "transparent" }}
                >
                  <Text style={{ color: "#fff", fontWeight: "500" }}>
                    {loading ? (
                      <ActivityIndicator
                        size="small"
                        color="#fff"
                        style={{ marginLeft: 6 }}
                      />
                    ) : (
                      "Đồng bộ"
                    )}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: "tomato",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnShow: {
    width: "95%",
    backgroundColor: ColorMain,
    marginTop: 20,
    alignSelf: "center",
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fafafaff",
    paddingHorizontal: 10,
    borderRadius: 8,
    width: "95%",
    minHeight: 200,
    alignItems: "center",
    paddingVertical: 20,
    position: "relative",
  },
  grabber: {
    alignSelf: "center",
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: ColorMain,
    marginBottom: 8,
  },

  label: {
    color: "#000000ff",
    fontWeight: "500",
    marginTop: 30,
    fontSize: 15,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
});
export default ModalSynchronized;
