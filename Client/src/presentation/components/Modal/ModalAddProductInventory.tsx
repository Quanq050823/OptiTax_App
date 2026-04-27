import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import {
	createProductInventory,
	getProductsInventoryById,
	getUnitNameProduct,
} from "@/src/services/API/storageService";
import {
	NewProductInventory,
	ProductInventory,
	UnitsNameProduct,
} from "@/src/types/storage";

interface ModalAddProductProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onAddOrEditProductInventory: () => Promise<void>;
	newProduct: NewProductInventory;
	setNewProduct: React.Dispatch<React.SetStateAction<NewProductInventory>>;
	fetchData: () => void;
	idProduct?: string | null;
	newProductInvenEdit?: ProductInventory;
	setNewProductInvenEdit: React.Dispatch<
		React.SetStateAction<ProductInventory | undefined>
	>;
}

function ModalAddProductInventory({
	visible,
	setVisible,
	newProduct,
	setNewProduct,
	fetchData,
	onAddOrEditProductInventory,
	idProduct,
	setNewProductInvenEdit,
	newProductInvenEdit,
}: ModalAddProductProps) {
	const isEdit = !!idProduct;

	const [dataUnitGet, setDataUnitGet] = useState<
		{ label: string; value: string }[]
	>([]);
	const [loadingUnits, setLoadingUnits] = useState(true);

	const setField = (key: keyof NewProductInventory, val: any) => {
		setNewProduct((prev) => ({ ...prev, [key]: val }));
		setNewProductInvenEdit((prev) =>
			prev ? { ...prev, [key]: val } : prev
		);
	};

	const pickImage = async () => {
		const { status } =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			Alert.alert("Cần quyền truy cập ảnh");
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});
		if (!result.canceled) {
			setField("imageURL", result.assets[0].uri);
		}
	};

	useEffect(() => {
		if (!idProduct) return;
		const fetch = async () => {
			try {
				const res = await getProductsInventoryById(idProduct);
				setNewProductInvenEdit(res);
			} catch {}
		};
		fetch();
	}, [idProduct]);

	useEffect(() => {
		if (!visible) return;
		const fetchUnits = async () => {
			setLoadingUnits(true);
			try {
				const res = await getUnitNameProduct();
				setDataUnitGet(res.units.map((u) => ({ label: u, value: u })));
			} catch {}
			finally { setLoadingUnits(false); }
		};
		fetchUnits();
	}, [visible]);

	const currentImage =
		newProductInvenEdit?.imageURL || newProduct.imageURL || null;
	const categoryValue =
		newProductInvenEdit?.category?.toString() ??
		newProduct.category?.toString() ??
		"1";
	const unitValue =
		newProductInvenEdit?.unit || newProduct.units || null;

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent
			onRequestClose={() => setVisible(false)}
		>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<Pressable style={styles.overlay} onPress={() => setVisible(false)}>
					<Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
						{/* Header */}
						<View style={styles.header}>
							<View style={styles.headerDrag} />
							<View style={styles.headerRow}>
								<Text style={styles.headerTitle}>
									{isEdit ? "Chỉnh sửa nguyên liệu" : "Thêm nguyên liệu"}
								</Text>
								<TouchableOpacity
									onPress={() => setVisible(false)}
									hitSlop={12}
								>
									<MaterialIcons name="close" size={24} color="#64748B" />
								</TouchableOpacity>
							</View>
						</View>

						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.scrollContent}
							keyboardShouldPersistTaps="handled"
						>
							{/* Image picker */}
							<TouchableOpacity
								onPress={pickImage}
								style={styles.imagePicker}
								activeOpacity={0.8}
							>
								{currentImage ? (
									<Image
										source={{ uri: currentImage }}
										style={styles.imagePreview}
									/>
								) : (
									<View style={styles.imagePlaceholder}>
										<Ionicons name="camera-outline" size={32} color="#94A3B8" />
										<Text style={styles.imagePlaceholderText}>
											Chọn ảnh nguyên liệu
										</Text>
									</View>
								)}
								<View style={styles.imageEditBadge}>
									<AntDesign name="camera" size={14} color="#fff" />
								</View>
							</TouchableOpacity>

							{/* Phân loại */}
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>Phân loại</Text>
								<View style={styles.categoryRow}>
									{[
										{ label: "🥬 Nguyên liệu", value: "1" },
										{ label: "🔧 Dụng cụ", value: "2" },
									].map((cat) => (
										<TouchableOpacity
											key={cat.value}
											style={[
												styles.categoryBtn,
												categoryValue === cat.value &&
													styles.categoryBtnActive,
											]}
											onPress={() => setField("category", cat.value)}
											activeOpacity={0.8}
										>
											<Text
												style={[
													styles.categoryBtnText,
													categoryValue === cat.value &&
														styles.categoryBtnTextActive,
												]}
											>
												{cat.label}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>

							{/* Thông tin cơ bản */}
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>Thông tin cơ bản</Text>
								<View style={styles.card}>
									<View style={styles.fieldWrap}>
										<Text style={styles.fieldLabel}>Tên nguyên liệu *</Text>
										<TextInput
											style={styles.input}
											placeholder="VD: Bột mì, Đường..."
											placeholderTextColor="#CBD5E1"
											value={
												newProductInvenEdit?.name ?? newProduct.name
											}
											onChangeText={(t) => setField("name", t)}
										/>
									</View>
									<View style={styles.divider} />
									<View style={styles.fieldWrap}>
										<Text style={styles.fieldLabel}>Mã vạch / Mã sản phẩm</Text>
										<TextInput
											style={styles.input}
											placeholder="VD: 8858223008455"
											placeholderTextColor="#CBD5E1"
											value={newProduct.code ?? ""}
											onChangeText={(t) => setField("code", t)}
											keyboardType="default"
										/>
									</View>
								</View>
							</View>

							{/* Giá & Số lượng */}
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>Giá & Số lượng</Text>
								<View style={styles.card}>
									<View style={styles.fieldWrap}>
										<Text style={styles.fieldLabel}>Đơn giá (VND)</Text>
										<TextInput
											style={styles.input}
											placeholder="VD: 10000"
											placeholderTextColor="#CBD5E1"
											value={(() => {
												const v = newProductInvenEdit?.price ?? newProduct.price;
												return v ? v.toString() : "";
											})()}
											onChangeText={(t) => setField("price", Number(t) || 0)}
											keyboardType="numeric"
										/>
									</View>
									<View style={styles.divider} />
									<View style={styles.rowFields}>
										<View style={{ flex: 1 }}>
											<Text style={styles.fieldLabel}>Số lượng</Text>
											<TextInput
												style={[styles.input, { marginRight: 6 }]}
												placeholder="VD: 10"
												placeholderTextColor="#CBD5E1"
												value={(() => {
												const v = newProductInvenEdit?.stock ?? newProduct.stock;
												return v ? v.toString() : "";
											})()}
											onChangeText={(t) => setField("stock", Number(t) || 0)}
												keyboardType="numeric"
											/>
										</View>
										<View style={{ flex: 1.2 }}>
											<Text style={styles.fieldLabel}>Đơn vị tính</Text>
											<TextInput
												style={styles.input}
												placeholder="VD: kg, lít, cái..."
												placeholderTextColor="#CBD5E1"
												value={unitValue ?? ""}
												onChangeText={(t) => {
													setField("units", t);
													setNewProductInvenEdit((prev) =>
														prev ? { ...prev, unit: t } : prev
													);
												}}
											/>
										</View>
									</View>
								</View>
							</View>

							{/* Mô tả */}
							<View style={styles.section}>
								<Text style={styles.sectionLabel}>Mô tả</Text>
								<View style={styles.card}>
									<TextInput
										style={[styles.input, styles.textArea]}
										placeholder="Nhập mô tả nguyên liệu (tuỳ chọn)"
										placeholderTextColor="#CBD5E1"
										value={newProduct.description ?? ""}
										onChangeText={(t) => setField("description", t)}
										multiline
										numberOfLines={3}
										textAlignVertical="top"
									/>
								</View>
							</View>

							{/* Save */}
							<TouchableOpacity
								style={styles.saveBtn}
								onPress={onAddOrEditProductInventory}
								activeOpacity={0.85}
							>
								<Ionicons name="checkmark-circle" size={20} color="#fff" />
								<Text style={styles.saveBtnText}>
									{isEdit ? "Cập nhật" : "Lưu nguyên liệu"}
								</Text>
							</TouchableOpacity>
						</ScrollView>
					</Pressable>
				</Pressable>
			</KeyboardAvoidingView>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "flex-end",
	},
	sheet: {
		backgroundColor: "#F8FAFC",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		maxHeight: "95%",
	},
	header: {
		backgroundColor: "#fff",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingHorizontal: 16,
		paddingBottom: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#F1F5F9",
	},
	headerDrag: {
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: "#CBD5E1",
		alignSelf: "center",
		marginTop: 10,
		marginBottom: 12,
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 17,
		fontWeight: "700",
		color: "#0F172A",
	},
	scrollContent: {
		padding: 16,
		paddingBottom: 40,
		gap: 16,
	},
	imagePicker: {
		alignSelf: "center",
		position: "relative",
	},
	imagePreview: {
		width: 110,
		height: 110,
		borderRadius: 16,
		backgroundColor: "#E2E8F0",
	},
	imagePlaceholder: {
		width: 110,
		height: 110,
		borderRadius: 16,
		backgroundColor: "#F1F5F9",
		borderWidth: 2,
		borderColor: "#E2E8F0",
		borderStyle: "dashed",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
	},
	imagePlaceholderText: {
		fontSize: 11,
		color: "#94A3B8",
		textAlign: "center",
	},
	imageEditBadge: {
		position: "absolute",
		bottom: 4,
		right: 4,
		backgroundColor: ColorMain,
		borderRadius: 20,
		width: 26,
		height: 26,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#fff",
	},
	section: {
		gap: 8,
	},
	sectionLabel: {
		fontSize: 13,
		fontWeight: "600",
		color: "#64748B",
		textTransform: "uppercase",
		letterSpacing: 0.5,
		marginLeft: 4,
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 14,
		paddingHorizontal: 14,
		shadowColor: "#000",
		shadowOpacity: 0.04,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 2 },
		elevation: 1,
	},
	fieldWrap: {
		paddingVertical: 12,
	},
	fieldLabel: {
		fontSize: 12,
		fontWeight: "600",
		color: "#64748B",
		marginBottom: 6,
	},
	input: {
		fontSize: 14,
		color: "#0F172A",
		padding: 0,
		minHeight: 24,
	},
	textArea: {
		paddingVertical: 12,
		minHeight: 72,
	},
	divider: {
		height: 1,
		backgroundColor: "#F1F5F9",
	},
	rowFields: {
		flexDirection: "row",
		paddingVertical: 12,
		gap: 12,
	},
	dropdown: {
		height: 32,
		backgroundColor: "#F8FAFC",
		borderRadius: 8,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	categoryRow: {
		flexDirection: "row",
		gap: 10,
	},
	categoryBtn: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 12,
		backgroundColor: "#F1F5F9",
		alignItems: "center",
		borderWidth: 1.5,
		borderColor: "transparent",
	},
	categoryBtnActive: {
		backgroundColor: "#FFF7ED",
		borderColor: ColorMain,
	},
	categoryBtnText: {
		fontSize: 13,
		fontWeight: "600",
		color: "#64748B",
	},
	categoryBtnTextActive: {
		color: ColorMain,
	},
	saveBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		backgroundColor: ColorMain,
		paddingVertical: 15,
		borderRadius: 14,
		marginTop: 4,
		shadowColor: ColorMain,
		shadowOpacity: 0.35,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 4,
	},
	saveBtnText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 15,
	},
});
export default ModalAddProductInventory;
