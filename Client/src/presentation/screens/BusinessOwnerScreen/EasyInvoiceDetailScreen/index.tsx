import { ColorMain } from "@/src/presentation/components/colors";
import {
	cancelEasyInvoice,
	removeUnsignedEasyInvoice,
	viewEasyInvoice,
} from "@/src/services/API/invoiceService";
import { RootStackParamList } from "@/src/types/route";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
import { WebView } from "react-native-webview";

type NavProp = StackNavigationProp<RootStackParamList>;

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
		value,
	);

const STATUS_MAP: Record<number, { label: string; color: string; bg: string }> =
	{
		0: { label: "Chưa phát hành", color: "#D97706", bg: "#FFF7ED" },
		1: { label: "Đã phát hành", color: "#059669", bg: "#ECFDF5" },
		2: { label: "Đã hủy", color: "#DC2626", bg: "#FEF2F2" },
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
	const [showViewModal, setShowViewModal] = useState(false);
	const [viewInvoiceUrl, setViewInvoiceUrl] = useState<string | null>(null);

	const status = STATUS_MAP[invoice.InvoiceStatus] ?? {
		label: "Không xác định",
		color: "#9CA3AF",
		bg: "#F3F4F6",
	};

	const normalizeInvoiceUrl = (raw?: string | null) => {
		if (!raw) return null;
		let url = String(raw).trim();
		if (!url) return null;

		url = url.replace(/^"|"$/g, "").replace(/\\\//g, "/");
		if (!/^https?:\/\//i.test(url)) {
			url = `https://${url.replace(/^\/+/, "")}`;
		}
		return url;
	};

	const openInvoiceUrl = async (rawUrl?: string | null) => {
		const normalizedUrl = normalizeInvoiceUrl(rawUrl);
		if (!normalizedUrl) return false;

		setViewInvoiceUrl(normalizedUrl);
		setShowViewModal(true);
		return true;
	};

	const handleViewOnline = async () => {
		if (await openInvoiceUrl(invoice.LinkView)) {
			return;
		}

		setLoadingView(true);
		try {
			const res = await viewEasyInvoice({
				Ikey: invoice.Ikey,
				Pattern: invoice.Pattern,
				Option: 1,
				Serial: invoice.Serial || undefined,
			});
			const result = res as any;
			const linkCandidates = [
				result?.data?.Data?.LinkView,
				result?.data?.LinkView,
				result?.LinkView,
				result?.data?.Data?.LinkView ?? result?.data?.Data?.Url,
				result?.data?.Url,
				result?.Url,
			];

			let opened = false;
			for (const candidate of linkCandidates) {
				if (await openInvoiceUrl(candidate)) {
					opened = true;
					break;
				}
			}

			if (!opened) {
				Alert.alert("Thông báo", "Không có liên kết xem hóa đơn.");
			}
		} catch (err: any) {
			Alert.alert(
				"Lỗi",
				err?.message ?? "Không thể lấy liên kết xem hóa đơn.",
			);
		} finally {
			setLoadingView(false);
		}
	};

	const handleCancel = () => {
		if (invoice.InvoiceStatus !== 1) {
			Alert.alert("Thông báo", "Chỉ có thể hủy hóa đơn đã phát hành.");
			return;
		}
		Alert.alert(
			"Xác nhận hủy hóa đơn",
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
									onPress: ()    => navigate.goBack(),
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

	const handleRemoveUnsigned = () => {
		if (invoice.InvoiceStatus !== 0) {
			Alert.alert("Thông báo", "Chỉ có thể xóa hóa đơn chưa phát hành.");
			return;
		}

		Alert.alert(
			"Xác nhận xóa hóa đơn",
			`Bạn có chắc muốn xóa hóa đơn chưa phát hành ${invoice.No || invoice.Ikey}?`,
			[
				{ text: "Không", style: "cancel" },
				{
					text: "Xóa hóa đơn",
					style: "destructive",
					onPress: async () => {
						setCancelling(true);
						try {
							await removeUnsignedEasyInvoice({
								Ikey: invoice.Ikey,
								Pattern: invoice.Pattern,
								Serial: invoice.Serial || undefined,
							});
							Alert.alert(
								"Thành công",
								"Hóa đơn chưa phát hành đã được xóa.",
								[
									{
										text: "OK",
										onPress: () => navigate.goBack(),
									},
								],
							);
						} catch (err: any) {
							Alert.alert(
								"Lỗi",
								err?.message ?? "Xóa hóa đơn chưa phát hành thất bại.",
							);
						} finally {
							setCancelling(false);
						}
					},
				},
			],
		);
	};

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.content}
			showsVerticalScrollIndicator={false}
		>
			<View style={[styles.statusCard, { backgroundColor: status.bg }]}>
				<View style={[styles.statusIconWrap, { backgroundColor: `${status.color}14` }]}>
					<MaterialCommunityIcons
						name="invoice-text-outline"
						size={30}
						color={status.color}
					/>
				</View>
				<View style={styles.statusContent}>
					<Text style={[styles.statusEyebrow, { color: status.color }]}>Hóa đơn EasyInvoice</Text>
					<Text style={[styles.statusLabel, { color: status.color }]}> 
						{status.label}
					</Text>
					<Text style={styles.statusSubtitle}>
						Theo dõi trạng thái phát hành, tra cứu và thao tác trực tiếp trên hóa đơn.
					</Text>
					<View style={styles.metaRow}>
						<View style={styles.metaBadge}>
							<Text style={styles.metaBadgeText}>Mã: {invoice.Ikey}</Text>
						</View>
						{!!invoice.No && (
							<View style={styles.metaBadge}>
								<Text style={styles.metaBadgeText}>Số HĐ: {invoice.No}</Text>
							</View>
						)}
					</View>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Thông tin hóa đơn</Text>
				<Text style={styles.sectionDescription}>
					Tổng quan các thông tin nhận dạng và tình trạng xử lý của hóa đơn.
				</Text>
				<InfoRow label="Số hóa đơn" value={invoice.No || "-"} />
				<InfoRow label="Ký hiệu hóa đơn" value={invoice.Pattern} />
				<InfoRow label="Mẫu số" value={invoice.Serial || "-"} />
				<InfoRow label="Ngày lập" value={invoice.ArisingDate} />
				<InfoRow label="Ngày phát hành" value={invoice.IssueDate} />
				<InfoRow label="Cập nhật lần cuối" value={invoice.ModifiedDate} />
				<InfoRow label="Mã cơ quan thuế" value={invoice.TaxAuthorityCode} />
				<InfoRow label="Trạng thái CQT" value={invoice.TCTCheckStatus} />
				<InfoRow label="Chữ ký số" value={invoice.HasSigned ? "Đã ký" : "Chưa ký"} />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
				<Text style={styles.sectionDescription}>
					Thông tin bên mua được đồng bộ từ dữ liệu hóa đơn hiện tại.
				</Text>
				<InfoRow label="Tên khách hàng" value={invoice.CustomerName} />
				<InfoRow label="Địa chỉ" value={invoice.CustomerAddress} />
				<InfoRow label="Mã số thuế" value={invoice.CustomerTaxCode} />
				<InfoRow label="Mã khách hàng" value={invoice.CustomerCode} />
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Thông tin tài chính</Text>
				<Text style={styles.sectionDescription}>
					Giá trị tiền hàng, thuế VAT và tổng số tiền thanh toán của hóa đơn.
				</Text>
				<View style={styles.infoRow}>
					<Text style={styles.infoLabel}>Tiền hàng chưa VAT</Text>
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
					<Text style={styles.totalValue}>{formatCurrency(invoice.Amount)}</Text>
				</View>
			</View>

			{!!invoice.LookupCode && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Tra cứu</Text>
					<Text style={styles.sectionDescription}>
						Sử dụng mã tra cứu để kiểm tra nhanh hóa đơn trên hệ thống đối tác.
					</Text>
					<InfoRow label="Mã tra cứu" value={invoice.LookupCode} />
				</View>
			)}

			<View style={styles.actions}>
				<Text style={styles.actionsTitle}>Thao tác</Text>
				<TouchableOpacity
					style={styles.viewBtn}
					onPress={handleViewOnline}
					disabled={loadingView}
					activeOpacity={0.9}
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

				{invoice.InvoiceStatus === 1 && (
					<TouchableOpacity
						style={styles.adjustBtn}
						onPress={() =>
							navigate.navigate("EasyInvoiceAdjustScreen", { invoice })
						}
						activeOpacity={0.9}
					>
						<AntDesign name="edit" size={16} color="#db8026" />
						<Text style={styles.adjustBtnText}>Điều chỉnh hóa đơn</Text>
					</TouchableOpacity>
				)}

				{invoice.InvoiceStatus === 1 && (
					<TouchableOpacity
						style={styles.cancelBtn}
						onPress={handleCancel}
						disabled={cancelling}
						activeOpacity={0.9}
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

				{invoice.InvoiceStatus === 0 && (
					<TouchableOpacity
						style={styles.removeBtn}
						onPress={handleRemoveUnsigned}
						disabled={cancelling}
						activeOpacity={0.9}
					>
						{cancelling ? (
							<ActivityIndicator color="#b40909" />
						) : (
							<>
								<Feather name="trash-2" size={16} color="#b40909" />
								<Text style={styles.removeBtnText}>Xóa hóa đơn chưa phát hành</Text>
							</>
						)}
					</TouchableOpacity>
				)}
			</View>

			<Modal
				visible={showViewModal}
				animationType="slide"
				transparent
				onRequestClose={() => setShowViewModal(false)}
			>
				<View style={styles.webViewBackdrop}>
					<View style={styles.webViewModalCard}>
						<View style={styles.webViewHeader}>
							<Text style={styles.webViewTitle}>Xem hóa đơn</Text>
							<TouchableOpacity
								style={styles.webViewCloseBtn}
								onPress={() => setShowViewModal(false)}
							>
								<AntDesign name="close" size={18} color="#111827" />
							</TouchableOpacity>
						</View>
						{viewInvoiceUrl ? (
							<WebView
								source={{ uri: viewInvoiceUrl }}
								startInLoadingState
								renderLoading={() => (
									<View style={styles.webViewLoading}>
										<ActivityIndicator size="large" color={ColorMain} />
									</View>
								)}
							/>
						) : (
							<View style={styles.webViewLoading}>
								<Text style={styles.emptyWebViewText}>
									Không có liên kết xem hóa đơn.
								</Text>
							</View>
						)}
					</View>
				</View>
			</Modal>
		</ScrollView>
	);
}
const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F4F7FB" },
	content: { padding: 16, gap: 14, paddingBottom: 36 },
	statusCard: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 14,
		padding: 18,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "rgba(15, 23, 42, 0.06)",
		...Platform.select({
			ios: {
				shadowColor: "#0F172A",
				shadowOpacity: 0.08,
				shadowRadius: 20,
				shadowOffset: { width: 0, height: 10 },
			},
			android: {
				elevation: 3,
			},
		}),
	},
	statusIconWrap: {
		width: 56,
		height: 56,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	statusContent: { flex: 1, gap: 6 },
	statusEyebrow: { fontSize: 12, fontWeight: "700", letterSpacing: 0.4 },
	statusLabel: { fontSize: 22, fontWeight: "800" },
	statusSubtitle: {
		fontSize: 13,
		lineHeight: 20,
		color: "#475569",
	},
	metaRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginTop: 4,
	},
	metaBadge: {
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: "rgba(255, 255, 255, 0.7)",
		borderWidth: 1,
		borderColor: "rgba(148, 163, 184, 0.2)",
	},
	metaBadgeText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#334155",
	},
	section: {
		backgroundColor: "#fff",
		borderRadius: 18,
		padding: 16,
		borderWidth: 1,
		borderColor: "#EEF2F7",
		...Platform.select({
			ios: {
				shadowColor: "#0F172A",
				shadowOpacity: 0.04,
				shadowRadius: 14,
				shadowOffset: { width: 0, height: 6 },
			},
			android: {
				elevation: 2,
			},
		}),
	},
	sectionTitle: {
		fontSize: 15,
		fontWeight: "800",
		color: ColorMain,
		marginBottom: 6,
	},
	sectionDescription: {
		fontSize: 13,
		lineHeight: 19,
		color: "#64748B",
		marginBottom: 12,
	},
	infoRow: {
		gap: 8,
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#F1F5F9",
	},
	infoLabel: {
		fontSize: 13,
		color: "#64748B",
		fontWeight: "500",
	},
	infoValue: {
		fontSize: 15,
		lineHeight: 22,
		color: "#0F172A",
		fontWeight: "700",
	},
	moneyText: { color: "#1E293B" },
	totalRow: {
		borderTopWidth: 1,
		borderTopColor: "#E2E8F0",
		marginTop: 4,
		paddingTop: 12,
		borderBottomWidth: 0,
	},
	totalLabel: {
		fontSize: 15,
		fontWeight: "800",
		color: "#0F172A",
	},
	totalValue: {
		fontSize: 18,
		fontWeight: "800",
		color: ColorMain,
	},
	actions: { gap: 10, marginTop: 2 },
	actionsTitle: {
		fontSize: 15,
		fontWeight: "800",
		color: "#0F172A",
		marginBottom: 2,
	},
	viewBtn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#0F766E",
		padding: 14,
		borderRadius: 14,
	},
	viewBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
	cancelBtn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#FEF2F2",
		padding: 14,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#FECACA",
	},
	cancelBtnText: { color: "#DC2626", fontSize: 15, fontWeight: "700" },
	removeBtn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#ffeded",
		padding: 14,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#feaaaa",
	},
	removeBtnText: { color: "#B45309", fontSize: 15, fontWeight: "700" },
	adjustBtn: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#f0c79f14",
		padding: 14,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#db8026",
	},
	adjustBtnText: { color: "#db8026", fontSize: 15, fontWeight: "700" },
	webViewBackdrop: {
		flex: 1,
		backgroundColor: "hsla(221, 39%, 11%, 0.50)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 20,
	},
	webViewModalCard: {
		width: "100%",
		height: "88%",
		backgroundColor: "#fff",
		borderRadius: 18,
		overflow: "hidden",
	},
	webViewHeader: {
		height: 56,
		paddingHorizontal: 16,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
	},
	webViewTitle: {
		fontSize: 16,
		fontWeight: "800",
		color: "#111827",
	},
	webViewCloseBtn: {
		width: 32,
		height: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	webViewLoading: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24,
	},
	emptyWebViewText: {
		fontSize: 14,
		lineHeight: 21,
		color: "#64748B",
		textAlign: "center",
	},
});
