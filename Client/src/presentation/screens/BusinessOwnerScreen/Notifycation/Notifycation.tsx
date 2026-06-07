import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import { getInvoiceOutputList } from "@/src/services/API/invoiceService";
import { getTaxDeadline } from "@/src/services/API/profileService";
import { getInvoiceIn } from "@/src/services/API/syncInvoiceIn";
import { getVoucherPayment } from "@/src/services/API/voucherService";
import { InvoiceSummary } from "@/src/types/invoiceIn";
import { Invoice } from "@/src/types/route";
import { PaymentVoucher } from "@/src/types/voucher";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import * as React from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type NotificationType = "all" | "invoice" | "tax" | "payment";
type NotificationTone = "info" | "success" | "warning" | "danger";

type NotificationItem = {
  id: string;
  type: Exclude<NotificationType, "all">;
  title: string;
  description: string;
  time: string;
  timestamp: number;
  amount?: number;
  tone: NotificationTone;
};

const routes: { key: NotificationType; title: string }[] = [
  { key: "all", title: "Tất cả" },
  { key: "invoice", title: "Hóa đơn" },
  { key: "tax", title: "Thuế" },
  { key: "payment", title: "Chi tiền" },
];

const toneMap: Record<
  NotificationTone,
  { bg: string; color: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  info: { bg: "#eef6ff", color: "#2563eb", icon: "bell-outline" },
  success: { bg: "#ecfdf3", color: "#15803d", icon: "check-circle-outline" },
  warning: { bg: "#fff7ed", color: "#c2410c", icon: "alert-outline" },
  danger: { bg: "#fef2f2", color: "#dc2626", icon: "alert-circle-outline" },
};

const typeLabel: Record<Exclude<NotificationType, "all">, string> = {
  invoice: "Hóa đơn",
  tax: "Thuế",
  payment: "Chi tiền",
};

const formatCurrency = (value?: number) =>
  typeof value === "number"
    ? value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "";

const getTimestamp = (value?: string | Date | null) => {
  if (!value) return Date.now();
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? Date.now() : timestamp;
};

const formatTime = (timestamp: number) => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(timestamp).toLocaleDateString("vi-VN");
};

const normalizeInvoicesIn = (items: unknown): InvoiceSummary[] =>
  Array.isArray(items) ? (items as InvoiceSummary[]) : [];

const buildInvoiceInNotification = (invoice: InvoiceSummary): NotificationItem => {
  const timestamp = getTimestamp(invoice.ngayKy || invoice.ngayLap || invoice.createdAt);
  const invoiceCode = invoice.soHoaDon ? `#${invoice.soHoaDon}` : invoice.kyHieu || "mới";
  const seller = invoice.nguoiBan?.ten || "Nhà cung cấp";
  const amount = invoice.tien?.tong ?? undefined;

  return {
    id: `invoice-in-${invoice._id || invoice.id || invoice.mhdon || invoiceCode}`,
    type: "invoice",
    title: `Hóa đơn đầu vào ${invoiceCode}`,
    description: `${seller}${amount ? ` - ${formatCurrency(amount)}` : ""}`,
    time: formatTime(timestamp),
    timestamp,
    amount,
    tone: "info",
  };
};

const buildInvoiceOutNotification = (invoice: Invoice): NotificationItem => {
  const timestamp = getTimestamp(invoice.ncnhat);
  const invoiceCode = invoice.shdon ? `#${invoice.shdon}` : invoice.khhdon || "mới";
  const buyer = invoice.nmten || "Người mua";

  return {
    id: `invoice-out-${invoice._id || invoice.mhdon || invoiceCode}`,
    type: "invoice",
    title: `Hóa đơn đầu ra ${invoiceCode}`,
    description: `${buyer} - ${formatCurrency(invoice.tgtttbso)}`,
    time: formatTime(timestamp),
    timestamp,
    amount: invoice.tgtttbso,
    tone: invoice.ttxly === 1 ? "success" : "info",
  };
};

const buildVoucherNotification = (voucher: PaymentVoucher): NotificationItem => {
  const timestamp = getTimestamp(voucher.createdAt || voucher.date || voucher.recordDate);
  return {
    id: `payment-${voucher._id}`,
    type: "payment",
    title: `Phiếu chi ${voucher.category || voucher.type || ""}`.trim(),
    description: `${voucher.recipientName || "Người nhận"} - ${formatCurrency(voucher.amount)}`,
    time: formatTime(timestamp),
    timestamp,
    amount: voucher.amount,
    tone: "warning",
  };
};

