import { ColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ModalAddCategoryByProductStorage from "@/src/presentation/components/Modal/ModalAddCategoryByProductStorage";
import { getProductsInventory } from "@/src/services/API/storageService";
import { ProductInventory } from "@/src/types/storage";
import {
	AntDesign,
	Entypo,
	Fontisto,
	MaterialCommunityIcons,
	MaterialIcons,
} from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	ListRenderItem,
	RefreshControl,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const DEFAULT_THUMBNAIL =
	"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSErqSt2kBmwnB-jYBsysGhqN6cg_kuGAD7bA&s";

function NewIngredientList() {
	const [newIngredientList, setNewIngredientList] = useState<
		ProductInventory[]
	>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(false);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [productSelected, setProductSelected] = useState<ProductInventory[]>(
		[]
	);
	const [openModalAddCate, setOpenModalAddCate] = useState(false);
	const fetchDataProductInventory = async (append = false) => {
		setLoading(true);

		try {
			const res = await getProductsInventory();
			const unsyncedProducts = res.data.filter(
				(item) => item.syncStatus === false
			);
			setNewIngredientList(unsyncedProducts);
		} catch {
			console.log("Lỗi! Chưa có dữ liệu!");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchDataProductInventory();
	}, []);
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchDataProductInventory();
		setRefreshing(false);
	}, []);

	const handleSelect = (product: ProductInventory) => {
		setSelectedIds((prev) =>
			prev.includes(product._id)
				? prev.filter((id) => id !== product._id)
				: [...prev, product._id]
		);

		setProductSelected((prev) =>
			prev.some((p) => p._id === product._id)
				? prev.filter((p) => p._id !== product._id)
				: [...prev, product]
		);
	};
	const renderItem: ListRenderItem<ProductInventory> = ({ item }) => {
		const isSelected = selectedIds.includes(item._id);

		return (
			<TouchableOpacity
				key={item._id}
				onPress={() => handleSelect(item)}
				activeOpacity={0.7}
			>
				<View style={styles.card}>
					{/* Tag Mới */}
					<View style={styles.tagNew}>
						<Text style={styles.tagText}>Mới</Text>
					</View>

					{/* Checkbox */}
					{selected && (
						<MaterialCommunityIcons
							style={styles.checkbox}
							name={
								isSelected
									? "checkbox-marked-circle"
									: "checkbox-blank-circle-outline"
							}
							size={24}
							color={isSelected ? ColorMain : "#ccc"}
						/>
					)}

					{/* Hình ảnh */}
					<Image
						source={{ uri: item.imageURL || DEFAULT_THUMBNAIL }}
						style={styles.image}
					/>

					{/* Thông tin sản phẩm */}
					<View style={styles.infoContainer}>
						<Text numberOfLines={2} ellipsizeMode="tail" style={styles.name}>
							{item.name}
						</Text>
						<View style={styles.detailsRow}>
							<View style={styles.detailItem}>
								<MaterialIcons name="inventory" size={16} color="#666" />
								<Text style={styles.detailText}>{item.stock}</Text>
							</View>
							<View style={styles.detailItem}>
								<MaterialCommunityIcons
									name="tag-outline"
									size={16}
									color="#666"
								/>
								<Text style={styles.detailText}>{item.unit}</Text>
							</View>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	};
	return (
		<View style={{ flex: 1 }}>
			<LoadingScreen visible={loading} />

			<View
				style={{
					padding: 10,
					justifyContent: "flex-end",
					flexDirection: "row",
				}}
			>
				<TouchableOpacity
					style={styles.btnSyn}
					onPress={() => setSelected(!selected)}
				>
					{!selected ? (
						<>
							<Text style={{ color: "#fff", fontWeight: "600" }}>Chọn </Text>
							<MaterialCommunityIcons name="select" size={17} color="#fff" />
						</>
					) : (
						<>
							<Text style={{ color: "#fff", fontWeight: "600" }}>Hủy </Text>
							<AntDesign name="close" size={17} color="#fff" />
						</>
					)}
				</TouchableOpacity>
			</View>
			{newIngredientList.length > 0 ? (
				<FlatList
					data={newIngredientList}
					keyExtractor={(item) => item._id}
					renderItem={renderItem}
					contentContainerStyle={{
						paddingBottom: 100,
						paddingHorizontal: 12,
					}}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							colors={[ColorMain]}
							tintColor={ColorMain}
							title="Đang tải dữ liệu..."
						/>
					}
				/>
			) : (
				<View
					style={{ flex: 1, alignContent: "center", justifyContent: "center" }}
				>
					<Text style={{ textAlign: "center", marginBottom: 100 }}>
						Không có nguyên liệu mới
					</Text>
				</View>
			)}
			{selected && (
				<TouchableOpacity
					onPress={() => setOpenModalAddCate(true)}
					disabled={productSelected.length > 0 ? false : true}
					style={[
						styles.btnSyn,
						{
							position: "absolute",
							bottom: 30,
							alignSelf: "center",
							paddingHorizontal: 30,
							paddingVertical: 20,
							borderRadius: 50,
							opacity: productSelected.length > 0 ? 1 : 0.5,
						},
					]}
				>
					<Text style={{ color: "#fff", fontWeight: "700" }}>
						Phân loại ({productSelected.length})
					</Text>
					{/* <Entypo name="arrow-right" size={17} color="#fff" /> */}
				</TouchableOpacity>
			)}
			<ModalAddCategoryByProductStorage
				visible={openModalAddCate}
				setVisible={setOpenModalAddCate}
				loading={loading}
				setLoading={setLoading}
				listProductAdd={productSelected}
				onSuccess={async () => {
					await fetchDataProductInventory();
					setProductSelected([]);
					setSelectedIds([]);
					setSelected(false);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
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
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 12,
		marginBottom: 10,
		borderRadius: 12,
		position: "relative",
		// Shadow
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 3,
	},
	image: {
		width: 70,
		height: 70,
		borderRadius: 10,
		marginRight: 12,
	},
	infoContainer: {
		flex: 1,
		justifyContent: "center",
		paddingRight: 8,
	},
	name: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 6,
	},
	detailsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	detailItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	detailText: {
		fontSize: 13,
		color: "#666",
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
	btnSyn: {
		backgroundColor: ColorMain,
		padding: 8,
		borderRadius: 10,
		minWidth: 70,
		marginTop: 10,
		flexDirection: "row",
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
	},
	tagNew: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		backgroundColor: "#FF3B30",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		position: "absolute",
		right: 8,
		top: 8,
		zIndex: 10,
	},
	tagText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 11,
	},
	checkbox: {
		position: "absolute",
		left: 8,
		top: 8,
		zIndex: 10,
	},
	checked: {
		position: "absolute",
		left: 7,
		top: 7,
	},
});
export default NewIngredientList;
