import { InvoiceProduct } from "@/src/types/route";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

const InvoiceDetailScreen = ({ route }: any) => {
	const { item, total, label } = route.params;
	console.log(item, "Item detail");

	const renderHeader = () => (
		<View style={[styles.row, styles.headerRow]}>
			<Text style={[styles.cell, { flex: 1.25 }]}>STT</Text>
			<Text style={[styles.cell, { flex: 1.5 }]}>Tên</Text>
			<Text style={[styles.cell, { flex: 0.25 }]}>ĐVT</Text>
			<Text style={[styles.cell, { flex: 0.7 }]}>SL</Text>
			<Text style={[styles.cell, { flex: 1 }]}>Đơn giá</Text>
			<Text style={[styles.cell, { flex: 2 }]}>Thành tiền</Text>
			<Text style={[styles.cell, { flex: 1 }]}>GTGT</Text>
			<Text style={[styles.cell, { flex: 1 }]}>TNCN</Text>
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
			<View
				key={item._id || index}
				style={[styles.row, { paddingHorizontal: 15, backgroundColor: "#fff" }]}
			>
				<Text style={[styles.cell, { flex: 0.5 }]}>{index + 1}</Text>
				<Text style={[styles.cell, { flex: 1.5, fontWeight: "600" }]}>
					{item.ten}
				</Text>
				<Text style={[styles.cell, { flex: 0.5 }]}>{item.dvtinh}</Text>
				<Text style={[styles.cell, { flex: 0.7 }]}>
					{Number(item.sluong) % 1 === 0
						? Number(item.sluong)
						: Number(item.sluong).toString()}
				</Text>
				<Text style={[styles.cell, { flex: 1 }]}>
					{Number(item.dgia ?? 0).toLocaleString("vi-VN")}
				</Text>
				<Text style={[styles.cell, { flex: 2 }]}>
					{Number(item.thtien ?? 0).toLocaleString("vi-VN")}
				</Text>
				<Text style={[styles.cell, { flex: 1 }]}>
					{Number(item.gtgt ?? 0).toLocaleString("vi-VN")}
				</Text>
				<Text style={[styles.cell, { flex: 1 }]}>
					{Number(item.tncn ?? 0).toLocaleString("vi-VN")}
				</Text>
			</View>
		);
	};

	return (
		<>
			<FlatList
				data={item?.hdhhdvu ?? []}
				renderItem={renderItem}
				keyExtractor={(item, index) => index.toString()}
				ListFooterComponent={
					<View style={styles.container}>
						<View style={styles.card}>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Tổng tiền thuế:</Text>
								<Text style={styles.value}>{item?.khmshdon} đ</Text>
							</View>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Tổng tiền hàng hoá:</Text>
								{/* <Text style={styles.value}>{item?.tien.truocThue} đ</Text> */}
							</View>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Tổng tiền CKTM:</Text>
								<Text style={styles.value}></Text>
							</View>
							<View style={[styles.flexLabel]}>
								<Text style={styles.label}>Tổng tiền thanh toán:</Text>
								<Text style={[styles.value, styles.money]}>
									{total.toLocaleString("vi-VN")} đ
								</Text>
							</View>
						</View>
					</View>
				}
				ListHeaderComponent={
					<View style={styles.container}>
						<View style={styles.card}>
							<Text
								style={{
									textAlign: "center",
									fontWeight: "700",
									fontSize: 17,
									marginBottom: 20,
								}}
							>
								{label}
							</Text>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Mã HĐ:</Text>
								<Text style={styles.value}>{item.khmshdon}</Text>
							</View>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Ký hiệu HĐ:</Text>
								<Text style={styles.value}>{item.khhdon}</Text>
							</View>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Số HĐ:</Text>
								<Text style={styles.value}>{item.shdon}</Text>
							</View>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Mẫu HĐ:</Text>
								<Text style={styles.value}>{item.mhdon}</Text>
							</View>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Ngày lập:</Text>
								<Text style={styles.value}>
									{item.ncnhat
										? new Date(item.ncnhat).toLocaleDateString("vi-VN")
										: ""}
								</Text>
							</View>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Tên người bán:</Text>
								<Text style={styles.value}>{item.nbten}</Text>
							</View>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Mã số thuế:</Text>
								<Text style={styles.value}>{item.nbmst}</Text>
							</View>
							<View style={styles.flexLabel}>
								<Text style={styles.label}>Địa chỉ:</Text>
								<Text style={styles.value}>{item.nbdchi}</Text>
							</View>

							<View style={styles.line}></View>
							<View style={[styles.flexLabel, { marginTop: 20 }]}>
								<Text style={styles.label}>Tên người mua:</Text>
								<Text style={styles.value}>{item.nmten}</Text>
							</View>

							<View style={[styles.flexLabel]}>
								<Text style={styles.label}>Mã số thuế:</Text>
								<Text style={styles.value}>{item.nmmst}</Text>
							</View>
							<View style={[styles.flexLabel]}>
								<Text style={styles.label}>Địa chỉ:</Text>
								<Text style={styles.value}>{item.nmdchi}</Text>
							</View>
							<View
								style={[styles.flexLabel, { justifyContent: "space-between" }]}
							>
								<View
									style={{
										flexDirection: "row",
										flex: 1,
									}}
								>
									<Text style={[styles.label, { marginRight: 0, flex: 1 }]}>
										HTTT:
									</Text>
									<Text style={styles.value}>{item.thtttoan}</Text>
								</View>
							</View>
						</View>
						<View style={[styles.card, { marginTop: 20 }]}>
							<Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
							{renderHeader()}
						</View>
					</View>
				}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f4f6f9",
		paddingTop: 15,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
		color: "#333",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 5,
		padding: 16,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 3,
		paddingBottom: 0,
		alignItems: "center",
	},
	flexLabel: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#555",
		marginRight: 6,
		flex: 1,
	},
	value: {
		fontSize: 16,
		color: "#111",
		fontWeight: "600",
		flex: 2,
		flexShrink: 1,
		textAlign: "right",
	},
	money: {
		color: "#e67e22",
		fontWeight: "bold",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
		color: "#222",
	},

	row: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: "#eee",
		paddingVertical: 6,
		paddingHorizontal: 4,
	},
	headerRow: {
		backgroundColor: "#f2f2f2",
		marginTop: 15,
	},
	cell: {
		fontSize: 12,
		textAlign: "center",
	},
	line: {
		borderBottomWidth: 1,
		borderColor: "#d8d8d8ff",
		width: "100%",
	},
});

export default InvoiceDetailScreen;
