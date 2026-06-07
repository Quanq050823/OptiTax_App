import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import { getVoucherPayment } from "@/src/services/API/voucherService";
import { PaymentVoucher, VoucherPaymentResponse } from "@/src/types/voucher";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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

const CatePayVoucherData = [
  { label: "Chi phí nhân công", value: "1" },
  { label: "Chi phí điện", value: "2" },
  { label: "Chi phí nước", value: "3" },
  { label: "Chi phí viễn thông", value: "4" },
  { label: "Chi phí thuê bãi, mặt bằng kinh doanh", value: "5" },
  { label: "Chi phí quản lý", value: "6" },
  { label: "Chi phí khác", value: "7" },
];

type FilterKey = "all" | "today" | "month";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "today", label: "Hôm nay" },
  { key: "month", label: "Tháng này" },
];

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value ?? 0));

const toDate = (value?: string | Date) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value?: string | Date) => {
  const date = toDate(value);
  return date ? date.toLocaleDateString("vi-VN") : "Chưa có ngày";
};

const isSameDay = (date: Date, target: Date) =>
  date.getDate() === target.getDate() &&
  date.getMonth() === target.getMonth() &&
  date.getFullYear() === target.getFullYear();

function PaymentVoucherScreen() {
  const navigate = useAppNavigation();
  const { data } = useData();
  const [voucherPayList, setVoucherPayList] = useState<PaymentVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const fetchDataVoucherPay = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const res: VoucherPaymentResponse = await getVoucherPayment();
      setVoucherPayList(res.data ?? []);
    } catch (error: any) {
      Alert.alert(
        "Không tải được phiếu chi",
        error?.message ?? "Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDataVoucherPay();
    }, [fetchDataVoucherPay])
  );

  const getCategoryLabel = useCallback((value?: string) => {
    const found = CatePayVoucherData.find((item) => item.value === value);
    return found ? found.label : "Chưa phân loại";
  }, []);

  const filteredVouchers = useMemo(() => {
    const now = new Date();
    const query = search.trim().toLowerCase();

    return voucherPayList.filter((item) => {
      const itemDate = toDate(item.date ?? item.createdAt);
      const matchesTime =
        activeFilter === "all" ||
        (activeFilter === "today" && itemDate && isSameDay(itemDate, now)) ||
        (activeFilter === "month" &&
          itemDate &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear());

      if (!matchesTime) return false;
      if (!query) return true;

      return [
        item._id,
        item.description,
        item.paymentMethod,
        getCategoryLabel(item.category),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [activeFilter, getCategoryLabel, search, voucherPayList]);

  const totalAmount = useMemo(
    () => filteredVouchers.reduce((sum, item) => sum + Number(item.amount ?? 0), 0),
    [filteredVouchers]
  );

  const renderItem = ({ item }: { item: PaymentVoucher }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => navigate.navigate("PaymentVoucherDetail", { voucher: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleWrap}>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons name="cash-minus" size={18} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {getCategoryLabel(item.category)}
            </Text>
            <Text style={styles.cardSubTitle} numberOfLines={1}>
              #{item._id}
            </Text>
          </View>
        </View>
        <Text style={styles.amountText}>{formatCurrency(item.amount)}</Text>
      </View>

      {!!item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Feather name="calendar" size={12} color="#6B7280" />
          <Text style={styles.metaText}>{formatDate(item.date ?? item.createdAt)}</Text>
        </View>
        <View style={styles.metaChip}>
          <Feather name="credit-card" size={12} color="#6B7280" />
          <Text style={styles.metaText}>{item.paymentMethod || "Chưa chọn"}</Text>
        </View>
      </View>

      <View style={styles.creatorRow}>
        <Text style={styles.creatorLabel}>Người tạo</Text>
        <Text style={styles.creatorName} numberOfLines={1}>
          {data?.businessName ?? "Doanh nghiệp"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Phiếu chi</Text>
          <Text style={styles.subtitle}>{filteredVouchers.length} phiếu đang hiển thị</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.85}
          onPress={() => navigate.navigate("CreateVoucherPayment")}
        >
          <AntDesign name="plus" size={16} color="#fff" />
          <Text style={styles.createButtonText}>Tạo phiếu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Tổng chi</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalAmount)}</Text>
        </View>
        <View style={styles.summaryIcon}>
          <MaterialCommunityIcons name="chart-donut" size={24} color={ColorMain} />
        </View>
      </View>

      <View style={styles.searchBox}>
        <AntDesign name="search" size={16} color="#9CA3AF" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholder="Tìm mô tả, mã phiếu, danh mục..."
          placeholderTextColor="#9CA3AF"
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <AntDesign name="close" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {filters.map((item) => {
          const active = activeFilter === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setActiveFilter(item.key)}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={ColorMain} size="large" />
          <Text style={styles.centerText}>Đang tải phiếu chi...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVouchers}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchDataVoucherPay(true)}
              colors={[ColorMain]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons
                name="cash-remove"
                size={58}
                color="#D1D5DB"
              />
              <Text style={styles.emptyTitle}>Chưa có phiếu chi phù hợp</Text>
              <Text style={styles.emptyText}>
                Tạo phiếu đầu tiên hoặc thử đổi bộ lọc.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F8FA",
    paddingHorizontal: 14,
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
  },
  createButton: {
    alignItems: "center",
    backgroundColor: ColorMain,
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  summaryCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 14,
  },
  summaryLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "600",
  },
  summaryValue: {
    color: "#EF4444",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },
  summaryIcon: {
    alignItems: "center",
    backgroundColor: "#EAF8F3",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: "#111827",
    flex: 1,
    fontSize: 14,
    height: "100%",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  filterChip: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    backgroundColor: ColorMain,
    borderColor: ColorMain,
  },
  filterText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  filterTextActive: {
    color: "#fff",
  },
  list: {
    paddingBottom: 34,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  cardTitleWrap: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  iconBadge: {
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  cardTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  cardSubTitle: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  amountText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "800",
    maxWidth: 140,
    textAlign: "right",
  },
  description: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  metaChip: {
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  metaText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
  },
  creatorRow: {
    alignItems: "center",
    borderTopColor: "#F3F4F6",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
  },
  creatorLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
  },
  creatorName: {
    color: ColorMain,
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 12,
    textAlign: "right",
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  centerText: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 10,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 12,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    textAlign: "center",
  },
});

export default PaymentVoucherScreen;
