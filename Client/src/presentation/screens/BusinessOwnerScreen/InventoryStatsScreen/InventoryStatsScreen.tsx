import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ColorMain } from '@/src/presentation/components/colors';
import { getListItemStorageSynced, getStockSummary } from '@/src/services/API/storageService';
import { ProductInventory, StockSummaryItem } from '@/src/types/storage';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 32; // 16px padding each side

const formatPrice = (value: number) => value.toLocaleString('vi-VN') + ' ₫';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterPeriod = 'all' | 'month' | 'week';

const FILTERS: { key: FilterPeriod; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'month', label: 'Tháng này' },
  { key: 'week', label: 'Tuần này' },
];

const getDateRange = (filter: FilterPeriod): { startDate?: string; endDate?: string } => {
  const now = new Date();
  if (filter === 'all') return {};
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

type SortKey = 'name' | 'stock' | 'price' | 'value';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Tên' },
  { key: 'stock', label: 'Tồn kho' },
  { key: 'price', label: 'Đơn giá' },
  { key: 'value', label: 'Giá trị' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  iconColor,
  bgColor,
  title,
  value,
  sub,
}: {
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  value: string;
  sub?: string;
}) => (
  <View style={[styles.statCard, { borderLeftColor: iconColor }]}>
    <View style={[styles.statIconWrap, { backgroundColor: bgColor }]}>
      <MaterialCommunityIcons name={icon as any} size={22} color={iconColor} />
    </View>
    <View style={styles.statCardContent}>
      <Text style={styles.statCardTitle}>{title}</Text>
      <Text style={[styles.statCardValue, { color: iconColor }]}>{value}</Text>
      {sub ? <Text style={styles.statCardSub}>{sub}</Text> : null}
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function InventoryStatsScreen() {
  const navigation = useNavigation();

  const [items, setItems] = useState<ProductInventory[]>([]);
  const [summaryItems, setSummaryItems] = useState<StockSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [sortKey, setSortKey] = useState<SortKey>('value');
  const [sortAsc, setSortAsc] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'items'>('overview');

  const fetchData = useCallback(async () => {
    try {
      const { startDate, endDate } = getDateRange(filterPeriod);
      const [inventoryRes, summaryRes] = await Promise.all([
        getListItemStorageSynced(),
        getStockSummary(startDate, endDate),
      ]);
      const synced = (inventoryRes.data ?? []).filter((i) => i.syncStatus === true);
      setItems(synced);
      setSummaryItems(summaryRes.data ?? []);
    } catch {
      setItems([]);
      setSummaryItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filterPeriod]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // ─── Derived stats ───────────────────────────────────────────────────────────

  const ingredientItems = items.filter((i) => i.category === 1);
  const toolItems = items.filter((i) => i.category === 2);

  const totalValue = items.reduce((s, i) => s + i.stock * i.price, 0);
  const ingredientValue = ingredientItems.reduce((s, i) => s + i.stock * i.price, 0);
  const toolValue = toolItems.reduce((s, i) => s + i.stock * i.price, 0);
  const lowStockItems = items.filter((i) => i.stock <= 5);
  const outOfStockItems = items.filter((i) => i.stock === 0);

  const totalAdded = summaryItems.reduce((s, i) => s + (i.totalAdded ?? 0), 0);
  const totalDeleted = summaryItems.reduce((s, i) => s + (i.totalDeleted ?? 0), 0);

  // ─── Sorted list ─────────────────────────────────────────────────────────────

  const sortedItems = [...items].sort((a, b) => {
    let diff = 0;
    if (sortKey === 'name') diff = a.name.localeCompare(b.name, 'vi');
    else if (sortKey === 'stock') diff = a.stock - b.stock;
    else if (sortKey === 'price') diff = a.price - b.price;
    else if (sortKey === 'value') diff = a.stock * a.price - b.stock * b.price;
    return sortAsc ? diff : -diff;
  });

  const handleSortPress = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  // ─── Render helpers ───────────────────────────────────────────────────────────

  const renderStockBadge = (stock: number) => {
    if (stock === 0)
      return <View style={[styles.stockBadge, { backgroundColor: '#fee2e2' }]}><Text style={[styles.stockBadgeText, { color: '#dc2626' }]}>Hết hàng</Text></View>;
    if (stock <= 5)
      return <View style={[styles.stockBadge, { backgroundColor: '#fef3c7' }]}><Text style={[styles.stockBadgeText, { color: '#d97706' }]}>Sắp hết</Text></View>;
    return null;
  };

  const renderItem = ({ item }: { item: ProductInventory }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemRowLeft}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.itemRowMeta}>
          <Text style={styles.itemMetaText}>{item.unit || '—'}</Text>
          <Text style={styles.itemMetaDot}>·</Text>
          <Text style={styles.itemMetaText}>{item.category === 1 ? 'Nguyên liệu' : 'Dụng cụ'}</Text>
        </View>
      </View>
      <View style={styles.itemRowRight}>
        <View style={styles.itemRowStats}>
          <Text style={styles.itemStatLabel}>Tồn</Text>
          <Text style={[styles.itemStatValue, item.stock === 0 && { color: '#dc2626' }, item.stock > 0 && item.stock <= 5 && { color: '#d97706' }]}>
            {item.stock}
          </Text>
        </View>
        <View style={styles.itemRowStats}>
          <Text style={styles.itemStatLabel}>Giá trị</Text>
          <Text style={[styles.itemStatValue, { color: ColorMain }]}>
            {formatPrice(item.stock * item.price)}
          </Text>
        </View>
        {renderStockBadge(item.stock)}
      </View>
    </View>
  );

  // ─── Chart config ─────────────────────────────────────────────────────────────

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(77, 191, 153, ${opacity})`,
    labelColor: () => '#5a5b5a',
    barPercentage: 1,
    propsForLabels: { fontSize: 11 },
    formatYLabel: (v: string) => {
      const n = parseInt(v);
      if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'tr';
      if (n >= 1_000) return (n / 1_000).toFixed(0) + 'k';
      return v;
    },
  };

  // ─── Overview tab content ─────────────────────────────────────────────────────

  const OverviewContent = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ColorMain]} tintColor={ColorMain} />}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Period Filter */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filterPeriod === f.key && styles.filterChipActive]}
            onPress={() => setFilterPeriod(f.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, filterPeriod === f.key && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main stat cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tổng quan kho hàng</Text>
        <View style={styles.statGrid}>
          <StatCard
            icon="package-variant"
            iconColor={ColorMain}
            bgColor="#e8f8f2"
            title="Tổng mặt hàng"
            value={`${items.length}`}
            sub={`${ingredientItems.length} NL · ${toolItems.length} DC`}
          />
          <StatCard
            icon="cash-multiple"
            iconColor="#6366f1"
            bgColor="#eef2ff"
            title="Tổng giá trị kho"
            value={formatPrice(totalValue)}
          />
          <StatCard
            icon="alert-circle-outline"
            iconColor="#f59e0b"
            bgColor="#fffbeb"
            title="Sắp hết hàng"
            value={`${lowStockItems.length} mặt hàng`}
            sub={outOfStockItems.length > 0 ? `${outOfStockItems.length} hết hàng` : undefined}
          />
          <StatCard
            icon="trending-up"
            iconColor="#10b981"
            bgColor="#ecfdf5"
            title="Nhập trong kỳ"
            value={`+${totalAdded}`}
            sub={totalDeleted > 0 ? `-${totalDeleted} xuất kho` : undefined}
          />
        </View>
      </View>

      {/* Category Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phân loại danh mục</Text>
        <View style={styles.categoryCard}>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: ColorMain }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.categoryName}>Nguyên liệu</Text>
              <Text style={styles.categorySub}>{ingredientItems.length} mặt hàng</Text>
            </View>
            <Text style={[styles.categoryValue, { color: ColorMain }]}>{formatPrice(ingredientValue)}</Text>
          </View>
          <View style={styles.categoryDivider} />
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: '#6366f1' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.categoryName}>Dụng cụ</Text>
              <Text style={styles.categorySub}>{toolItems.length} mặt hàng</Text>
            </View>
            <Text style={[styles.categoryValue, { color: '#6366f1' }]}>{formatPrice(toolValue)}</Text>
          </View>

          {/* Progress bar */}
          {totalValue > 0 && (
            <View style={styles.progressWrap}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFillGreen,
                    { flex: ingredientValue / totalValue },
                  ]}
                />
                <View
                  style={[
                    styles.progressFillPurple,
                    { flex: toolValue / totalValue },
                  ]}
                />
              </View>
              <View style={styles.progressLabels}>
                <Text style={[styles.progressLabel, { color: ColorMain }]}>
                  {totalValue > 0 ? Math.round((ingredientValue / totalValue) * 100) : 0}%
                </Text>
                <Text style={[styles.progressLabel, { color: '#6366f1' }]}>
                  {totalValue > 0 ? Math.round((toolValue / totalValue) * 100) : 0}%
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Pie Chart — Category value split */}
      {totalValue > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tỷ trọng giá trị theo danh mục</Text>
          <View style={styles.chartCard}>
            <PieChart
              data={[
                {
                  name: 'Nguyên liệu',
                  value: Math.round(ingredientValue),
                  color: ColorMain,
                  legendFontColor: '#555',
                  legendFontSize: 12,
                },
                {
                  name: 'Dụng cụ',
                  value: Math.round(toolValue) || 0.001,
                  color: '#6366f1',
                  legendFontColor: '#555',
                  legendFontSize: 12,
                },
              ]}
              width={CHART_WIDTH - 16}
              height={180}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="10"
              absolute={false}
            />
          </View>
        </View>
      )}

      {/* Top items by value — custom horizontal bar list */}
      {items.length > 0 && (() => {
        const topItems = [...items]
          .sort((a, b) => b.stock * b.price - a.stock * a.price)
          .slice(0, 8);
        const maxValue = topItems[0]?.stock * topItems[0]?.price || 1;
        const RANK_COLORS = ['#f59e0b', '#94a3b8', '#cd7c3e'];
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top mặt hàng theo giá trị</Text>
            <View style={styles.chartCard}>
              {topItems.map((item, idx) => {
                const value = item.stock * item.price;
                const ratio = value / maxValue;
                const barColor = idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7c3e' : ColorMain;
                return (
                  <View key={item._id} style={styles.topItemRow}>
                    {/* Rank badge */}
                    <View style={[styles.rankBadge, { backgroundColor: idx < 3 ? RANK_COLORS[idx] + '20' : '#f0f0f0' }]}>
                      <Text style={[styles.rankText, { color: idx < 3 ? RANK_COLORS[idx] : '#aaa' }]}>
                        {idx + 1}
                      </Text>
                    </View>
                    {/* Name + bar */}
                    <View style={styles.topItemContent}>
                      <View style={styles.topItemHeader}>
                        <Text style={styles.topItemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={[styles.topItemValue, { color: barColor }]}>
                          {formatPrice(value)}
                        </Text>
                      </View>
                      <View style={styles.topBarTrack}>
                        <View style={[styles.topBarFill, { flex: ratio, backgroundColor: barColor }]} />
                        <View style={{ flex: 1 - ratio }} />
                      </View>
                      <Text style={styles.topItemSub}>
                        {item.stock} {item.unit} · {item.price.toLocaleString('vi-VN')}đ/{item.unit}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })()}

      {/* Low Stock Warning */}
      {lowStockItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cảnh báo tồn kho thấp</Text>
          <View style={styles.warningCard}>
            {lowStockItems.slice(0, 5).map((item) => (
              <View key={item._id} style={styles.warningRow}>
                <View style={styles.warningLeft}>
                  <Ionicons
                    name={item.stock === 0 ? 'close-circle' : 'warning'}
                    size={16}
                    color={item.stock === 0 ? '#dc2626' : '#f59e0b'}
                  />
                  <Text style={styles.warningName} numberOfLines={1}>{item.name}</Text>
                </View>
                <Text style={[styles.warningStock, { color: item.stock === 0 ? '#dc2626' : '#f59e0b' }]}>
                  {item.stock} {item.unit}
                </Text>
              </View>
            ))}
            {lowStockItems.length > 5 && (
              <Text style={styles.warningMore}>+{lowStockItems.length - 5} mặt hàng khác...</Text>
            )}
          </View>
        </View>
      )}

      {/* Activity Summary */}
      {summaryItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biến động kho ({filterPeriod === 'all' ? 'toàn bộ' : filterPeriod === 'month' ? 'tháng này' : 'tuần này'})</Text>
          <View style={styles.activityCard}>
            {summaryItems.slice(0, 8).map((s) => (
              <View key={s.storageItemId} style={styles.activityRow}>
                <Text style={styles.activityName} numberOfLines={1}>{s.itemName}</Text>
                <View style={styles.activityBadgeWrap}>
                  {s.totalAdded > 0 && (
                    <View style={[styles.activityBadge, { backgroundColor: '#ecfdf5' }]}>
                      <Text style={[styles.activityBadgeText, { color: '#10b981' }]}>+{s.totalAdded}</Text>
                    </View>
                  )}
                  {s.countUpdate > 0 && (
                    <View style={[styles.activityBadge, { backgroundColor: '#eff6ff' }]}>
                      <Text style={[styles.activityBadgeText, { color: '#3b82f6' }]}>~{s.countUpdate} sửa</Text>
                    </View>
                  )}
                  {s.totalDeleted > 0 && (
                    <View style={[styles.activityBadge, { backgroundColor: '#fef2f2' }]}>
                      <Text style={[styles.activityBadgeText, { color: '#ef4444' }]}>-{s.totalDeleted}</Text>
                    </View>
                  )}
                  <View style={[styles.activityBadge, { backgroundColor: '#f1f5f9' }]}>
                    <Text style={[styles.activityBadgeText, { color: '#64748b' }]}>±{s.netChange}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );

  // ─── Items tab content ────────────────────────────────────────────────────────

  const ItemsContent = () => (
    <View style={{ flex: 1 }}>
      {/* Sort bar */}
      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>Sắp xếp:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScrollContent}>
          {SORT_OPTIONS.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[styles.sortChip, sortKey === s.key && styles.sortChipActive]}
              onPress={() => handleSortPress(s.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.sortChipText, sortKey === s.key && styles.sortChipTextActive]}>
                {s.label}
              </Text>
              {sortKey === s.key && (
                <MaterialIcons
                  name={sortAsc ? 'arrow-upward' : 'arrow-downward'}
                  size={12}
                  color={ColorMain}
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Tên hàng</Text>
        <Text style={[styles.tableHeaderText, { width: 60, textAlign: 'right' }]}>Tồn</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.2, textAlign: 'right' }]}>Giá trị</Text>
      </View>

      <FlatList
        data={sortedItems}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[ColorMain]} tintColor={ColorMain} />
        }
        ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <MaterialCommunityIcons name="package-variant-closed-remove" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Không có dữ liệu</Text>
          </View>
        }
      />
    </View>
  );

  // ─── Main render ──────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê kho hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'overview' && styles.tabItemActive]}
          onPress={() => setActiveTab('overview')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="chart-box-outline"
            size={18}
            color={activeTab === 'overview' ? ColorMain : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
            Tổng quan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'items' && styles.tabItemActive]}
          onPress={() => setActiveTab('items')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={18}
            color={activeTab === 'items' ? ColorMain : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'items' && styles.tabTextActive]}>
            Danh sách ({items.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={ColorMain} />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {activeTab === 'overview' ? <OverviewContent /> : <ItemsContent />}
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#f6f6f6',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: ColorMain,
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  tabTextActive: {
    color: ColorMain,
    fontWeight: '700',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 16,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: ColorMain,
    borderColor: ColorMain,
  },
  filterChipText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  statGrid: {
    gap: 10,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderLeftWidth: 4,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardContent: {
    flex: 1,
  },
  statCardTitle: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginBottom: 3,
  },
  statCardValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statCardSub: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  categorySub: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 1,
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  categoryDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  progressWrap: {
    marginTop: 4,
    gap: 4,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  progressFillGreen: {
    backgroundColor: ColorMain,
  },
  progressFillPurple: {
    backgroundColor: '#6366f1',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  warningCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warningLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  warningName: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  warningStock: {
    fontSize: 13,
    fontWeight: '700',
  },
  warningMore: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 2,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  activityName: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  activityBadgeWrap: {
    flexDirection: 'row',
    gap: 4,
  },
  activityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activityBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 10,
    gap: 8,
  },
  sortLabel: {
    fontSize: 13,
    color: '#888',
    flexShrink: 0,
  },
  sortScrollContent: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sortChipActive: {
    backgroundColor: '#e8f8f2',
    borderColor: ColorMain,
  },
  sortChipText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortChipTextActive: {
    color: ColorMain,
    fontWeight: '700',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  itemRowLeft: {
    flex: 2,
    gap: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  itemRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemMetaText: {
    fontSize: 11,
    color: '#aaa',
  },
  itemMetaDot: {
    fontSize: 11,
    color: '#ccc',
  },
  itemRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemRowStats: {
    alignItems: 'flex-end',
  },
  itemStatLabel: {
    fontSize: 10,
    color: '#aaa',
    fontWeight: '500',
  },
  itemStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  stockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  itemDivider: {
    height: 8,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#bbb',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  topItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '800',
  },
  topItemContent: {
    flex: 1,
    gap: 4,
  },
  topItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  topItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  topItemValue: {
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 0,
  },
  topBarTrack: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  topBarFill: {
    borderRadius: 3,
  },
  topItemSub: {
    fontSize: 11,
    color: '#aaa',
  },
});
