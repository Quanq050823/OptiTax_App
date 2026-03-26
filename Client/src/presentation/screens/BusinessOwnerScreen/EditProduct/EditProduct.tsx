import { ColorMain } from "@/src/presentation/components/colors";
import { AntDesign } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
	Alert,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
	getProductsById,
	updateProduct,
} from "@/src/services/API/productService";
import { materials, Product } from "@/src/types/product";
import { ProductInventory, UnitsNameProduct } from "@/src/types/storage";
import {
	getProductsInventory,
	getUnitNameProduct,
} from "@/src/services/API/storageService";
import { useNavigation, useRoute } from "@react-navigation/native";

type Ingredient = {
	material: string | null;
	quantity: string;
	unit: string | null;
};

type CategoryItem = { label: string; value: string };

const donVi = [
	{ label: "ml", value: "ml" },
	{ label: "gram", value: "gram" },
	{ label: "kg", value: "kg" },
	{ label: "Phần", value: "phan" },
	{ label: "lít", value: "lit" },
];

const BUSINESS_TYPES = [
	{ label: "Phân phối / Cung cấp hàng hóa", value: "distribution" },
	{ label: "Dịch vụ (không bao gồm vật liệu)", value: "service_no_material" },
	{
		label: "Sản xuất / Xây dựng (có vật liệu)",
		value: "production_with_material",
	},
	{ label: "Hoạt động kinh doanh khác", value: "other_business" },
];

const INITIAL_INGREDIENT: Ingredient = {
	material: null,
	quantity: "",
	unit: null,
};

