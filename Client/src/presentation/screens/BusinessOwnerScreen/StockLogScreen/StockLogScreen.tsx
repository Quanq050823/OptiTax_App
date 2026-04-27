import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getStockLogs } from '@/src/services/API/storageService';
import { StockLog, StockLogChange } from '@/src/types/storage';
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

// ─── Filter bar ──────────────────────────────────────────────────────────────

type FilterType = 'all' | 'today' | 'week' | 'month';

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

// ─── Log row ─────────────────────────────────────────────────────────────────

const SourceBadge = ({ source }: { source: StockLog['source'] }) => {
  const isAdd = source === 'manual_add';
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isAdd ? '#EDE9FE' : '#FEF3C7' },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: isAdd ? '#7C3AED' : '#D97706' },
        ]}
      >
        {isAdd ? 'Thêm mới' : 'Cập nhật'}
      </Text>
    </View>
  );
};

const LogRow = ({ item }: { item: StockLog }) => {
  const { time, date } = formatDateTime(item.createdAt);
  return (
    <View style={styles.logRow}>
      <View style={styles.logRowHeader}>
        <View style={styles.logRowLeft}>
          <MaterialCommunityIcons name="package-variant" size={18} color="#7C3AED" />
          <Text style={styles.logItemName} numberOfLines={1}>
            {item.itemName}
          </Text>
        </View>
        <SourceBadge source={item.source} />
      </View>

      <View style={styles.logRowMeta}>
        <View style={styles.metaChip}>
          <Ionicons name="layers-outline" size={12} color="#6B7280" />
          <Text style={styles.metaText}>
            {item.quantityChanged ?? 0} {item.unit ?? ''}
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

      {/* Hiển thị chi tiết thay đổi cho lần cập nhật */}
      {item.source === 'manual_update' && item.changes && item.changes.length > 0 && (
        <ChangesRow changes={item.changes} />
      )}
    </View>
  );
};

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function StockLogScreen() {
  const navigation = useNavigation();

  const [logs, setLogs] = useState<StockLog[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);

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

  const filtered = logs.filter((l) => {
    if (filter === 'today') return isToday(l.createdAt);
    if (filter === 'week') return isThisWeek(l.createdAt);
    if (filter === 'month') return isThisMonth(l.createdAt);
    return true;
  });

  const addCount = filtered.filter((l) => l.source === 'manual_add').length;
  const updateCount = filtered.filter((l) => l.source === 'manual_update').length;

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

      {/* Filter bar */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterChipText,
                filter === f.key && styles.filterChipTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary chips */}
      {!loading && (
        <View style={styles.summaryRow}>
          <View style={[styles.summaryChip, { backgroundColor: '#EDE9FE' }]}>
            <Text style={[styles.summaryText, { color: '#7C3AED' }]}>
              +{addCount} thêm mới
            </Text>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: '#FEF3C7' }]}>
            <Text style={[styles.summaryText, { color: '#D97706' }]}>
              ~{updateCount} cập nhật
            </Text>
          </View>
          <Text style={styles.totalText}>{filtered.length} mục</Text>
        </View>
      )}

      {/* List */}
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
  summaryChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  summaryText: { fontSize: 12, fontWeight: '600' },
  totalText: { fontSize: 12, color: '#9CA3AF', marginLeft: 'auto' },

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
  logRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  logItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },

  logRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: { fontSize: 12, color: '#6B7280' },

  emptyContainer: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: '#9CA3AF' },

  changesContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
    gap: 4,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeField: { fontSize: 11, color: '#6B7280', fontWeight: '600', minWidth: 54 },
  changeOld: { fontSize: 11, color: '#EF4444', textDecorationLine: 'line-through' },
  changeNew: { fontSize: 11, color: '#16A34A', fontWeight: '600' },
});
