import { ColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ModalConversUnit from "@/src/presentation/components/Modal/ModalConversUnit";
import { assignCategoryForProducts } from "@/src/services/API/storageService";
import { ProductInventory } from "@/src/types/storage";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
	Dimensions,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type ModalOpen = {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	listProductAdd: ProductInventory[];
	onSuccess?: () => Promise<void> | void;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const categories = [
	{ label: "Nguyên vật liệu", value: 1 },
	{ label: "Dụng cụ", value: 2 },
];

type ActiveModal = "step1" | "step2" | "conversion" | null;

function ModalAddCategoryByProductStorage({
	visible,
	setVisible,
	listProductAdd,
	onSuccess,
	loading,
	setLoading,
}: ModalOpen) {
	const [categoryValue, setCategoryValue] = useState<number | null>(null);
	const [activeModal, setActiveModal] = useState<ActiveModal>(null);
	const [conversionItemId, setConversionItemId] = useState<string>("");
	const [configuredIds, setConfiguredIds] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (visible) {
			setCategoryValue(null);
			setConfiguredIds(new Set());
			setActiveModal("step1");
		} else {
			setActiveModal(null);
		}
	}, [visible]);

	const handleCancel = () => {
		setVisible(false);
	};

	const handleNext = async () => {
		if (categoryValue === null) return;
		try {
			setLoading(true);
			await assignCategoryForProducts(listProductAdd, categoryValue);
			if (categoryValue === 1) {
				setActiveModal("step2");
			} else {
				setVisible(false);
				if (onSuccess) await onSuccess();
			}
		} catch (error) {
			console.error("Lỗi khi lưu nguyên liệu:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleFinish = async () => {
		setVisible(false);
		if (onSuccess) await onSuccess();
	};

	const openConversion = (itemId: string) => {
		setConversionItemId(itemId);
		setActiveModal("conversion");
	};

	const handleConversionBack = () => {
		setActiveModal("step2");
	};

	const handleConversionDone = () => {
		setConfiguredIds((prev) => {
			const next = new Set(prev);
			next.add(conversionItemId);
			return next;
		});
		setActiveModal("step2");
	};

	const StepIndicator = ({ current }: { current: 1 | 2 }) => (
		<View style={styles.stepIndicator}>
			<View style={[styles.stepDot, current >= 1 && styles.stepDotActive]}>
				<Text
					style={[styles.stepDotText, current >= 1 && styles.stepDotTextActive]}
				>
					1
				</Text>
			</View>
			<View style={[styles.stepLine, current >= 2 && styles.stepLineActive]} />
			<View style={[styles.stepDot, current >= 2 && styles.stepDotActive]}>
				<Text
					style={[styles.stepDotText, current >= 2 && styles.stepDotTextActive]}
				>
					2
				</Text>
			</View>
		</View>
	);

	return (
		<>
			{/* Bước 1: Phân loại */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={activeModal === "step1"}
				onRequestClose={handleCancel}
				statusBarTranslucent
			>
				<View style={styles.overlay}>
					<View style={styles.sheet}>
						<LoadingScreen visible={loading} />
						<View style={styles.header}>
							<View style={styles.grabber} />
							<StepIndicator current={1} />
							<Text style={styles.title}>Phân loại nguyên liệu</Text>
							<Text style={styles.subtitle}>
								Đang phân loại{" "}
								<Text style={{ fontWeight: "700", color: ColorMain }}>
									{listProductAdd.length}
								</Text>{" "}
								mục
							</Text>
						</View>
						<View style={styles.body}>
							<Text style={styles.fieldLabel}>Loại vật liệu</Text>
							<Dropdown
								style={styles.dropdown}
								containerStyle={styles.dropdownContainer}
								data={categories}
								labelField="label"
								valueField="value"
								placeholder="Chọn loại vật liệu..."
								value={categoryValue}
								onChange={(item) => setCategoryValue(Number(item.value))}
								maxHeight={200}
								selectedTextStyle={styles.selectedText}
								placeholderStyle={styles.placeholder}
								itemTextStyle={styles.dropdownItem}
								activeColor="#f0faf6"
								renderRightIcon={() => (
									<AntDesign name="down" size={13} color="#9ca3af" />
								)}
							/>
							{categoryValue === 1 && (
								<View style={styles.infoBox}>
									<AntDesign name="info-circle" size={14} color={ColorMain} />
									<Text style={styles.infoText}>
										Bước tiếp theo bạn có thể thiết lập quy đổi đơn vị cho từng
										nguyên liệu (có thể bỏ qua).
									</Text>
								</View>
							)}
						</View>
						<View style={styles.footer}>
							<TouchableOpacity
								style={styles.btnOutline}
								onPress={handleCancel}
								activeOpacity={0.7}
							>
								<Text style={styles.btnOutlineText}>Hủy</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.btnPrimary,
									categoryValue === null && styles.btnDisabled,
								]}
								onPress={handleNext}
								disabled={categoryValue === null || loading}
								activeOpacity={0.8}
							>
								<Text style={styles.btnPrimaryText}>
									{categoryValue === 1 ? "Tiếp theo" : "Lưu"}
								</Text>
								{categoryValue === 1 && (
									<AntDesign name="arrow-right" size={15} color="#fff" />
								)}
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* Bước 2: Chuyển đổi đơn vị */}
			<Modal
				animationType="fade"
				transparent={true}
				visible={activeModal === "step2"}
				onRequestClose={handleFinish}
				statusBarTranslucent
			>
				<View style={styles.overlay}>
					<View style={[styles.sheet, { maxHeight: "82%" }]}>
						<LoadingScreen visible={loading} />
						<View style={styles.header}>
							<View style={styles.grabber} />
							<StepIndicator current={2} />
							<Text style={styles.title}>Chuyển đổi đơn vị</Text>
							<Text style={styles.subtitle}>
								Thiết lập quy đổi cho từng nguyên liệu
							</Text>
						</View>
						<ScrollView
							style={styles.listContainer}
							contentContainerStyle={{ paddingBottom: 4 }}
							showsVerticalScrollIndicator={false}
						>
							{listProductAdd.map((item) => {
								const configured = configuredIds.has(item._id);
								return (
									<View key={item._id} style={styles.itemCard}>
										<View style={styles.itemIconWrap}>
											<MaterialIcons
												name="inventory"
												size={18}
												color={ColorMain}
											/>
										</View>
										<View style={{ flex: 1 }}>
											<Text style={styles.itemName} numberOfLines={1}>
												{item.name}
											</Text>
											<Text style={styles.itemUnit}>
												Đơn vị gốc:{" "}
												<Text style={{ fontWeight: "600", color: "#374151" }}>
													{item.unit}
												</Text>
											</Text>
										</View>
										{configured ? (
											<View style={styles.configuredBadge}>
												<AntDesign
													name="check-circle"
													size={13}
													color="#16a34a"
												/>
												<Text style={styles.configuredText}>Xong</Text>
											</View>
										) : (
											<TouchableOpacity
												style={styles.convertBtn}
												onPress={() => openConversion(item._id)}
												activeOpacity={0.8}
											>
												<Feather name="refresh-cw" size={11} color="#fff" />
												<Text style={styles.convertBtnText}>Quy đổi</Text>
											</TouchableOpacity>
										)}
									</View>
								);
							})}
						</ScrollView>
						<View style={styles.progressWrap}>
							<View style={styles.progressBar}>
								<View
									style={[
										styles.progressFill,
										{
											width: `${Math.round(
												(configuredIds.size /
													Math.max(listProductAdd.length, 1)) *
													100,
											)}%`,
										},
									]}
								/>
							</View>
							<Text style={styles.progressText}>
								{configuredIds.size}/{listProductAdd.length} đã thiết lập
							</Text>
						</View>
						<View
							style={[
								styles.footer,
								{ borderTopWidth: 1, borderTopColor: "#f3f4f6" },
							]}
						>
							<TouchableOpacity
								style={styles.btnOutline}
								onPress={handleFinish}
								activeOpacity={0.7}
							>
								<Text style={styles.btnOutlineText}>Bỏ qua</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.btnPrimary}
								onPress={handleFinish}
								activeOpacity={0.8}
							>
								<AntDesign name="check-circle" size={14} color="#fff" />
								<Text style={styles.btnPrimaryText}>Hoàn thành</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* Modal quy đổi đơn vị */}
			<ModalConversUnit
				visible={activeModal === "conversion"}
				id={conversionItemId}
				setVisible={(val) => {
					const resolved =
						typeof val === "function" ? val(activeModal === "conversion") : val;
					if (!resolved) handleConversionBack();
				}}
				onSuccess={handleConversionDone}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	sheet: {
		backgroundColor: "#fff",
		borderRadius: 20,
		width: Math.min(SCREEN_WIDTH * 0.92, 420),
		overflow: "hidden",
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 12 },
				shadowOpacity: 0.15,
				shadowRadius: 28,
			},
			android: {
				elevation: 14,
			},
		}),
	},
	grabber: {
		alignSelf: "center",
		width: 36,
		height: 4,
		borderRadius: 2,
		backgroundColor: "#d1d5db",
		marginBottom: 14,
	},
	header: {
		paddingTop: 18,
		paddingHorizontal: 20,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#f3f4f6",
	},
	stepIndicator: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "center",
		marginBottom: 16,
	},
	stepDot: {
		width: 30,
		height: 30,
		borderRadius: 15,
		backgroundColor: "#e5e7eb",
		alignItems: "center",
		justifyContent: "center",
	},
	stepDotActive: {
		backgroundColor: ColorMain,
	},
	stepDotText: {
		fontSize: 13,
		fontWeight: "700",
		color: "#9ca3af",
	},
	stepDotTextActive: {
		color: "#fff",
	},
	stepLine: {
		width: 44,
		height: 3,
		backgroundColor: "#e5e7eb",
		borderRadius: 2,
	},
	stepLineActive: {
		backgroundColor: ColorMain,
	},
	title: {
		fontSize: 17,
		fontWeight: "700",
		color: "#111827",
		textAlign: "center",
		letterSpacing: 0.2,
	},
	subtitle: {
		fontSize: 13,
		color: "#6b7280",
		textAlign: "center",
		marginTop: 5,
	},
	body: {
		padding: 20,
	},
	fieldLabel: {
		fontSize: 13,
		fontWeight: "600",
		color: "#374151",
		marginBottom: 8,
	},
	dropdown: {
		height: 50,
		borderColor: "#d1d5db",
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 14,
		backgroundColor: "#f9fafb",
	},
	dropdownContainer: {
		borderRadius: 12,
		borderColor: "#d1d5db",
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.1,
				shadowRadius: 10,
			},
			android: {
				elevation: 5,
			},
		}),
	},
	placeholder: {
		color: "#9ca3af",
		fontSize: 14,
	},
	selectedText: {
		color: "#111827",
		fontWeight: "500",
		fontSize: 14,
	},
	dropdownItem: {
		color: "#374151",
		fontSize: 14,
	},
	infoBox: {
		flexDirection: "row",
		alignItems: "flex-start",
		backgroundColor: "#f0fdf9",
		borderRadius: 10,
		padding: 12,
		marginTop: 14,
		gap: 8,
		borderLeftWidth: 3,
		borderLeftColor: ColorMain,
	},
	infoText: {
		flex: 1,
		fontSize: 12,
		color: "#374151",
		lineHeight: 19,
	},
	footer: {
		flexDirection: "row",
		gap: 10,
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	btnOutline: {
		flex: 1,
		height: 46,
		borderRadius: 12,
		borderWidth: 1.5,
		borderColor: "#d1d5db",
		alignItems: "center",
		justifyContent: "center",
	},
	btnOutlineText: {
		color: "#374151",
		fontWeight: "600",
		fontSize: 14,
	},
	btnPrimary: {
		flex: 2,
		height: 46,
		borderRadius: 12,
		backgroundColor: ColorMain,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		gap: 6,
	},
	btnPrimaryText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 14,
		letterSpacing: 0.2,
	},
	btnDisabled: {
		backgroundColor: "#d1d5db",
	},
	listContainer: {
		paddingHorizontal: 16,
		paddingTop: 12,
	},
	itemCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f9fafb",
		borderRadius: 12,
		padding: 12,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		gap: 10,
	},
	itemIconWrap: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: "#f0fdf9",
		alignItems: "center",
		justifyContent: "center",
	},
	itemName: {
		fontSize: 14,
		fontWeight: "600",
		color: "#111827",
	},
	itemUnit: {
		fontSize: 12,
		color: "#6b7280",
		marginTop: 2,
	},
	configuredBadge: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#dcfce7",
		borderRadius: 20,
		paddingVertical: 5,
		paddingHorizontal: 9,
		gap: 4,
	},
	configuredText: {
		fontSize: 11,
		fontWeight: "700",
		color: "#16a34a",
	},
	convertBtn: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: ColorMain,
		borderRadius: 8,
		paddingVertical: 7,
		paddingHorizontal: 10,
		gap: 4,
	},
	convertBtnText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#fff",
	},
	progressWrap: {
		paddingHorizontal: 16,
		paddingTop: 4,
		paddingBottom: 10,
	},
	progressBar: {
		height: 6,
		backgroundColor: "#e5e7eb",
		borderRadius: 3,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: ColorMain,
		borderRadius: 3,
	},
	progressText: {
		textAlign: "right",
		fontSize: 11,
		color: "#6b7280",
		marginTop: 5,
	},
});

export default ModalAddCategoryByProductStorage;
