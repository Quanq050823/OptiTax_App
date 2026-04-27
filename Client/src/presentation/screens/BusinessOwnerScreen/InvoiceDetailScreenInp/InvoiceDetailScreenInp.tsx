import { getLocalDate } from "@/src/presentation/Controller/FomatDate";
import { InvoiceProduct } from "@/src/types/route";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

const InvoiceDetailScreenInp = ({ route }: any) => {
	const { item, total, label } = route.params;

	const products: InvoiceProduct[] = item?.hdhhdvu ?? [];
	const totalTax = Number(item?.tien?.thue ?? 0);
	const totalPayment = Number(item?.tien?.tong ?? total ?? 0);

	const formatMoney = (value: number) =>
		Math.floor(Number(value || 0)).toLocaleString("vi-VN");

	const renderInfoRow = (labelText: string, value?: string | number | null) => (
		<View style={styles.infoRow} key={labelText}>
			<Text style={styles.label}>{labelText}</Text>
			<Text style={styles.value}>{value ? String(value) : "-"}</Text>
		</View>
	);

	const renderHeader = () => (
		<View style={[styles.tableRow, styles.tableHeaderRow]}>
			<Text style={[styles.tableCell, styles.colIndex, styles.headerCell]}>STT</Text>
			<Text style={[styles.tableCell, styles.colName, styles.headerCell]}>Tên</Text>
			<Text style={[styles.tableCell, styles.colUnit, styles.headerCell]}>ĐVT</Text>
			<Text style={[styles.tableCell, styles.colQty, styles.headerCell]}>SL</Text>
			<Text style={[styles.tableCell, styles.colMoney, styles.headerCell]}>
				Đơn giá
			</Text>
			<Text style={[styles.tableCell, styles.colMoney, styles.headerCell]}>
				Thành tiền
			</Text>
		</View>
	);

	const renderItem = ({
		item,
		index,
	}: {
		item: InvoiceProduct;
		index: number;
	}) => {
		return (
			<View key={item._id || index} style={styles.tableRow}>
				<Text style={[styles.tableCell, styles.colIndex]}>{index + 1}</Text>
				<Text style={[styles.tableCell, styles.colName, styles.strongCell]}>
					{item.ten}
				</Text>
				<Text style={[styles.tableCell, styles.colUnit]}>{item.dvtinh}</Text>
				<Text style={[styles.tableCell, styles.colQty]}>
					{Number(item.sluong) % 1 === 0
						? Number(item.sluong)
						: Number(item.sluong).toString()}
				</Text>
				<Text style={[styles.tableCell, styles.colMoney]}>
					{formatMoney(Number(item.dgia ?? 0))}
				</Text>
				<Text style={[styles.tableCell, styles.colMoney]}>
					{formatMoney(Number(item.thtien ?? 0))}
				</Text>

			</View>
		);
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.contentWrap}>
			<View style={styles.titleWrap}>
				<Text style={styles.title}>{label}</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Thông tin hóa đơn</Text>
				{renderInfoRow("Mã HĐ", item?.mhdon)}
				{renderInfoRow("Ký hiệu HĐ", item?.kyHieu)}
				{renderInfoRow("Số HĐ", item?.soHoaDon)}
				{renderInfoRow("Mẫu HĐ", item?.mauSo)}
				{renderInfoRow(
					"Ngày lập",
					item?.createdAt ? getLocalDate(item.createdAt.toString()) : "",
				)}
			</View>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Người bán</Text>
				{renderInfoRow("Tên người bán", item?.nguoiBan?.ten)}
				{renderInfoRow("Mã số thuế", item?.nguoiBan?.mst)}
				{renderInfoRow("Địa chỉ", item?.nguoiBan?.diaChi)}
			</View>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Người mua</Text>
				{renderInfoRow("Tên người mua", item?.nguoiMua?.ten || item?.nmtnmua)}
				{renderInfoRow("Mã số thuế", item?.nguoiMua?.mst || item?.nmmst)}
				{renderInfoRow("Địa chỉ", item?.nguoiMua?.diaChi)}
				{renderInfoRow("HTTT", item?.thanhToan?.hinhThuc)}
			</View>

			<View style={styles.card}>
				<Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator>
					<View style={styles.tableWrap}>
						{renderHeader()}
						{products.length > 0 ? (
							products.map((product, index) =>
								renderItem({ item: product, index }),
							)
						) : (
							<View style={styles.emptyRow}>
								<Text style={styles.emptyText}>Không có dữ liệu sản phẩm</Text>
							</View>
						)}
					</View>
				</ScrollView>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Tổng hợp thanh toán</Text>
				{renderInfoRow("Tổng tiền thuế", `${formatMoney(totalTax)} đ`)}
				{renderInfoRow("Đơn vị tiền tệ", item?.tien?.dvtte)}
				{renderInfoRow("Bằng chữ", item?.tien?.bangChu)}
				<View style={styles.totalBox}>
					<Text style={styles.totalLabel}>Tổng tiền thanh toán</Text>
					<Text style={styles.totalValue}>{formatMoney(totalPayment)} đ</Text>
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F4F7FB",
	},
	contentWrap: {
		padding: 14,
		paddingBottom: 24,
		gap: 12,
	},
	titleWrap: {
		paddingVertical: 4,
	},
	title: {
		fontSize: 20,
		fontWeight: "700",
		textAlign: "center",
		color: "#0F172A",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 14,
		shadowColor: "#000",
		shadowOpacity: Platform.OS === "ios" ? 0.07 : 0,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 3 },
		elevation: Platform.OS === "android" ? 2 : 0,
		padding: 12,
	},
	cardTitle: {
		fontSize: 15,
		fontWeight: "700",
		color: "#0F172A",
		marginBottom: 10,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingVertical: 8,
		borderBottomWidth: 1,
		borderBottomColor: "#EEF2F7",
	},
	label: {
		fontSize: 13,
		fontWeight: "600",
		color: "#64748B",
		marginRight: 10,
		flex: 1,
	},
	value: {
		fontSize: 14,
		color: "#0F172A",
		fontWeight: "600",
		flex: 2,
		flexShrink: 1,
		textAlign: "right",
	},
	sectionTitle: {
		fontSize: 15,
		fontWeight: "700",
		marginBottom: 10,
		color: "#0F172A",
	},
	tableWrap: {
		minWidth: 510,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: "#E8EDF3",
		paddingVertical: 8,
		paddingHorizontal: 6,
	},
	tableHeaderRow: {
		backgroundColor: "#F8FAFC",
		borderTopWidth: 1,
		borderTopColor: "#E8EDF3",
	},
	tableCell: {
		fontSize: 12,
		color: "#0F172A",
		paddingHorizontal: 4,
	},
	headerCell: {
		fontWeight: "700",
		color: "#334155",
	},
	strongCell: {
		fontWeight: "600",
	},
	colIndex: {
		width: 36,
	},
	colName: {
		width: 255,
	},
	colUnit: {
		width: 60,
	},
	colQty: {
		width: 44,
	},
	colMoney: {
		width: 108,
	},
	colTax: {
		width: 90,
	},
	emptyRow: {
		paddingVertical: 14,
		alignItems: "center",
	},
	emptyText: {
		fontSize: 13,
		color: "#64748B",
	},
	totalBox: {
		marginTop: 12,
		padding: 12,
		borderRadius: 12,
		backgroundColor: "#FFF7ED",
		borderWidth: 1,
		borderColor: "#FED7AA",
	},
	totalLabel: {
		fontSize: 13,
		color: "#9A3412",
		fontWeight: "600",
		marginBottom: 4,
	},
	totalValue: {
		fontSize: 18,
		color: "#C2410C",
		fontWeight: "800",
	},
});

export default InvoiceDetailScreenInp;
