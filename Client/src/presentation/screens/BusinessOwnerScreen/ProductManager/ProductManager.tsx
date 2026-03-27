import { ColorMain } from "@/src/presentation/components/colors";
import ModalAddProduct from "@/src/presentation/components/Modal/ModalAddProduct/ModalAddProduct";
import ModalEditProduct from "@/src/presentation/components/Modal/ModalEditProduct/ModalEditProduct";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { deleteProduct, getProducts } from "@/src/services/API/productService";
import { Product, RootStackParamList } from "@/src/types/route";
import {
	AntDesign,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import {
	CommonActions,
	RouteProp,
	useFocusEffect,
	useRoute,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Swipeable } from "react-native-gesture-handler";
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
	const [showEditProduct, setShowEditProduct] = useState<string | null>(null);
	const [visible, setVisible] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());
	const [openId, setOpenId] = useState<string | null>(null);

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
			setName(productScan.name || "");
			setCategory(
				typeof productScan.category === "object"
					? Object.values(productScan.category).join(", ")
					: productScan.category || "",
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
				}),
			);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchData();
		}, []),
	);

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
			{ cancelable: true },
		);
	};

	const handleOpenModalEditProduct = (id: string) => {
		// setShowEditProduct((prev) => (prev === id ? null : id));
		// setIdEditProduct(id);
		navigate.navigate("EditProductScreen", { id });
	};
	const renderRightActions = (item: Product) => (
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
				onPress={() => handleDeleteProduct(item._id)}
				activeOpacity={0.8}
			>
				<MaterialIcons name="delete-outline" size={20} color="#fff" />
				<Text style={styles.actionText}>Xóa</Text>
			</TouchableOpacity>
		</View>
	);

	const filteredProducts = searchQuery.trim()
		? products.filter((p) =>
				p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
		  )
		: products;

	const renderItem = ({ item }: { item: Product }) => (
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
						item.imageUrl
							? { uri: item.imageUrl }
							: require("@/assets/images/no-image-news.png")
					}
					style={styles.image}
				/>
				<View style={styles.cardInfo}>
					<Text style={styles.name} numberOfLines={2}>
						{item.name}
					</Text>
					{item.unit ? (
						<Text style={styles.unitText}>{item.unit}</Text>
					) : null}
					<Text style={styles.priceText}>
						{item.price.toLocaleString()}đ
					</Text>
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
						name={openId === item._id ? "keyboard-double-arrow-right" : "more-vert"}
						size={22}
						color="#bbb"
					/>
				</TouchableOpacity>
			</View>
		</Swipeable>
	);

	return (
		<View style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.searchRow}>
					<View style={styles.searchInput}>
						<AntDesign name="search" size={16} color="#999" />
						<TextInput
							placeholder="Tìm kiếm sản phẩm..."
							value={searchQuery}
							onChangeText={setSearchQuery}
							placeholderTextColor="#bbb"
							style={styles.searchText}
						/>
					</View>
					<TouchableOpacity
						style={styles.scanBtn}
						onPress={() => navigate.navigate("ScanBarcodeProductScreen")}
						activeOpacity={0.7}
					>
						<MaterialCommunityIcons name="barcode-scan" size={22} color={ColorMain} />
					</TouchableOpacity>
				</View>
			</View>

			{/* List */}
			<FlatList
				data={filteredProducts}
				keyExtractor={(item) => item._id}
				renderItem={renderItem}
				ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<MaterialIcons name="inventory" size={48} color="#ddd" />
						<Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
					</View>
				}
			/>

			{/* FAB */}
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => navigate.navigate("CreateProductScreen")}
				activeOpacity={0.85}
			>
				<Ionicons name="add" size={30} color="#fff" />
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
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f6fa",
	},
	header: {
		backgroundColor: "#fff",
		paddingHorizontal: 16,
		paddingTop: 14,
		paddingBottom: 14,
		// iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.07,
		shadowRadius: 4,
		// Android
		elevation: 3,
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
	listContent: {
		paddingTop: 12,
		paddingHorizontal: 12,
		paddingBottom: 100,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderRadius: 12,
		paddingVertical: 12,
		paddingHorizontal: 14,
		gap: 14,
		// iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.07,
		shadowRadius: 4,
		// Android
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
	unitText: {
		fontSize: 12,
		color: "#999",
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
	emptyState: {
		alignItems: "center",
		justifyContent: "center",
		paddingTop: 80,
		gap: 12,
	},
	emptyText: {
		fontSize: 14,
		color: "#ccc",
	},
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
		// iOS
		shadowColor: ColorMain,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.4,
		shadowRadius: 6,
		// Android
		elevation: 6,
	},
});
