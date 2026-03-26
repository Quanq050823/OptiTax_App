import { ColorMain } from "@/src/presentation/components/colors";
import { AntDesign } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
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
import { createProduct } from "@/src/services/API/productService";
import { materials, Product } from "@/src/types/product";
import { ProductInventory, UnitsNameProduct } from "@/src/types/storage";
import {
	getProductsInventory,
	getUnitNameProduct,
} from "@/src/services/API/storageService";
import ModalConversUnit from "@/src/presentation/components/Modal/ModalConversUnit";

type Ingredient = {
	material: string | null;
	quantity: string;
	unit: string | null;
};

type CategoryItem = { label: string; value: string };

const INITIAL_INGREDIENT: Ingredient = {
	material: null,
	quantity: "",
	unit: null,
};

function CreateProductScreen() {
	const navigation = useAppNavigation();
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
	const [productStorage, setProductStorage] = useState<ProductInventory[]>([]);
	const [unitsData, setUnitsData] = useState<UnitsNameProduct>();
	const [filteredProductsList, setFilteredProductsList] = useState<
		ProductInventory[][]
	>([]);

	const [openModalConvers, setOpenModalConvers] = useState(false);
	const [idProductStorage, setIdProductStorage] = useState("");

	const [showUnitInput, setShowUnitInput] = useState(false);
	const [newCustomUnit, setNewCustomUnit] = useState("");
	const [unitValue, setUnitValue] = useState<string | null>(null);

	const [isSaving, setIsSaving] = useState(false);

	const [categories, setCategories] = useState<CategoryItem[]>([
		{ label: "Ăn uống", value: "an uong" },
		{ label: "Dịch vụ", value: "dich vu" },
		{ label: "Sản xuất / Công nghiệp", value: "sxcn" },
		{ label: "Nông nghiệp / Thủy sản", value: "nnts" },
		{ label: "Khác", value: "other" },
	]);
	const [showCategoryInput, setShowCategoryInput] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [categoryValue, setCategoryValue] = useState<string | null>(null);

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

	const addIngredient = useCallback(() => {
		setIngredients((prev) => [
			...prev,
			{ material: null, quantity: "", unit: null },
		]);
		setFilteredProductsList((prev) => [...prev, [...productStorage]]);
	}, [productStorage]);

	const removeIngredient = useCallback((index: number) => {
		setIngredients((prev) => prev.filter((_, i) => i !== index));
		setFilteredProductsList((prev) => prev.filter((_, i) => i !== index));
	}, []);

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

	const getAvailableUnits = useCallback(
		(materialId: string | null) => {
			if (!materialId) return [];
			const product = productStorage.find((p) => p._id === materialId);
			if (!product) return [];
			const units = new Set<string>();
			if (product.unit) units.add(product.unit);
			if (product.conversionUnit?.to) {
				product.conversionUnit.to.forEach((conversion: any) => {
					if (conversion.itemName) units.add(conversion.itemName);
				});
			}
			return Array.from(units).map((unit) => ({ label: unit, value: unit }));
		},
		[productStorage],
	);

	const handleAddProduct = useCallback(async () => {
		const isIngredientsValid = ingredients.every(
			(i) =>
				(i.material?.trim() ?? "") !== "" &&
				(i.quantity?.trim() ?? "") !== "" &&
				(i.unit?.trim() ?? "") !== "",
		);
		if (
			!newProduct.name ||
			!newProduct.price ||
			!newProduct.unit ||
			!isIngredientsValid
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
			const productToCreate: Product = {
				...newProduct,
				code: newProduct.code ?? null,
				unit: newProduct.unit ?? null,
				imageUrl: newProduct.imageUrl ?? null,
				materials: materialsList,
			};
			const created = await createProduct(productToCreate);
			if (created && typeof created === "object" && "name" in created) {
				Alert.alert("Thành công", `Đã thêm sản phẩm: ${created.name}`, [
					{ text: "OK", onPress: () => navigation.goBack() },
				]);
			} else {
				Alert.alert("Lỗi", "Không thể lấy thông tin sản phẩm vừa tạo.");
			}
		} catch (error: any) {
			Alert.alert("Lỗi", error?.message || "Có lỗi xảy ra khi tạo sản phẩm.");
		} finally {
			setIsSaving(false);
		}
	}, [ingredients, newProduct]);

	const isValid =
		newProduct.name.trim() !== "" &&
		newProduct.price > 0 &&
		(newProduct.unit?.trim() ?? "") !== "" &&
		ingredients.every(
			(i) =>
				(i.material?.trim() ?? "") !== "" &&
				(i.quantity?.trim() ?? "") !== "" &&
				(i.unit?.trim() ?? "") !== "",
		);

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
						<Text style={styles.label}>Mã sản phẩm</Text>
						<TextInput
							style={styles.input}
							placeholder="Tạo tự động, VD: SP001"
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
						<View style={{ flex: 1.4 }}>
							<Text style={styles.label}>Danh mục</Text>
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
							<Text style={styles.label}>
								Đơn vị tính <Text style={styles.required}>*</Text>
							</Text>
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
					<Text style={styles.sectionTitle}>
						Thành phần / Nguyên liệu <Text style={styles.required}>*</Text>
					</Text>

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

					{ingredients.map((item, index) => {
						const disableConvert = !item.material;
						return (
							<View key={index} style={[styles.row, { marginBottom: 10 }]}>
								{/* Nguyên liệu */}
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
										onChange={(selected) => {
											updateIngredient(index, "material", selected.value);
											setIdProductStorage(selected.value);
										}}
									/>
								</View>

								{/* Số lượng */}
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

								{/* Đơn vị */}
								<View style={{ flex: 0.7 }}>
									<Dropdown
										style={styles.dropdown}
										data={[
											{
												label: "+ Quy đổi",
												value: "__add__",
												disable: disableConvert,
											},
											...getAvailableUnits(item.material),
										]}
										labelField="label"
										valueField="value"
										placeholder="ĐV"
										placeholderStyle={styles.dropdownPlaceholder}
										selectedTextStyle={styles.dropdownSelected}
										value={item.unit}
										renderItem={(u) => {
											const isAdd = u.value === "__add__";
											return (
												<Text
													style={[
														styles.dropdownItem,
														isAdd && {
															color: disableConvert ? "#CCC" : ColorMain,
															fontWeight: "600",
														},
													]}
												>
													{u.label}
												</Text>
											);
										}}
										onChange={(u) => {
											if (u.value === "__add__") {
												if (disableConvert) return;
												setOpenModalConvers(true);
												return;
											}
											updateIngredient(index, "unit", u.value);
										}}
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
						);
					})}

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

				{/* ── Nút thêm ── */}
				<TouchableOpacity
					style={[
						styles.saveBtn,
						(!isValid || isSaving) && styles.saveBtnDisabled,
					]}
					disabled={!isValid || isSaving}
					onPress={handleAddProduct}
				>
					<Text style={styles.saveBtnText}>
						{isSaving ? "Đang lưu…" : "Thêm sản phẩm"}
					</Text>
				</TouchableOpacity>
			</KeyboardAwareScrollView>

			<ModalConversUnit
				visible={openModalConvers}
				id={idProductStorage}
				setVisible={setOpenModalConvers}
				onSuccess={fetchProductStorage}
			/>
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
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingTop: Platform.select({ ios: 54, android: 16 }),
		paddingBottom: 12,
		backgroundColor: "#fff",
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: "#E0E0E0",
	},
	headerTitle: {
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

export default CreateProductScreen;
