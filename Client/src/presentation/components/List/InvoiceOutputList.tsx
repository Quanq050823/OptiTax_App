import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { Invoice } from "@/src/types/route";
import { Entypo } from "@expo/vector-icons";
import {
	FlatList,
	Platform,
	RefreshControl,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { getLocalDate } from "../../Controller/FomatDate";
import { useState } from "react";
import { InvoiceSummary, RawInvoice } from "@/src/types/invoiceIn";

type invoice = {
	invoicesData: Invoice[];
	fetchData: () => void;
};
function InvoiceOutputList({ invoicesData, fetchData }: invoice) {
	const navigate = useAppNavigation();
	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const onRefresh = () => {
		setRefreshing(true);
		fetchData(); // gọi lại API hoặc data
		setRefreshing(false); // tắt vòng xoay loading
	};

	const getStatusInfo = (status?: number | string | null) => {
		const s = Number(status); // ép string -> number

		switch (s) {
			case 1:
				return { text: "Nháp", color: "red" };
			case 8:
				return { text: "Đã cấp mã", color: "green" };
			default:
				return { text: "Không xác định", color: "gray" };
		}
	};
	const totalInvoice = (invoice: Invoice) => {
		return invoice.hdhhdvu?.reduce((sum, p) => sum + Number(p.thtien), 0) ?? 0;
	};

	const totals = invoicesData.map((inv) => ({
		id: inv._id,
		total: totalInvoice(inv),
	}));

	const renderItem = ({ item }: { item: Invoice }) => {
		const total = Number(item.tgtttbso);
		const formattedTotal = total.toLocaleString("vi-VN");
		const label = "Hoá đơn bán ra";

		return (
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() =>
					navigate.navigate("InvoiceDetailScreen", { item, total, label })
				}
			>
				<View style={styles.card}>
					<View style={styles.accentBar} />
					<View style={styles.cardContent}>
						<View style={styles.cardHeader}>
							<Text style={styles.buyerName} numberOfLines={1}>
								{item.nbten}
							</Text>
							<Text style={styles.dateText}>{getLocalDate(item.ncnhat)}</Text>
						</View>
						<Text style={styles.invoiceCode} numberOfLines={1}>
							Mã HĐ: {item.mhdon}
						</Text>
						<View style={styles.cardFooter}>
							<View style={styles.badges}>
								<View style={[styles.statusBadge, styles.badgeBlue]}>
									<Text style={[styles.statusText, { color: "#2d3681ff" }]}>
										Đã phát hành
									</Text>
								</View>
								<View style={[styles.statusBadge, styles.badgeGreen]}>
									<Text style={[styles.statusText, { color: textColorMain }]}>
										Hợp lệ
									</Text>
								</View>
							</View>
							<Text style={styles.totalAmount}>{formattedTotal} đ</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<FlatList
			data={invoicesData}
			keyExtractor={(item) => item._id}
			renderItem={renderItem}
			ListEmptyComponent={
				<View
					style={{
						alignItems: "center",
						marginTop: 200,
					}}
				>
					<Text>Không có hóa đơn</Text>
				</View>
			}
			contentContainerStyle={styles.container}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
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
		backgroundColor: "#3F4E87",
	},
	cardContent: {
		flex: 1,
		padding: 12,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		marginBottom: 4,
	},
	buyerName: {
		fontSize: 15,
		fontWeight: "700",
		color: "#1F2937",
		flex: 1,
		marginRight: 8,
	},
	dateText: {
		fontSize: 12,
		color: "#9CA3AF",
	},
	invoiceCode: {
		fontSize: 13,
		color: "#374151",
		fontWeight: "500",
		marginBottom: 8,
	},
	cardFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#F3F4F6",
	},
	badges: {
		flexDirection: "row",
		gap: 6,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		borderWidth: 0.5,
	},
	badgeBlue: {
		borderColor: "#3F4E87",
		backgroundColor: "#3f4d8724",
	},
	badgeGreen: {
		borderColor: ColorMain,
		backgroundColor: "#4dbf9929",
	},
	statusText: {
		fontSize: 10,
		fontWeight: "600",
	},
	totalAmount: {
		fontSize: 16,
		fontWeight: "700",
		color: ColorMain,
	},
});
export default InvoiceOutputList;
