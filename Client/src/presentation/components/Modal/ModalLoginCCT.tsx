import { ColorMain } from "@/src/presentation/components/colors";
import { AntDesign, MaterialIcons, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import ShimmerSweep from "../ShimmerSweep";

type ModalOpen = {
  openLogin: boolean;
  setOpenLogin: React.Dispatch<React.SetStateAction<boolean>>;
};
function ModalLoginCCT({ openLogin, setOpenLogin }: ModalOpen) {
  const [hdrSize, setHdrSize] = useState({ w: 0, h: 0 });
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openLogin}
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
            />
            <TextInput
              placeholder="Nhập mật khẩu"
              style={styles.input}
              placeholderTextColor="#9d9d9d"
            />
            <View
              style={{
                width: "100%",
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
                paddingHorizontal: 10,
              }}
            >
              <Text style={{ color: "#4d69cfff", fontWeight: "600" }}>
                Quên mật khẩu?
              </Text>
            </View>
            <TouchableOpacity style={styles.btnLogin}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Đăng nhập
              </Text>
            </TouchableOpacity>
            <Text style={styles.des}>-- Hoặc --</Text>
          </View>

          <AntDesign
            name="close"
            size={16}
            color="#000"
            style={{ position: "absolute", right: 20, top: 20 }}
            onPress={() => setOpenLogin(false)}
          />
          <LinearGradient
            colors={["#4dbf99ff", "#6A7DB3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 3 }}
            style={styles.btnShow}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setHdrSize({ w: width, h: height }); // 👈 CẬP NHẬT KÍCH THƯỚC
            }}
          >
            <TouchableOpacity
              onPress={() => {}}
              style={{
                flex: 1,
                alignItems: "center",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                Liên hệ kế toán EON
              </Text>
            </TouchableOpacity>
            <ShimmerSweep
              sweepDuration={5000}
              pauseDuration={100}
              angleDeg={20}
              intensity={0.9}
              bandWidth={100}
              containerWidth={hdrSize.w}
              containerHeight={hdrSize.h}
            />
          </LinearGradient>
          <TouchableOpacity>
            <Text
              style={{
                color: "#344992ff",
                fontWeight: "500",
                marginTop: 20,
              }}
            >
              Xem Demo &nbsp;
              <Octicons name="video" size={15} color="#344992ff" />
            </Text>
          </TouchableOpacity>
          {/* <View style={styles.grabber} /> */}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    minHeight: 600,
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
