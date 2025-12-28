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

  const route = useRoute<RouteProp<RootStackParamList, "ProductManager">>();
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
				(item) => item.syncStatus === true
			);

			// ✅ Lọc thêm theo category
			const category1Products = syncedProducts.filter(
				(item) => item.category === 1
			);
			const category2Products = syncedProducts.filter(
				(item) => item.category === 2
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
			setVisible(true);
			// Có thể set luôn các field mặc định từ productScan
			// setName(productScan.name || "");
			// setCode(productScan._id?.toString() || "");
			// setCategory(
			//   typeof productScan.category === "object"
			//     ? Object.values(productScan.category).join(", ")
			//     : productScan.category || ""
			// );
			// setDescription(productScan.description);
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

  const renderRightActions = (item: ProductInventory) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: "#0f7aacff" }]}
        onPress={() => handleOpenModalEditProduct(item._id)}
      >
        <Text style={styles.actionText}>Sửa</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: "#c21212ff" }]}
        onPress={() => handleDeleteProductInventory(item._id)}
      >
        <Text style={styles.actionText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem: ListRenderItem<ProductInventory> = (item) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.item)}
      overshootRight={false}
      ref={(ref) => {
        if (ref) swipeableRefs.current.set(item.item._id, ref);
      }}
      onSwipeableOpen={() => setOpenId(item.item._id)}
      onSwipeableClose={() => setOpenId(null)}
    >
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
            <Image source={{ uri: item.item.imageURL }} style={styles.image} />
            <View
              style={{
                flex: 1,
                paddingHorizontal: 10,
              }}
            >
              <Text style={styles.name}>{item.item.name}</Text>
              <Text style={styles.detail}>
                Giá: {item.item.price.toLocaleString()}đ
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flex: 0.2,
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={() => {
                const current = swipeableRefs.current.get(item.item._id);

                // 🔁 Toggle open / close
                if (openId === item.item._id) {
                  current?.close();
                } else {
                  // ❌ đóng cái khác
                  if (openId) {
                    swipeableRefs.current.get(openId)?.close();
                  }
                  current?.openRight();
                }
              }}
            >
              {showAction === item.item._id ? (
                <MaterialIcons
                  name="keyboard-double-arrow-right"
                  size={24}
                  color="black"
                />
              ) : (
                <AntDesign name="edit" size={20} color="#6e6e6eff" />
              )}
            </TouchableOpacity>
            {showAction === item.item._id && (
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
                  onPress={() => handleOpenModalEditProduct(item.item._id)}
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
                  onPress={() => handleDeleteProductInventory(item.item._id)}
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
						<View
							style={{
								width: "100%",
								alignItems: "flex-end",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<TouchableOpacity
								style={styles.btnSyn}
								onPress={handleSyncProductFromInvoiceIn}
							>
								<Text style={{ color: "#fff" }}>Đồng bộ </Text>
								<Entypo name="arrow-bold-down" size={17} color="#fff" />
							</TouchableOpacity>
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
						</View>
					</View>
					{/* <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Tìm sản phẩm..."
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View> */}
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
    borderRadius: 8,
    minHeight: 100,
    paddingHorizontal: 10,
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
    marginTop: 10,
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
  btnSyn: {
    backgroundColor: ColorMain,
    padding: 10,
    borderRadius: 10,
    minWidth: 50,
    marginTop: 20,
    flexDirection: "row",
    position: "relative",
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
    width: 160,
    flexDirection: "row",
  },

  actionBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
});
