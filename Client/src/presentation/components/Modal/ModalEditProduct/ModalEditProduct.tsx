import { ColorMain } from "@/src/presentation/components/colors";
import {
  getProductsById,
  updateProduct,
} from "@/src/services/API/productService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
interface ModalEditProductProps {
  //   visible: boolean;
  //   setVisible: (visible: boolean) => void;
  //   onAddProduct: any;
  //   setName: (name: string) => void;
  //   setPrice: (price: string) => void;
  //   setStock: (quantity: string) => void;
  //   setCode: (code: string) => void;
  //   setDescription: (description: string) => void;
  //   setCategory: (category: string) => void;
  setShowEditProduct: (showEditProduct: string | null) => void;
  fetchData: () => void;
  idEditProduct: string | null;
}

function ModalEditProduct({
  setShowEditProduct,
  idEditProduct,
  fetchData,
}: // visible,
// setVisible,
// onAddProduct,
// setName,
// setPrice,
// setStock,
// setCode,
// setDescription,
// setCategory,

ModalEditProductProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  //   const [updateProduct, setUpdateProduct] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (idEditProduct) {
          const data = (await getProductsById(idEditProduct)) as Product;
          setProduct(data);
          setName(data.name || "");
          setCode(data.code || "");
          setDescription(data.description || "");
          setCategory(data.category || "");
          setImageUrl(data.imageUrl || "");
          setStock(data.stock || 0);
          setPrice(data.price || 0);
        }
      } catch (error) {
        console.error("Error edit product:", error);
      }
    };
    fetchProduct();
  }, [idEditProduct]);

  const handleUpdateProduct = async (id: string, updatedFields: any) => {
    // Kiểm tra các trường bắt buộc
    if (
      !updatedFields.name ||
      !updatedFields.price ||
      !updatedFields.stock ||
      !updatedFields.description ||
      !updatedFields.code ||
      !updatedFields.category ||
      !updatedFields.imageUrl
    ) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường");
      return;
    }

    // Tạo object chứa các trường cần cập nhật
    const productData = {
      name: updatedFields.name,
      code: updatedFields.code,
      category: updatedFields.category,
      price: Number(updatedFields.price),
      description: updatedFields.description,
      imageUrl:
        "https://www.okoone.com/wp-content/uploads/2024/06/React-native-2-logo.png",
      stock: Number(updatedFields.stock),
    };

    try {
      const res = await updateProduct(id, productData); // đổi sang hàm update có id
      console.log("Cập nhật thành công:", res);
      Alert.alert("Thành công", "Sản phẩm đã được cập nhật");
      setShowEditProduct(null);
      fetchData();
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      Alert.alert("Lỗi", "Không thể cập nhật sản phẩm");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowEditProduct(null)}
      style={{ zIndex: 100 }}
    >
      <Pressable style={styleModal.overlay}>
        <View style={styleModal.modalContent}>
          {product ? (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                  width: "100%",
                }}
              >
                <Text style={styleModal.modalText}>Chỉnh sửa sản phẩm</Text>
                <TouchableOpacity
                  onPress={() => setShowEditProduct(null)}
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
                  defaultValue={code}
                  onChangeText={(value) => setCode(value)}
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styleModal.labelInput}>Tên </Text>
                <TextInput
                  placeholder={"Nhập tên sản phẩm"}
                  style={styleModal.input}
                  placeholderTextColor={"#9d9d9d"}
                  onChangeText={(value) => setName(value)}
                  defaultValue={name}
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styleModal.labelInput}>Giá tiền (VND)</Text>
                <TextInput
                  placeholder={"Nhập giá sản phẩm"}
                  style={styleModal.input}
                  placeholderTextColor={"#9d9d9d"}
                  keyboardType="number-pad"
                  onChangeText={(value) => setPrice(Number(value))}
                  defaultValue={price.toString()}
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styleModal.labelInput}>Số lượng</Text>
                <TextInput
                  placeholder={"Nhập số lượng sản phẩm"}
                  style={styleModal.input}
                  placeholderTextColor={"#9d9d9d"}
                  keyboardType="numeric"
                  onChangeText={(value) => setStock(Number(value))}
                  defaultValue={stock.toString()}
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
                  style={styleModal.input}
                  placeholderTextColor={"#9d9d9d"}
                  onChangeText={(value) => setDescription(value)}
                  defaultValue={description}
                />
              </View>
              <View
                style={{ width: "100%", alignItems: "flex-end", marginTop: 20 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    if (!idEditProduct) return;
                    handleUpdateProduct(idEditProduct, {
                      name,
                      code,
                      category,
                      price,
                      description,
                      imageUrl,
                      stock,
                    });
                  }}
                  style={styleModal.AddButton}
                >
                  <Text style={styleModal.AddText}>Cập nhật</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View>
              <Text>Sản phẩm không tồn tại</Text>
            </View>
          )}
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
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
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

export default ModalEditProduct;
