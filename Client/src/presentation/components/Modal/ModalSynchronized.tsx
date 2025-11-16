import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
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
import { Button, PaperProvider } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

type ModalOpen = {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setSyncDataInvoiceIn: React.Dispatch<React.SetStateAction<syncDataInvoiceIn>>;
	onSyncInvoiceIn: () => Promise<void>;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
function ModalSynchronized({
	visible,
	setVisible,
	setSyncDataInvoiceIn,
	onSyncInvoiceIn,
	loading,
	setLoading,
}: ModalOpen) {
	const [dateStart, setDateStart] = useState<Date | undefined>();
	const [dateEnd, setDateEnd] = useState<Date | undefined>();
	const [openModalDateStart, setOpenModalDateStart] = useState(false);
	const [openModalDateEnd, setOpenModalDateEnd] = useState(false);
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
		const month = String(d.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
		const day = String(d.getDate()).padStart(2, "0");
		return `${year}/${month}/${day}`;
	}
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			onRequestClose={() => setVisible(false)}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					{/* <View style={styles.grabber} /> */}
					<LoadingScreen visible={loading} />

					<View>
						<Text
							style={{
								fontSize: 20,
								fontWeight: "600",
								color: textColorMain,
								marginBottom: 20,
							}}
						>
							Đồng bộ theo ngày
						</Text>
					</View>
					<MaterialIcons
						name="cancel"
						size={24}
						color={ColorMain}
						style={{ position: "absolute", right: 20, top: 20 }}
						onPress={() => setVisible(false)}
					/>
					<TouchableOpacity
						style={{
							backgroundColor: !dateStart || !dateEnd ? "#ccc" : ColorMain,
							paddingHorizontal: 20,
							borderRadius: 10,
							marginTop: 20,
							paddingVertical: 15,
						}}
						onPress={onSyncInvoiceIn}
					>
						<Text style={{ color: "#fff" }}>Đồng bộ</Text>
					</TouchableOpacity>
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
		color: "#000000ff",
		fontWeight: "500",
		marginTop: 30,
		fontSize: 15,
		textAlign: "center",
	},
});
export default ModalSynchronized;
