import {
	Image,
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Alert,
	ScrollView,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { ColorMain } from "../colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { ProductInventory } from "@/src/types/storage";
import { useEffect, useState } from "react";
import {
	getProductsInventoryById,
	updateUnitConversion,
} from "@/src/services/API/storageService";

type ConverItem = {
	visible: boolean;
	id: string;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	onSuccess?: () => void;
};

type ConversionItem = {
	itemName: string;
	itemQuantity: string;
};

function ModalConversUnit({ visible, id, setVisible, onSuccess }: ConverItem) {
	const [item, setItem] = useState<ProductInventory>();
	const [conversions, setConversions] = useState<ConversionItem[]>([
		{ itemName: "", itemQuantity: "" },
	]);

	useEffect(() => {
		const fetchProduct = async () => {
			if (id) {
				try {
					const product = await getProductsInventoryById(id);
					setItem(product);

					// Load existing conversions if any
					if (
						product?.conversionUnit?.to &&
						product.conversionUnit.to.length > 0
					) {
						const existingConversions = product.conversionUnit.to.map(
							(conv) => ({
								itemName: conv.itemName || "",
								itemQuantity: conv.itemQuantity?.toString() || "",
							})
						);
						setConversions(existingConversions);
					}
				} catch (error) {
					console.log("❌ Không lấy được thông tin sản phẩm:", error);
				}
			}
		};

		if (visible && id) {
			fetchProduct();
		}
	}, [id, visible]);

	const handleAddConversion = () => {
		setConversions([...conversions, { itemName: "", itemQuantity: "" }]);
	};

	const handleUpdateConversion = (
		index: number,
		field: keyof ConversionItem,
		value: string
	) => {
		const updated = [...conversions];
		updated[index][field] = value;
		setConversions(updated);
	};

	const handleRemoveConversion = (index: number) => {
		if (conversions.length > 1) {
			setConversions(conversions.filter((_, i) => i !== index));
		}
	};

	const handleSave = async () => {
		if (!id || !item) {
			Alert.alert("Lỗi", "Không tìm thấy thông tin sản phẩm");
			return;
		}

		const validConversions = conversions.filter(
			(conv) => conv.itemName.trim() !== "" && conv.itemQuantity.trim() !== ""
		);

		if (validConversions.length === 0) {
			Alert.alert("Lỗi", "Vui lòng nhập ít nhất một quy đổi đơn vị");
			return;
		}

		for (const conv of validConversions) {
			const qty = parseFloat(conv.itemQuantity);
			if (isNaN(qty) || qty <= 0) {
				Alert.alert("Lỗi", `Số lượng "${conv.itemQuantity}" không hợp lệ`);
				return;
			}
		}

		try {
			const conversionData = {
				from: {
					itemQuantity: 1,
				},
				to: validConversions.map((conv) => ({
					itemName: conv.itemName,
					itemQuantity: parseFloat(conv.itemQuantity),
				})),
			};

			await updateUnitConversion(id, conversionData);
			Alert.alert("Thành công", "Đã lưu quy đổi đơn vị");
			if (onSuccess) {
				onSuccess();
			}
			setVisible(false);
		} catch (error: any) {
			const errorMessage = error?.message || "Không thể lưu quy đổi đơn vị";
			Alert.alert("Lỗi", errorMessage);
		}
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			// onRequestClose={() => setVisible(false)}
			style={{ zIndex: 100 }}
		>
			<Pressable style={styles.overlay}>
				<View style={styles.modalContent}>
					<View style={styles.tittleWr}>
						<Text style={styles.tittle}>Quy đổi đơn vị tính của sản phẩm</Text>
						<TouchableOpacity
							style={styles.cancleAction}
							onPress={() => setVisible(false)}
						>
							<Text style={{ color: "#e20c0cff", fontWeight: "500" }}>Hủy</Text>
						</TouchableOpacity>
					</View>

					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.itemWr}>
							<View>
								<Image
									width={50}
									height={50}
									source={{
										uri:
											item?.imageURL ??
											"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTixbrVNY9XIHQBZ1iehMIV0Z9AtHB9dp46lg&s",
									}}
								/>
							</View>
							<View>
								<Text>{item?.name}</Text>
							</View>
						</View>
						<Text
							style={{
								fontSize: 17,
								fontWeight: "500",
								color: "#666666ff",
								textAlign: "center",
							}}
						>
							Quy đổi
						</Text>

						{conversions.map((conversion, index) => (
							<View
								key={index}
								style={{
									flexDirection: "row",
									padding: 20,
									alignItems: "center",
								}}
							>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											fontSize: 17,
											fontWeight: "500",
											textAlign: "center",
										}}
									>
										1 {item?.unit}
									</Text>
								</View>
								<Text style={{ flex: 0.5 }}>
									<FontAwesome name="arrows-h" size={24} color="#9d9d9d" />
								</Text>
								<View
									style={{
										flex: 2,
										flexDirection: "row",
										justifyContent: "space-around",
										gap: 8,
									}}
								>
									<TextInput
										placeholder="Số lượng"
										style={[styles.inp, { flex: 1 }]}
										keyboardType="numeric"
										value={conversion.itemQuantity}
										onChangeText={(text) =>
											handleUpdateConversion(index, "itemQuantity", text)
										}
									/>
									<TextInput
										placeholder="Tên đơn vị"
										style={[styles.inp, { flex: 1 }]}
										value={conversion.itemName}
										onChangeText={(text) =>
											handleUpdateConversion(index, "itemName", text)
										}
									/>
								</View>
								{conversions.length > 1 && (
									<TouchableOpacity
										onPress={() => handleRemoveConversion(index)}
										style={{ marginLeft: 8 }}
									>
										<Ionicons name="close-circle" size={24} color="red" />
									</TouchableOpacity>
								)}
							</View>
						))}

						<TouchableOpacity
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
								marginTop: 10,
							}}
							onPress={handleAddConversion}
						>
							<Ionicons name="add-circle-outline" size={17} color={ColorMain} />
							<Text style={{ color: ColorMain, marginLeft: 4 }}>
								Thêm quy đổi
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{
								alignSelf: "center",
								paddingVertical: 10,
								paddingHorizontal: 20,
								backgroundColor: ColorMain,
								borderRadius: 5,
								marginTop: 20,
								marginBottom: 20,
							}}
							onPress={handleSave}
						>
							<Text style={{ color: "#fff" }}>Lưu</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
			</Pressable>
		</Modal>
	);
}
const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "100%",
		backgroundColor: "#ffffffff",
		borderRadius: 12,
		height: "40%",
		padding: 10,
		paddingTop: 20,
	},
	tittleWr: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
	},
	tittle: { fontSize: 15 },
	cancleAction: {
		position: "absolute",
		right: 10,
	},
	itemWr: { flexDirection: "row", padding: 20, alignItems: "center" },
	inp: {
		borderWidth: 1,
		padding: 10,
		borderRadius: 10,
		borderColor: "#b9b9b9ff",
	},
});
export default ModalConversUnit;
