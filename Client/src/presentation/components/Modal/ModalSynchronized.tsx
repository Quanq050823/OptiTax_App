import { ColorMain } from "@/src/presentation/components/colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, PaperProvider } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

type ModalOpen = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
function ModalSynchronized({ visible, setVisible }: ModalOpen) {
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

          <View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: ColorMain,
                marginBottom: 20,
              }}
            >
              Đồng bộ theo ngày
            </Text>
          </View>
          <MaterialIcons
            name="cancel"
            size={24}
            color={ColorMain}
            style={{ position: "absolute", right: 20, top: 20 }}
            onPress={() => setVisible(false)}
          />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              paddingHorizontal: 20,
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "50%" }}>
              <Text style={styles.label}>Từ ngày</Text>
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <Button
                  mode="outlined"
                  onPress={() => setOpenModalDateStart(true)}
                  style={{ marginVertical: 10, borderRadius: 10 }}
                >
                  <Text style={{ color: ColorMain }}>
                    {dateStart
                      ? dateStart.toLocaleDateString("vi-VN")
                      : "Chọn ngày"}
                  </Text>
                </Button>
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
            </View>

            <View style={{ width: "50%" }}>
              <Text style={styles.label}>Đến ngày</Text>
              <View
                style={{
                  alignItems: "center",
                  marginVertical: 10,
                  width: "100%",
                }}
              >
                <Button
                  mode="outlined"
                  onPress={() => setOpenModalDateEnd(true)}
                  style={{ marginVertical: 10, borderRadius: 10 }}
                >
                  <Text style={{ color: ColorMain }}>
                    {dateEnd
                      ? dateEnd.toLocaleDateString("vi-VN")
                      : "Chọn ngày"}
                  </Text>
                </Button>
              </View>

              <DatePickerModal
                locale="vi"
                mode="single"
                visible={openModalDateEnd}
                date={dateEnd}
                onDismiss={() => setOpenModalDateEnd(false)}
                onConfirm={(params) => {
                  setOpenModalDateEnd(false);
                  setDateEnd(params.date);
                }}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: ColorMain,
              paddingHorizontal: 20,
              borderRadius: 10,
              marginTop: 20,
              paddingVertical: 15,
            }}
          >
            <Text style={{ color: "#fff" }}>Đồng bộ</Text>
          </TouchableOpacity>
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
    width: "95%",
    height: 50,
    padding: 10,
    borderRadius: 5,
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e7e7e7ff",
  },
  label: {
    color: "#5a5a5aff",
    fontWeight: "500",
    marginTop: 30,
    fontSize: 15,
    textAlign: "center",
  },
});
export default ModalSynchronized;
