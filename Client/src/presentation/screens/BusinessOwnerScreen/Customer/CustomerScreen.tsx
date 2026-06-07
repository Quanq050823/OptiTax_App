import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { getCustomerList } from "@/src/services/API/customerService";
import { Customer, CustomerListResponse } from "@/src/types/customer";
import { AntDesign, Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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

type FilterKey = "all" | "individual" | "business" | "active";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "individual", label: "Cá nhân" },
  { key: "business", label: "Doanh nghiệp" },
  { key: "active", label: "Hoạt động" },
];

const getAddress = (customer: Customer) => {
  const address = customer.address;
  if (!address) return "Chưa có địa chỉ";
  return [address.street, address.ward, address.district, address.city]
    .filter(Boolean)
    .join(", ") || "Chưa có địa chỉ";
};

const getInitials = (name?: string) => {
  if (!name?.trim()) return "KH";
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

function CustomerManagerScreen() {
  const navigate = useAppNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [listCustomer, setListCustomer] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const fetchCustomers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res: CustomerListResponse = await getCustomerList();
      setListCustomer(res ?? []);
    } catch (error: any) {
      Alert.alert(
        "Không tải được khách hàng",
        error?.message ?? "Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, [fetchCustomers])
  );

  const filteredCustomer = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return listCustomer.filter((item) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "active" && item.status === "active") ||
        item.customerType === activeFilter;

      if (!matchesFilter) return false;
      if (!query) return true;

      return [
        item.name,
        item.code,
        item.phoneNumber,
        item.email,
        item.companyName,
        item.taxCode,
        getAddress(item),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });
  }, [activeFilter, listCustomer, searchQuery]);

  const totalActive = useMemo(
    () => listCustomer.filter((item) => item.status === "active").length,
    [listCustomer]
  );

  const renderCustomerItem = ({ item }: { item: Customer }) => {
    const isBusiness = item.customerType === "business";
    const statusColor = item.status === "active" ? ColorMain : "#9CA3AF";

    return (
      <TouchableOpacity activeOpacity={0.85} style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameCustomer} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.codeText} numberOfLines={1}>
                #{item.code || "Chưa có mã"}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.status === "active" ? "#EAF8F3" : "#F3F4F6" },
              ]}
            >
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status === "active" ? "Hoạt động" : "Tạm dừng"}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Feather name="phone" size={12} color="#6B7280" />
              <Text style={styles.metaText}>{item.phoneNumber || "Chưa có SĐT"}</Text>
            </View>
            <View style={styles.metaChip}>
              <FontAwesome5
                name={isBusiness ? "building" : "user"}
                size={11}
                color="#6B7280"
              />
              <Text style={styles.metaText}>{isBusiness ? "Doanh nghiệp" : "Cá nhân"}</Text>
            </View>
          </View>

          <Text style={styles.addressText} numberOfLines={2}>
            {getAddress(item)}
          </Text>

          {item.tags?.length > 0 && (
            <View style={styles.tagRow}>
              {item.tags.slice(0, 2).map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Khách hàng</Text>
          <Text style={styles.subtitle}>{filteredCustomer.length} khách hàng đang hiển thị</Text>
        </View>
        <TouchableOpacity
          style={styles.btnAddCustomer}
          activeOpacity={0.85}
          onPress={() => navigate.navigate("CreateCustomerScreen")}
        >
          <FontAwesome5 name="user-plus" size={16} color="#fff" />
          <Text style={styles.btnAddText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Tổng khách</Text>
          <Text style={styles.summaryValue}>{listCustomer.length}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Đang hoạt động</Text>
          <Text style={[styles.summaryValue, { color: ColorMain }]}>{totalActive}</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <AntDesign name="search" size={16} color="#9CA3AF" />
        <TextInput
          placeholder="Tìm tên, SĐT, mã KH, MST..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
        {!!searchQuery && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
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
          <Text style={styles.centerText}>Đang tải khách hàng...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCustomer}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={renderCustomerItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchCustomers(true)}
              colors={[ColorMain]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <MaterialCommunityIcons name="account-search" size={58} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>Chưa có khách hàng phù hợp</Text>
              <Text style={styles.emptyText}>
                Thêm khách hàng mới hoặc thử đổi bộ lọc tìm kiếm.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F6F8FA",
    flex: 1,
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
  btnAddCustomer: {
    alignItems: "center",
    backgroundColor: ColorMain,
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  btnAddText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  summaryLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  summaryValue: {
    color: "#111827",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 3,
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
    flexWrap: "wrap",
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
    flexGrow: 1,
    paddingBottom: 34,
    paddingTop: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#EAF8F3",
    borderRadius: 8,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  avatarText: {
    color: ColorMain,
    fontSize: 15,
    fontWeight: "800",
  },
  cardBody: {
    flex: 1,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
  },
  nameCustomer: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  codeText: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
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
  addressText: {
    color: "#4B5563",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 10,
  },
  tag: {
    backgroundColor: "#EAF8F3",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  tagText: {
    color: ColorMain,
    fontSize: 12,
    fontWeight: "800",
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

export default CustomerManagerScreen;
