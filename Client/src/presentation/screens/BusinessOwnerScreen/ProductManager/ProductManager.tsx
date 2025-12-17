import { ColorMain } from "@/src/presentation/components/colors";
import ModalAddProduct from "@/src/presentation/components/Modal/ModalAddProduct/ModalAddProduct";
import ModalEditProduct from "@/src/presentation/components/Modal/ModalEditProduct/ModalEditProduct";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
  createProduct,
  deleteProduct,
  getProducts,
} from "@/src/services/API/productService";
import {
  InvoiceListResponse,
  Product,
  RootStackParamList,
} from "@/src/types/route";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { CommonActions, RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
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
export default function ProductManagerScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "ProductManager">>();
  const productScan = route.params?.scannedProduct;

  const navigate = useAppNavigation();
  const [products, setProducts] = useState<Product[]>([]);

  const [idEditProduct, setIdEditProduct] = useState<string | null>(null);
  const [showAction, setShowAction] = useState<string | null>(null);
  const [showEditProduct, setShowEditProduct] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const screenWidth = Dimensions.get("window").width;
  const ITEM_MARGIN = 8;
  const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    code: "",
    category: "",
    unit: "",
    price: 0,
    description: "",
    imageUrl: "",
    stock: 0,
    attributes: [],
  });
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
  const fetchData = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      navigate.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShowAction = (code: string) => {
    setShowAction((prev) => (prev === code ? null : code)); // toggle
    if (showAction === code) {
      // Đóng
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350, // 👈 chậm hơn
        easing: Easing.out(Easing.ease), // 👈 mượt
        useNativeDriver: true,
      }).start(() => setShowAction(null));
    } else {
      setShowAction(code);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 350, // 👈 chậm hơn
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const handleDeleteProduct = async (id: string) => {
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
              await deleteProduct(id);
              fetchData();
              Alert.alert("Thành công", "Sản phẩm đã được xoá");
            } catch (error) {
              console.error("Error deleting product:", error);
              Alert.alert("Lỗi", "Không thể xoá sản phẩm");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleOpenModalEditProduct = (id: string) => {
    // setShowEditProduct((prev) => (prev === id ? null : id));
    // setIdEditProduct(id);
    navigate.navigate("EditProductScreen", { id });
  };
  const renderItem = ({ item }: any) => (
    <View>
      <View
        style={[
          styles.card,
          {
            position: "relative",
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View
            style={{
              alignContent: "flex-start",
              flex: showAction === item.code ? 2 : 4,
              paddingHorizontal: 10,
            }}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>
              Giá: {item.price.toLocaleString()}đ
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={() => handleShowAction(item.code)}
          >
            {showAction === item.code ? (
              <SimpleLineIcons name="close" size={24} color="black" />
            ) : (
              <SimpleLineIcons
                name="arrow-right-circle"
                size={24}
                color="black"
              />
            )}
          </TouchableOpacity>
          {showAction === item.code && (
            <Animated.View
              style={{
                flexDirection: "row",
                flex: 2,
                height: "100%",
                transform: [
                  {
                    translateX: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0], // 👈 trượt từ phải vào
                    }),
                  },
                ],
                opacity: slideAnim,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,

                  height: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => handleOpenModalEditProduct(item._id)}
              >
                <Text style={{ textAlign: "center", color: "#0f7aacff" }}>
                  Sửa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,

                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => handleDeleteProduct(item._id)}
              >
                <Text style={{ textAlign: "center", color: "#c21212ff" }}>
                  Xóa
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
          {/* <Text style={styles.detail}>Số lượng: {item.stock}</Text> */}
        </View>
        {/* {showAction === item.code && (
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
                onPress={() => handleDeleteProduct(item._id)}
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
        )} */}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {products ? (
        <>
          {/* <Text style={styles.header}>Quản lý sản phẩm</Text> */}
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
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
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 80,
              paddingHorizontal: 5,
              marginTop: 20,
            }}
            // columnWrapperStyle={{
            //   justifyContent: "space-between",
            //   marginTop: 20,
            // }}
            numColumns={1}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigate.navigate("CreateProductScreen")}
          >
            <Ionicons name="add" size={28} color="#fff" />
            {/* <Text style={styles.addText}>Thêm sản phẩm</Text> */}
          </TouchableOpacity>
          <ModalAddProduct
            visible={visible}
            setVisible={setVisible}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
          />
          {showEditProduct && (
            <ModalEditProduct
              setShowEditProduct={setShowEditProduct}
              fetchData={fetchData}
              idEditProduct={idEditProduct}
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
    paddingVertical: 10,
    marginBottom: 12,
    borderRadius: 8,
    minHeight: 100,
    paddingHorizontal: 10,
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
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 50,
    width: 70,
    height: 70,
    backgroundColor: ColorMain,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 50,
    right: 20,
    shadowColor: "#747474ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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
