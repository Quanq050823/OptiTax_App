import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getStockLogs, getStockSummary } from '@/src/services/API/storageService';
import { StockLog, StockLogChange, StockSummaryItem } from '@/src/types/storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDateTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const time = `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  const date = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()}`;
  return { time, date };
};

const formatPrice = (price?: number) =>
  price !== undefined ? price.toLocaleString('vi-VN') + ' ₫' : '—';

const getDateRange = (filter: FilterType): { startDate?: string; endDate?: string } => {
  const now = new Date();
  if (filter === 'all') return {};
  if (filter === 'today') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { startDate: start.toISOString(), endDate: now.toISOString() };
  }
  if (filter === 'week') {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return { startDate: start.toISOString(), endDate: now.toISOString() };
  }
  if (filter === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: start.toISOString(), endDate: now.toISOString() };
  }
  return {};
};

const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};
const isThisWeek = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return d >= start;
};
const isThisMonth = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'today' | 'week' | 'month';
type TabType = 'detail' | 'summary';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'today', label: 'Hôm nay' },
  { key: 'week', label: 'Tuần này' },
  { key: 'month', label: 'Tháng này' },
];

const FIELD_LABEL: Record<string, string> = {
  name: 'Tên',
  unit: 'Đơn vị',
  stock: 'Tồn kho',
  price: 'Giá',
};

const formatValue = (field: string, value: any): string => {
  if (value === undefined || value === null) return '—';
  if (field === 'price') return Number(value).toLocaleString('vi-VN') + ' ₫';
  return String(value);
};

// ─── Detail components ────────────────────────────────────────────────────────

const ChangesRow = ({ changes }: { changes: StockLogChange[] }) => (
  <View style={styles.changesContainer}>
    {changes.map((c, i) => (
      <View key={i} style={styles.changeItem}>
        <Text style={styles.changeField}>{FIELD_LABEL[c.field] ?? c.field}:</Text>
        <Text style={styles.changeOld}>{formatValue(c.field, c.oldValue)}</Text>
        <Ionicons name="arrow-forward" size={11} color="#9CA3AF" />
        <Text style={styles.changeNew}>{formatValue(c.field, c.newValue)}</Text>
      </View>
    ))}
  </View>
);

const SOURCE_CONFIG: Partial<Record<StockLog['source'], { label: string; bg: string; color: string }>> = {
  opening_balance: { label: 'Số dư đầu', bg: '#F1F5F9', color: '#64748B' },
  manual_add: { label: 'Thêm mới', bg: '#EDE9FE', color: '#7C3AED' },
  manual_update: { label: 'Cập nhật', bg: '#FEF3C7', color: '#D97706' },
  manual_delete: { label: 'Đã xoá', bg: '#FEE2E2', color: '#DC2626' },
  invoice_in: { label: 'Hóa đơn mua', bg: '#ECFDF5', color: '#10B981' },
  invoice_out: { label: 'Hóa đơn bán', bg: '#FEF2F2', color: '#EF4444' },
  merge: { label: 'Gộp kho', bg: '#EEF2FF', color: '#6366F1' },
};

