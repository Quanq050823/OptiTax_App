import { ColorMain } from "@/src/presentation/components/colors";
import { AntDesign } from "@expo/vector-icons";
import { useRef, useEffect } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  Modal,
  View,
  Text,
  TextInput,
} from "react-native";

type PropsModalAdd = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

function ModalAddProductInVoucherInput({ visible, setVisible }: PropsModalAdd) {
  const translateY = useRef(new Animated.Value(0)).current;

  // reset vị trí khi mở modal
  useEffect(() => {
    if (visible) {
      translateY.setValue(0);
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, // ✅ luôn cho phép bắt gesture
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
          // kéo đủ xa thì đóng
          setVisible(false);
        } else {
          // trả lại vị trí ban đầu
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.centeredView}>
        <Animated.View
          style={[styles.modalView, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.grabber} />
          <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: ColorMain,
                marginBottom: 20,
              }}
            >
              Tạo hàng hoá
            </Text>
            <Text style={styles.label}>Tên sản phẩm</Text>
            <TextInput placeholder="Nhập tên sản phẩm" style={styles.input} />

            <Text style={styles.label}>Đơn giá (đ)</Text>
            <TextInput placeholder="VD: 150.000" style={styles.input} />
            <Text style={styles.label}>Số lượng</Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "flex-start",
                alignItems: "center",
                alignContent: "flex-start",
              }}
            >
              <TouchableOpacity style={{ margin: 20 }}>
                <AntDesign name="minuscircle" size={24} color={ColorMain} />
              </TouchableOpacity>
              <TextInput
                placeholder="1"
                style={[styles.input, { width: 80 }]}
              />

              <TouchableOpacity style={{ margin: 20 }}>
                <AntDesign name="pluscircle" size={24} color={ColorMain} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
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
    backgroundColor: "rgba(0,0,0,0.5)", // nền mờ
  },    
  modalView: {
    backgroundColor: "#fafafaff",
    padding: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: "100%",
    height: "90%",
    alignItems: "center",
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
    textAlign: "left",
    width: "100%",
    marginBottom: 8,
    color: "#5a5a5aff",
    fontWeight: "500",
    marginTop: 30,
    fontSize: 15,
  },
});

export default ModalAddProductInVoucherInput;
