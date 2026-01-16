import { ColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import { assignCategoryForProducts } from "@/src/services/API/storageService";
import { ProductInventory } from "@/src/types/storage";
import { syncDataInvoiceIn } from "@/src/types/syncData";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
	Animated,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Button, PaperProvider } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

type ModalOpen = {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	listProductAdd: ProductInventory[];
	onSuccess?: () => Promise<void> | void;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
const categories = [
	{ label: "Nguyên vât liệu", value: 1 },
	{ label: "Dụng cụ", value: 2 },
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
function ModalAddCategoryByProductStorage({
	visible,
	setVisible,
	listProductAdd,
	onSuccess,
	loading,
	setLoading,
}: ModalOpen) {
	const [dateStart, setDateStart] = useState<Date | undefined>();
	const [dateEnd, setDateEnd] = useState<Date | undefined>();
	const [openModalDateStart, setOpenModalDateStart] = useState(false);
	const [openModalDateEnd, setOpenModalDateEnd] = useState(false);
	const [value, setValue] = useState<number | null>(null);
	const [businessType, setBusinessType] = useState<string | null>(null);

	const onDismiss = () => {
		setVisible(false);
	};

	const onConfirm = (params: { date: Date }) => {
		setVisible(false);
		setDateStart(params.date);
		console.log("Ngày được chọn:", params.date);
	};

	function formatDate(d: Date): string {
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		return `${year}/${month}/${day}`;
	}

	const handleSave = async () => {
		if (value === null) {
			alert("Vui lòng chọn loại vật liệu");
			return;
		}

		try {
			setLoading(true);

			await assignCategoryForProducts(listProductAdd, value);

			setVisible(false);

			if (onSuccess) {
				await onSuccess();
			}
		} catch (error) {
			console.error("Lỗi khi lưu nguyên liệu:", error);
			alert("Có lỗi xảy ra, vui lòng thử lại!");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={() => setVisible(false)}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<LoadingScreen visible={loading} />

					<View>
						<Text style={{ color: ColorMain, fontSize: 17, fontWeight: "700" }}>
							Chọn danh mục cho {listProductAdd.length} nguyên liệu
						</Text>
						<View style={{ marginTop: 30 }}>
							<Dropdown
								style={styles.dropdown}
								data={categories}
								labelField="label"
								valueField="value"
								placeholder="Chọn loại vật liệu"
								value={value}
								onChange={(item) => {
									const numericValue = Number(item.value);
									setValue(numericValue);
									console.log("Đã chọn:", item);
								}}
								maxHeight={300}
								selectedTextStyle={styles.selectedText}
								placeholderStyle={styles.placeholder}
								itemTextStyle={{ color: "#333" }}
							/>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "center",
								gap: 10,
								marginTop: 20,
							}}
						>
							<TouchableOpacity
								style={[
									styles.btnSyn,
									{
										backgroundColor: "transparent",
										borderWidth: 0.5,
										borderColor: "red",
									},
								]}
								onPress={() => setVisible(false)}
							>
								<Text style={{ color: "red", fontWeight: "600" }}>Hủy</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.btnSyn} onPress={handleSave}>
								<Text style={{ color: "#fff", fontWeight: "600" }}>
									Lưu nguyên liệu
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	closeButton: {
		backgroundColor: "tomato",
		padding: 10,
		borderRadius: 8,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
		alignItems: "center",
	},
	modalView: {
		backgroundColor: "#fafafaff",
		paddingHorizontal: 10,
		borderRadius: 8,
		width: "95%",
		minHeight: 200,
		alignItems: "center",
		paddingVertical: 20,
		position: "relative",
	},
	grabber: {
		alignSelf: "center",
		width: 42,
		height: 5,
		borderRadius: 3,
		backgroundColor: ColorMain,
		marginBottom: 8,
	},
	input: {
		width: "95%",
		height: 50,
		padding: 10,
		borderRadius: 5,
		shadowColor: ColorMain,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.25,
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#e7e7e7ff",
	},
	label: {
		color: "#5a5a5aff",
		fontWeight: "500",
		marginTop: 30,
		fontSize: 15,
		textAlign: "center",
	},
	dropdown: {
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		backgroundColor: "#fff",
		marginBottom: 20,
	},
	placeholder: {
		color: "#787878ff",
	},
	selectedText: {
		color: "#000",
		fontWeight: "500",
	},
	btnSyn: {
		backgroundColor: ColorMain,
		paddingVertical: 10,
		borderRadius: 7,
		minWidth: 70,
		flexDirection: "row",
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		paddingHorizontal: 10,
	},
});
export default ModalAddCategoryByProductStorage;