const SourceBadge = ({ source }: { source: StockLog['source'] }) => {
  const cfg = SOURCE_CONFIG[source] ?? { label: 'Thêm mới', bg: '#EDE9FE', color: '#7C3AED' };
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

const getLogQuantityChange = (item: StockLog) => {
  if (typeof item.signedQuantity === 'number') return item.signedQuantity;
  if (item.direction === 'out' || item.source === 'manual_delete' || item.source === 'invoice_out') {
    return -Math.abs(item.quantityChanged ?? 0);
  }
  return Math.abs(item.quantityChanged ?? 0);
};

const LogRow = ({ item }: { item: StockLog }) => {
  const { time, date } = formatDateTime(item.createdAt);
  const quantityChange = getLogQuantityChange(item);
  const isOut = quantityChange < 0;
  const isDelete = item.source === 'manual_delete';
  return (
    <View style={[styles.logRow, isDelete && styles.logRowDeleted]}>
      <View style={styles.logRowHeader}>
        <View style={styles.logRowLeft}>
          <MaterialCommunityIcons
            name={isOut ? 'package-variant-closed-remove' : 'package-variant'}
            size={18}
            color={isOut ? '#DC2626' : '#7C3AED'}
          />
          <Text
            style={[styles.logItemName, isDelete && { color: '#DC2626', textDecorationLine: 'line-through' }]}
            numberOfLines={1}
          >
            {item.itemName}
          </Text>
        </View>
        <SourceBadge source={item.source} />
      </View>

      <View style={styles.logRowMeta}>
        <View style={styles.metaChip}>
          <Ionicons name="layers-outline" size={12} color="#6B7280" />
          <Text style={styles.metaText}>
            {quantityChange > 0 ? '+' : quantityChange < 0 ? '-' : ''}{Math.abs(quantityChange)} {item.unit ?? ''}
          </Text>
        </View>
        {item.pricePerUnit !== undefined && item.pricePerUnit > 0 && (
          <View style={styles.metaChip}>
            <Ionicons name="pricetag-outline" size={12} color="#6B7280" />
            <Text style={styles.metaText}>{formatPrice(item.pricePerUnit)}</Text>
          </View>
        )}
        <View style={[styles.metaChip, { marginLeft: 'auto' }]}>
          <Ionicons name="time-outline" size={12} color="#9CA3AF" />
          <Text style={[styles.metaText, { color: '#9CA3AF' }]}>
            {time} · {date}
          </Text>
        </View>
      </View>

      {item.source === 'manual_update' && item.changes && item.changes.length > 0 && (
        <ChangesRow changes={item.changes} />
      )}
    </View>
  );
};

// ─── Summary components ───────────────────────────────────────────────────────

const NetChangeBadge = ({ net, unit }: { net: number; unit: string }) => {
  const isPositive = net > 0;
  const isZero = net === 0;
  return (
    <View
      style={[
        styles.netBadge,
        { backgroundColor: isZero ? '#F3F4F6' : isPositive ? '#DCFCE7' : '#FEE2E2' },
      ]}
    >
      <Text
        style={[
          styles.netBadgeText,
          { color: isZero ? '#6B7280' : isPositive ? '#16A34A' : '#DC2626' },
        ]}
      >
        {isPositive ? '+' : ''}{net} {unit}
      </Text>
    </View>
  );
};

const FIELD_LABEL_VN: Record<string, string> = {
  name: 'Tên',
  unit: 'Đơn vị',
  stock: 'Tồn kho',
  price: 'Giá',
};

const SummaryCard = ({
  item,
  changedFields,
  onPress,
}: {
  item: StockSummaryItem;
  changedFields: string[];
  onPress: () => void;
}) => {
  const { date } = formatDateTime(item.lastActivity);
  const totalOps = item.countAdd + item.countUpdate + item.countDelete;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.summaryCard}>
      <View style={styles.summaryCardHeader}>
        <View style={styles.summaryCardLeft}>
          <MaterialCommunityIcons name="package-variant" size={16} color="#7C3AED" />
          <Text style={styles.summaryItemName} numberOfLines={2}>{item.itemName}</Text>
        </View>
        <NetChangeBadge net={item.netChange} unit={item.unit} />
      </View>

      <View style={styles.summaryBreakdown}>
        {item.countAdd > 0 && (
          <View style={[styles.breakdownChip, { backgroundColor: '#EDE9FE' }]}>
            <Ionicons name="add-circle-outline" size={12} color="#7C3AED" />
            <Text style={[styles.breakdownText, { color: '#7C3AED' }]}>
              {item.countAdd} lần thêm (+{item.totalAdded} {item.unit})
            </Text>
          </View>
        )}
        {item.countUpdate > 0 && (
          <View style={[styles.breakdownChip, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="pencil-outline" size={12} color="#D97706" />
            <Text style={[styles.breakdownText, { color: '#D97706' }]}>
              {item.countUpdate} lần sửa
              {changedFields.length > 0 && (
                <Text style={{ color: '#92400E' }}>
                  {' '}({changedFields.map(f => FIELD_LABEL_VN[f] ?? f).join(', ')})
                </Text>
              )}
            </Text>
          </View>
        )}
        {item.countDelete > 0 && (
          <View style={[styles.breakdownChip, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="trash-outline" size={12} color="#DC2626" />
            <Text style={[styles.breakdownText, { color: '#DC2626' }]}>
              {item.countDelete} lần xoá (-{item.totalDeleted} {item.unit})
            </Text>
          </View>
        )}
      </View>

      <View style={styles.summaryCardMeta}>
        <View style={styles.metaChip}>
          <Ionicons name="swap-vertical-outline" size={12} color="#9CA3AF" />
          <Text style={[styles.metaText, { color: '#9CA3AF' }]}>{totalOps} thao tác</Text>
        </View>
        <View style={[styles.metaChip, { marginLeft: 'auto' }]}>
          <Text style={[styles.metaText, { color: '#7C3AED', fontWeight: '600' }]}>Xem chi tiết</Text>
          <Ionicons name="chevron-forward" size={12} color="#7C3AED" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Item detail modal ────────────────────────────────────────────────────────

const ItemDetailModal = ({
  visible,
  onClose,
  item,
  logs,
}: {
  visible: boolean;
  onClose: () => void;
  item: StockSummaryItem | null;
  logs: StockLog[];
}) => {
  if (!item) return null;
  const itemLogs = logs
    .filter((l) => l.itemName === item.itemName)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalScreen}>
        {/* Modal header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn}>
            <Ionicons name="close" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.modalTitle} numberOfLines={1}>{item.itemName}</Text>
            <Text style={styles.modalSubtitle}>{itemLogs.length} bản ghi</Text>
          </View>
          <NetChangeBadge net={item.netChange} unit={item.unit} />
        </View>

        {/* Quick stats */}
        <View style={styles.modalStats}>
          {item.countAdd > 0 && (
            <View style={[styles.modalStatChip, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="add-circle-outline" size={13} color="#7C3AED" />
              <Text style={[styles.modalStatText, { color: '#7C3AED' }]}>+{item.totalAdded} {item.unit} nhập</Text>
            </View>
          )}
          {item.countDelete > 0 && (
            <View style={[styles.modalStatChip, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="remove-circle-outline" size={13} color="#DC2626" />
              <Text style={[styles.modalStatText, { color: '#DC2626' }]}>-{item.totalDeleted} {item.unit} xoá</Text>
            </View>
          )}
          {item.countUpdate > 0 && (
            <View style={[styles.modalStatChip, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="pencil-outline" size={13} color="#D97706" />
              <Text style={[styles.modalStatText, { color: '#D97706' }]}>{item.countUpdate} lần sửa</Text>
            </View>
          )}
        </View>

        <FlatList
          data={itemLogs}
          keyExtractor={(l) => l._id}
          renderItem={({ item: log }) => <LogRow item={log} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="package-variant-closed" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>Không có bản ghi nào</Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

// ─── Summary totals banner ────────────────────────────────────────────────────

const SummaryBanner = ({ items }: { items: StockSummaryItem[] }) => {
  const totalAdd = items.reduce((s, i) => s + i.totalAdded, 0);
  const totalDel = items.reduce((s, i) => s + i.totalDeleted, 0);
  const totalUpdOps = items.reduce((s, i) => s + i.countUpdate, 0);
  const uniqueItems = items.length;
  return (
    <View style={styles.banner}>
      <View style={styles.bannerItem}>
        <Text style={[styles.bannerValue, { color: '#7C3AED' }]}>{uniqueItems}</Text>
        <Text style={styles.bannerLabel}>Mặt hàng</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerItem}>
        <Text style={[styles.bannerValue, { color: '#16A34A' }]}>+{totalAdd}</Text>
        <Text style={styles.bannerLabel}>Tổng nhập</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerItem}>
        <Text style={[styles.bannerValue, { color: '#DC2626' }]}>-{totalDel}</Text>
        <Text style={styles.bannerLabel}>Tổng xoá</Text>
      </View>
      <View style={styles.bannerDivider} />
      <View style={styles.bannerItem}>
        <Text style={[styles.bannerValue, { color: '#D97706' }]}>{totalUpdOps}</Text>
        <Text style={styles.bannerLabel}>Lần sửa</Text>
      </View>
    </View>
  );
};

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function StockLogScreen() {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const [filter, setFilter] = useState<FilterType>('all');

  // Detail state
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);

  // Summary state
  const [summary, setSummary] = useState<StockSummaryItem[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryRefreshing, setSummaryRefreshing] = useState(false);
  const [selectedSummaryItem, setSelectedSummaryItem] = useState<StockSummaryItem | null>(null);

  // ── Detail fetch ──────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async (p = 1, replace = true) => {
    try {
      const res = await getStockLogs(p, 50);
      if (replace) {
        setLogs(res.data);
      } else {
        setLogs((prev) => [...prev, ...res.data]);
      }
      setTotalPages(res.totalPages);
      setPage(res.page);
      pageRef.current = res.page;
    } catch (e) {
      console.error('StockLogScreen fetchLogs error:', e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchLogs(1, true).finally(() => setLoading(false));
  }, [fetchLogs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchLogs(1, true);
    setRefreshing(false);
  }, [fetchLogs]);

  const onLoadMore = useCallback(async () => {
    if (loadingMore || pageRef.current >= totalPages) return;
    setLoadingMore(true);
    await fetchLogs(pageRef.current + 1, false);
    setLoadingMore(false);
  }, [fetchLogs, loadingMore, totalPages]);

  // ── Summary fetch ─────────────────────────────────────────────────────────
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const { startDate, endDate } = getDateRange(filter);
      const res = await getStockSummary(startDate, endDate);
      setSummary(res.data);
    } catch (e) {
      console.error('StockLogScreen fetchSummary error:', e);
    } finally {
      setSummaryLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (activeTab === 'summary') {
      fetchSummary();
    }
  }, [activeTab, filter, fetchSummary]);

  const onSummaryRefresh = useCallback(async () => {
    setSummaryRefreshing(true);
    await fetchSummary();
    setSummaryRefreshing(false);
  }, [fetchSummary]);

  // ── Filter helper for detail tab ──────────────────────────────────────────
  const filtered = logs.filter((l) => {
    if (filter === 'today') return isToday(l.createdAt);
    if (filter === 'week') return isThisWeek(l.createdAt);
    if (filter === 'month') return isThisMonth(l.createdAt);
    return true;
  });

  const addCount = filtered.filter((l) => l.source === 'manual_add').length;
  const updateCount = filtered.filter((l) => l.source === 'manual_update').length;
  const deleteCount = filtered.filter((l) => l.source === 'manual_delete').length;

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử tồn kho</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tab switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'detail' && styles.tabItemActive]}
          onPress={() => setActiveTab('detail')}
        >
          <Ionicons name="list-outline" size={15} color={activeTab === 'detail' ? '#7C3AED' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'detail' && styles.tabTextActive]}>
            Chi tiết
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'summary' && styles.tabItemActive]}
          onPress={() => setActiveTab('summary')}
        >
          <Ionicons name="bar-chart-outline" size={15} color={activeTab === 'summary' ? '#7C3AED' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'summary' && styles.tabTextActive]}>
            Tổng hợp
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter bar */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Detail tab ── */}
      {activeTab === 'detail' && (
        <>
          {!loading && (
            <View style={styles.summaryRow}>
              <View style={[styles.summaryChip, { backgroundColor: '#EDE9FE' }]}>
                <Text style={[styles.summaryText, { color: '#7C3AED' }]}>+{addCount} thêm</Text>
              </View>
              <View style={[styles.summaryChip, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.summaryText, { color: '#D97706' }]}>~{updateCount} sửa</Text>
              </View>
              {deleteCount > 0 && (
                <View style={[styles.summaryChip, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.summaryText, { color: '#DC2626' }]}>✕{deleteCount} xoá</Text>
                </View>
              )}
              <Text style={styles.totalText}>{filtered.length} mục</Text>
            </View>
          )}
          {loading ? (
            <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 48 }} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <LogRow item={item} />}
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />
              }
              onEndReached={onLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator size="small" color="#7C3AED" style={{ marginVertical: 16 }} />
                ) : null
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="package-variant-closed" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyText}>Chưa có lịch sử tồn kho</Text>
                </View>
              }
            />
          )}
        </>
      )}

      {/* ── Summary tab ── */}
      {activeTab === 'summary' && (
        <>
          {!summaryLoading && summary.length > 0 && <SummaryBanner items={summary} />}
          {summaryLoading ? (
            <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 48 }} />
          ) : (
            <FlatList
              data={summary}
              keyExtractor={(item) => item.storageItemId}
              renderItem={({ item }) => {
                const changedFields = [...new Set(
                  logs
                    .filter((l) => l.itemName === item.itemName && l.source === 'manual_update')
                    .flatMap((l) => (l.changes ?? []).map((c) => c.field))
                )];
                return (
                  <SummaryCard
                    item={item}
                    changedFields={changedFields}
                    onPress={() => setSelectedSummaryItem(item)}
                  />
                );
              }}
              contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
              refreshControl={
                <RefreshControl refreshing={summaryRefreshing} onRefresh={onSummaryRefresh} tintColor="#7C3AED" />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="chart-bar" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyText}>Không có dữ liệu cho kỳ này</Text>
                </View>
              }
            />
          )}
          <ItemDetailModal
            visible={!!selectedSummaryItem}
            onClose={() => setSelectedSummaryItem(null)}
            item={selectedSummaryItem}
            logs={logs}
          />
        </>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '600', color: '#111827' },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: { borderBottomColor: '#7C3AED' },
  tabText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  tabTextActive: { color: '#7C3AED', fontWeight: '700' },

  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterChipActive: { backgroundColor: '#7C3AED' },
  filterChipText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  summaryChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  summaryText: { fontSize: 12, fontWeight: '600' },
  totalText: { fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' },

  // Detail log row
  logRow: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logRowDeleted: { borderLeftWidth: 3, borderLeftColor: '#DC2626', opacity: 0.85 },
  logRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  logItemName: { fontSize: 15, fontWeight: '600', color: '#111827', flex: 1 },

  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  badgeText: { fontSize: 11, fontWeight: '600' },

  logRowMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 12, color: '#6B7280' },

  changesContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    gap: 4,
  },
  changeItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  changeField: { fontSize: 11, color: '#6B7280', fontWeight: '600', minWidth: 54 },
  changeOld: { fontSize: 11, color: '#EF4444', textDecorationLine: 'line-through' },
  changeNew: { fontSize: 11, color: '#16A34A', fontWeight: '600' },

  emptyContainer: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: '#9CA3AF' },

  // Summary banner
  banner: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerItem: { flex: 1, alignItems: 'center', gap: 2 },
  bannerDivider: { width: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },
  bannerValue: { fontSize: 18, fontWeight: '700' },
  bannerLabel: { fontSize: 11, color: '#9CA3AF' },

  // Summary card
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  summaryItemName: { fontSize: 15, fontWeight: '600', color: '#111827', flex: 1 },

  netBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  netBadgeText: { fontSize: 13, fontWeight: '700' },

  summaryBreakdown: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  breakdownChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  breakdownText: { fontSize: 11, fontWeight: '500' },

  summaryCardMeta: { flexDirection: 'row', alignItems: 'center' },

  // Item detail modal
  modalScreen: { flex: 1, backgroundColor: '#F9FAFB' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  modalSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 1 },
  modalStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalStatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  modalStatText: { fontSize: 12, fontWeight: '600' },
});
