import { ColorMain } from "@/src/presentation/components/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
interface ModalAddProductProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onAddProduct: any;
  setName: (name: string) => void;
  setPrice: (price: number) => void;
  setStock: (quantity: string) => void;
  setCode: (code: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category: string) => void;
  name: string;
  code: string;
  category: string;
  description: string;
}

function ModalAddProduct({
  visible,
  setVisible,
  onAddProduct,
  setName,
  setPrice,
  setStock,
  setCode,
  setDescription,
  setCategory,
  name,
  code,
  category,
  description,
}: ModalAddProductProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setVisible(false)}
      style={{ zIndex: 100 }}
    >
      <Pressable style={styleModal.overlay}>
        <View style={styleModal.modalContent}>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                position: "relative",
                width: "100%",
              }}
            >
              <Text style={styleModal.modalText}>Sản phẩm mới</Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{ position: "absolute", right: 0 }}
              >
                <MaterialIcons name="cancel" size={24} color={ColorMain} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styleModal.labelInput}>Mã sản phẩm </Text>
              <TextInput
                placeholder={"Nhập mã sp"}
                style={styleModal.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(value) => setCode(value)}
                defaultValue={code}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styleModal.labelInput}>Tên </Text>
              <TextInput
                placeholder={"Nhập tên sản phẩm"}
                style={styleModal.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(value) => setName(value)}
                value={name}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styleModal.labelInput}>Giá tiền (VND)</Text>
              <TextInput
                placeholder={"Nhập giá sản phẩm"}
                style={styleModal.input}
                placeholderTextColor={"#9d9d9d"}
                keyboardType="number-pad"
                onChangeText={(value) => setPrice(Number(value) || 0)}
                defaultValue="0"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styleModal.labelInput}>Số lượng</Text>
              <TextInput
                placeholder={"Nhập số lượng sản phẩm"}
                style={styleModal.input}
                placeholderTextColor={"#9d9d9d"}
                keyboardType="numeric"
                onChangeText={(value) => setStock(value)}
                defaultValue="0"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styleModal.labelInput}>Danh mục </Text>
              <TextInput
                placeholder={"Ví dụ: Ăn uống,..."}
                style={styleModal.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(value) => setCategory(value)}
                defaultValue={category}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styleModal.labelInput}>Mô tả </Text>
              <TextInput
                placeholder={"Nhập mô tả sản phẩm"}
                style={[styleModal.input, { minHeight: 70 }]}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(value) => setDescription(value)}
                defaultValue={description}
                multiline
              />
            </View>
            <View
              style={{ width: "100%", alignItems: "flex-end", marginTop: 20 }}
            >
              <TouchableOpacity
                onPress={onAddProduct}
                style={styleModal.AddButton}
              >
                <Text style={styleModal.AddText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  button: {
    backgroundColor: "#2f80ed",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    height: "90%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    color: ColorMain,
    fontWeight: "700",
  },
  AddButton: {
    marginTop: 10,
    backgroundColor: ColorMain,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: 100,
    textAlign: "center",
  },
  AddText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },

  input: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cccccccc",
  },
  labelInput: { textAlign: "left", marginBottom: 7, color: ColorMain },
});

export default ModalAddProduct;
