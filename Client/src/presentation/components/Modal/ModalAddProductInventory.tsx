import { ColorMain } from "@/src/presentation/components/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type NewProduct = {
  name: string;
  code: string;
  ten?: string;
  id?: string;
  dgia?: string;
  category: string;
  unit: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  attributes: { key: string; value: string }[];
};
interface ModalAddProductProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onAddProduct?: any;
  newProduct: NewProduct;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProduct>>;
  //   setProductSynchronized?: React.Dispatch<
  //     React.SetStateAction<InvoiceProduct[]>
  //   >;
}

function ModalAddProductInventory({
  visible,
  setVisible,
  newProduct,
  setNewProduct,
}: ModalAddProductProps) {
  const [categories, setCategories] = useState([
    { label: "Danh mục A", value: "a" },
    { label: "Danh mục B", value: "b" },
  ]);

  const [unitData, setUnitData] = useState([
    { label: "Kg", value: "kg" },
    { label: "Gram", value: "g" },
    { label: "Ml", value: "ml" },
    { label: "Lít", value: "l" },
    { label: "Cái", value: "cai" },
    { label: "Thùng", value: "thung" },
    { label: "Lon", value: "lon" },
  ]);
  const [value, setValue] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() === "") return;
    const newItem = { label: newCategory.trim(), value: newCategory.trim() };
    setCategories([...categories, newItem]);
    setNewCategory("");
    setShowInput(false);
    setValue(newItem.value); // chọn luôn danh mục vừa thêm
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setVisible(false)}
      style={{ zIndex: 100 }}
    >
      <Pressable style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                position: "relative",
                width: "100%",
              }}
            >
              <Text style={styles.modalText}>Tạo nguyên liệu</Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{ position: "absolute", right: 0 }}
              >
                <MaterialIcons name="cancel" size={24} color={ColorMain} />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.labelInput}>Tên </Text>
              <TextInput
                placeholder={"Tên nguyên liệu"}
                style={styles.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, name: text })
                }
                value={newProduct.name || newProduct.ten}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.labelInput}>Danh mục </Text>
              <Dropdown
                style={styles.dropdown}
                data={[
                  ...categories,
                  { label: "+ Thêm danh mục", value: "__add__" }, // item đặc biệt
                ]}
                labelField="label"
                valueField="value"
                placeholder="-- Chọn danh mục --"
                value={value}
                onChange={(item) => {
                  if (item.value === "__add__") {
                    // Xử lý logic mở input hoặc modal thêm danh mục
                    console.log("Người dùng muốn thêm danh mục mới");
                  } else {
                    setValue(item.value);
                  }
                }}
                renderItem={(item) => {
                  if (item.value === "__add__") {
                    return (
                      <View style={{ padding: 12 }}>
                        {showInput ? (
                          <>
                            <TextInput
                              placeholder="Tên danh mục mới"
                              value={newCategory}
                              onChangeText={setNewCategory}
                              style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 6,
                                padding: 8,
                                marginBottom: 8,
                              }}
                            />
                            <TouchableOpacity
                              onPress={handleAddCategory}
                              style={{
                                backgroundColor: "#007bff",
                                padding: 10,
                                borderRadius: 6,
                                alignItems: "center",
                              }}
                            >
                              <Text style={{ color: "#fff" }}>Lưu</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <TouchableOpacity onPress={() => setShowInput(true)}>
                            <Text style={{ color: "#007bff" }}>
                              + Thêm danh mục
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  }
                  return <Text style={{ padding: 12 }}>{item.label}</Text>;
                }}
              />
            </View>
            <View style={{ marginTop: 20, flexDirection: "row", gap: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.labelInput}>Đơn giá (VND) </Text>

                <TextInput
                  placeholder={"VD: 10000"}
                  style={styles.input}
                  placeholderTextColor={"#9d9d9d"}
                  onChangeText={(text) =>
                    setNewProduct({ ...newProduct, name: text })
                  }
                  value={newProduct.name || newProduct.ten}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.labelInput}>Đơn vị tính </Text>

                <Dropdown
                  style={styles.dropdown}
                  data={[
                    ...unitData,
                    { label: "+ Thêm danh mục", value: "__add__" }, // item đặc biệt
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="-- Chọn danh mục --"
                  value={value}
                  onChange={(item) => {
                    if (item.value === "__add__") {
                      // Xử lý logic mở input hoặc modal thêm danh mục
                      console.log("Người dùng muốn thêm danh mục mới");
                    } else {
                      setValue(item.value);
                    }
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#f9f9f9ff",
    borderRadius: 12,
    height: "95%",
    padding: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    color: ColorMain,
    fontWeight: "700",
  },
  input: {
    height: 40,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#a4a4a4cc",
    borderRadius: 5,
    padding: 5,
  },
  labelInput: { textAlign: "left", marginBottom: 7, color: ColorMain },
  dropdown: {
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#a4a4a4cc",
  },
});
export default ModalAddProductInventory;
