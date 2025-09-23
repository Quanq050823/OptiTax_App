import { ColorMain } from "@/src/presentation/components/colors";
import ModalAddProduct from "@/src/presentation/components/Modal/ModalAddProduct/ModalAddProduct";
import ModalAddProductInventory from "@/src/presentation/components/Modal/ModalAddProductInventory";
import ModalEditProduct from "@/src/presentation/components/Modal/ModalEditProduct/ModalEditProduct";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
  createProduct,
  deleteProduct,
  getProducts,
} from "@/src/services/API/productService";
import {
  createProductInventory,
  deleteProductInventory,
  getProductsInventory,
  getProductsInventoryByKey,
  searchProductsInventory,
  updateProductInventory,
} from "@/src/services/API/storageService";
import {
  InvoiceListResponse,
  Product,
  RootStackParamList,
} from "@/src/types/route";
import {
  NewProductInventory,
  ProductInventory,
  ProductInventoryList,
} from "@/src/types/storage";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { CommonActions, RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";
type NewProduct = {
  name: string;
  code: string;
  category: string;
  unit: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  attributes: { key: string; value: string }[];
};

const productData = [
  {
    _id: 1,
    name: "Đường bà Tú",
    code: "ĐT",
    category: "Ăn uống",
    unit: "kg",
    price: "12000",
    imageUrl: "https://example.com/images/tshirt001.jpg",
    stock: 10,
    isActive: true,
  },
];

export default function InventoryManagerScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "ProductManager">>();
  const productScan = route.params?.scannedProduct;

  const navigate = useAppNavigation();
  const [productsInventory, setProductsInventory] = useState<
    ProductInventory[]
  >([]);

  const [idEditProduct, setIdEditProduct] = useState<string>("");
  const [showAction, setShowAction] = useState<string | null>(null);
  const [showEditProduct, setShowEditProduct] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [newProductInvenEdit, setNewProductInvenEdit] =
    useState<ProductInventory>();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;
  const ITEM_MARGIN = 8;
  const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;

  const [newProduct, setNewProduct] = useState<NewProductInventory>({
    name: "",
    code: "",
    category: "",
    unit: "",
    price: 0,
    description: "",
    imageURL: "",
    stock: 0,
    attributes: [],
  });

  const fetchDataProductInventory = async () => {
    try {
      setLoading(true);

      const res = await getProductsInventory();
      console.log(res, "duwx ");

      setProductsInventory(res.data ?? []);
    } catch {
      console.log("Lỗi! Chưa có dữ liệu!");
      setProductsInventory([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataProductInventory();
  }, []);
  useEffect(() => {
    if (productScan) {
      setVisible(true);
      // Có thể set luôn các field mặc định từ productScan
      setName(productScan.name || "");
      setCode(productScan._id?.toString() || "");
      setCategory(
        typeof productScan.category === "object"
          ? Object.values(productScan.category).join(", ")
          : productScan.category || ""
      );
      setDescription(productScan.description);
    }
  }, [productScan]);

  const handleCreateProductInventory = async (
    newProduct: NewProductInventory
  ) => {
    try {
      await createProductInventory(newProduct);
      Alert.alert("Thành công", "Đã tạo nguyên liệu mới");
      setVisible(false);
      fetchDataProductInventory();
    } catch {
      Alert.alert("Lỗi", "Vui lòng kiểm tra các trường nguyên liệu");
    }
  };

  const handleShowAction = (_id: string) => {
    setShowAction((prev) => (prev === _id ? null : _id)); // toggle
  };

  const handleDeleteProductInventory = async (id: string) => {
    Alert.alert(
      "Xác nhận xoá",
      "Bạn có chắc muốn xoá sản phẩm này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xoá",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProductInventory(id);
              fetchDataProductInventory();
              Alert.alert("Thành công", "Nguyên liệu đã được xoá");
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Lỗi", "Không thể xoá nguyên liệu");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  // useEffect(() => {
  //   const fetchNamesUnits = async () => {
  //     try {
  //       const res = await searchProductsInventory(searchQuery);
  //       setProductsInventory(res.data);
  //     } catch (err) {
  //       console.error("Lỗi lấy names/units:", err);
  //     }
  //   };

  //   fetchNamesUnits();
  // }, [searchQuery]);
  const handleOpenModalEditProduct = (_id: string) => {
    setShowEditProduct((prev) => (prev === _id ? null : _id));
    setIdEditProduct(_id);
    setVisibleEdit(true);
  };

  const handleUpdateProductInventory = async (
    id: string,
    updatedFields: any
  ) => {
    // // Kiểm tra các trường bắt buộc
    // if (
    //   !updatedFields.name ||
    //   !updatedFields.price ||
    //   !updatedFields.stock ||
    //   !updatedFields.imageURL ||
    //   !updatedFields.unit
    // ) {
    //   Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường");
    //   return;
    // }

    // Tạo object chứa các trường cần cập nhật
    const productData = {
      name: updatedFields.name,
      unit: updatedFields.unit,
      price: Number(updatedFields.price),
      imageURL: updatedFields.imageURL,
      stock: Number(updatedFields.stock),
    };

    try {
      const res = await updateProductInventory(id, productData); // đổi sang hàm update có id
      console.log("Cập nhật thành công:", res);
      Alert.alert("Thành công", "Sản phẩm đã được cập nhật");
      setShowEditProduct(null);
      fetchDataProductInventory();
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      Alert.alert("Lỗi", "Không thể cập nhật sản phẩm");
    }
  };
  const renderItem: ListRenderItem<ProductInventory> = ({ item }) => (
    <TouchableOpacity onPress={() => handleShowAction(item._id)} key={item._id}>
      <View
        style={[
          styles.card,
          {
            width: ITEM_WIDTH,
            marginHorizontal: ITEM_MARGIN / 2,
            position: "relative",
          },
        ]}
      >
        <View style={{ flex: 1, alignItems: "center", width: "80%" }}>
          <Image source={{ uri: item.imageURL }} style={styles.image} />

          <Text style={styles.name}>{item.name}</Text>
          {/* <Text style={styles.detail}>Giá: {item.stock.toString()}đ</Text> */}

          <Text style={styles.detail}>Số lượng: {item.stock}</Text>
          <Text style={styles.detail}>Danh mục: {item.unit}</Text>
        </View>
        {showAction === item._id && (
          <>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <MaterialIcons
                name="delete-outline"
                size={24}
                color="red"
                onPress={() => handleDeleteProductInventory(item._id)}
              />
              <AntDesign
                name="edit"
                size={24}
                color={ColorMain}
                onPress={() => handleOpenModalEditProduct(item._id)}
              />
            </View>
            <View
              style={{
                position: "absolute",
                flex: 1,
                backgroundColor: "#24408f1a",
                zIndex: -10,
                inset: 0,
                borderRadius: 8,
              }}
            ></View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : productsInventory ? (
        <>
          {/* <Text style={styles.header}>Quản lý sản phẩm</Text> */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingTop: 10,
              paddingBottom: 20,
              shadowColor: "#9d9d9d",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.22,
              backgroundColor: "transparent",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                shadowColor: ColorMain,
                shadowOpacity: 0.22,
                shadowOffset: { width: 0, height: 1 },
                borderRadius: 50,
                width: "100%",
              }}
            >
              <Searchbar
                placeholder="Tìm kiếm sản phẩm"
                onChangeText={setSearchQuery}
                value={searchQuery}
                icon="magnify"
                style={{
                  backgroundColor: "transparent",
                  width: "70%",
                }}
                iconColor={ColorMain}
                placeholderTextColor={ColorMain}
              />
              <TouchableOpacity
                style={{
                  width: 60,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                }}
                onPress={() => navigate.navigate("ScanBarcodeProductScreen")}
              >
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Tìm sản phẩm..."
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View> */}
          <FlatList
            data={productsInventory}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingBottom: 80,
              paddingHorizontal: 5,
              marginTop: 20,
            }}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginTop: 20,
            }}
            numColumns={2}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setVisible(true)}
          >
            <Ionicons name="add" size={28} color="#fff" />
            <Text style={styles.addText}>Thêm sản phẩm</Text>
          </TouchableOpacity>
          <ModalAddProductInventory
            visible={visible}
            setVisible={setVisible}
            onAddOrEditProductInventory={() =>
              handleCreateProductInventory(newProduct)
            }
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            fetchData={fetchDataProductInventory}
          />
          {showEditProduct && (
            <ModalAddProductInventory
              visible={visibleEdit}
              setVisible={setVisibleEdit}
              onAddOrEditProductInventory={() =>
                handleUpdateProductInventory(idEditProduct, newProductInvenEdit)
              }
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              newProductInvenEdit={newProductInvenEdit}
              setNewProductInvenEdit={setNewProductInvenEdit}
              fetchData={fetchDataProductInventory}
              idProduct={idEditProduct}
            />
          )}
        </>
      ) : (
        <View>
          <Text>haha</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 200,

    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#2f80ed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  addText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  shadow: {
    shadowColor: ColorMain,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 1 },
  },
});
