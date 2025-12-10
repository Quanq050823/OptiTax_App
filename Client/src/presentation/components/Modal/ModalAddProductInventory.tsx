import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
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
  const [dataUnitGet, setDataUnitGet] = useState<
    { label: string; value: string }[]
  >([]);
  useEffect(() => {
    if (!idProduct) return; // ❌ không có id thì bỏ qua

    const fetchProductById = async () => {
      try {
        const res = await getProductsInventoryById(idProduct);
        setNewProductInvenEdit(res);
      } catch (error) {
        return;
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

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await getUnitNameProduct();
        console.log(res, "ressss");

        const formattedUnits = res.units.map((u) => ({
          label: u,
          value: u,
        }));
        setDataUnitGet(formattedUnits);
      } catch (error) {
        console.error("Lỗi lấy đơn vị:", error);
      }
    };

    if (visible) {
      // chỉ fetch khi modal mở
      fetchUnits();
    }
  }, [visible]);

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
                style={{ position: "absolute", right: 10 }}
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
            <View style={{ flex: 1, marginTop: 20 }}>
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

            <View style={{ marginTop: 20, flexDirection: "row", gap: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.labelInput}>Số lượng </Text>
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
                  value={newProduct.stock?.toString()}
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <Text style={styles.labelInput}>Đơn vị tính </Text>
                {!loading && (
                  <Dropdown
                    style={styles.dropdown}
                    data={[
                      ...dataUnitGet,
                      { label: "+ Thêm danh mục", value: "__add__" }, // item đặc biệt
                    ]}
                    labelField="label"
                    valueField="value"
                    placeholder="---"
                    value={
                      newProductInvenEdit?.unit
                        ? dataUnitGet.find(
                            (item) =>
                              item.label.toLowerCase().trim() ===
                              newProductInvenEdit?.unit.toLowerCase().trim()
                          )?.value
                        : value
                    }
                    onChange={(item) => {
                      setValue(item.label);

                      if (item.value === "__add__") {
                        // Xử lý logic mở input hoặc modal thêm danh mục
                        console.log(dataUnitGet, "dataaaa");
                      } else {
                        setNewProduct({ ...newProduct, units: item.label });
                        //   setNewProductInvenEdit((prev) =>
                        //   prev ? { ...prev, unit: item.label } : prev
                        // );
                      }
                    }}
                  />
                )}
              </View>
            </View>
            {/* <View style={{ flex: 1, marginTop: 20 }}>
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
            </View> */}
            <View style={{ marginTop: 20 }}>
              {image && (
                <Image
                  source={{ uri: image }}
                  style={{
                    width: 200,
                    height: 200,
                    marginTop: 10,
                    alignSelf: "center",
                    marginBottom: 20,
                  }}
                />
              )}
              <TouchableOpacity onPress={pickImage} style={styles.addImage}>
                <Ionicons name="images-outline" size={24} color="black" />
                <Text style={{ marginLeft: 10 }}>Chọn ảnh</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.btnSaveProduct}
              onPress={onAddOrEditProductInventory}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Lưu nguyên liệu {}
              </Text>
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
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    height: "95%",
    padding: 10,
    paddingTop: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    color: ColorMain,
    fontWeight: "700",
  },
  input: {
    height: 50,
    width: "98%",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#313131ff",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    marginHorizontal: 5,
    shadowRadius: 2,
    elevation: 5,
  },
  labelInput: {
    textAlign: "left",
    marginBottom: 7,
    color: textColorMain,
    fontWeight: "600",
  },
  dropdown: {
    height: 50,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: "#fff",

    shadowColor: "#555555ff",
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    marginHorizontal: 5,
    shadowRadius: 2,
    elevation: 5,
  },
  btnSaveProduct: {
    alignItems: "center",
    backgroundColor: ColorMain,
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },
  addImage: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    borderRadius: 10,
  },
});
export default ModalAddProductInventory;
