import { ColorMain } from "@/src/presentation/components/colors";
import ModalAddReceiptVourcher from "@/src/presentation/components/Modal/ModalAddReceiptVourcher/ModalAddReceiptVourcher";
import { phieuThu } from "@/src/types/route";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value ?? 0));

function ReceiptVoucherScreen() {
  const [voteReceipt, setVoteReceipt] = React.useState<phieuThu[]>([]);
  const [visible, setVisible] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredReceipts = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return voteReceipt;

    return voteReceipt.filter((item) =>
      [
        item.id,
        item.documentNumber,
        item.submitter,
        item.typeVoucher,
        item.note,
        item.paymentMethod,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [search, voteReceipt]);

  const totalReceipt = React.useMemo(
    () => filteredReceipts.reduce((sum, item) => sum + Number(item.price ?? 0), 0),
    [filteredReceipts]
  );

  const renderItem = ({ item }: { item: phieuThu }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleWrap}>
          <View style={styles.iconBadge}>
            <MaterialCommunityIcons name="cash-plus" size={18} color={ColorMain} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.typeVoucher || "Phiếu thu"}
            </Text>
            <Text style={styles.cardSubTitle}>#{item.id}</Text>
          </View>
        </View>
        <Text style={styles.amountText}>{formatCurrency(item.price)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Người nộp</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {item.submitter || "Chưa nhập"}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Chứng từ</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {item.documentNumber || "Chưa có"}
        </Text>
      </View>

      {!!item.note && (
        <Text style={styles.note} numberOfLines={2}>
          {item.note}
        </Text>
      )}

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Feather name="calendar" size={12} color="#6B7280" />
          <Text style={styles.metaText}>{item.date}</Text>
        </View>
        <View style={styles.metaChip}>
          <Feather name="credit-card" size={12} color="#6B7280" />
          <Text style={styles.metaText}>{item.paymentMethod}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Phiếu thu</Text>
          <Text style={styles.subtitle}>{filteredReceipts.length} phiếu đang hiển thị</Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.85}
          onPress={() => setVisible(true)}
        >
          <AntDesign name="plus" size={16} color="#fff" />
          <Text style={styles.createButtonText}>Tạo phiếu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Tổng thu</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalReceipt)}</Text>
        </View>
        <View style={styles.summaryIcon}>
          <MaterialCommunityIcons name="cash-register" size={24} color={ColorMain} />
        </View>
      </View>

      <View style={styles.searchBox}>
        <AntDesign name="search" size={16} color="#9CA3AF" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholder="Tìm người nộp, chứng từ, loại phiếu..."
          placeholderTextColor="#9CA3AF"
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <AntDesign name="close" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredReceipts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="cash-plus" size={62} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Chưa có phiếu thu phù hợp</Text>
            <Text style={styles.emptyText}>
              Tạo phiếu đầu tiên để theo dõi dòng tiền vào rõ ràng hơn.
            </Text>
          </View>
        }
      />

      <ModalAddReceiptVourcher
        voteReceipt={voteReceipt}
        setVoteReceipt={setVoteReceipt}
        visible={visible}
        setVisible={setVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    color: ColorMain,
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
    marginBottom: 12,
    padding: 14,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  cardTitleWrap: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  iconBadge: {
    alignItems: "center",
    backgroundColor: "#EAF8F3",
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
    color: ColorMain,
    fontSize: 16,
    fontWeight: "800",
    maxWidth: 140,
    textAlign: "right",
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  infoLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
  },
  infoValue: {
    color: "#374151",
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 12,
    textAlign: "right",
  },
  note: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
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
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
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

export default ReceiptVoucherScreen;
