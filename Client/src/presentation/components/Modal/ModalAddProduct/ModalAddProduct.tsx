import { ColorMain } from "@/src/presentation/components/colors";
import { AntDesign } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { InvoiceProduct, Product } from "@/src/types/route";

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
  setProductSynchronized?: React.Dispatch<
    React.SetStateAction<InvoiceProduct[]>
  >;
}

type Ingredient = {
  material: string | null;
  quantity: string;
  unit: string | null;
};

const donVi = [
  {
    label: "ml",
    value: "ml",
  },
  {
    label: "gram",
    value: "gram",
  },
  {
    label: "kg",
    value: "kg",
  },
  {
    label: "Phần",
    value: "phan",
  },
  {
    label: "lít",
    value: "lit",
  },
];

const nguyenLieu = [
  {
    label: "Cà Phê Bột",
    value: "caphebot",
  },
  {
    label: "Trà sữa bột",
    value: "trasuabot",
  },
  {
    label: "Sữa đặc",
    value: "suadac",
  },
  {
    label: "Đường",
    value: "duong",
  },
];
function ModalAddProduct({
  visible,
  setVisible,
  onAddProduct,
  newProduct,
  setNewProduct,
  setProductSynchronized,
}: ModalAddProductProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { material: null, quantity: "", unit: null },
  ]);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { material: null, quantity: "", unit: null },
    ]);
  };

  const updateIngredient = <K extends keyof Ingredient>(
    index: number,
    key: K,
    value: Ingredient[K]
  ) => {
    const newList = [...ingredients];
    newList[index][key] = value;
    setIngredients(newList);
  };

  const [categories, setCategories] = useState([
    { label: "Danh mục A", value: "a" },
    { label: "Danh mục B", value: "b" },
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
      <Pressable style={styleModal.overlay}>
        <View style={styleModal.modalContent}>
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            extraScrollHeight={100} // khoảng cách thêm khi bàn phím hiện
            keyboardOpeningTime={0}
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <ScrollView>
              <View style={styleModal.wrAddField}>
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
                    onChangeText={(text) =>
                      setNewProduct({ ...newProduct, code: text })
                    }
                    defaultValue={newProduct.code || newProduct.id






                      
                    }
                  />
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text style={styleModal.labelInput}>Tên </Text>
                  <TextInput
                    placeholder={"Nhập tên sản phẩm"}
                    style={styleModal.input}
                    placeholderTextColor={"#9d9d9d"}
                    onChangeText={(text) =>
                      setNewProduct({ ...newProduct, name: text })
                    }
                    value={newProduct.name || newProduct.ten}
                  />
                </View>
                <View style={{ flexDirection: "row", gap: 30 }}>
                  <View style={{ marginTop: 20, flex: 1 }}>
                    <Text style={styleModal.labelInput}>Giá tiền (VND)</Text>
                    <TextInput
                      placeholder={"Nhập giá sản phẩm"}
                      style={styleModal.input}
                      placeholderTextColor={"#9d9d9d"}
                      keyboardType="number-pad"
                      onChangeText={(text) =>
                        setNewProduct({ ...newProduct, price: Number(text) })
                      }
                      defaultValue={newProduct.dgia ? newProduct.dgia : "0"}
                    />
                  </View>

                  <View style={{ marginTop: 20, flex: 1.5 }}>
                    <Text style={styleModal.labelInput}>Danh mục </Text>
                    <Dropdown
                      style={styleModal.dropdown}
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
                                <TouchableOpacity
                                  onPress={() => setShowInput(true)}
                                >
                                  <Text style={{ color: "#007bff" }}>
                                    + Thêm danh mục
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        }
                        return (
                          <Text style={{ padding: 12 }}>{item.label}</Text>
                        );
                      }}
                    />
                  </View>
                </View>
              </View>
              <View style={[styleModal.wrAddField, { paddingTop: 20 }]}>
                <View style={{ flexDirection: "row", flex: 1, gap: 15 }}>
                  <View style={{ flex: 1.2 }}>
                    <Text style={styleModal.labelInput}>Thành phần </Text>
                  </View>
                  <View style={{ flex: 0.8 }}>
                    <Text style={styleModal.labelInput}>Số lượng </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text style={styleModal.labelInput}>ĐL </Text>
                  </View>
                </View>

                {ingredients.map((item, index) => (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        gap: 15,
                        marginBottom: 20,
                      }}
                    >
                      <View style={{ flex: 1.2 }}>
                        <Dropdown
                          style={styleModal.dropdown}
                          data={nguyenLieu}
                          labelField="label"
                          valueField="value"
                          placeholder={"Nguyên liệu"}
                          search
                          containerStyle={{ width: "90%" }}
                          searchPlaceholder="Tìm nguyên liệu..."
                          inputSearchStyle={{
                            // style cho ô tìm kiếm
                            height: 40,
                            fontSize: 14,
                            color: "#333",
                          }}
                          placeholderStyle={{ color: "#9d9d9d" }}
                          onChange={(item) => {}}
                        />
                      </View>
                      <View style={{ flex: 0.8 }}>
                        <TextInput
                          placeholder={"Số lượng"}
                          style={[styleModal.input]}
                          placeholderTextColor={"#9d9d9d"}
                          // onChangeText={(value) => setPrice(Number(value))}
                        />
                      </View>
                      <View style={{ flex: 0.7 }}>
                        <Dropdown
                          style={styleModal.dropdown}
                          data={donVi}
                          labelField="label"
                          valueField="value"
                          placeholder={"kg"}
                          containerStyle={{
                            width: "50%",
                            marginLeft: -100,
                          }}
                          placeholderStyle={{ color: "#9d9d9d" }}
                          onChange={(item) => {}}
                        />
                      </View>
                    </View>
                  </>
                ))}
                <TouchableOpacity
                  style={{
                    marginTop: 30,
                    flexDirection: "row",
                    alignContent: "center",
                  }}
                  onPress={addIngredient}
                >
                  <AntDesign name="plus-circle" size={17} color={ColorMain} />

                  <Text style={styleModal.labelInput}>
                    &nbsp;Thêm nguyên liệu
                  </Text>
                </TouchableOpacity>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      gap: 10,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styleModal.btnAction,
                        { backgroundColor: "#ffffff" },
                      ]}
                    >
                      <Text>Huỷ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styleModal.btnAction,
                        { backgroundColor: ColorMain },
                      ]}
                    >
                      <Text style={{ color: "#ffffff" }}>Lưu</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={[styleModal.wrAddField, { paddingTop: 20 }]}>
                <View>
                  <Text style={styleModal.labelInput}>Mô tả </Text>
                  <TextInput
                    placeholder={"Nhập mô tả sản phẩm"}
                    style={[styleModal.input, { minHeight: 60 }]}
                    placeholderTextColor={"#9d9d9d"}
                    onChangeText={(text) =>
                      setNewProduct({ ...newProduct, description: text })
                    }
                    defaultValue={newProduct.description}
                    multiline
                  />
                </View>
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
          </KeyboardAwareScrollView>
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
    backgroundColor: "#f9f9f9ff",
    borderRadius: 12,
    height: "95%",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    color: ColorMain,
    fontWeight: "700",
  },
  wrAddField: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 5,
    paddingVertical: 20,
    marginBottom: 20,
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    paddingBottom: 20,
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
  btnAction: {
    padding: 10,
    shadowColor: "#9d9d9d",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    borderRadius: 5,
  },
});

export default ModalAddProduct;
