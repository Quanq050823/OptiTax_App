import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getSyncHistory } from '@/src/services/API/storageService';
import { SyncHistoryItem, SyncHistoryRecord } from '@/src/types/storage';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${d.getFullYear()} ${d
    .getHours()
    .toString()
    .padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN') + ' ₫';

/** Group items by invoiceNumber, preserving insertion order */
const groupByInvoice = (items: SyncHistoryItem[]) => {
  const map = new Map<string, { sellerName: string; items: SyncHistoryItem[] }>();
  for (const item of items) {
    const key = item.invoiceNumber || '(Không có số HĐ)';
    if (!map.has(key)) {
      map.set(key, { sellerName: item.sellerName ?? '', items: [] });
    }
    map.get(key)!.items.push(item);
  }
  return Array.from(map.entries()).map(([invoiceNumber, val]) => ({
    invoiceNumber,
    ...val,
  }));
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const ActionBadge = ({ action }: { action: SyncHistoryItem['action'] }) => (
  <View style={[styles.badge, action === 'created' ? styles.badgeCreated : styles.badgeUpdated]}>
    <Text style={[styles.badgeText, { color: action === 'created' ? '#6d28d9' : '#92400e' }]}>
      {action === 'created' ? 'Thêm mới' : 'Cập nhật'}
    </Text>
  </View>
);

const ItemRow = ({ item }: { item: SyncHistoryItem }) => (
  <View style={styles.itemRow}>
    <View style={styles.itemRowLeft}>
      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.itemMeta}>
        SL: <Text style={{ fontWeight: '600' }}>{item.stock}</Text> {item.unit}
        {'  ·  '}
        {formatPrice(item.price)}
      </Text>
    </View>
    <ActionBadge action={item.action} />
  </View>
);

const InvoiceGroup = ({
  invoiceNumber,
  sellerName,
  items,
  defaultOpen,
}: {
  invoiceNumber: string;
  sellerName: string;
  items: SyncHistoryItem[];
  defaultOpen: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const createdCount = items.filter(i => i.action === 'created').length;
  const updatedCount = items.filter(i => i.action === 'updated').length;

  return (
    <View style={styles.invoiceGroup}>
      <TouchableOpacity style={styles.invoiceGroupHeader} onPress={() => setOpen(v => !v)} activeOpacity={0.8}>
        <View style={styles.invoiceIcon}>
          <MaterialCommunityIcons name="file-document-outline" size={15} color="#6366f1" />
        </View>
        <View style={styles.invoiceHeaderText}>
          <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
          {!!sellerName && (
            <Text style={styles.sellerName} numberOfLines={1}>NCC: {sellerName}</Text>
          )}
          <View style={styles.invoiceSummaryRow}>
            {createdCount > 0 && (
              <Text style={[styles.invoiceSummaryChip, { color: '#6d28d9', backgroundColor: '#ede9fe' }]}>
                +{createdCount} mới
              </Text>
            )}
            {updatedCount > 0 && (
              <Text style={[styles.invoiceSummaryChip, { color: '#92400e', backgroundColor: '#fef3c7' }]}>
                ~{updatedCount} cập nhật
              </Text>
            )}
          </View>
        </View>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#94a3b8" />
      </TouchableOpacity>

      {open && (
        <View style={styles.invoiceItems}>
          {items.map((item, idx) => (
            <ItemRow key={idx} item={item} />
          ))}
        </View>
      )}
    </View>
  );
};

const RecordCard = ({ record }: { record: SyncHistoryRecord }) => {
  const [expanded, setExpanded] = useState(false);
  const invoiceGroups = useMemo(() => groupByInvoice(record.items), [record.items]);

  return (
    <View style={styles.card}>
      {/* Card header – tap to expand */}
      <TouchableOpacity style={styles.cardHeader} onPress={() => setExpanded(v => !v)} activeOpacity={0.8}>
        <View style={styles.cardHeaderLeft}>
          {/* Date/time */}
          <View style={styles.cardDateRow}>
            <Ionicons name="time-outline" size={14} color="#6366f1" />
            <Text style={styles.cardDate}>{formatDate(record.createdAt)}</Text>
          </View>

          {/* Stats chips */}
          <View style={styles.statsRow}>
            <View style={[styles.statChip, styles.statSuccess]}>
              <Ionicons name="checkmark-circle" size={13} color="#16a34a" />
              <Text style={[styles.statText, { color: '#16a34a' }]}>{record.successCount} thành công</Text>
            </View>
            {record.failCount > 0 && (
              <View style={[styles.statChip, styles.statFail]}>
                <Ionicons name="close-circle" size={13} color="#dc2626" />
                <Text style={[styles.statText, { color: '#dc2626' }]}>{record.failCount} lỗi</Text>
              </View>
            )}
          </View>

          {/* Invoice count summary */}
          <View style={styles.invoiceCountRow}>
            <MaterialCommunityIcons name="file-multiple-outline" size={13} color="#64748b" />
            <Text style={styles.invoiceCountText}>
              {invoiceGroups.length} hóa đơn · {record.items.length} mặt hàng
            </Text>
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#94a3b8" />
      </TouchableOpacity>

      {/* Invoice list */}
      {expanded && (
        <View style={styles.invoiceList}>
          {invoiceGroups.length === 0 ? (
            <View style={styles.emptyItems}>
              <Text style={styles.emptyItemsText}>Không có chi tiết sản phẩm</Text>
            </View>
          ) : (
            invoiceGroups.map((group, idx) => (
              <InvoiceGroup
                key={idx}
                invoiceNumber={group.invoiceNumber}
                sellerName={group.sellerName}
                items={group.items}
                defaultOpen={invoiceGroups.length === 1}
              />
            ))
          )}
        </View>
      )}
    </View>
  );
};

// ─── Filter bar ──────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'today' | 'week' | 'month';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'today', label: 'Hôm nay' },
  { key: 'week', label: 'Tuần này' },
  { key: 'month', label: 'Tháng này' },
];

const isInRange = (dateStr: string, filter: FilterKey): boolean => {
  if (filter === 'all') return true;
  const d = new Date(dateStr);
  const now = new Date();
  if (filter === 'today') {
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }
  if (filter === 'week') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return d >= startOfWeek;
  }
  if (filter === 'month') {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }
  return true;
};

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function SyncHistoryScreen() {
  const navigation = useNavigation();
  const [records, setRecords] = useState<SyncHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const load = useCallback(async (pageNum = 1, replace = false) => {
    try {
      const res = await getSyncHistory(pageNum);
      setRecords(prev => (replace ? res.data : [...prev, ...res.data]));
      setTotalPages(res.totalPages);
      setPage(pageNum);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load(1, true).finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load(1, true);
    setRefreshing(false);
  }, [load]);

  const onEndReached = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    await load(page + 1, false);
    setLoadingMore(false);
  }, [loadingMore, page, totalPages, load]);

  const filtered = useMemo(
    () => records.filter(r => isInRange(r.createdAt, activeFilter)),
    [records, activeFilter],
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đồng bộ</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Filter bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, activeFilter === f.key && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.filterCount}>
          <Text style={styles.filterCountText}>{filtered.length} lần</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <RecordCard record={item} />}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator style={{ margin: 16 }} color="#6366f1" /> : null
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="sync-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Chưa có lịch sử đồng bộ</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1e293b' },

  // Filter bar
  filterBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  filterChipText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  filterCount: { paddingHorizontal: 12 },
  filterCountText: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },

  // List
  list: { padding: 14, gap: 12, paddingBottom: 40 },

  // Record card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
  },
  cardHeaderLeft: { flex: 1 },
  cardDateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  cardDate: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statSuccess: { backgroundColor: '#dcfce7' },
  statFail: { backgroundColor: '#fee2e2' },
  statText: { fontSize: 12, fontWeight: '500' },
  invoiceCountRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  invoiceCountText: { fontSize: 12, color: '#64748b' },

  // Invoice list (inside expanded record)
  invoiceList: { borderTopWidth: 1, borderTopColor: '#f1f5f9' },

  // Invoice group
  invoiceGroup: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  invoiceGroupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fafafa',
    gap: 8,
  },
  invoiceIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  invoiceHeaderText: { flex: 1 },
  invoiceNumber: { fontSize: 13, fontWeight: '700', color: '#3730a3' },
  sellerName: { fontSize: 11, color: '#64748b', marginTop: 1 },
  invoiceSummaryRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  invoiceSummaryChip: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },

  // Items inside an invoice
  invoiceItems: { backgroundColor: '#fff' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  itemRowLeft: { flex: 1, marginRight: 8 },
  itemName: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  itemMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  badgeCreated: { backgroundColor: '#ede9fe' },
  badgeUpdated: { backgroundColor: '#fef3c7' },
  badgeText: { fontSize: 11, fontWeight: '600' },

  emptyItems: { padding: 14, alignItems: 'center' },
  emptyItemsText: { fontSize: 13, color: '#94a3b8' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 80 },
  emptyText: { fontSize: 14, color: '#94a3b8' },
});
