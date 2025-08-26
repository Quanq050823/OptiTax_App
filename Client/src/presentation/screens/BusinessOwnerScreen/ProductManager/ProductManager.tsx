import { ColorMain } from "@/src/presentation/components/colors";
import ModalAddProduct from "@/src/presentation/components/Modal/ModalAddProduct/ModalAddProduct";
import ModalEditProduct from "@/src/presentation/components/Modal/ModalEditProduct/ModalEditProduct";
import {
  createProduct,
  deleteProduct,
  getProducts,
} from "@/src/services/API/productService";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";

export default function ProductManagerScreen() {
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

  // const [products, setProducts] = useState([
  //   {
  //     id: "1",
  //     name: "Áo thun nam",
  //     price: 150000,
  //     quantity: 10,
  //     image: "https://via.placeholder.com/80",
  //   },
  //   {
  //     id: "2",
  //     name: "Quần jeans nữ",
  //     price: 250000,
  //     quantity: 5,
  //     image: "https://via.placeholder.com/80",
  //   },
  //   {
  //     id: "3",
  //     name: "Quần jeans nam",
  //     price: 250000,
  //     quantity: 5,
  //     image: "https://via.placeholder.com/80",
  //   },
  //   {
  //     id: "4",
  //     name: "Áo khoác nam",
  //     price: 200000,
  //     quantity: 5,
  //     image: "https://via.placeholder.com/80",
  //   },
  // ]);
  const screenWidth = Dimensions.get("window").width;
  const ITEM_MARGIN = 8;
  const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;

  const newProduct = {
    name: name,
    code: code,
    category: category,
    unit: "li",
    price: price,
    description: description,
    imageUrl:
      "https://www.okoone.com/wp-content/uploads/2024/06/React-native-2-logo.png",
    stock: stock,
    attributes: [{ key: "đường", value: "có" }],
  };

  const fetchData = async () => {
    try {
      const data = await getProducts();
      setProducts(data as Product[]);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async () => {
    if (!name || !price || !stock || !description || !code || !category) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường");
      return;
    }

    const created = await createProduct(newProduct);
    if (created && typeof created === "object" && "name" in created) {
      Alert.alert(
        "Thành công",
        `Đã thêm sản phẩm: ${(created as { name: string }).name}`
      );
    } else {
      Alert.alert("Lỗi", "Không thể lấy thông tin sản phẩm vừa tạo.");
    }
    fetchData();
    setVisible(false);
    // Reset input
    setName("");
    setPrice(0);
    setStock(0);
    setImage("");
    setDescription("");
  };

  const handleShowAction = (code: string) => {
    setShowAction((prev) => (prev === code ? null : code)); // toggle
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
    setShowEditProduct((prev) => (prev === id ? null : id));
    setIdEditProduct(id);
  };
  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleShowAction(item.code)}>
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
          <Text style={styles.detail}>Giá: {item.price.toLocaleString()}đ</Text>
          <Text style={styles.detail}>Số lượng: {item.stock}</Text>
        </View>
        {showAction === item.code && (
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
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {products ? (
        <>
          {/* <Text style={styles.header}>Quản lý sản phẩm</Text> */}
          <View
            style={[styles.shadow, { marginTop: 20, paddingHorizontal: 10 }]}
          >
            <Searchbar
              placeholder="Tìm kiếm sản phẩm"
              onChangeText={setSearchQuery}
              value={searchQuery}
              icon="magnify"
              style={{ backgroundColor: "#fff" }}
              iconColor={ColorMain}
              placeholderTextColor={ColorMain}
            />
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
            contentContainerStyle={{
              paddingBottom: 80,
              paddingHorizontal: 5,
              marginTop: 20,
            }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            numColumns={2}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setVisible(true)}
          >
            <Ionicons name="add" size={28} color="#fff" />
            <Text style={styles.addText}>Thêm sản phẩm</Text>
          </TouchableOpacity>
          <ModalAddProduct
            visible={visible}
            setVisible={setVisible}
            onAddProduct={handleAddProduct}
            setName={setName}
            setPrice={(price: number) => setPrice(Number(price))}
            setStock={(stock: string) => setStock(Number(stock))}
            setCode={setCode}
            setDescription={setDescription}
            setCategory={setCategory}
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
