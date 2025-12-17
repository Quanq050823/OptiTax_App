import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { ColorMain } from "../colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ProductInventory } from "@/src/types/storage";
import { useState } from "react";

type ConverItem = {
  visible: boolean;
  id: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
function ModalConversUnit({ visible, id, setVisible }: ConverItem) {
  const [item, setItem] = useState<ProductInventory>();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      // onRequestClose={() => setVisible(false)}
      style={{ zIndex: 100 }}
    >
      <Pressable style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.tittleWr}>
            <Text style={styles.tittle}>Quy đổi đơn vị tính của sản phẩm</Text>
            <TouchableOpacity
              style={styles.cancleAction}
              onPress={() => setVisible(false)}
            >
              <Text style={{ color: "#e20c0cff", fontWeight: "500" }}>Hủy</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.itemWr}>
            <View>
              <Image
                width={50}
                height={50}
                source={{
                  uri:
                    item?.imageURL ??
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTixbrVNY9XIHQBZ1iehMIV0Z9AtHB9dp46lg&s",
                }}
              />
            </View>
            <View>
              <Text>{item?.name}</Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "500",
              color: "#666666ff",
              textAlign: "center",
            }}
          >
            Quy đổi
          </Text>
          <View
            style={{ flexDirection: "row", padding: 20, alignItems: "center" }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                1 {item?.unit}
              </Text>
            </View>
            <Text style={{ flex: 0.5 }}>
              <FontAwesome name="arrows-h" size={24} color="#9d9d9d" />
            </Text>
            <View
              style={{
                flex: 2,
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <TextInput placeholder="Tên đơn vị" style={styles.inp} />
              <TextInput
                placeholder="Số lượng"
                style={styles.inp}
                keyboardType="numeric"
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="add-circle-outline" size={17} color={ColorMain} />

            <Text style={{ color: ColorMain }}>Thêm quy đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: "center",
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: ColorMain,
              borderRadius: 5,
              marginTop: 50,
            }}
          >
            <Text style={{ color: "#fff" }}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
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
    height: "40%",
    padding: 10,
    paddingTop: 20,
  },
  tittleWr: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tittle: { fontSize: 15 },
  cancleAction: {
    position: "absolute",
    right: 10,
  },
  itemWr: { flexDirection: "row", padding: 20, alignItems: "center" },
  inp: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#b9b9b9ff",
  },
});
export default ModalConversUnit;
