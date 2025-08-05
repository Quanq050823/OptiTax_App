import ModalAddProduct from "@/src/presentation/components/Modal/ModalAddProduct/ModalAddProduct";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
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
  quantity: number;
  image: string;
};

export default function ProductManagerScreen() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState("");
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Áo thun nam",
      price: 150000,
      quantity: 10,
      image: "https://via.placeholder.com/80",
    },
    {
      id: "2",
      name: "Quần jeans nữ",
      price: 250000,
      quantity: 5,
      image: "https://via.placeholder.com/80",
    },
  ]);
  const handleAddProduct = () => {
    if (!name || !price || !quantity) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường");
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      price: price,
      quantity: quantity,
      image: image || "https://via.placeholder.com/80",
    };

    setProducts([...products, newProduct]);
    setVisible(false);
    // Reset input
    setName("");
    setPrice(0);
    setQuantity(0);
    setImage("");
  };
  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.detail}>Giá: {item.price.toLocaleString()}đ</Text>
        <Text style={styles.detail}>Số lượng: {item.quantity}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#aaa" />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Quản lý sản phẩm</Text> */}

      <TextInput
        placeholder="Tìm sản phẩm..."
        style={styles.searchInput}
        placeholderTextColor="#999"
      />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
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
        setQuantity={(quantity: string) => setQuantity(Number(quantity))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 16,
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
    flexDirection: "row",
    padding: 12,
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
