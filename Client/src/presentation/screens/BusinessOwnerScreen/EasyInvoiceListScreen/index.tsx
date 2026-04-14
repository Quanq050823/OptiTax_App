import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
	cancelEasyInvoice,
	EasyInvoiceItem,
	getEasyInvoicesByDateRange,
	getEasyInvoicesAuto,
} from "@/src/services/API/invoiceService";
import { RootStackParamList } from "@/src/types/route";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	RefreshControl,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

type NavProp = StackNavigationProp<RootStackParamList>;

const STATUS_LABELS: Record<number, { label: string; color: string }> = {
	0: { label: "Chưa phát hành", color: "#F59E0B" },
	1: { label: "Đã phát hành", color: "#10B981" },
	2: { label: "Đã hủy", color: "#EF4444" },
};

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
		value,
	);

const toDateParam = (date: Date) => {
	const d = String(date.getDate()).padStart(2, "0");
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const y = date.getFullYear();
	return `${d}/${m}/${y}`;
};

const PAGE_SIZE = 20;

export default function EasyInvoiceListScreen() {
	const navigate = useNavigation<NavProp>();
	const [invoices, setInvoices] = useState<EasyInvoiceItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [cancelling, setCancelling] = useState<string | null>(null);

	// Pagination
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(false);
	const knownTotalRef = React.useRef<number>(0);
	const userPageRef = React.useRef<number>(1);
	const resolvedDateRangeRef = React.useRef<{ FromDate: string; ToDate: string } | null>(null);

	// Date filter
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();

	// Search
	const [search, setSearch] = useState("");

	const fetchInvoices = useCallback(
		async (userPage = 1, isRefresh = false) => {
			if (userPage === 1) {
				isRefresh ? setRefreshing(true) : setLoading(true);
			} else {
				setLoadingMore(true);
			}

			try {
				let rawInvoices: EasyInvoiceItem[] = [];
				let apiPage: number;

				if (userPage === 1) {
					// Probe page 1 to learn TotalRecords, then jump to the last API page (newest)
					let fromDate: string;
					let toDate: string;
					let totalRecords: number;

					if (startDate && endDate) {
						fromDate = toDateParam(startDate);
						toDate = toDateParam(endDate);
						const probe = await getEasyInvoicesByDateRange({
							FromDate: fromDate,
							ToDate: toDate,
							Page: 1,
							PageSize: PAGE_SIZE,
						});
						totalRecords = probe?.data?.Data?.TotalRecords ?? 0;
					} else {
						const autoResult = await getEasyInvoicesAuto();
						totalRecords = autoResult?.data?.Data?.TotalRecords ?? 0;
						fromDate = autoResult?.dateRange?.FromDate ?? "";
						toDate = autoResult?.dateRange?.ToDate ?? "";
					}

					knownTotalRef.current = totalRecords;
					resolvedDateRangeRef.current = { FromDate: fromDate, ToDate: toDate };

					const totalAPIPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
					apiPage = totalAPIPages; // user page 1 = newest = last API page

					const result = await getEasyInvoicesByDateRange({
						FromDate: fromDate,
						ToDate: toDate,
						Page: apiPage,
						PageSize: PAGE_SIZE,
					});
					rawInvoices = result?.data?.Data?.Invoices ?? [];
					setHasMore(apiPage > 1);
				} else {
					// Subsequent pages: reverse-paginate to get older invoices
					const totalAPIPages = Math.max(
						1,
						Math.ceil(knownTotalRef.current / PAGE_SIZE),
					);
					apiPage = Math.max(1, totalAPIPages - userPage + 1);
					const result = await getEasyInvoicesByDateRange({
						...resolvedDateRangeRef.current!,
						Page: apiPage,
						PageSize: PAGE_SIZE,
					});
					rawInvoices = result?.data?.Data?.Invoices ?? [];
					setHasMore(apiPage > 1);
				}

				// Sort newest-first within this page (ArisingDate is DD/MM/YYYY)
				const sorted = [...rawInvoices].sort((a, b) => {
					const [dA, mA, yA] = a.ArisingDate.split("/").map(Number);
					const [dB, mB, yB] = b.ArisingDate.split("/").map(Number);
					return (
						new Date(yB, mB - 1, dB).getTime() -
						new Date(yA, mA - 1, dA).getTime()
					);
				});

				if (userPage === 1) {
					setInvoices(sorted);
				} else {
					setInvoices((prev) => [...prev, ...sorted]);
				}
				userPageRef.current = userPage;
			} catch (err: any) {
				Alert.alert(
					"Lỗi",
					err?.message ?? "Không thể tải danh sách hóa đơn EasyInvoice",
				);
			} finally {
				setLoading(false);
				setRefreshing(false);
				setLoadingMore(false);
			}
		},
		[startDate, endDate],
	);

	useEffect(() => {
		fetchInvoices(1);
	}, [fetchInvoices]);

	const handleRefresh = () => fetchInvoices(1, true);

	const handleLoadMore = () => {
		if (!loadingMore && hasMore) {
			fetchInvoices(userPageRef.current + 1);
		}
	};

	const handleCancel = (item: EasyInvoiceItem) => {
		if (item.InvoiceStatus !== 0) {
			Alert.alert("Thông báo", "Chỉ có thể hủy hóa đơn chưa phát hành.");
			return;
		}
		Alert.alert(
			"Xác nhận hủy",
			`Bạn có chắc muốn hủy hóa đơn số ${item.No || item.Ikey}?`,
			[
				{ text: "Không", style: "cancel" },
				{
					text: "Hủy hóa đơn",
					style: "destructive",
					onPress: async () => {
						setCancelling(item.Ikey);
						try {
							await cancelEasyInvoice(item.Ikey);
							Alert.alert("Thành công", "Hóa đơn đã được hủy.");
							fetchInvoices(1);
						} catch (err: any) {
							Alert.alert("Lỗi", err?.message ?? "Hủy hóa đơn thất bại.");
						} finally {
							setCancelling(null);
						}
					},
				},
			],
		);
	};

	const filteredInvoices = invoices.filter((inv) => {
		if (!search.trim()) return true;
		const q = search.toLowerCase();
		return (
			(inv.CustomerName ?? "").toLowerCase().includes(q) ||
			(inv.No ?? "").includes(q) ||
			(inv.Ikey ?? "").toLowerCase().includes(q) ||
			(inv.CustomerTaxCode ?? "").includes(q)
		);
	});

	const renderItem = ({ item }: { item: EasyInvoiceItem }) => {
		const status = STATUS_LABELS[item.InvoiceStatus] ?? {
			label: "Không xác định",
			color: "#9CA3AF",
		};
		const isCancelling = cancelling === item.Ikey;

		return (
			<TouchableOpacity
				style={styles.card}
				onPress={() =>
					navigate.navigate("EasyInvoiceDetailScreen", { invoice: item })
				}
				activeOpacity={0.85}
			>
				<View style={styles.cardHeader}>
					<View style={styles.cardHeaderLeft}>
						<MaterialCommunityIcons
							name="invoice-text-outline"
							size={20}
							color={ColorMain}
						/>
						<Text style={styles.invoiceNo}>
							HĐ #{item.No || "—"} · {item.Pattern}
						</Text>
					</View>
					<View
						style={[
							styles.statusBadge,
							{ backgroundColor: status.color + "22" },
						]}
					>
						<Text style={[styles.statusText, { color: status.color }]}>
							{status.label}
						</Text>
					</View>
				</View>

				<Text style={styles.customerName} numberOfLines={1}>
					{item.CustomerName || "Khách hàng"}
				</Text>
				{!!item.CustomerTaxCode && (
					<Text style={styles.taxCode}>MST: {item.CustomerTaxCode}</Text>
				)}

				<View style={styles.cardFooter}>
					<View>
						<Text style={styles.label}>Ngày lập</Text>
						<Text style={styles.value}>{item.ArisingDate}</Text>
					</View>
					<View style={{ alignItems: "flex-end" }}>
						<Text style={styles.label}>Tổng tiền</Text>
						<Text
							style={[styles.value, { color: ColorMain, fontWeight: "700" }]}
						>
							{formatCurrency(item.Amount)}
						</Text>
					</View>
				</View>

				{item.InvoiceStatus === 0 && (
					<TouchableOpacity
						style={styles.cancelBtn}
						onPress={() => handleCancel(item)}
						disabled={isCancelling}
					>
						{isCancelling ? (
							<ActivityIndicator size="small" color="#EF4444" />
						) : (
							<>
								<Feather name="trash-2" size={14} color="#EF4444" />
								<Text style={styles.cancelText}>Hủy hóa đơn</Text>
							</>
						)}
					</TouchableOpacity>
				)}
			</TouchableOpacity>
		);
	};

	const renderFooter = () => {
		if (!loadingMore) return null;
		return (
			<View style={styles.footerLoader}>
				<ActivityIndicator color={ColorMain} />
			</View>
		);
	};

	return (
		<View style={styles.container}>
			{/* Search */}
			<View style={styles.searchRow}>
				<View style={styles.searchBox}>
					<AntDesign name="search" size={16} color="#9CA3AF" />
					<TextInput
						style={styles.searchInput}
						placeholder="Tìm theo tên KH, số HĐ..."
						value={search}
						onChangeText={setSearch}
						placeholderTextColor="#9CA3AF"
					/>
					{!!search && (
						<TouchableOpacity onPress={() => setSearch("")}>
							<AntDesign name="close" size={14} color="#9CA3AF" />
						</TouchableOpacity>
					)}
				</View>
				<TouchableOpacity
					style={[
						styles.filterBtn,
						(startDate || endDate) && styles.filterBtnActive,
					]}
					onPress={() => setShowDatePicker(true)}
				>
					<Feather
						name="calendar"
						size={16}
						color={startDate || endDate ? "#fff" : ColorMain}
					/>
				</TouchableOpacity>
			</View>

			{/* Active date filter chip */}
			{startDate && endDate && (
				<View style={styles.chipRow}>
					<View style={styles.chip}>
						<Text style={styles.chipText}>
							{toDateParam(startDate)} → {toDateParam(endDate)}
						</Text>
						<TouchableOpacity
							onPress={() => {
								setStartDate(undefined);
								setEndDate(undefined);
							}}
						>
							<AntDesign name="close" size={12} color="#3F4E87" />
						</TouchableOpacity>
					</View>
				</View>
			)}

			{/* Summary */}
			{!loading && (
				<Text style={styles.summary}>
					{filteredInvoices.length} hóa đơn hiển thị
				</Text>
			)}

			{loading ? (
				<View style={styles.center}>
					<ActivityIndicator size="large" color={ColorMain} />
					<Text style={styles.loadingText}>Đang tải hóa đơn...</Text>
				</View>
			) : filteredInvoices.length === 0 ? (
				<View style={styles.center}>
					<MaterialCommunityIcons
						name="invoice-text-remove-outline"
						size={56}
						color="#D1D5DB"
					/>
					<Text style={styles.emptyText}>Không có hóa đơn nào</Text>
				</View>
			) : (
				<FlatList
					data={filteredInvoices}
					keyExtractor={(item, index) => `${item.Ikey ?? ""}-${index}`}
					renderItem={renderItem}
					contentContainerStyle={styles.list}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
							colors={[ColorMain]}
						/>
					}
					onEndReached={handleLoadMore}
					onEndReachedThreshold={0.3}
					ListFooterComponent={renderFooter}
				/>
			)}

			{/* Date range picker */}
			<DatePickerModal
				locale="vi"
				mode="range"
				visible={showDatePicker}
				onDismiss={() => setShowDatePicker(false)}
				startDate={startDate}
				endDate={endDate}
				onConfirm={({ startDate: s, endDate: e }) => {
					setShowDatePicker(false);
					setStartDate(s);
					setEndDate(e);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F3F4F6" },
	searchRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
	},
	searchBox: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F9FAFB",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		paddingHorizontal: 10,
		gap: 6,
	},
	searchInput: { flex: 1, paddingVertical: 8, fontSize: 14, color: "#111" },
	filterBtn: {
		padding: 10,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: ColorMain,
	},
	filterBtnActive: { backgroundColor: ColorMain },
	chipRow: { paddingHorizontal: 12, paddingTop: 8 },
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "#EEF2FF",
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 20,
		alignSelf: "flex-start",
	},
	chipText: { fontSize: 12, color: "#3F4E87", fontWeight: "500" },
	summary: {
		paddingHorizontal: 14,
		paddingTop: 8,
		paddingBottom: 4,
		fontSize: 12,
		color: "#6B7280",
	},
	list: { padding: 12, gap: 10 },
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 14,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.06,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 6,
	},
	cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
	invoiceNo: { fontSize: 13, fontWeight: "600", color: "#374151" },
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 20,
	},
	statusText: { fontSize: 11, fontWeight: "600" },
	customerName: {
		fontSize: 15,
		fontWeight: "600",
		color: "#111827",
		marginBottom: 2,
	},
	taxCode: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
	cardFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#F3F4F6",
	},
	label: { fontSize: 11, color: "#9CA3AF", marginBottom: 2 },
	value: { fontSize: 13, color: "#374151" },
	cancelBtn: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginTop: 10,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#FEE2E2",
		alignSelf: "flex-start",
	},
	cancelText: { fontSize: 12, color: "#EF4444", fontWeight: "500" },
	center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
	loadingText: { fontSize: 14, color: "#6B7280" },
	emptyText: { fontSize: 16, color: "#9CA3AF", marginTop: 8 },
	footerLoader: { paddingVertical: 16, alignItems: "center" },
});
