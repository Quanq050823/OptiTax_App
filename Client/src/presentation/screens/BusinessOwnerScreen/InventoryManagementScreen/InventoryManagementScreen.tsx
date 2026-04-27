import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ModalAddProduct from "@/src/presentation/components/Modal/ModalAddProduct/ModalAddProduct";
import ModalAddProductInventory from "@/src/presentation/components/Modal/ModalAddProductInventory";
import ModalEditProduct from "@/src/presentation/components/Modal/ModalEditProduct/ModalEditProduct";
import NewIngredientButton from "@/src/presentation/components/NewIngredientButton";
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
  getListItemStorageNew,
  getListItemStorageSynced,
  getProductsInventory,
  // getProductsInventoryByKey,
  searchProductsInventory,
  syncProduct,
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
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { CommonActions, RouteProp, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl, Swipeable } from "react-native-gesture-handler";
import { ActivityIndicator, Searchbar } from "react-native-paper";
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

const DEFAULT_THUMBNAIL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSErqSt2kBmwnB-jYBsysGhqN6cg_kuGAD7bA&s";

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
  const slideAnim = useRef(new Animated.Value(0)).current;

  const route =
    useRoute<RouteProp<RootStackParamList, "InventoryManagementScreen">>();
  const productScan = route.params?.scannedProduct;

  const navigate = useAppNavigation();
  const [productsInventory, setProductsInventory] = useState<
    ProductInventory[]
  >([]);
  const [productInventoryNew, setProductsInventoryNew] = useState<
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
  const [refreshing, setRefreshing] = useState(false);
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());
  const [openId, setOpenId] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width;
  const ITEM_MARGIN = 8;
  const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;
  const [loadingMore, setLoadingMore] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [toolsList, setToolsList] = useState<ProductInventory[]>([]);
  const [newProduct, setNewProduct] = useState<NewProductInventory>({
    name: "",
    units: "",
    price: 0,
    imageURL: "",
    stock: 0,
  });
  console.log(productInventoryNew);

  const fetchDataProductInventory = async (append = false) => {
    try {
      setLoading(true);

      const res = await getListItemStorageSynced();
      const productStorageNew = await getListItemStorageNew();
      const syncedProducts = (res.data ?? []).filter(
        (item) => item.syncStatus === true,
      );

      // ✅ Lọc thêm theo category
      const category1Products = syncedProducts.filter(
        (item) => item.category === 1,
      );
      const category2Products = syncedProducts.filter(
        (item) => item.category === 2,
      );
      setProductsInventory(category1Products);
      setToolsList(category2Products);
      setProductsInventoryNew(productStorageNew.data);
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

  console.log(productInventoryNew.length);

  useEffect(() => {
    if (productScan) {
      setNewProduct({
        name: productScan.name ?? "",
        code: productScan.code ?? productScan._id?.toString() ?? "",
        imageURL: productScan.imageURL ?? productScan.imageUrl ?? "",
        description: productScan.description ?? "",
        units: productScan.units ?? "",
        price: 0,
        stock: 0,
        category: "1",
      });
      setVisible(true);
    }
  }, [productScan]);

  const handleCreateProductInventory = async (
    newProduct: NewProductInventory,
  ) => {
    try {
      await createProductInventory(newProduct);
      Alert.alert("Thành công", "Đã tạo nguyên liệu mới");
      setVisible(false);
      fetchDataProductInventory();
    } catch (error: any) {
      const errorMessage =
        error?.message || "Vui lòng kiểm tra các trường nguyên liệu";
      Alert.alert("Lỗi", errorMessage);
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
      { cancelable: true },
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
    updatedFields: any,
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

  const renderRightActions = (item: ProductInventory) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity
        style={[styles.actionBtn, styles.actionEdit]}
        onPress={() => handleOpenModalEditProduct(item._id)}
        activeOpacity={0.8}
      >
        <AntDesign name="edit" size={20} color="#fff" />
        <Text style={styles.actionText}>Sửa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionBtn, styles.actionDelete]}
        onPress={() => handleDeleteProductInventory(item._id)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="delete-outline" size={20} color="#fff" />
        <Text style={styles.actionText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem: ListRenderItem<ProductInventory> = ({ item }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item)}
      overshootRight={false}
      ref={(ref) => {
        if (ref) swipeableRefs.current.set(item._id, ref);
      }}
      onSwipeableOpen={() => setOpenId(item._id)}
      onSwipeableClose={() => setOpenId(null)}
    >
      <View style={styles.card}>
        <Image
          source={
            item.imageURL
              ? { uri: item.imageURL }
              : require("@/assets/images/no-image-news.png")
          }
          style={styles.image}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.tagRow}>
            <Text style={styles.stockText}>Tồn: {item.stock}</Text>
            {item.unit ? (
              <View style={styles.unitTag}>
                <Text style={styles.unitTagText}>{item.unit}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.priceText}>{item.price.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity
          style={styles.actionTrigger}
          activeOpacity={0.6}
          onPress={() => {
            const current = swipeableRefs.current.get(item._id);
            if (openId === item._id) {
              current?.close();
            } else {
              if (openId) swipeableRefs.current.get(openId)?.close();
              current?.openRight();
            }
          }}
        >
          <MaterialIcons
            name={
              openId === item._id ? "keyboard-double-arrow-right" : "more-vert"
            }
            size={22}
            color="#bbb"
          />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );

  const handleSyncProductFromInvoiceIn = async () => {
    try {
      await syncProduct();
      fetchDataProductInventory();
    } catch (err) {
      console.error("Lỗi lấy names/units:", err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDataProductInventory();
    setRefreshing(false);
  }, []);
  const handleLoadMore = async () => {
    if (!loadingMore) {
      await fetchDataProductInventory(true);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.cateWrapper}>
        <TouchableOpacity
          style={[
            styles.cateItem,
            !isActive && {
              borderBottomWidth: 3,
              borderColor: ColorMain,
            },
          ]}
          onPress={() => setIsActive(false)}
        >
          <Text
            style={[
              styles.textCate,
              !isActive && { color: ColorMain, fontWeight: "700" },
            ]}
          >
            Nguyên liệu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.cateItem,
            isActive && {
              borderBottomWidth: 3,
              borderColor: ColorMain,
            },
          ]}
          onPress={() => setIsActive(true)}
        >
          <Text
            style={[
              styles.textCate,
              isActive && { color: ColorMain, fontWeight: "700" },
            ]}
          >
            Dụng cụ
          </Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <LoadingScreen visible={loading} />
      ) : productsInventory ? (
        <>
          <View style={styles.topBar}>
            <View style={styles.searchRow}>
              <View style={styles.searchInput}>
                <AntDesign name="search" size={16} color="#999" />
                <TextInput
                  placeholder="Tìm kiếm nguyên liệu..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#bbb"
                  style={styles.searchText}
                />
              </View>
              <TouchableOpacity
                style={styles.scanBtn}
                onPress={() =>
                  navigate.navigate("ScanBarcodeProductScreen", {
                    source: "InventoryManagement",
                  })
                }
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={22}
                  color={ColorMain}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.newIngredientRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.newIngredientScrollContent}
              >
                <TouchableOpacity
                  style={styles.btnSyn}
                  onPress={() => navigate.navigate("NewIngredientList")}
                >
                  <Text style={{ color: "#fff" }}>Nguyên liệu mới </Text>
                  <Entypo name="new-message" size={17} color="#fff" />
                  {productInventoryNew.length > 0 && (
                    <NewIngredientButton quantity={productInventoryNew.length} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnHistory}
                  onPress={() => navigate.navigate("SyncHistoryScreen")}
                >
                  <Ionicons name="time-outline" size={16} color={ColorMain} />
                  <Text style={styles.btnHistoryText}>Lịch sử đồng bộ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnHistory, { borderColor: ColorMain }]}
                  onPress={() => navigate.navigate("StockLogScreen")}
                >
                  <Ionicons name="archive-outline" size={16} color={ColorMain} />
                  <Text style={[styles.btnHistoryText, { color: ColorMain }]}>Lịch sử tồn kho</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
          <>
            {loading ? (
              <LoadingScreen visible={loading} />
            ) : !isActive ? (
              productsInventory.length === 0 ? (
                <View
                  style={{
                    marginTop: 40,
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#777", marginTop: 100 }}>
                    Không có nguyên liệu nào trong kho
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={productsInventory}
                  keyExtractor={(item) => item._id}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={["#FF6B00"]}
                      tintColor="#FF6B00"
                      title="Đang tải dữ liệu..."
                    />
                  }
                  ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                  contentContainerStyle={{
                    paddingTop: 12,
                    paddingBottom: 80,
                    paddingHorizontal: 5,
                  }}
                />
              )
            ) : toolsList.length === 0 ? (
              <View style={{ marginTop: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: "#777", marginTop: 100 }}>
                  Không có dụng cụ nào trong kho
                </Text>
              </View>
            ) : (
              <FlatList
                data={toolsList}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#FF6B00"]}
                    tintColor="#FF6B00"
                    title="Đang tải dữ liệu..."
                  />
                }
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                contentContainerStyle={{
                  paddingBottom: 80,
                  paddingHorizontal: 5,
                }}
              />
            )}
          </>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setVisible(true)}
          >
            <Ionicons name="add" size={28} color="#fff" />
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
            setNewProductInvenEdit={() => {}}
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
  topBar: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 3,
    gap: 10,
  },
  newIngredientRow: {
    marginTop: 4,
  },
  newIngredientScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 2,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f1f5",
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingVertical: 0,
  },
  scanBtn: {
    width: 42,
    height: 42,
    backgroundColor: "#f0f1f5",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  unitTag: {
    backgroundColor: "#eef1f9",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unitTagText: {
    fontSize: 12,
    color: ColorMain,
    fontWeight: "600",
  },
  stockText: {
    fontSize: 12,
    color: "#64748B",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "700",
    color: ColorMain,
  },
  actionTrigger: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 32,
    right: 20,
    width: 58,
    height: 58,
    backgroundColor: ColorMain,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
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
  btnSyn: {
    backgroundColor: ColorMain,
    padding: 10,
    borderRadius: 10,
    minWidth: 50,
    marginTop: 5,
	marginLeft: 8,
    flexDirection: "row",
    position: "relative",
  },
  btnHistory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorMain,
    marginTop: 5,
  },
  btnHistoryText: {
    fontSize: 13,
    color: ColorMain,
    fontWeight: "600",
  },
  cateWrapper: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    backgroundColor: "#fff",
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
  },
  cateItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  textCate: { fontSize: 16, color: "#6d6d6dff" },
  rightActionContainer: {
    width: 150,
    flexDirection: "row",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
  },
  actionBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  actionEdit: {
    backgroundColor: "#3b82f6",
  },
  actionDelete: {
    backgroundColor: "#ef4444",
  },
  actionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
