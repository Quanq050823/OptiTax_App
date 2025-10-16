import SearchByName from "@/src/presentation/components/SearchByName";
import { getProducts } from "@/src/services/API/productService";
import { getProductsInventory } from "@/src/services/API/storageService";
import { Product } from "@/src/types/route";
import { ProductInventory } from "@/src/types/storage";
import { useEffect, useState } from "react";
import {
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

function ExportInvoicePayment() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productStorage, setProductStorage] = useState<ProductInventory[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [openModalNotQuantity, setOpenModalNotQuantity] = useState(false);
  const [openProductStorage, setOpenProductStorage] = useState(false);
  const fetchData = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchDataStorage();
  }, [openProductStorage]);

  const openModal = (item: Product) => {
    setSelectedProduct(item);
    setQuantity(1);
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
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
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
      </View>
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
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <SearchByName label="Tìm kiếm nhà cung cấp" />
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
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginTop: 20,
        }}
        numColumns={2}
      />

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
                onPress={decreaseQuantity}
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
                Nguyên liệu thay thế: 30ml{" "}
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
      </Modal>

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
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
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
    padding: 8,
    width: "80%",
    textAlign: "center",
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
    marginTop: 16,
    justifyContent: "center",
    width: 50,
    gap: 20,
  },
  quantityButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
export default ExportInvoicePayment;