export default function NotificationScreen() {
  const [activeType, setActiveType] = React.useState<NotificationType>("all");
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const fetchNotifications = React.useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setErrorMessage("");

    try {
      const [taxResult, invoiceInResult, invoiceOutResult, voucherResult] =
        await Promise.allSettled([
          getTaxDeadline(),
          getInvoiceIn(),
          getInvoiceOutputList(),
          getVoucherPayment(),
        ]);

      const nextNotifications: NotificationItem[] = [];

      if (taxResult.status === "fulfilled" && taxResult.value) {
        const deadline = taxResult.value;
        const deadlineTimestamp = getTimestamp(deadline.deadlineDate);
        const daysRemaining = Number(deadline.daysRemaining ?? 0);
        nextNotifications.push({
          id: `tax-${deadline.period}-${deadline.deadlineDate}`,
          type: "tax",
          title: `Hạn kê khai ${deadline.period}`,
          description:
            daysRemaining >= 0
              ? `Còn ${daysRemaining} ngày, hạn cuối ${new Date(
                  deadlineTimestamp,
                ).toLocaleDateString("vi-VN")}`
              : `Đã quá hạn ${Math.abs(daysRemaining)} ngày`,
          time: formatTime(deadlineTimestamp),
          timestamp: deadlineTimestamp,
          tone: daysRemaining < 0 ? "danger" : daysRemaining <= 3 ? "warning" : "info",
        });
      }

      if (invoiceInResult.status === "fulfilled") {
        normalizeInvoicesIn(invoiceInResult.value)
          .slice(0, 6)
          .forEach((invoice) => nextNotifications.push(buildInvoiceInNotification(invoice)));
      }

      if (invoiceOutResult.status === "fulfilled") {
        (invoiceOutResult.value.data ?? [])
          .slice(0, 6)
          .forEach((invoice) => nextNotifications.push(buildInvoiceOutNotification(invoice)));
      }

      if (voucherResult.status === "fulfilled") {
        (voucherResult.value.data ?? [])
          .slice(0, 6)
          .forEach((voucher) => nextNotifications.push(buildVoucherNotification(voucher)));
      }

      setNotifications(
        nextNotifications
          .filter((item, index, source) => source.findIndex((n) => n.id === item.id) === index)
          .sort((a, b) => b.timestamp - a.timestamp),
      );

      if (
        [taxResult, invoiceInResult, invoiceOutResult, voucherResult].every(
          (result) => result.status === "rejected",
        )
      ) {
        setErrorMessage("Không thể tải dữ liệu thông báo. Vui lòng thử lại.");
      }
    } catch {
      setErrorMessage("Không thể tải dữ liệu thông báo. Vui lòng thử lại.");
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications]),
  );

  const filteredData = React.useMemo(
    () =>
      activeType === "all"
        ? notifications
        : notifications.filter((item) => item.type === activeType),
    [activeType, notifications],
  );

  const unreadCount = notifications.length;

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const tone = toneMap[item.tone];
    return (
      <View style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: tone.bg }]}>
          <MaterialCommunityIcons name={tone.icon} size={22} color={tone.color} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.badge, { color: tone.color, backgroundColor: tone.bg }]}>
              {typeLabel[item.type]}
            </Text>
            {item.amount ? <Text style={styles.amountText}>{formatCurrency(item.amount)}</Text> : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LoadingScreen visible={loading && !refreshing} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Thông báo</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? `${unreadCount} cập nhật từ dữ liệu hệ thống`
              : "Chưa có cập nhật mới"}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={() => fetchNotifications(true)}>
          <MaterialCommunityIcons name="refresh" size={20} color={ColorMain} />
        </TouchableOpacity>
      </View>

      <View style={styles.segmentWrap}>
        {routes.map((route) => {
          const isActive = activeType === route.key;
          const count =
            route.key === "all"
              ? notifications.length
              : notifications.filter((item) => item.type === route.key).length;

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.segmentItem, isActive && styles.segmentItemActive]}
              onPress={() => setActiveType(route.key)}
              activeOpacity={0.85}
            >
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {route.title}
              </Text>
              {count > 0 ? (
                <View style={[styles.countPill, isActive && styles.countPillActive]}>
                  <Text style={[styles.countText, isActive && styles.countTextActive]}>
                    {count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {errorMessage ? (
        <View style={styles.errorBox}>
          <MaterialCommunityIcons name="wifi-alert" size={20} color="#dc2626" />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={filteredData.length ? styles.listContent : styles.emptyContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchNotifications(true)}
            colors={[ColorMain]}
            tintColor={ColorMain}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons name="bell-check-outline" size={30} color={ColorMain} />
              </View>
              <Text style={styles.emptyTitle}>Không có thông báo</Text>
              <Text style={styles.emptyDescription}>
                Khi hệ thống có hóa đơn, hạn thuế hoặc phiếu chi mới, thông báo sẽ xuất hiện ở đây.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8fb",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#eef8f7",
    alignItems: "center",
    justifyContent: "center",
  },
  segmentWrap: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#edf1f5",
  },
  segmentItem: {
    flex: 1,
    minHeight: 38,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 6,
  },
  segmentItemActive: {
    backgroundColor: textColorMain,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  segmentTextActive: {
    color: "#fff",
  },
  countPill: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  countPillActive: {
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  countText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
  },
  countTextActive: {
    color: "#fff",
  },
  errorBox: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fef2f2",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: "#991b1b",
    fontSize: 13,
    lineHeight: 18,
  },
  listContent: {
    padding: 12,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#edf1f5",
    ...Platform.select({
      ios: {
        shadowColor: "#0f172a",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 20,
  },
  cardTime: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
  cardDescription: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    color: "#4b5563",
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  badge: {
    overflow: "hidden",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 11,
    fontWeight: "800",
  },
  amountText: {
    flex: 1,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#eef8f7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  emptyDescription: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 19,
    color: "#6b7280",
  },
});
