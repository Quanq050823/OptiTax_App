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
						p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
					)
				: products,
		[products, searchQuery],
	);

	const filteredProductStorage = useMemo(
		() => productStorage.filter((p) => p.syncStatus && p.category === 1),
		[productStorage],
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
				<View style={styles.card}>
					<View style={styles.cardRow}>
						<Image
							source={require("@/assets/images/no-image-news.png")}
							style={styles.image}
						/>
						<View style={styles.cardInfo}>
							<Text style={styles.productName} numberOfLines={2}>
								{item.name}
							</Text>
							<Text style={styles.priceText}>
								{item.price.toLocaleString()}đ
							</Text>
						</View>
						<View style={styles.quantityWrapper}>
							{qty > 0 ? (
								<View style={styles.stepper}>
									<TouchableOpacity
										style={styles.stepBtn}
										onPress={() => decreaseQuantity(item._id)}
										activeOpacity={0.7}
									>
										<Text style={styles.stepBtnText}>−</Text>
									</TouchableOpacity>
									<TextInput
										style={styles.stepInput}
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
										style={[styles.stepBtn, styles.stepBtnActive]}
										onPress={() => increaseQuantity(item._id)}
										activeOpacity={0.7}
									>
										<Text style={[styles.stepBtnText, { color: "#fff" }]}>
											+
										</Text>
									</TouchableOpacity>
								</View>
							) : (
								<TouchableOpacity
									style={styles.addBtn}
									onPress={() => increaseQuantity(item._id)}
									activeOpacity={0.7}
								>
									<Entypo name="plus" size={18} color="#fff" />
								</TouchableOpacity>
							)}
						</View>
					</View>
				</View>
			);
		},
		[quantity],
	);

	const renderItemStorage = useCallback(
		({ item }: { item: ProductInventory }) => {
			const qty = quantity[item._id] || 0;
			const isOutOfStock = item.stock < 1;
			const conversionText =
				item.conversionUnit?.isActive &&
				item.conversionUnit.from?.itemQuantity &&
				item.conversionUnit.to?.[0]?.itemName &&
				item.conversionUnit.to?.[0]?.itemQuantity
					? `(${Math.round(
							(item.stock * item.conversionUnit.to[0].itemQuantity) /
								item.conversionUnit.from.itemQuantity,
						)} ${item.conversionUnit.to[0].itemName})`
					: null;

			return (
				<View style={[styles.card, isOutOfStock && styles.cardDisabled]}>
					<View style={styles.cardRow}>
						<View style={styles.imageWrapper}>
							<Image
								source={
									item.imageURL
										? { uri: item.imageURL }
										: require("@/assets/images/no-image-news.png")
								}
								style={styles.image}
							/>
							{isOutOfStock && (
								<View style={styles.outOfStockBadge}>
									<Text style={styles.outOfStockText}>Hết hàng</Text>
								</View>
							)}
						</View>
						<View style={styles.cardInfo}>
							<Text style={styles.productName} numberOfLines={2}>
								{item.name}
							</Text>
							<View style={styles.stockRow}>
								<Text style={styles.stockLabel}>Tồn kho: </Text>
								<Text style={styles.stockValue}>
									{`${item.stock.toFixed(2)}${item.unit ? ` ${item.unit}` : ""}`}
								</Text>
							</View>
							{conversionText && (
								<Text style={styles.conversionText}>{conversionText}</Text>
							)}
							<Text style={styles.priceText}>
								{item.price.toLocaleString()}đ
							</Text>
						</View>
						<View style={styles.quantityWrapper}>
							{qty > 0 ? (
								<View style={styles.stepper}>
									<TouchableOpacity
										style={styles.stepBtn}
										onPress={() => decreaseQuantity(item._id)}
										activeOpacity={0.7}
									>
										<Text style={styles.stepBtnText}>−</Text>
									</TouchableOpacity>
									<TextInput
										style={styles.stepInput}
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
										style={[styles.stepBtn, styles.stepBtnActive]}
										onPress={() => increaseQuantity(item._id)}
										activeOpacity={0.7}
									>
										<Text style={[styles.stepBtnText, { color: "#fff" }]}>
											+
										</Text>
									</TouchableOpacity>
								</View>
							) : (
								<TouchableOpacity
									style={[styles.addBtn, isOutOfStock && styles.addBtnDisabled]}
									disabled={isOutOfStock}
									onPress={() => increaseQuantity(item._id)}
									activeOpacity={0.7}
								>
									<Entypo name="plus" size={18} color="#fff" />
								</TouchableOpacity>
							)}
						</View>
					</View>
				</View>
			);
		},
		[quantity],
	);

	return (
		<View style={styles.screen}>
			<LoadingScreen visible={loading} />

			{/* Header: Search + Tabs */}
			<View style={styles.header}>
				<View style={styles.containerSearch}>
					<Entypo name="magnifying-glass" size={18} color="#999" />
					<TextInput
						placeholder="Tìm kiếm sản phẩm"
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholderTextColor="#bbb"
						style={styles.inputSearch}
					/>
				</View>

				<View style={styles.tabTrack}>
					<TouchableOpacity
						style={[styles.tabItem, !isActive && styles.tabItemActive]}
						onPress={() => setIsActive(false)}
						activeOpacity={0.8}
					>
						<Text style={[styles.tabText, !isActive && styles.tabTextActive]}>
							Sản phẩm đã tạo
						</Text>
						{filteredProducts.length > 0 && (
							<View
								style={[styles.tabBadge, !isActive && styles.tabBadgeActive]}
							>
								<Text
									style={[
										styles.tabBadgeText,
										!isActive && styles.tabBadgeTextActive,
									]}
								>
									{filteredProducts.length}
								</Text>
							</View>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.tabItem, isActive && styles.tabItemActive]}
						onPress={() => setIsActive(true)}
						activeOpacity={0.8}
					>
						<Text style={[styles.tabText, isActive && styles.tabTextActive]}>
							Sản phẩm từ kho
						</Text>
						{filteredProductStorage.length > 0 && (
							<View
								style={[styles.tabBadge, isActive && styles.tabBadgeActive]}
							>
								<Text
									style={[
										styles.tabBadgeText,
										isActive && styles.tabBadgeTextActive,
									]}
								>
									{filteredProductStorage.length}
								</Text>
							</View>
						)}
					</TouchableOpacity>
				</View>
			</View>

			{/* FlatList */}
			{!isActive ? (
				<FlatList
					data={filteredProducts}
					keyExtractor={(item) => item._id}
					renderItem={renderItem}
					contentContainerStyle={styles.listContent}
					numColumns={1}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<FlatList
					data={filteredProductStorage}
					keyExtractor={(item) => item._id}
					renderItem={renderItemStorage}
					contentContainerStyle={styles.listContent}
					numColumns={1}
					showsVerticalScrollIndicator={false}
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
	screen: {
		flex: 1,
		backgroundColor: "#f5f6fa",
	},
	header: {
		backgroundColor: "#fff",
		paddingTop: 16,
		paddingHorizontal: 16,
		paddingBottom: 12,
		// iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.07,
		shadowRadius: 4,
		// Android
		elevation: 3,
	},
	listContent: {
		paddingTop: 12,
		paddingBottom: 100,
		paddingHorizontal: 12,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		marginBottom: 10,
		paddingVertical: 14,
		paddingHorizontal: 14,
		// iOS shadow
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		// Android shadow
		elevation: 2,
	},
	cardDisabled: {
		opacity: 0.55,
	},
	cardRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	imageWrapper: {
		position: "relative",
	},
	image: {
		width: 72,
		height: 72,
		borderRadius: 10,
		backgroundColor: "#f0f0f0",
	},
	outOfStockBadge: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0,0,0,0.55)",
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		paddingVertical: 3,
		alignItems: "center",
	},
	outOfStockText: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "600",
	},
	cardInfo: {
		flex: 1,
		gap: 4,
	},
	productName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#1a1a1a",
		lineHeight: 20,
	},
	priceText: {
		fontSize: 14,
		fontWeight: "700",
		color: ColorMain,
		marginTop: 2,
	},
	stockRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	stockLabel: {
		fontSize: 13,
		color: "#888",
	},
	stockValue: {
		fontSize: 13,
		fontWeight: "600",
		color: "#333",
	},
	conversionText: {
		fontSize: 12,
		color: "#aaa",
		fontStyle: "italic",
	},
	quantityWrapper: {
		alignItems: "center",
		justifyContent: "center",
	},
	stepper: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},
	stepBtn: {
		width: 30,
		height: 30,
		borderRadius: 8,
		backgroundColor: "#f0f0f0",
		alignItems: "center",
		justifyContent: "center",
	},
	stepBtnActive: {
		backgroundColor: ColorMain,
	},
	stepBtnText: {
		fontSize: 18,
		fontWeight: "600",
		color: "#444",
		lineHeight: 22,
	},
	stepInput: {
		minWidth: 36,
		textAlign: "center",
		fontSize: 14,
		fontWeight: "600",
		color: "#1a1a1a",
		borderWidth: 1,
		borderColor: "#e0e0e0",
		borderRadius: 6,
		paddingHorizontal: 4,
		paddingVertical: 4,
		backgroundColor: "#fafafa",
	},
	addBtn: {
		width: 36,
		height: 36,
		borderRadius: 10,
		backgroundColor: ColorMain,
		alignItems: "center",
		justifyContent: "center",
	},
	addBtnDisabled: {
		backgroundColor: "#ccc",
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
	tabTrack: {
		flexDirection: "row",
		backgroundColor: "#f0f1f5",
		borderRadius: 10,
		padding: 4,
		marginTop: 12,
	},
	tabItem: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 9,
		borderRadius: 8,
		gap: 6,
	},
	tabItemActive: {
		backgroundColor: "#fff",
		// iOS shadow for active pill
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 2,
	},
	tabText: {
		fontSize: 13,
		fontWeight: "500",
		color: "#999",
	},
	tabTextActive: {
		color: ColorMain,
		fontWeight: "700",
	},
	tabBadge: {
		minWidth: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: "#ddd",
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 5,
	},
	tabBadgeActive: {
		backgroundColor: ColorMain + "20",
	},
	tabBadgeText: {
		fontSize: 11,
		fontWeight: "600",
		color: "#999",
	},
	tabBadgeTextActive: {
		color: ColorMain,
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
		backgroundColor: "#f0f1f5",
		borderRadius: 10,
		height: 42,
		paddingHorizontal: 12,
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