function EditProductScreen() {
	const route = useRoute();
	const navigation = useNavigation();
	const { id } = route.params as { id: string };

	const [ingredients, setIngredients] = useState<Ingredient[]>([
		INITIAL_INGREDIENT,
	]);
	const [newProduct, setNewProduct] = useState<Product>({
		name: "",
		code: null,
		category: "",
		unit: null,
		price: 0,
		description: "",
		imageUrl: null,
		stock: 0,
		materials: [],
	});
	const [productGet, setProductGet] = useState<Product | undefined>();
	const [productStorage, setProductStorage] = useState<ProductInventory[]>([]);
	const [unitsData, setUnitsData] = useState<UnitsNameProduct>();
	const [filteredProductsList, setFilteredProductsList] = useState<
		ProductInventory[][]
	>([]);

	const [showCategoryInput, setShowCategoryInput] = useState(false);
	const [showUnitInput, setShowUnitInput] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [newCustomUnit, setNewCustomUnit] = useState("");

	const [categoryValue, setCategoryValue] = useState<string | null>(null);
	const [unitValue, setUnitValue] = useState<string | null>(null);
	const [businessType, setBusinessType] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const [categories, setCategories] = useState<CategoryItem[]>([
		{ label: "Ăn uống", value: "an uong" },
		{ label: "Dịch vụ", value: "dich vu" },
		{ label: "Sản xuất / Công nghiệp", value: "sxcn" },
		{ label: "Nông nghiệp / Thủy sản", value: "nnts" },
		{ label: "Khác", value: "other" },
	]);

	const fetchProductById = useCallback(async () => {
		try {
			const res = await getProductsById(id);
			setProductGet(res);
		} catch {
			Alert.alert("Lỗi", "Sản phẩm không tồn tại");
		}
	}, [id]);

	// Sync form fields when product data loads
	useEffect(() => {
		if (productGet) {
			setNewProduct({
				name: productGet.name ?? "",
				code: productGet.code ?? null,
				category: productGet.category ?? "",
				unit: productGet.unit ?? null,
				price: productGet.price ?? 0,
				description: productGet.description ?? "",
				imageUrl: productGet.imageUrl ?? null,
				stock: productGet.stock ?? 0,
				materials: productGet.materials ?? [],
			});
			setCategoryValue(productGet.category ?? null);
			setUnitValue(productGet.unit ?? null);
			if (productGet.materials && productGet.materials.length > 0) {
				setIngredients(
					productGet.materials.map((m) => ({
						material: m.component,
						quantity: m.quantity,
						unit: m.unit,
					})),
				);
			}
		}
	}, [productGet]);

	useEffect(() => {
		fetchProductById();
	}, [fetchProductById]);

	useEffect(() => {
		if (productStorage.length > 0) {
			setFilteredProductsList(ingredients.map(() => [...productStorage]));
		}
	}, [productStorage, ingredients.length]);

	const fetchUnits = useCallback(async () => {
		try {
			const res = await getUnitNameProduct();
			setUnitsData(res);
		} catch {
			/* silent */
		}
	}, []);

	const fetchProductStorage = useCallback(async () => {
		try {
			const res = await getProductsInventory();
			setProductStorage(res.data);
		} catch {
			/* silent */
		}
	}, []);

	useEffect(() => {
		fetchUnits();
		fetchProductStorage();
	}, [fetchUnits, fetchProductStorage]);

	const unitOptions =
		unitsData?.units.map((u) => ({ label: u, value: u })) ?? [];

	const updateIngredient = useCallback(
		<K extends keyof Ingredient>(index: number, key: K, val: Ingredient[K]) => {
			setIngredients((prev) => {
				const next = [...prev];
				next[index] = { ...next[index], [key]: val };
				return next;
			});
		},
		[],
	);

	const removeIngredient = useCallback((index: number) => {
		setIngredients((prev) => prev.filter((_, i) => i !== index));
		setFilteredProductsList((prev) => prev.filter((_, i) => i !== index));
	}, []);

	const addIngredient = useCallback(() => {
		setIngredients((prev) => [
			...prev,
			{ material: null, quantity: "", unit: null },
		]);
		setFilteredProductsList((prev) => [...prev, [...productStorage]]);
	}, [productStorage]);

	const handleAddCategory = useCallback(() => {
		if (!newCategory.trim()) return;
		const newItem: CategoryItem = {
			label: newCategory.trim(),
			value: newCategory.trim(),
		};
		setCategories((prev) => [...prev, newItem]);
		setCategoryValue(newItem.value);
		setNewProduct((prev) => ({ ...prev, category: newItem.value }));
		setNewCategory("");
		setShowCategoryInput(false);
	}, [newCategory]);

	const handleAddUnit = useCallback(() => {
		if (!newCustomUnit.trim()) return;
		setUnitsData((prev) => ({
			names: [...(prev?.names ?? []), newCustomUnit.trim()],
			units: [...(prev?.units ?? []), newCustomUnit.trim()],
		}));
		setUnitValue(newCustomUnit.trim());
		setNewProduct((prev) => ({ ...prev, unit: newCustomUnit.trim() }));
		setNewCustomUnit("");
		setShowUnitInput(false);
	}, [newCustomUnit]);

	const handleSaveProduct = useCallback(async () => {
		if (
			!newProduct.name ||
			!newProduct.price ||
			!newProduct.code ||
			!newProduct.category
		) {
			Alert.alert(
				"Thiếu thông tin",
				"Vui lòng nhập đầy đủ các trường bắt buộc.",
			);
			return;
		}
		setIsSaving(true);
		try {
			const materialsList: materials[] = ingredients.map((ing) => ({
				component: ing.material || "",
				quantity: ing.quantity,
				unit: ing.unit || "",
			}));
			const productToSave = {
				...newProduct,
				code: newProduct.code ?? "",
				unit: newProduct.unit ?? "",
				imageUrl: newProduct.imageUrl ?? "",
				materials: materialsList,
			};
			const updated = await updateProduct(id, productToSave);
			if (updated && typeof updated === "object" && "name" in updated) {
				Alert.alert("Thành công", `Đã cập nhật: ${updated.name}`, [
					{ text: "OK", onPress: () => navigation.goBack() },
				]);
			} else {
				Alert.alert("Lỗi", "Không thể cập nhật sản phẩm.");
			}
		} catch {
			Alert.alert("Lỗi", "Đã xảy ra lỗi khi lưu.");
		} finally {
			setIsSaving(false);
		}
	}, [ingredients, newProduct, id, navigation]);

	const isValid =
		(newProduct.code?.trim() ?? "") !== "" &&
		newProduct.name.trim() !== "" &&
		newProduct.price > 0 &&
		newProduct.category.trim() !== "";

	return (
		<View style={styles.container}>
			<KeyboardAwareScrollView
				enableOnAndroid
				extraScrollHeight={120}
				keyboardOpeningTime={0}
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
			>
				{/* ── Thông tin cơ bản ── */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>
							Mã sản phẩm <Text style={styles.required}>*</Text>
						</Text>
						<TextInput
							style={styles.input}
							placeholder="VD: SP001"
							placeholderTextColor="#BBBBBB"
							value={newProduct.code ?? ""}
							onChangeText={(text) =>
								setNewProduct((p) => ({ ...p, code: text }))
							}
						/>
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>
							Tên sản phẩm <Text style={styles.required}>*</Text>
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Nhập tên sản phẩm"
							placeholderTextColor="#BBBBBB"
							value={newProduct.name}
							onChangeText={(text) =>
								setNewProduct((p) => ({ ...p, name: text }))
							}
						/>
					</View>

					<View style={styles.fieldGroup}>
						<Text style={styles.label}>
							Giá tiền (VND) <Text style={styles.required}>*</Text>
						</Text>
						<TextInput
							style={styles.input}
							placeholder="Nhập giá sản phẩm"
							placeholderTextColor="#BBBBBB"
							keyboardType="number-pad"
							value={newProduct.price > 0 ? newProduct.price.toString() : ""}
							onChangeText={(text) =>
								setNewProduct((p) => ({ ...p, price: Number(text) || 0 }))
							}
						/>
					</View>

					<View style={styles.row}>
						{/* Danh mục */}
						<View style={{ flex: 1.5 }}>
							<Text style={styles.label}>
								Danh mục <Text style={styles.required}>*</Text>
							</Text>
							<Dropdown
								style={styles.dropdown}
								data={[
									...categories,
									{ label: "+ Thêm danh mục", value: "__add__" },
								]}
								labelField="label"
								valueField="value"
								placeholder="Chọn danh mục"
								placeholderStyle={styles.dropdownPlaceholder}
								selectedTextStyle={styles.dropdownSelected}
								value={categoryValue}
								onChange={(item) => {
									if (item.value === "__add__") return;
									setCategoryValue(item.value);
									setNewProduct((p) => ({ ...p, category: item.value }));
								}}
								renderItem={(item) => {
									if (item.value === "__add__") {
										return (
											<View style={styles.addItemBox}>
												{showCategoryInput ? (
													<View style={styles.addRow}>
														<TextInput
															style={styles.addInput}
															placeholder="Tên danh mục"
															value={newCategory}
															onChangeText={setNewCategory}
															autoFocus
														/>
														<TouchableOpacity
															style={styles.addConfirmBtn}
															onPress={handleAddCategory}
														>
															<AntDesign name="check" size={15} color="#fff" />
														</TouchableOpacity>
													</View>
												) : (
													<TouchableOpacity
														onPress={() => setShowCategoryInput(true)}
													>
														<Text style={styles.addOptionText}>
															+ Thêm danh mục mới
														</Text>
													</TouchableOpacity>
												)}
											</View>
										);
									}
									return (
										<Text
											style={[
												styles.dropdownItem,
												categoryValue === item.value &&
													styles.dropdownItemActive,
											]}
										>
											{item.label}
										</Text>
									);
								}}
							/>
						</View>

						{/* Đơn vị */}
						<View style={{ flex: 1, marginLeft: 12 }}>
							<Text style={styles.label}>Đơn vị tính</Text>
							<Dropdown
								style={styles.dropdown}
								onFocus={fetchUnits}
								data={[
									...unitOptions,
									{ label: "+ Thêm đơn vị", value: "__add__" },
								]}
								labelField="label"
								valueField="value"
								placeholder="Chọn đơn vị"
								placeholderStyle={styles.dropdownPlaceholder}
								selectedTextStyle={styles.dropdownSelected}
								value={unitValue}
								onChange={(item) => {
									if (item.value === "__add__") return;
									setUnitValue(item.value);
									setNewProduct((p) => ({ ...p, unit: item.value }));
								}}
								renderItem={(item) => {
									if (item.value === "__add__") {
										return (
											<View style={styles.addItemBox}>
												{showUnitInput ? (
													<View style={styles.addRow}>
														<TextInput
															style={styles.addInput}
															placeholder="Tên đơn vị"
															value={newCustomUnit}
															onChangeText={setNewCustomUnit}
															autoFocus
														/>
														<TouchableOpacity
															style={styles.addConfirmBtn}
															onPress={handleAddUnit}
														>
															<AntDesign name="check" size={15} color="#fff" />
														</TouchableOpacity>
													</View>
												) : (
													<TouchableOpacity
														onPress={() => setShowUnitInput(true)}
													>
														<Text style={styles.addOptionText}>
															+ Thêm đơn vị mới
														</Text>
													</TouchableOpacity>
												)}
											</View>
										);
									}
									return (
										<Text
											style={[
												styles.dropdownItem,
												unitValue === item.value && styles.dropdownItemActive,
											]}
										>
											{item.label}
										</Text>
									);
								}}
							/>
						</View>
					</View>
				</View>

				{/* ── Thành phần / Nguyên liệu ── */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Thành phần / Nguyên liệu</Text>

					{/* Column headers */}
					<View style={[styles.row, { marginBottom: 6 }]}>
						<Text style={[styles.colHeader, { flex: 1.3 }]}>Nguyên liệu</Text>
						<Text
							style={[styles.colHeader, { flex: 0.8, marginHorizontal: 8 }]}
						>
							Số lượng
						</Text>
						<Text style={[styles.colHeader, { flex: 0.7 }]}>Đơn vị</Text>
						<View style={{ width: 32 }} />
					</View>

					{ingredients.map((item, index) => (
						<View key={index} style={[styles.row, { marginBottom: 10 }]}>
							<View style={{ flex: 1.3 }}>
								<Dropdown
									style={styles.dropdown}
									data={
										filteredProductsList[index]?.map((u) => ({
											label: u.name,
											value: u._id,
										})) ?? []
									}
									labelField="label"
									valueField="value"
									placeholder="Chọn"
									placeholderStyle={styles.dropdownPlaceholder}
									selectedTextStyle={styles.dropdownSelected}
									value={item.material}
									search
									searchPlaceholder="Tìm..."
									onChange={(selected) =>
										updateIngredient(index, "material", selected.value)
									}
								/>
							</View>
							<View style={{ flex: 0.8, marginHorizontal: 8 }}>
								<TextInput
									style={styles.input}
									placeholder="0"
									placeholderTextColor="#BBBBBB"
									keyboardType="decimal-pad"
									value={item.quantity}
									onChangeText={(text) =>
										updateIngredient(index, "quantity", text)
									}
								/>
							</View>
							<View style={{ flex: 0.7 }}>
								<Dropdown
									style={styles.dropdown}
									data={donVi}
									labelField="label"
									valueField="value"
									placeholder="ĐV"
									placeholderStyle={styles.dropdownPlaceholder}
									selectedTextStyle={styles.dropdownSelected}
									value={item.unit}
									onChange={(u) => updateIngredient(index, "unit", u.value)}
								/>
							</View>
							<TouchableOpacity
								style={styles.removeBtn}
								onPress={() => removeIngredient(index)}
								disabled={ingredients.length === 1}
							>
								<AntDesign
									name="minus-circle"
									size={18}
									color={ingredients.length === 1 ? "#DDD" : "#FF4D4F"}
								/>
							</TouchableOpacity>
						</View>
					))}

					<TouchableOpacity
						style={styles.addIngredientBtn}
						onPress={addIngredient}
					>
						<AntDesign name="plus-circle" size={16} color={ColorMain} />
						<Text style={[styles.addIngredientText, { color: ColorMain }]}>
							Thêm nguyên liệu
						</Text>
					</TouchableOpacity>
				</View>

				{/* ── Định nghĩa sản phẩm ── */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Định nghĩa sản phẩm</Text>
					<Dropdown
						style={styles.dropdown}
						data={BUSINESS_TYPES}
						labelField="label"
						valueField="value"
						placeholder="Chọn loại hình kinh doanh"
						placeholderStyle={styles.dropdownPlaceholder}
						selectedTextStyle={styles.dropdownSelected}
						search
						searchPlaceholder="Tìm loại hình..."
						inputSearchStyle={styles.searchInput}
						value={businessType}
						onChange={(item) => setBusinessType(item.value)}
					/>
				</View>

				{/* ── Mô tả ── */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Mô tả</Text>
					<TextInput
						style={[styles.input, styles.textarea]}
						placeholder="Nhập mô tả sản phẩm..."
						placeholderTextColor="#BBBBBB"
						value={newProduct.description}
						onChangeText={(text) =>
							setNewProduct((p) => ({ ...p, description: text }))
						}
						multiline
						numberOfLines={4}
						textAlignVertical="top"
					/>
				</View>

				{/* ── Nút lưu ── */}
				<TouchableOpacity
					style={[
						styles.saveBtn,
						(!isValid || isSaving) && styles.saveBtnDisabled,
					]}
					disabled={!isValid || isSaving}
					onPress={handleSaveProduct}
				>
					<Text style={styles.saveBtnText}>
						{isSaving ? "Đang lưu…" : "Lưu thay đổi"}
					</Text>
				</TouchableOpacity>
			</KeyboardAwareScrollView>
		</View>
	);
}

const cardShadow = Platform.select({
	ios: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.07,
		shadowRadius: 4,
	},
	android: { elevation: 2 },
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F2F4F7",
	},
	// Header
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: Platform.select({ ios: 54, android: 16 }),
		paddingBottom: 12,
		backgroundColor: "#fff",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#E0E0E0",
	},
	backBtn: {
		width: 36,
		height: 36,
		justifyContent: "center",
		alignItems: "center",
	},
	headerTitle: {
		flex: 1,
		textAlign: "center",
		fontSize: 17,
		fontWeight: "700",
		color: "#1A1A1A",
	},
	saveHeaderBtn: {
		paddingHorizontal: 14,
		paddingVertical: 7,
		backgroundColor: ColorMain,
		borderRadius: 8,
	},
	saveHeaderText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
	},
	// Scroll & layout
	scrollContent: {
		padding: 16,
		paddingBottom: 48,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 14,
		padding: 16,
		marginBottom: 14,
		...cardShadow,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "700",
		color: "#444",
		marginBottom: 14,
		paddingBottom: 10,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#EBEBEB",
		textTransform: "uppercase",
		letterSpacing: 0.4,
	},
	fieldGroup: {
		marginBottom: 14,
	},
	label: {
		fontSize: 13,
		fontWeight: "500",
		color: "#555",
		marginBottom: 6,
	},
	required: {
		color: "#FF4D4F",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
	},
	// Inputs
	input: {
		height: 44,
		backgroundColor: "#FAFAFA",
		borderWidth: 1,
		borderColor: "#E8E8E8",
		borderRadius: 9,
		paddingHorizontal: 12,
		fontSize: 14,
		color: "#1A1A1A",
	},
	textarea: {
		height: 96,
		paddingTop: 10,
		paddingBottom: 10,
	},
	// Dropdowns
	dropdown: {
		height: 44,
		backgroundColor: "#FAFAFA",
		borderWidth: 1,
		borderColor: "#E8E8E8",
		borderRadius: 9,
		paddingHorizontal: 12,
	},
	dropdownPlaceholder: {
		fontSize: 14,
		color: "#BBBBBB",
	},
	dropdownSelected: {
		fontSize: 14,
		color: "#1A1A1A",
	},
	dropdownItem: {
		paddingHorizontal: 14,
		paddingVertical: 12,
		fontSize: 14,
		color: "#333",
	},
	dropdownItemActive: {
		color: ColorMain,
		fontWeight: "600",
	},
	searchInput: {
		height: 40,
		fontSize: 14,
		color: "#333",
		borderColor: "#E8E8E8",
		borderRadius: 8,
	},
	// Add item inside dropdown
	addItemBox: {
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderTopWidth: StyleSheet.hairlineWidth,
		borderTopColor: "#EBEBEB",
	},
	addRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	addInput: {
		flex: 1,
		height: 36,
		borderWidth: 1,
		borderColor: "#E8E8E8",
		borderRadius: 7,
		paddingHorizontal: 10,
		fontSize: 13,
		backgroundColor: "#FAFAFA",
		color: "#1A1A1A",
	},
	addConfirmBtn: {
		width: 36,
		height: 36,
		backgroundColor: ColorMain,
		borderRadius: 7,
		justifyContent: "center",
		alignItems: "center",
	},
	addOptionText: {
		color: ColorMain,
		fontSize: 14,
		fontWeight: "500",
	},
	// Ingredients table
	colHeader: {
		fontSize: 11,
		fontWeight: "700",
		color: "#AAA",
		textTransform: "uppercase",
		letterSpacing: 0.3,
	},
	removeBtn: {
		width: 32,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 4,
	},
	addIngredientBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
		marginTop: 6,
		paddingVertical: 10,
		borderWidth: 1.5,
		borderColor: ColorMain,
		borderRadius: 9,
		borderStyle: "dashed",
	},
	addIngredientText: {
		fontSize: 14,
		fontWeight: "500",
	},
	// Save button
	saveBtn: {
		backgroundColor: ColorMain,
		paddingVertical: 15,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 4,
	},
	saveBtnDisabled: {
		opacity: 0.4,
	},
	saveBtnText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 0.3,
	},
});

export default EditProductScreen;
