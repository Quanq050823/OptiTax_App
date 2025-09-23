import { ColorMain } from "@/src/presentation/components/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
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
import * as ImagePicker from "expo-image-picker";
import {
  createProductInventory,
  getProductsInventoryById,
  getUnitNameProduct,
} from "@/src/services/API/storageService";
import {
  NewProductInventory,
  ProductInventory,
  UnitsNameProduct,
} from "@/src/types/storage";

interface ModalAddProductProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onAddOrEditProductInventory: () => Promise<void>;
  newProduct: NewProductInventory;
  setNewProduct: React.Dispatch<React.SetStateAction<NewProductInventory>>;
  //   setProductSynchronized?: React.Dispatch<
  //     React.SetStateAction<InvoiceProduct[]>
  //   >;
  fetchData: () => void;
  idProduct?: string | null;
  newProductInvenEdit?: ProductInventory;

  setNewProductInvenEdit: React.Dispatch<
    React.SetStateAction<ProductInventory | undefined>
  >;
}

function ModalAddProductInventory({
  visible,
  setVisible,
  newProduct,
  setNewProduct,
  fetchData,
  onAddOrEditProductInventory,
  idProduct,
  setNewProductInvenEdit,
  newProductInvenEdit,
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
  const [image, setImage] = useState<string | null>(null);
  const [NameList, setNameList] = useState<UnitsNameProduct[]>([]);
  const [unitList, setUnitList] = useState<UnitsNameProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idProduct) return; // ❌ không có id thì bỏ qua

    const fetchProductById = async () => {
      try {
        const res = await getProductsInventoryById(idProduct);
        setNewProductInvenEdit(res);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchProductById();
  }, [idProduct]);
  const handleAddCategory = () => {
    if (newCategory.trim() === "") return;
    const newItem = { label: newCategory.trim(), value: newCategory.trim() };
    setCategories([...categories, newItem]);
    setNewCategory("");
    setShowInput(false);
    setValue(newItem.value); // chọn luôn danh mục vừa thêm
  };

  const handleCreateProductInventory = async () => {
    try {
      await createProductInventory(newProduct);
      Alert.alert("Thành công", "Đã tạo nguyên liệu mới");
      setVisible(false);
      fetchData();
    } catch {
      Alert.alert("Lỗi", "Vui lòng kiểm tra các trường nguyên liệu");
    }
  };
  const pickImage = async () => {
    // xin quyền truy cập ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Bạn cần cấp quyền để chọn ảnh!");
      return;
    }

    // mở thư viện ảnh
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // cho phép crop
      aspect: [4, 3], // tỉ lệ crop
      quality: 1,
    });

    if (!result.canceled) {
      setNewProduct({
        ...newProduct,
        imageURL: result.assets[0].uri, // cập nhật ảnh mới
      }); // lưu uri ảnh
      setImage(result.assets[0].uri); // lưu uri ảnh
      setNewProductInvenEdit((prev) =>
        prev ? { ...prev, imageURL: result.assets[0].uri } : prev
      );
    }
  };

  useEffect(() => {
    const fetchUnitProduct = async () => {
      try {
        const res: UnitsNameProduct = await getUnitNameProduct();
        setNameList(res.names);
        setUnitList(res.units);
      } catch {
        Alert.alert("Không tìm thấy dữ liệu đơn vị tính");
      } finally {
        setLoading(false);
      }
    };

    fetchUnitProduct();
  }, []);
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
                onChangeText={(text) => {
                  setNewProduct({ ...newProduct, name: text });

                  setNewProductInvenEdit((prev) =>
                    prev ? { ...prev, name: text } : prev
                  );
                }}
                defaultValue={newProductInvenEdit?.name}
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
                    setNewProduct({ ...newProduct, unit: item.label });
                    setNewProductInvenEdit((prev) =>
                      prev ? { ...prev, unit: item.label } : prev
                    );
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
                  onChangeText={(text) => {
                    setNewProduct({ ...newProduct, price: Number(text) });

                    setNewProductInvenEdit((prev) =>
                      prev ? { ...prev, price: Number(text) } : prev
                    );
                  }}
                  value={newProduct.price?.toString()}
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={styles.labelInput}>Đơn vị tính </Text>
                {!loading && (
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
                        //   setNewProductInvenEdit((prev) =>
                        //   prev ? { ...prev, unit: item.label } : prev
                        // );
                      }
                    }}
                  />
                )}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelInput}>Số lượng</Text>

              <TextInput
                placeholder={"VD: 10000"}
                style={styles.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(text) => {
                  setNewProduct({ ...newProduct, stock: Number(text) });

                  setNewProductInvenEdit((prev) =>
                    prev ? { ...prev, stock: Number(text) } : prev
                  );
                }}
                value={newProduct.stock.toString()}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Button title="Chọn ảnh" onPress={pickImage} />
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{ width: 200, height: 200, marginTop: 10 }}
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.btnSaveProduct}
              onPress={onAddOrEditProductInventory}
            >
              <Text style={{ color: "#fff" }}>Lưu nguyên liệu {}</Text>
            </TouchableOpacity>
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
  btnSaveProduct: {
    alignItems: "center",
    backgroundColor: ColorMain,
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
  },
});
export default ModalAddProductInventory;
