import { ColorMain } from "@/src/presentation/components/colors";
import { AntDesign } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  Alert,
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
import { InvoiceProduct } from "@/src/types/route";
import { createProduct } from "@/src/services/API/productService";
import { materials, Product } from "@/src/types/product";
import { ProductInventory, UnitsNameProduct } from "@/src/types/storage";
import {
  getProductsInventory,
  getUnitNameProduct,
} from "@/src/services/API/storageService";
import ModalConversUnit from "@/src/presentation/components/Modal/ModalConversUnit";

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
    label: "Kg",
    value: "Kg",
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

const BUSINESS_TYPES = [
  { label: "Phân phối / Cung cấp hàng hóa", value: "distribution" },
  { label: "Dịch vụ (không bao gồm vật liệu)", value: "service_no_material" },
  {
    label: "Sản xuất / Xây dựng (có vật liệu)",
    value: "production_with_material",
  },
  { label: "Hoạt động kinh doanh khác", value: "other_business" },
];

const INITIAL_INGREDIENT: Ingredient = {
  material: null,
  quantity: "",
  unit: null,
};

function CreateProductScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    INITIAL_INGREDIENT,
  ]);

  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    code: "",
    category: "",
    unit: "",
    price: 0,
    description: "",
    imageUrl: "",
    stock: 0,
    materials: [],
  });
  const [productStorage, setProductStorage] = useState<ProductInventory[]>([]);
  const [unitsData, setUnitsData] = useState<UnitsNameProduct>();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredProductsList, setFilteredProductsList] = useState<
    ProductInventory[][]
  >(ingredients.map(() => productStorage));
  const [openModalConvers, setOpenModalConvers] = useState(false);
  const [idProductStorage, setIdProductStorage] = useState("");
  const [showUnitInput, setShowUnitInput] = useState(false);
  const [newUnit, setNewUnit] = useState("");

  const [value, setValue] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  //--------------------Search product storage dropdown--------------------
  useEffect(() => {
    if (productStorage.length > 0) {
      setFilteredProductsList(ingredients.map(() => [...productStorage]));
    }
  }, [productStorage, ingredients.length]);

  const filterProducts = (index: number, keyword: string) => {
    const filtered = productStorage.filter((p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase())
    );

    setFilteredProductsList((prev) => {
      const copy = [...prev];
      copy[index] = [...filtered]; // clone
      return copy;
    });
  };
  //--------------------------------------------------------------
  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { material: null, quantity: "", unit: null }, // copy mới
    ]);

    setFilteredProductsList((prev) => [...prev, productStorage]);
  };
  const getUnitName = async () => {
    try {
      const res = await getUnitNameProduct();
      setUnitsData(res);
    } catch {
      console.log("Không tìm thấy dữ liệu unit name");
    }
  };

  const getProductStorage = async () => {
    try {
      const res = await getProductsInventory();
      setProductStorage(res.data);
    } catch {
      console.log("không lấy được data");
    }
  };

  const fetchUnits = useCallback(async () => {
    try {
      const res = await getUnitNameProduct();
      setUnitsData(res);
    } catch {
      console.log("Không tìm thấy dữ liệu unit name");
    }
  }, []);

  const fetchProductStorage = useCallback(async () => {
    try {
      const res = await getProductsInventory();
      setProductStorage(res.data);
    } catch {
      console.log("Không lấy được data");
    }
  }, []);

  useEffect(() => {
    fetchUnits();
    fetchProductStorage();
  }, [fetchUnits, fetchProductStorage]);

  const uniqueUnits = Array.from(
    new Map(unitsData?.units.map((u) => [u.toLowerCase(), u])).values()
  );

  const unitOptions =
    unitsData?.units.map((u) => ({ label: u, value: u })) || [];

  const updateIngredient = useCallback(
    <K extends keyof Ingredient>(
      index: number,
      key: K,
      value: Ingredient[K]
    ) => {
      setIngredients((prev) => {
        const newList = [...prev];
        newList[index][key] = value;
        return newList;
      });
    },
    []
  );

  const [categories, setCategories] = useState([
    { label: "Ăn uống", value: "an uong" },
    { label: "Dịch vụ", value: "dich vu" },
    { label: "Sản xuất / Công nghiệp", value: "sxcn" },
    { label: "Nông nghiệp / Thủy sản", value: "nnts" },
    { label: "Khác", value: "other" },
  ]);

  const handleAddCategory = useCallback(() => {
    if (!newCategory.trim()) return;
    const newItem = { label: newCategory.trim(), value: newCategory.trim() };
    setCategories((prev) => [...prev, newItem]);
    setValue(newItem.value);
    setNewCategory("");
    setShowInput(false);
    setNewProduct((prev) => ({ ...prev, category: newItem.value }));
  }, [newCategory]);

  const isIngredientsValid = ingredients.every(
    (i) =>
      (i.material?.trim() ?? "") !== "" &&
      (i.quantity?.trim() ?? "") !== "" &&
      (i.unit?.trim() ?? "") !== ""
  );
  const handleAddProduct = useCallback(async () => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.unit ||
      !isIngredientsValid
    ) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường");
      return;
    }

    const materialsList: materials[] = ingredients.map((ing) => ({
      component: ing.material || "",
      quantity: ing.quantity,
      unit: ing.unit || "",
    }));

    const productToCreate = { ...newProduct, materials: materialsList };
    const created = await createProduct(productToCreate);

    if (created && typeof created === "object" && "name" in created) {
      Alert.alert("Thành công", `Đã thêm sản phẩm: ${created.name}`);
    } else {
      Alert.alert("Lỗi", "Không thể lấy thông tin sản phẩm vừa tạo.");
    }
  }, [ingredients, newProduct]);

  const handleAddUnit = useCallback(() => {
    if (!newUnit.trim()) return;
    setUnitsData((prev) => ({
      names: [...(prev?.names ?? []), newUnit],
      units: [...(prev?.units ?? []), newUnit],
    }));
    setNewUnit("");
  }, [newUnit]);

  const isValid =
    (newProduct.name?.trim() ?? "") !== "" &&
    newProduct.price > 0 &&
    // (newProduct.category?.trim() ?? "") !== "" &&
    (newProduct.unit?.trim() ?? "") !== "" &&
    ingredients.every(
      (i) =>
        (i.material?.trim() ?? "") !== "" &&
        (i.quantity?.trim() ?? "") !== "" &&
        (i.unit?.trim() ?? "") !== ""
    );
  const handleOpenConversUnit = useCallback((id: string) => {
    setOpenModalConvers(true);
    setIdProductStorage(id);
  }, []);
  const handleRemoveIngredient = (removeIndex: number) => {
    setIngredients((prev) => prev.filter((_, index) => index !== removeIndex));
  };
  return (
    <View style={styleModal.modalContent}>
      <ScrollView>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          extraScrollHeight={100} // khoảng cách thêm khi bàn phím hiện
          keyboardOpeningTime={0}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styleModal.wrAddField}>
            <View style={{ marginTop: 20 }}>
              <Text style={styleModal.labelInput}>Mã sản phẩm </Text>
              <TextInput
                placeholder={"Tạo tự động, VD: SP001"}
                style={styleModal.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, code: text })
                }
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styleModal.labelInput}>
                Tên <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                placeholder={"Nhập tên sản phẩm"}
                style={styleModal.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, name: text })
                }
              />
            </View>
            <View style={{ marginTop: 20, flex: 1 }}>
              <Text style={styleModal.labelInput}>
                Giá tiền (VND) <Text style={{ color: "red" }}>*</Text>
              </Text>
              <TextInput
                placeholder={"Nhập giá sản phẩm"}
                style={styleModal.input}
                placeholderTextColor={"#9d9d9d"}
                keyboardType="number-pad"
                onChangeText={(text) =>
                  setNewProduct({ ...newProduct, price: Number(text) })
                }
              />
            </View>
            <View style={{ flexDirection: "row", gap: 30 }}>
              {/* <View style={{ marginTop: 20, flex: 1.5 }}>
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
                      setNewProduct({ ...newProduct, category: item.value });
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
                    return <Text style={{ padding: 12 }}>{item.label}</Text>;
                  }}
                />
              </View> */}
              <View style={{ marginTop: 20, flex: 1 }}>
                <Text style={styleModal.labelInput}>
                  Đơn vị tính <Text style={{ color: "red" }}>*</Text>
                </Text>
                <Dropdown
                  style={styleModal.dropdown}
                  onFocus={() => {
                    getUnitName();
                    console.log("hihih", unitsData);
                  }}
                  data={[
                    ...unitOptions,

                    { label: "+ Thêm danh mục", value: "__add__" }, // item đặc biệt
                  ]}
                  labelField="label"
                  valueField="value"
                  placeholder="--Phần, kg --"
                  value={newUnit}
                  onChange={(item) => {
                    if (item.value === "__add__") {
                      // Xử lý logic mở input hoặc modal thêm danh mục
                      console.log("Người dùng muốn thêm danh mục mới");
                    } else {
                      setNewUnit(item.value);
                      setNewProduct({ ...newProduct, unit: item.value });
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
                                value={newUnit}
                                onChangeText={(value) => setNewUnit(value)}
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#ccc",
                                  borderRadius: 6,
                                  padding: 8,
                                  marginBottom: 8,
                                }}
                              />
                              <TouchableOpacity
                                onPress={handleAddUnit}
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
                    return <Text style={{ padding: 12 }}>{item.label}</Text>;
                  }}
                />
              </View>
            </View>
          </View>
          <View style={[styleModal.wrAddField, { paddingTop: 20 }]}>
            <View style={{ flexDirection: "row", flex: 1, gap: 15 }}>
              <View style={{ flex: 1.2 }}>
                <Text style={styleModal.labelInput}>
                  Thành phần <Text style={{ color: "red" }}>*</Text>
                </Text>
              </View>
              <View style={{ flex: 0.8 }}>
                <Text style={styleModal.labelInput}>
                  Số lượng <Text style={{ color: "red" }}>*</Text>
                </Text>
              </View>
              <View style={{ flex: 0.5 }}>
                <Text style={styleModal.labelInput}>
                  ĐL <Text style={{ color: "red" }}>*</Text>
                </Text>
              </View>
            </View>
            {ingredients.map((item, index) => {
              const disableConvert = !item.material;

              return (
                <>
                  <TouchableOpacity
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                    onPress={() => handleRemoveIngredient(index)}
                  >
                    <Text style={{ color: "red", fontWeight: "500" }}>Xóa</Text>
                  </TouchableOpacity>
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      gap: 15,
                      marginBottom: 20,
                      marginTop: 10,
                    }}
                  >
                    {/* Dropdown nguyên liệu */}
                    <View style={{ flex: 1.2 }}>
                      <Dropdown
                        style={styleModal.dropdown}
                        data={
                          filteredProductsList[index]?.map((u) => ({
                            label: u.name,
                            value: u._id, // 🔥 ID duy nhất
                          })) ?? []
                        }
                        labelField="label"
                        valueField="value"
                        placeholder="Nguyên liệu"
                        value={item.material} // material = id
                        search
                        onChange={(selected) => {
                          updateIngredient(index, "material", selected.value);
                          setIdProductStorage(selected.value); //id
                        }}
                      />
                    </View>

                    {/* Số lượng */}
                    <View style={{ flex: 0.8 }}>
                      <TextInput
                        placeholder="Số lượng"
                        style={[styleModal.input]}
                        placeholderTextColor="#9d9d9d"
                        value={item.quantity}
                        onChangeText={(text) =>
                          updateIngredient(index, "quantity", text)
                        }
                      />
                    </View>

                    {/* Đơn vị */}
                    <View style={{ flex: 0.7 }}>
                      <Dropdown
                        style={styleModal.dropdown}
                        data={[
                          {
                            label: "+ Quy đổi định lượng",
                            value: "__add__",
                            disable: disableConvert,
                          }, // item cố định ở đầu
                          ...donVi,
                        ]}
                        renderItem={(item) => {
                          const isAdd = item.value === "__add__";
                          return (
                            <Text
                              style={{
                                padding: 12,
                                color: isAdd
                                  ? disableConvert
                                    ? "#c0c0c0" // 👈 mờ khi chưa có material
                                    : "#007bff" // 👈 xanh khi cho phép
                                  : "#000",
                                fontWeight:
                                  item.value === "__add__" ? "600" : "400",
                              }}
                            >
                              {item.label}
                            </Text>
                          );
                        }}
                        labelField="label"
                        valueField="value"
                        placeholder="kg"
                        value={item.unit}
                        containerStyle={{ width: "50%", marginLeft: -100 }}
                        placeholderStyle={{ color: "#9d9d9d" }}
                        onChange={(u) => {
                          if (u.value === "__add__") {
                            if (disableConvert) return;

                            setOpenModalConvers(true);
                            return; // ❌ KHÔNG set value
                          }

                          updateIngredient(index, "unit", u.value);
                        }}
                      />

                      <TouchableOpacity
                        disabled={disableConvert}
                        onPress={() => setOpenModalConvers(true)}
                      >
                        <Text
                          style={{
                            marginTop: 6,
                            color: disableConvert ? "#c0c0c0" : "#007bff",
                            fontWeight: "600",
                          }}
                        >
                          + Quy đổi ĐL
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              );
            })}
            <TouchableOpacity
              style={{
                marginTop: 0,
                flexDirection: "row",
                alignContent: "center",
              }}
              onPress={addIngredient}
            >
              <AntDesign name="plus-circle" size={17} color={ColorMain} />

              <Text style={[styleModal.labelInput, { color: ColorMain }]}>
                &nbsp;Thêm nguyên liệu
              </Text>
            </TouchableOpacity>
            {/* <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  style={[styleModal.btnAction, { backgroundColor: "#ffffff" }]}
                >
                  <Text>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styleModal.btnAction, { backgroundColor: ColorMain }]}
                >
                  <Text style={{ color: "#ffffff" }}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
          {/* <View style={[styleModal.wrAddField, { paddingTop: 20 }]}>
            <Text style={styleModal.labelInput}>Định nghĩa sản phẩm </Text>

            <Dropdown
              style={styleModal.dropdown}
              data={BUSINESS_TYPES}
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
          </View> */}
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
                multiline
              />
            </View>
          </View>
          <View
            style={{ width: "100%", alignItems: "flex-end", marginTop: 20 }}
          >
            <TouchableOpacity
              disabled={!isValid}
              onPress={handleAddProduct}
              style={[
                styleModal.AddButton,
                { opacity: isValid ? 1 : 0.4 }, // mờ khi disable
              ]}
            >
              <Text style={styleModal.AddText}>Thêm</Text>
            </TouchableOpacity>
          </View>
          <ModalConversUnit
            visible={openModalConvers}
            id={idProductStorage}
            setVisible={setOpenModalConvers}
          />
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
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
    paddingVertical: 10,
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
    borderWidth: 0.5,
    borderColor: "#a4a4a4cc",
    borderRadius: 5,
    padding: 5,
  },
  labelInput: {
    textAlign: "left",
    marginBottom: 7,
    color: "#000",
    fontWeight: "500",
  },
  dropdown: {
    height: 40,
    borderRadius: 5,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "#a4a4a4cc",
    fontSize: 10,
  },
  btnAction: {
    padding: 10,
    shadowColor: "#9d9d9d",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    borderRadius: 5,
  },
});

export default CreateProductScreen;
