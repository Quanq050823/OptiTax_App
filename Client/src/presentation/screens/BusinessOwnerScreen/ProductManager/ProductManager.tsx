import { ColorMain } from "@/src/presentation/components/colors";
import ModalAddProduct from "@/src/presentation/components/Modal/ModalAddProduct/ModalAddProduct";
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

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
};

export default function ProductManagerScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  const [showAction, setShowAction] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
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
    imageUrl: "https://example.com/images/tshirt001.jpg",
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
    try {
      await deleteProduct(id);
      fetchData(); // ⬅️ load lại danh sách sau khi xoá
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleShowAction(item.code)}>
      <View
        style={[
          styles.card,
          { width: ITEM_WIDTH, marginHorizontal: ITEM_MARGIN / 2 },
        ]}
      >
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={{ flex: 1 }}>
          <Image source={{ uri: item.imageUrl }} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.detail}>Giá: {item.price.toLocaleString()}đ</Text>
          <Text style={styles.detail}>Số lượng: {item.stock}</Text>
        </View>
        {showAction === item.code && (
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
            <AntDesign name="edit" size={24} color={ColorMain} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Quản lý sản phẩm</Text> */}

      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Tìm sản phẩm..."
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 5 }}
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
        setPrice={(price: string) => setPrice(Number(price))}
        setStock={(stock: string) => setStock(Number(stock))}
        setCode={setCode}
        setDescription={setDescription}
        setCategory={setCategory}
      />
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
    marginRight: 12,
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
});
