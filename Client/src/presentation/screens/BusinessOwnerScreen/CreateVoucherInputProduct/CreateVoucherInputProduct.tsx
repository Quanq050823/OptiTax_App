import { ColorMain } from "@/src/presentation/components/colors";
import NaviBottomPay from "@/src/presentation/components/NaviBottomPay";
import { getProducts } from "@/src/services/API/productService";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import axios from "axios";
import { Searchbar } from "react-native-paper";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import ModalAddProductInVoucherInput from "@/src/presentation/components/Modal/ModalAddProductInVoucherInput";
import { Product } from "@/src/types/route";

const screenWidth = Dimensions.get("window").width;
const ITEM_MARGIN = 8;
const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;

function CreateVoucherInputProduct() {
  const navigate = useAppNavigation();
  const [products, setProducts] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [inputValues, setInputValues] = useState<{ [id: string]: string }>({});

  const renderItem = ({ item }: any) => {
    const qty = getQty(item._id);
    return (
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
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>Giá: {item.price}đ</Text>
          <Text style={styles.detail}>Tồn kho: {item.stock}</Text>
        </View>

        {qty === 0 ? (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => increaseQuantity(item)}
          >
            <Text style={{ color: "#fff" }}>Chọn</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => decreaseQuantity(item)}>
              <AntDesign name="minus" size={20} color="#000" />
            </TouchableOpacity>
            <TextInput
              style={{
                marginHorizontal: 8,
                fontWeight: "700",
                color: ColorMain,
                flex: 1,
                textAlign: "center",
              }}
              keyboardType="numeric"
              value={inputValues[item._id] ?? qty.toString()}
              onChangeText={(text) => {
                setInputValues((prev) => ({ ...prev, [item._id]: text })); // cho phép rỗng
              }}
              onEndEditing={(e) => {
                const text = e.nativeEvent.text;
                const number = parseInt(text);

                if (isNaN(number) || number <= 0) {
                  // nếu rỗng hoặc 0 → remove khỏi selected
                  setSelectedProducts((prev) =>
                    prev.filter((p) => p._id !== item._id)
                  );
                  setInputValues((prev) => {
                    const copy = { ...prev };
                    delete copy[item._id];
                    return copy;
                  });
                } else {
                  updateQuantity(item, number);
                  setInputValues((prev) => {
                    const copy = { ...prev };
                    delete copy[item._id]; // xoá state tạm, dùng qty thật
                    return copy;
                  });
                }
              }}
            />
            <TouchableOpacity onPress={() => increaseQuantity(item)}>
              <AntDesign name="plus-circle" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  const fetchData = async () => {
    try {
      const data: Product = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  console.log(products);

  useEffect(() => {
    fetchData();
  }, []);

  // Hàm tăng số lượng
  const increaseQuantity = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Hàm giảm số lượng
  const decreaseQuantity = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (!exists) return prev;
      if (exists.qty === 1) {
        return prev.filter((p) => p._id !== product._id);
      }
      return prev.map((p) =>
        p._id === product._id ? { ...p, qty: p.qty - 1 } : p
      );
    });
  };

  const updateQuantity = (product: Product, qty?: number) => {
    setSelectedProducts((prev) => {
      if (qty === undefined) return prev; // 👈 không xử lý xoá khi đang gõ
      if (qty <= 0) {
        return prev.filter((p) => p._id !== product._id);
      }
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) => (p._id === product._id ? { ...p, qty } : p));
      }
      return [...prev, { ...product, qty }];
    });
  };
  // Lấy số lượng hiện tại của sản phẩm
  const getQty = (id: string) => {
    const found = selectedProducts.find((p) => p._id === id);
    return found ? found.qty : 0;
  };

  return (
    <View style={{ flex: 1, position: "relative", paddingBottom: 50 }}>
      <View style={styles.nav}>
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
            width: "80%",
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
        <TouchableOpacity
          style={{
            width: 70,
            height: "90%",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: ColorMain,
            borderRadius: 50,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={() => setVisible(true)}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 80,
          paddingHorizontal: 5,
          marginTop: 20,
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        numColumns={2}
      />
      <ModalAddProductInVoucherInput
        visible={visible}
        setVisible={setVisible}
      />
      <NaviBottomPay
        label="Tạo Phiếu"
        des="Tổng các sản phẩm"
        selectedItems={selectedProducts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    marginHorizontal: 10,
    marginVertical: 20,
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
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  addBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#2e3e84ff",
    borderRadius: 6,
  },
  counter: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 100,
  },
});

export default CreateVoucherInputProduct;
