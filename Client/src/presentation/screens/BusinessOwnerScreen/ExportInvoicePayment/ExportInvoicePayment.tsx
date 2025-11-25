import { ColorMain } from "@/src/presentation/components/colors";
import SearchByName from "@/src/presentation/components/SearchByName";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { getProducts } from "@/src/services/API/productService";
import { getProductsInventory } from "@/src/services/API/storageService";
import { Product, RootStackParamList } from "@/src/types/route";
import { ProductInventory } from "@/src/types/storage";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { logout as apiLogout } from "@/src/services/API/authService";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";

type ExportInvoicePaymentRoute = RouteProp<
  RootStackParamList,
  "ExportInvoicePayment"
>;
type NavProp = StackNavigationProp<RootStackParamList>;
function ExportInvoicePayment() {
  const navigate = useNavigation<NavProp>();

  const navigation = useAppNavigation();

  const route = useRoute<ExportInvoicePaymentRoute>();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productStorage, setProductStorage] = useState<ProductInventory[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
  const [openModalNotQuantity, setOpenModalNotQuantity] = useState(false);
  const [openProductStorage, setOpenProductStorage] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter((item) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);
  useEffect(() => {
    if (route.params?.items) {
      // Gộp thêm sản phẩm đã có
      const newItems = route.params.items;
      const updatedQuantities = { ...quantity };
      newItems.forEach((it) => {
        updatedQuantities[it._id] = (updatedQuantities[it._id] || 0) + it.stock;
      });
      setQuantity(updatedQuantities);
    }
  }, [route.params?.items]);
  useEffect(() => {
    // Tính tổng tiền dựa vào quantity và products
    let total = 0;
    for (const id in quantity) {
      const product = products.find((p) => p._id === id);
      if (product) {
        total += product.price * quantity[id];
      }
    }
    setTotalAmount(total);
  }, [quantity, products]);
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      // await AsyncStorage.removeItem("access_token");
      setLoading(false);

      Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại", [
        {
          text: "Đăng nhập lại",
          onPress: () => {
            // Xử lý điều hướng về màn Login
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
          style: "default", // hoặc "cancel", "destructive"
        },
      ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchDataStorage = async () => {
    try {
      const data = await getProductsInventory();
      setProductStorage(data.data);
    } catch (error) {
      // await AsyncStorage.removeItem("access_token");

      Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại", [
        {
          text: "Đăng nhập lại",
          onPress: async () => {
            // Xử lý điều hướng về màn Login
            const result = await apiLogout();
            console.log("Logout result:", result);

            // Chuyển về trang login sau khi logout
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
          style: "default", // hoặc "cancel", "destructive"
        },
      ]);
    }
  };

  useEffect(() => {
    fetchDataStorage();
  }, [openProductStorage]);

  const openModal = (item: Product) => {
    setSelectedProduct(item);
    // setQuantity(1);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
    setOpenModalNotQuantity(false);
  };

  const confirmSelection = () => {
    console.log("🧾 Đã chọn:", {
      productId: selectedProduct?._id,
      name: selectedProduct?.name,
      quantity,
    });
    // bạn có thể xử lý lưu dữ liệu hoặc thêm vào danh sách hóa đơn ở đây
    closeModal();
  };
  const openModalStorage = () => {
    setOpenModalNotQuantity(false); // đóng modal cũ
    setOpenProductStorage(true); // mở modal mới
  };
  const increaseQuantity = (id: string) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };
  const decreaseQuantity = (id: string) => {
    setQuantity((prev) => {
      const newQty = (prev[id] || 1) - 1;
      const updated = { ...prev };
      if (newQty <= 0) {
        delete updated[id]; // xóa luôn khi về 0
      } else {
        updated[id] = newQty;
      }
      return updated;
    });
  };

  const handleExpand = (id: string) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [id]: !prev[id], // toggle mở/đóng
    }));
    setQuantity((prev) => ({
      ...prev,
      [id]: prev[id] || 1, // nếu chưa có thì đặt = 1
    }));
  };

  const handleGoToPayment = () => {
    // Lọc ra những sản phẩm đã chọn
    const selectedItems = products
      .filter((p) => quantity[p._id])
      .map((p) => ({
        ...p,
        quantity: quantity[p._id],
        total: p.price * quantity[p._id],
      }));

    navigation.navigate("PaymentInvoiceScreen", {
      items: selectedItems,
    });
  };
  const screenWidth = Dimensions.get("window").width;
  const ITEM_MARGIN = 8;
  const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View
        style={[
          styles.card,
          {
            width: "100%",
            position: "relative",
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Image
            source={require("@/assets/images/no-image-news.png")}
            style={styles.image}
          />
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>
              Giá: {item.price.toLocaleString()}đ
            </Text>
            <Text style={styles.detail}>
              Còn: &nbsp;
              <Text
                style={{
                  color: item.stock < 1 ? "#ff3e3eff" : ColorMain,
                  fontWeight: "600",
                }}
              >
                {item.stock}
              </Text>
            </Text>
          </View>
          <View style={{ right: 10, position: "absolute" }}>
            {quantity[item._id] ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(item._id)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={quantity[item._id].toString()}
                  onChangeText={(val) =>
                    setQuantity((prev) => ({
                      ...prev,
                      [item._id]: Math.max(Number(val) || 0, 0),
                    }))
                  }
                />

                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: ColorMain },
                  ]}
                  disabled={item.stock < 1 ? true : false}
                  onPress={() => increaseQuantity(item._id)}
                >
                  <Text style={[styles.quantityButtonText, { color: "#fff" }]}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: item.stock < 1 ? "#ccc" : ColorMain,
                  borderRadius: 5,
                  padding: 5,
                }}
                disabled={item.stock < 1}
                onPress={() => increaseQuantity(item._id)} // ấn + lần đầu sẽ tạo quantity = 1
              >
                <Entypo name="plus" size={17} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <View style={styles.bottomLine} />
    </TouchableOpacity>
  );
  const renderItemStorage: ListRenderItem<ProductInventory> = ({ item }) => (
    <TouchableOpacity key={item._id}>
      <View
        style={[
          styles.card,
          {
            width: ITEM_WIDTH - 50,
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
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={{ flex: 1 }}>
      <LoadingScreen visible={loading} />

      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 15,
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
        }}
      >
        {/* <SearchByName label="Tìm kiếm nhà cung cấp" /> */}
        <View style={[styles.containerSearch, { width: "70%" }]}>
          <Entypo name="magnifying-glass" size={18} color="#666" />
          <TextInput
            placeholder="Tìm kiếm sản phẩm"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
            style={styles.inputSearch}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "transparent",
            borderRadius: 10,
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: ColorMain,
          }}
          // ấn + lần đầu sẽ tạo quantity = 1
        >
          <Entypo name="plus" size={17} color={ColorMain} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: ColorMain,
            borderRadius: 10,
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
          }}
          // ấn + lần đầu sẽ tạo quantity = 1
        >
          <AntDesign name="control" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 80,
          marginTop: 20,
        }}
        // columnWrapperStyle={{
        //   justifyContent: "space-between",
        //   marginTop: 20,
        // }}
        numColumns={1}
      />

      <View style={styles.wrBottom}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            borderRadius: 10,
            backgroundColor: "#e8e8e8ff",
            gap: 10,
            height: 40,
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Feather name="shopping-cart" size={24} color="black" />
          <Text style={{ fontWeight: "600" }}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 15,
            borderRadius: 10,
            backgroundColor: ColorMain,
            gap: 10,
            height: 40,
            flex: 4,
            justifyContent: "center",
          }}
          onPress={handleGoToPayment}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Tổng tiền: {totalAmount.toLocaleString()} đ
          </Text>
        </TouchableOpacity>
      </View>
      {/* 
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedProduct?.name ?? "Chi tiết sản phẩm"}
            </Text>

            <Text style={{ marginTop: 8 }}>
              Giá: {selectedProduct?.price?.toLocaleString()}đ
            </Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => decreaseQuantity}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={quantity.toString()}
                onChangeText={(val) =>
                  setQuantity(Number(val) > 0 ? Number(val) : 1)
                }
              />

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text>
                Nguyên liệu thay thế: 30ml
                <Text style={{ fontWeight: "700" }}>Sữa đặt</Text> thành 30ml
                <Text style={{ fontWeight: "700" }}> Rượu</Text>
              </Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ccc" }]}
                onPress={closeModal}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#139797ff" }]}
                onPress={() => {
                  setModalVisible(false); // đóng modal cũ
                  setOpenModalNotQuantity(true);
                }}
              >
                <Text style={{ color: "#fff" }}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}

      <Modal
        animationType="none"
        transparent={true}
        visible={openModalNotQuantity}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Hết nguyên liệu</Text>
            <Text style={[styles.modalTitle, { marginTop: 20, fontSize: 13 }]}>
              Sữa đặt: hết
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ccc" }]}
                onPress={closeModal}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#139797ff" }]}
                onPress={() => openModalStorage()}
              >
                <Text style={{ color: "#fff" }}>Thay thế</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={openProductStorage}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tất cả nguyên liệu</Text>

            <FlatList
              data={productStorage}
              keyExtractor={(item) => item._id}
              renderItem={renderItemStorage}
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
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.25,
    // shadowRadius: 2,
    // elevation: 2,
    // borderBottomWidth: 0.5,
    // borderBottomColor: "#d3d3d3ff",
  },
  bottomLine: {
    alignSelf: "center",
    width: "90%", // chiếm 95% chiều ngang
    height: 0.7,
    backgroundColor: "#d3d3d3ff",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "95%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    minWidth: 30,
    textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  quantityButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  wrBottom: {
    height: 90,
    width: "100%",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 20,
    borderRadius: 10,
  },
  containerSearch: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputSearch: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    paddingVertical: 0,
  },
});
export default ExportInvoicePayment;
