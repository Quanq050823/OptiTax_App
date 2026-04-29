import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ProductInventory } from "@/src/types/storage";
import { ColorMain } from "@/src/presentation/components/colors";

interface Props {
  visible: boolean;
  masterItem: ProductInventory | null;
  allItems: ProductInventory[];
  onConfirm: (duplicateId: string, conversionFactor: number) => Promise<void>;
  onClose: () => void;
}

export default function ModalMergeItem({
  visible,
  masterItem,
  allItems,
  onConfirm,
  onClose,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedDuplicate, setSelectedDuplicate] = useState<ProductInventory | null>(null);
  const [conversionInput, setConversionInput] = useState("1");
  const [loading, setLoading] = useState(false);

  const candidates = useMemo(() => {
    if (!masterItem) return [];
    const q = search.trim().toLowerCase();
    return allItems.filter(
      (item) =>
        item._id !== masterItem._id &&
        (q === "" || item.name.toLowerCase().includes(q))
    );
  }, [allItems, masterItem, search]);

  const needsConversion =
    selectedDuplicate != null &&
    masterItem != null &&
    selectedDuplicate.unit.trim().toLowerCase() !== masterItem.unit.trim().toLowerCase();

  const conversionFactor = parseFloat(conversionInput);
  const conversionValid = !isNaN(conversionFactor) && conversionFactor > 0;

  const addedStockPreview =
    selectedDuplicate && conversionValid
      ? selectedDuplicate.stock * (needsConversion ? conversionFactor : 1)
      : null;

  const handleConfirm = async () => {
    if (!selectedDuplicate || !masterItem) return;
    if (needsConversion && !conversionValid) {
      Alert.alert("Lỗi", "Hệ số quy đổi phải là số dương");
      return;
    }
    const factor = needsConversion ? conversionFactor : 1;

    Alert.alert(
      "Xác nhận gộp nguyên liệu",
      `Gộp "${selectedDuplicate.name}" vào "${masterItem.name}"?\n\n` +
        (needsConversion
          ? `Tồn kho sẽ thêm: ${selectedDuplicate.stock} ${selectedDuplicate.unit} × ${factor} = ${addedStockPreview} ${masterItem.unit}\n\n`
          : `Tồn kho sẽ thêm: ${selectedDuplicate.stock} ${selectedDuplicate.unit}\n\n`) +
        `"${selectedDuplicate.name}" sẽ bị xóa và không thể khôi phục.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Gộp",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await onConfirm(selectedDuplicate._id, factor);
              setSelectedDuplicate(null);
              setSearch("");
              setConversionInput("1");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setSelectedDuplicate(null);
    setSearch("");
    setConversionInput("1");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Gộp nguyên liệu</Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Master info */}
          {masterItem && (
            <View style={styles.masterBox}>
              <Text style={styles.masterLabel}>Giữ lại (master):</Text>
              <Text style={styles.masterName}>{masterItem.name}</Text>
              <Text style={styles.masterMeta}>
                {masterItem.stock} {masterItem.unit} · {masterItem.price.toLocaleString("vi-VN")} ₫
              </Text>
            </View>
          )}

          <Text style={styles.sectionLabel}>Chọn nguyên liệu cần gộp vào:</Text>

          {/* Search */}
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tên nguyên liệu..."
            value={search}
            onChangeText={setSearch}
            editable={!loading}
          />

          {/* List */}
          <FlatList
            data={candidates}
            keyExtractor={(item) => item._id}
            style={styles.list}
            renderItem={({ item }) => {
              const isSelected = selectedDuplicate?._id === item._id;
              return (
                <TouchableOpacity
                  style={[styles.itemRow, isSelected && styles.itemRowSelected]}
                  onPress={() => {
                    setSelectedDuplicate(isSelected ? null : item);
                    setConversionInput("1");
                  }}
                  disabled={loading}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>
                      {item.stock} {item.unit} · {item.price.toLocaleString("vi-VN")} ₫
                    </Text>
                  </View>
                  {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Không có nguyên liệu nào</Text>
            }
          />

          {/* Conversion input – chỉ hiện khi units khác nhau */}
          {selectedDuplicate && needsConversion && (
            <View style={styles.conversionBox}>
              <Text style={styles.conversionLabel}>
                Quy đổi đơn vị:{" "}
                <Text style={styles.bold}>
                  1 {selectedDuplicate.unit}
                </Text>{" "}
                ={" "}
                <Text style={styles.bold}>? {masterItem!.unit}</Text>
              </Text>
              <TextInput
                style={[
                  styles.conversionInput,
                  !conversionValid && { borderColor: "#f44336" },
                ]}
                keyboardType="numeric"
                value={conversionInput}
                onChangeText={setConversionInput}
                editable={!loading}
                placeholder="Ví dụ: 24"
              />
              {conversionValid && addedStockPreview !== null && (
                <Text style={styles.previewText}>
                  ➜ Tồn kho tăng: {selectedDuplicate.stock} × {conversionFactor} ={" "}
                  <Text style={styles.bold}>
                    {addedStockPreview} {masterItem!.unit}
                  </Text>
                </Text>
              )}
            </View>
          )}

          {/* Confirm button */}
          <TouchableOpacity
            style={[
              styles.confirmBtn,
              (!selectedDuplicate || loading || (needsConversion && !conversionValid)) &&
                styles.confirmBtnDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedDuplicate || loading || (needsConversion && !conversionValid)}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmBtnText}>Xác nhận gộp</Text>
            )}
          </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  closeBtn: { fontSize: 20, color: "#666", paddingHorizontal: 4 },
  masterBox: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  masterLabel: { fontSize: 12, color: "#555", marginBottom: 2 },
  masterName: { fontSize: 15, fontWeight: "700", color: "#2e7d32" },
  masterMeta: { fontSize: 13, color: "#555", marginTop: 2 },
  sectionLabel: { fontSize: 13, color: "#555", marginBottom: 6 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 8,
    backgroundColor: "#fafafa",
  },
  list: { maxHeight: 220 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: "#f5f5f5",
  },
  itemRowSelected: {
    backgroundColor: "#e3f2fd",
    borderWidth: 1.5,
    borderColor: ColorMain,
  },
  itemName: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  itemMeta: { fontSize: 12, color: "#666", marginTop: 2 },
  checkmark: { fontSize: 18, color: ColorMain, marginLeft: 8 },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 13,
    paddingVertical: 16,
  },
  conversionBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#fff8e1",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffe082",
  },
  conversionLabel: { fontSize: 13, color: "#555", marginBottom: 8 },
  bold: { fontWeight: "700" },
  conversionInput: {
    borderWidth: 1,
    borderColor: "#ffc107",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    width: 100,
  },
  previewText: { fontSize: 13, color: "#555", marginTop: 8 },
  confirmBtn: {
    marginTop: 16,
    backgroundColor: ColorMain,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmBtnDisabled: { backgroundColor: "#ccc" },
  confirmBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
