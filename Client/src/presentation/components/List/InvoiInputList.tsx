import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { InvoiceSummary, RawInvoice } from "@/src/types/invoiceIn";
import { Invoice } from "@/src/types/route";
import {
	FlatList,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const invoices: any = [
	{
		id: "HD001",
		date: "2025-08-20",
		supplier: "Công ty ABC",
		total: 1500000,
		status: 1,
	},
	{
		id: "HD002",
		date: "2025-08-21",
		supplier: "Nhà cung cấp XYZ",
		total: 2800000,
		status: 0,
	},
	{
		id: "HD003",
		date: "2025-08-22",
		supplier: "Siêu thị Metro",
		total: 560000,
		status: 2,
	},
];
type invoice = {
	invoicesData: RawInvoice[];
};
function InvoiInputList({ invoicesData }: invoice) {
	console.log(invoicesData);

	const navigate = useAppNavigation();
	const getStatusInfo = (status: number) => {
		switch (status) {
			case 0:
				return { text: "Chưa xử lý", color: "red" };
			case 1:
				return { text: "Đã xử lý", color: "green" };
			case 2:
				return { text: "Đang xử lý", color: ColorMain };
			default:
				return { text: "Không xác định", color: "gray" };
		}
	};

	const renderItem = ({ item }: { item: RawInvoice }) => {
		const total = item.tien?.tong || 0;
		const label = "Hoá đơn mua vào";

		return (
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() =>
					navigate.navigate("InvoiceDetailScreenInp", { item, total, label })
				}
			>
				<View style={styles.card}>
					<View style={styles.accentBar} />
					<View style={styles.cardContent}>
						<View style={styles.cardHeader}>
							<View style={styles.typeBadge}>
								<Text style={styles.typeBadgeText} numberOfLines={1}>
									{item.loaiHoaDon ?? "Hóa đơn"}
								</Text>
							</View>
							<Text style={styles.dateText}>
								{item.ngayKy?.split("T")[0] ?? "—"}
							</Text>
						</View>
						<Text style={styles.invoiceCode} numberOfLines={1}>
							Số HĐ: {item.soHoaDon ?? "—"}
						</Text>
						{!!item.nbten && (
							<Text style={styles.sellerName} numberOfLines={1}>
								{item.nbten}
							</Text>
						)}
						<View style={styles.cardFooter}>
							<Text style={styles.totalLabel}>Tổng tiền</Text>
							<Text style={styles.totalAmount}>
								{total.toLocaleString("vi-VN")} đ
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<FlatList
			data={invoicesData}
			keyExtractor={(item, index) =>
				`${item.soHoaDon ?? "NA"}_${item.ngayKy ?? "NA"}_${
					item.mstNguoiBan ?? index
				}`
			}
			renderItem={renderItem}
			contentContainerStyle={styles.container}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 12,
		paddingBottom: 20,
	},
	card: {
		flexDirection: "row",
		backgroundColor: "#fff",
		marginBottom: 10,
		borderRadius: 12,
		overflow: "hidden",
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.07,
				shadowRadius: 6,
			},
			android: { elevation: 3 },
		}),
	},
	accentBar: {
		width: 4,
		backgroundColor: textColorMain,
	},
	cardContent: {
		flex: 1,
		padding: 12,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 6,
	},
	typeBadge: {
		backgroundColor: "#f0fdf8",
		borderWidth: 1,
		borderColor: textColorMain,
		borderRadius: 6,
		paddingHorizontal: 8,
		paddingVertical: 2,
		maxWidth: "65%",
	},
	typeBadgeText: {
		fontSize: 11,
		color: textColorMain,
		fontWeight: "600",
	},
	dateText: {
		fontSize: 12,
		color: "#9CA3AF",
	},
	invoiceCode: {
		fontSize: 13,
		color: "#374151",
		fontWeight: "500",
		marginBottom: 2,
	},
	sellerName: {
		fontSize: 12,
		color: "#6B7280",
		marginBottom: 4,
	},
	cardFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: 8,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#F3F4F6",
	},
	totalLabel: {
		fontSize: 12,
		color: "#9CA3AF",
	},
	totalAmount: {
		fontSize: 16,
		fontWeight: "700",
		color: ColorMain,
	},
});
export default InvoiInputList;
