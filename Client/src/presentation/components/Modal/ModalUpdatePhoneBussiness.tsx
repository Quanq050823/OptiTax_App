import { ColorMain } from "@/src/presentation/components/colors";
import { Label } from "@react-navigation/elements";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
interface ModalEditProfileBussinessProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}
function ModalUpdatePhoneBussiness({
  visible,
  setVisible,
}: ModalEditProfileBussinessProps) {
  const [contentSendCode, setContentSendCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const handleSendCode = () => {
    setLoading(true);
    setTimeout(() => {
      setContentSendCode(true);
      setLoading(false);
    }, 2000);
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      style={{ zIndex: 100 }}
      onRequestClose={() => setVisible(false)}
    >
      <Pressable style={styleModal.overlay} onPress={() => setVisible(false)}>
        <View style={styleModal.modalContent}>
          {!contentSendCode ? (
            <View style={{ marginTop: 10 }}>
              <Label style={styleModal.label}>Nhập số điện thoại</Label>
              <TextInput
                style={[styleModal.input, styleModal.borderInput]}
                placeholder="090812xxx"
                keyboardType="phone-pad"
                defaultValue={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
              />
              <TouchableOpacity
                style={styleModal.btnCreate}
                onPress={handleSendCode}
              >
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  {loading ? <ActivityIndicator /> : "Gửi"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginTop: 10 }}>
              <Label style={styleModal.label}>
                Nhập mã xác nhận đã gửi đến 08080808
              </Label>
              <TextInput
                style={[styleModal.input, styleModal.borderInput]}
                placeholder="Vd: 123456"
                keyboardType="phone-pad"
                defaultValue={code}
                onChangeText={(text) => setCode(text)}
              />
              <TouchableOpacity style={styleModal.btnCreate}>
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styleModal = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "100%",
    backgroundColor: "#fcfcfcff",
    paddingVertical: 30,
    borderRadius: 12,
    height: "50%",
    position: "relative",
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  addButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#2f80ed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },

  shadow: {
    shadowColor: ColorMain,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 1 },
  },
  btnCreate: {
    backgroundColor: ColorMain,
    width: 100,
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
    alignItems: "center",
  },
  label: {
    textAlign: "left",
    fontWeight: 500,
    color: "#6d6d6dff",
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    color: "#333",
    backgroundColor: "#fff",
  },
  borderInput: {
    borderWidth: 1,
    borderColor: "#d5d5d5ff",
    borderRadius: 10,
  },
});
export default ModalUpdatePhoneBussiness;
