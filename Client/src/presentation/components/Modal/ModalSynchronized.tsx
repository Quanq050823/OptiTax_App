import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import { syncDataInvoiceIn } from "@/src/types/syncData";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, PaperProvider } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import CaptchaView from "../CaptchaView";
import { LinearGradient } from "expo-linear-gradient";

type ModalOpen = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSyncDataInvoiceIn: React.Dispatch<React.SetStateAction<syncDataInvoiceIn>>;
  onSyncInvoiceIn: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  sourceImg?: string;
  setCapchacode: React.Dispatch<React.SetStateAction<string>>;
  capchaCode: string;
};
function ModalSynchronized({
  visible,
  setVisible,
  setSyncDataInvoiceIn,
  onSyncInvoiceIn,
  loading,
  setLoading,
  sourceImg,
  setCapchacode,
  capchaCode,
}: ModalOpen) {
  const [dateStart, setDateStart] = useState<Date | undefined>();
  const [dateEnd, setDateEnd] = useState<Date | undefined>();
  const [openModalDateStart, setOpenModalDateStart] = useState(false);
  const [openModalDateEnd, setOpenModalDateEnd] = useState(false);
  const onDismiss = () => {
    setVisible(false);
  };

  const onConfirm = (params: { date: Date }) => {
    setVisible(false);
    setDateStart(params.date);
    console.log("Ngày được chọn:", params.date);
  };

  function formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* <View style={styles.grabber} /> */}
          <LoadingScreen visible={loading} />
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
            onPress={() => setVisible(false)}
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
              onPress={onSyncInvoiceIn}
            >
              <Text style={{ color: "#fff" }}>Đồng bộ hóa đơn đầu vào</Text>
            </TouchableOpacity>
          </LinearGradient>
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
  input: {
    height: 50,
    padding: 10,
    borderRadius: 5,

    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c0c0c0ff",
  },
  label: {
    color: "#000000ff",
    fontWeight: "500",
    marginTop: 30,
    fontSize: 15,
    textAlign: "center",
  },
});
export default ModalSynchronized;
