import { ColorMain } from "@/src/presentation/components/colors";
import { loginCCT } from "@/src/services/API/syncInvoiceIn";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ModalOpen = {
  openLogin: boolean;
  setOpenLogin: React.Dispatch<React.SetStateAction<boolean>>;
  visible: boolean;
};
function ModalLoginCCT({ openLogin, setOpenLogin, visible }: ModalOpen) {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  console.log(account);

  const handleLoginCCT = async () => {
    try {
      await loginCCT(account);
      Alert.alert("Đăng nhập thành công");
      setOpenLogin(false);
    } catch (error: any) {
      console.log("Login error:", error);

      // Nếu server trả về response
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
        Alert.alert("Lỗi đăng nhập", JSON.stringify(error.response.data));
      } else {
        // Nếu lỗi khác
        Alert.alert("Lỗi đăng nhập", error.message || "Unknown error");
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setOpenLogin(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Text style={styles.label}>Đăng nhập tài khoản chi cục thuế</Text>
          </View>

          <Image
            source={require("@/assets/images/logo_chi_cuc_thue.png")}
            style={{ width: 70, height: 70, marginTop: 20 }}
          />
          <View style={{ width: "100%", alignItems: "center" }}>
            <TextInput
              placeholder="Nhập mã số thuế"
              style={styles.input}
              placeholderTextColor="#9d9d9d"
              onChangeText={(value) =>
                setAccount((prev) => ({
                  ...prev,
                  username: value,
                }))
              }
            />
            <TextInput
              placeholder="Nhập mật khẩu"
              style={styles.input}
              placeholderTextColor="#9d9d9d"
              onChangeText={(value) =>
                setAccount((prev) => ({
                  ...prev,
                  password: value,
                }))
              }
            />
            <View
              style={{ width: "100%", alignItems: "flex-end", marginTop: 10 }}
            >
              <Text style={{ color: "#4d69cfff", fontWeight: "600" }}>
                Quên mật khẩu?
              </Text>
            </View>
            <TouchableOpacity style={styles.btnLogin} onPress={handleLoginCCT}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
            <Text style={styles.des}>
              Bạn phải đăng nhập tài khoản chi cục thuế để có thể lấy được hoá
              đơn chính xác nhất
            </Text>
          </View>

          <AntDesign
            name="close"
            size={16}
            color="#000"
            style={{ position: "absolute", right: 20, top: 20 }}
            onPress={() => setOpenLogin(false)}
          />
          {/* <View style={styles.grabber} /> */}
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
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#ffffffff",
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    minHeight: 550,
    alignItems: "center",
    paddingVertical: 20,
    position: "relative",
  },

  label: {
    color: "#000",
    fontWeight: "500",
    fontSize: 18,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    width: "95%",
    borderColor: "#c1c1c1ff",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  btnLogin: {
    width: "40%",
    alignItems: "center",
    backgroundColor: "#df0101ff",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 20,
  },
  des: {
    color: "#9d9d9d",
    marginTop: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
});
export default ModalLoginCCT;
