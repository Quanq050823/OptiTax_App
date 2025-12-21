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
import { useCallback, useEffect, useMemo, useState } from "react";
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

  const [isActive, setIsActive] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productStorage, setProductStorage] = useState<ProductInventory[]>([]);
  const [quantity, setQuantity] = useState<{ [key: string]: number }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [openModalNotQuantity, setOpenModalNotQuantity] = useState(false);
  const [openProductStorage, setOpenProductStorage] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- Fetch products ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại", [
        {
          text: "Đăng nhập lại",
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataStorage = async () => {
    try {
      const data = await getProductsInventory();
      setProductStorage(data.data);
    } catch (error) {
      Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại", [
        {
          text: "Đăng nhập lại",
          onPress: async () => {
            await apiLogout();
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          },
        },
      ]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataStorage();
  }, []);

  // --- Handle quantities ---
  const increaseQuantity = (id: string) =>
    setQuantity((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const decreaseQuantity = (id: string) =>
    setQuantity((prev) => {
      const val = (prev[id] || 1) - 1;
      if (val <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: val };
    });

  const handleExpand = (id: string) => {
    setExpandedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
    setQuantity((prev) => ({ ...prev, [id]: prev[id] || 1 }));
  };

  // --- Filtered products ---
  const filteredProducts = useMemo(
    () =>
      searchQuery.trim()
        ? products.filter((p) =>
            p.name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : products,
    [products, searchQuery]
  );

  const filteredProductStorage = useMemo(
    () => productStorage.filter((p) => p.syncStatus && p.category === 1),
    [productStorage]
  );

  // --- Total amount ---
  const totalAmount = useMemo(() => {
    const allProducts = [...products, ...productStorage];
    return Object.entries(quantity).reduce((sum, [id, qty]) => {
      const p = allProducts.find((prod) => prod._id === id);
      return sum + (p?.price || 0) * qty;
    }, 0);
  }, [quantity, products, productStorage]);

  const vatRate = (tchat: number, price: number) => {
    if (tchat === 1) return price * 0.5;
    else if (tchat === 2) return price * 2.5;
  };
  // --- Navigation to payment ---
  const handleGoToPayment = () => {
    const allProducts = [...products, ...productStorage];
    const selectedItems = allProducts
      .filter((p) => quantity[p._id])
      .map((p) => ({
        ...p,
        quantity: quantity[p._id],
        total: (p.price || 0) * quantity[p._id],
        vatRate: vatRate(p.tchat, p.price),
      }));
    navigation.navigate("PaymentInvoiceScreen", { items: selectedItems });
  };

  // --- Render items ---
  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
      const qty = quantity[item._id] || 0;
      return (
        <TouchableOpacity onPress={() => setSelectedProduct(item)}>
          <View style={[styles.card, { width: "100%" }]}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Image
                source={require("@/assets/images/no-image-news.png")}
                style={styles.image}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.detail}>
                  Giá: {item.price.toLocaleString()}đ
                </Text>
                {/* <Text style={styles.detail}>
                  Còn:
                  <Text
                    style={{
                      color: item.stock < 1 ? "#ff3e3eff" : ColorMain,
                      fontWeight: "600",
                    }}
                  >
                    {item.stock}
                  </Text>
                </Text> */}
              </View>
              <View style={{ position: "absolute", right: 10 }}>
                {qty > 0 ? (
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
                      value={qty.toString()}
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
                      onPress={() => increaseQuantity(item._id)}
                    >
                      <Text
                        style={[styles.quantityButtonText, { color: "#fff" }]}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: ColorMain,
                      borderRadius: 5,
                      padding: 5,
                    }}
                    // disabled={item.stock < 0}
                    onPress={() => increaseQuantity(item._id)}
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
    },
    [quantity]
  );

  const renderItemStorage = useCallback(
    ({ item }: { item: ProductInventory }) => {
      const qty = quantity[item._id] || 0;
      return (
        <TouchableOpacity onPress={() => increaseQuantity(item._id)}>
          <View style={[styles.card, { width: "100%" }]}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Image source={{ uri: item.imageURL }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.detail}>Số lượng: {item.stock}</Text>
                <Text style={styles.detail}>Giá: {item.price}</Text>
              </View>
              <View style={{ position: "absolute", right: 10 }}>
                {qty > 0 ? (
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
                      value={qty.toString()}
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
                      onPress={() => increaseQuantity(item._id)}
                    >
                      <Text
                        style={[styles.quantityButtonText, { color: "#fff" }]}
                      >
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
                    onPress={() => increaseQuantity(item._id)}
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
    },
    [quantity]
  );

  return (
    <View style={{ flex: 1 }}>
      <LoadingScreen visible={loading} />

      {/* Search + Controls */}
      <View
        style={{
          marginTop: 20,
          paddingHorizontal: 15,
          flexDirection: "row",
          gap: 20,
          alignItems: "center",
        }}
      >
        <View style={[styles.containerSearch, { width: "100%" }]}>
          <Entypo name="magnifying-glass" size={18} color="#666" />
          <TextInput
            placeholder="Tìm kiếm sản phẩm"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
            style={styles.inputSearch}
          />
        </View>
      </View>

      {/* Tabs */}
      <View
        style={{ flexDirection: "row", marginTop: 20, backgroundColor: "#fff" }}
      >
        <TouchableOpacity
          style={[
            { flex: 1, alignItems: "center", paddingVertical: 15 },
            !isActive && { borderBottomWidth: 3, borderColor: ColorMain },
          ]}
          onPress={() => setIsActive(false)}
        >
          <Text>Sản phẩm đã tạo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            { flex: 1, alignItems: "center", paddingVertical: 15 },
            isActive && { borderBottomWidth: 3, borderColor: ColorMain },
          ]}
          onPress={() => setIsActive(true)}
        >
          <Text>Sản phẩm từ kho</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList */}
      {!isActive ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 80, marginTop: 10 }}
          numColumns={1}
        />
      ) : (
        <FlatList
          data={filteredProductStorage}
          keyExtractor={(item) => item._id}
          renderItem={renderItemStorage}
          contentContainerStyle={{ paddingBottom: 80, marginTop: 10 }}
          numColumns={1}
        />
      )}

      {/* Bottom bar */}
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
          <Text style={{ fontWeight: "600" }}>
            {Object.keys(quantity).length}
          </Text>
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
