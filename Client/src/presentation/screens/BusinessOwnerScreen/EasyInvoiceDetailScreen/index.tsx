import { ColorMain } from "@/src/presentation/components/colors";
import {
	cancelEasyInvoice,
	EasyInvoiceItem,
	viewEasyInvoice,
} from "@/src/services/API/invoiceService";
import { RootStackParamList } from "@/src/types/route";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Linking,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

type NavProp = StackNavigationProp<RootStackParamList>;

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
		value,
	);

const STATUS_MAP: Record<number, { label: string; color: string; bg: string }> =
	{
		0: { label: "Chưa phát hành", color: "#F59E0B", bg: "#FFFBEB" },
		1: { label: "Đã phát hành", color: "#10B981", bg: "#ECFDF5" },
		2: { label: "Đã hủy", color: "#EF4444", bg: "#FEF2F2" },
	};

function InfoRow({
	label,
	value,
}: {
	label: string;
	value?: string | number | null;
}) {
	if (value === null || value === undefined || value === "") return null;
	return (
		<View style={styles.infoRow}>
			<Text style={styles.infoLabel}>{label}</Text>
			<Text style={styles.infoValue}>{String(value)}</Text>
		</View>
	);
}

export default function EasyInvoiceDetailScreen() {
	const route =
		useRoute<RouteProp<RootStackParamList, "EasyInvoiceDetailScreen">>();
	const navigate = useNavigation<NavProp>();
	const { invoice } = route.params;

	const [loadingView, setLoadingView] = useState(false);
	const [cancelling, setCancelling] = useState(false);

	const status = STATUS_MAP[invoice.InvoiceStatus] ?? {
		label: "Không xác định",
		color: "#9CA3AF",
		bg: "#F3F4F6",
	};

	const handleViewOnline = async () => {
		if (invoice.LinkView) {
			const canOpen = await Linking.canOpenURL(invoice.LinkView);
			if (canOpen) {
				await Linking.openURL(invoice.LinkView);
			} else {
				Alert.alert("Lỗi", "Không thể mở liên kết xem hóa đơn.");
			}
			return;
		}

		// Fallback: request view link from API
		setLoadingView(true);
		try {
			const res = await viewEasyInvoice({
				Ikey: invoice.Ikey,
				Pattern: invoice.Pattern,
				Option: 1,
				Serial: invoice.Serial || undefined,
			});
			const result = res as any;
			const link =
				result?.data?.Data?.LinkView ??
				result?.data?.LinkView ??
				result?.LinkView;
			if (link) {
				await Linking.openURL(link);
			} else {
				Alert.alert("Thông báo", "Không có liên kết xem hóa đơn.");
			}
		} catch (err: any) {
			Alert.alert("Lỗi", err?.message ?? "Không thể lấy liên kết xem hóa đơn.");
		} finally {
			setLoadingView(false);
		}
	};

	const handleCancel = () => {
		if (invoice.InvoiceStatus !== 0) {
			Alert.alert("Thông báo", "Chỉ có thể hủy hóa đơn chưa phát hành.");
			return;
		}
		Alert.alert(
			"Xác nhận hủy",
			`Bạn có chắc muốn hủy hóa đơn số ${invoice.No || invoice.Ikey}?`,
			[
				{ text: "Không", style: "cancel" },
				{
					text: "Hủy hóa đơn",
					style: "destructive",
					onPress: async () => {
						setCancelling(true);
						try {
							await cancelEasyInvoice(invoice.Ikey);
							Alert.alert("Thành công", "Hóa đơn đã được hủy thành công.", [
								{
									text: "OK",
									onPress: () => navigate.goBack(),
								},
							]);
						} catch (err: any) {
							Alert.alert("Lỗi", err?.message ?? "Hủy hóa đơn thất bại.");
						} finally {
							setCancelling(false);
						}
					},
				},
			],
		);
	};

	return (
		<ScrollView style={styles.container} contentContainerStyle={styles.content}>
			{/* Status Header */}
			<View style={[styles.statusCard, { backgroundColor: status.bg }]}>
				<MaterialCommunityIcons
					name="invoice-text"
					size={36}
					color={status.color}
				/>
				<View style={{ flex: 1 }}>
					<Text style={[styles.statusLabel, { color: status.color }]}>
						{status.label}
					</Text>
					<Text style={styles.statusIkey}>Mã: {invoice.Ikey}</Text>
				</View>
			</View>

			{/* Invoice info */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Thông tin hóa đơn</Text>
				<InfoRow label="Số hóa đơn" value={invoice.No || "—"} />
				<InfoRow label="Mẫu số (Pattern)" value={invoice.Pattern} />
				<InfoRow label="Ký hiệu (Serial)" value={invoice.Serial || "—"} />
				<InfoRow label="Ngày lập" value={invoice.ArisingDate} />
				<InfoRow label="Ngày phát hành" value={invoice.IssueDate} />
				<InfoRow label="Ngày cập nhật" value={invoice.ModifiedDate} />
				<InfoRow label="Mã CQT" value={invoice.TaxAuthorityCode} />
				<InfoRow label="Trạng thái CQT" value={invoice.TCTCheckStatus} />
				<InfoRow label="Đã ký số" value={invoice.HasSigned ? "Có" : "Chưa"} />
			</View>

			{/* Customer info */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
				<InfoRow label="Tên khách hàng" value={invoice.CustomerName} />
				<InfoRow label="Địa chỉ" value={invoice.CustomerAddress} />
				<InfoRow label="Mã số thuế" value={invoice.CustomerTaxCode} />
				<InfoRow label="Mã khách hàng" value={invoice.CustomerCode} />
			</View>

			{/* Financial info */}
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Thông tin tài chính</Text>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Tiền hàng (chưa VAT)</Text>
					<Text style={[styles.infoValue, styles.moneyText]}>
						{formatCurrency(invoice.Total)}
					</Text>
				</View>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Tiền thuế VAT</Text>
					<Text style={[styles.infoValue, styles.moneyText]}>
						{formatCurrency(invoice.TaxAmount)}
					</Text>
				</View>
				<View style={[styles.infoRow, styles.totalRow]}>
					<Text style={styles.totalLabel}>Tổng thanh toán</Text>
					<Text style={styles.totalValue}>
						{formatCurrency(invoice.Amount)}
					</Text>
				</View>
			</View>

			{/* Lookup code */}
			{!!invoice.LookupCode && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Tra cứu</Text>
					<InfoRow label="Mã tra cứu" value={invoice.LookupCode} />
				</View>
			)}

			{/* Actions */}
			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.viewBtn}
					onPress={handleViewOnline}
					disabled={loadingView}
				>
					{loadingView ? (
						<ActivityIndicator color="#fff" />
					) : (
						<>
							<Feather name="external-link" size={16} color="#fff" />
							<Text style={styles.viewBtnText}>Xem hóa đơn trực tuyến</Text>
						</>
					)}
				</TouchableOpacity>

				{invoice.InvoiceStatus === 0 && (
					<TouchableOpacity
						style={styles.cancelBtn}
						onPress={handleCancel}
						disabled={cancelling}
					>
						{cancelling ? (
							<ActivityIndicator color="#EF4444" />
						) : (
							<>
								<Feather name="trash-2" size={16} color="#EF4444" />
								<Text style={styles.cancelBtnText}>Hủy hóa đơn</Text>
							</>
						)}
					</TouchableOpacity>
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F3F4F6" },
	content: { padding: 16, gap: 12, paddingBottom: 32 },
	statusCard: {
		flexDirection: "row",
		alignItems: "center",
		gap: 14,
		padding: 16,
		borderRadius: 12,
		borderLeftWidth: 4,
		borderLeftColor: ColorMain,
	},
	statusLabel: { fontSize: 16, fontWeight: "700" },
	statusIkey: { fontSize: 12, color: "#6B7280", marginTop: 2 },
	section: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 14,
		elevation: 1,
		shadowColor: "#000",
		shadowOpacity: 0.04,
		shadowRadius: 3,
		shadowOffset: { width: 0, height: 1 },
	},
	sectionTitle: {
		fontSize: 13,
		fontWeight: "700",
		color: ColorMain,
		marginBottom: 10,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
		paddingVertical: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#F9FAFB",
	},
	infoLabel: { fontSize: 13, color: "#6B7280", flex: 1 },
	infoValue: {
		fontSize: 13,
		color: "#111827",
		fontWeight: "500",
		textAlign: "right",
		flex: 1,
	},
	moneyText: { color: "#374151" },
	totalRow: {
		borderTopWidth: 1,
		borderTopColor: "#E5E7EB",
		marginTop: 4,
		paddingTop: 8,
		borderBottomWidth: 0,
	},
	totalLabel: { fontSize: 14, fontWeight: "700", color: "#111827", flex: 1 },
	totalValue: {
		fontSize: 16,
		fontWeight: "700",
		color: ColorMain,
		textAlign: "right",
	},
	actions: { gap: 10, marginTop: 4 },
	viewBtn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
		backgroundColor: ColorMain,
		padding: 14,
		borderRadius: 10,
	},
	viewBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
	cancelBtn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#FEF2F2",
		padding: 14,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "#FECACA",
	},
	cancelBtnText: { color: "#EF4444", fontSize: 15, fontWeight: "600" },
});
