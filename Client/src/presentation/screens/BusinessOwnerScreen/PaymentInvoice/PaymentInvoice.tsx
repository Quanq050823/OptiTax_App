import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  UIManager,
  Animated,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Product, RootStackParamList } from "@/src/types/route";
import { TextInput as PaperTextInput } from "react-native-paper";
import readNumber from "read-vn-number";

import { MaterialIcons, Feather, FontAwesome } from "@expo/vector-icons";
import {
  colorDarkText,
  ColorMain,
  textColorMain,
} from "@/src/presentation/components/colors";
import NavigationBottomPayInvoice from "@/src/presentation/components/NavigationBottomPayInvoice";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { ExportInvoiceDetailParams } from "@/src/types/invoiceExport";

// Enable LayoutAnimation on Android (kept for completeness)
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  // @ts-ignore
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type PaymentRoute = RouteProp<RootStackParamList, "PaymentInvoiceScreen">;

const TAX_OPTIONS = [1, 2, 3, 5];

/* ----------- Small presentational component for each product row ----------- */
const ProductRow = React.memo(function ProductRow({
  item,
  isSelecting,
  isSelected,
  onToggleSelect,
  onIncrease,
  onDecrease,
  onChangeQuantity,
}: {
  item: Product & { quantity: number; total: number };
  isSelecting: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onChangeQuantity: (id: string, value: string) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => isSelecting && onToggleSelect(item._id)}
    >
      <View style={[styles.card, { width: "100%", position: "relative" }]}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
            gap: 10,
          }}
        >
          {isSelecting && (
            <TouchableOpacity onPress={() => onToggleSelect(item._id)}>
              <MaterialIcons
                name={isSelected ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={isSelected ? ColorMain : "#6c6c6cff"}
              />
            </TouchableOpacity>
          )}

          <Image
            source={require("@/assets/images/no-image-news.png")}
            style={styles.image}
          />

          <View style={{ flexShrink: 1 }}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.detail}>
              Giá: {item.price?.toLocaleString()}đ
            </Text>
            <Text style={styles.detail}>Còn: {item.stock}</Text>
          </View>

          <View style={{ right: 10, position: "absolute" }}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => onDecrease(item._id)}
                disabled={isSelecting}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={(item.quantity || 0).toString()}
                onChangeText={(val) => onChangeQuantity(item._id, val)}
                editable={!isSelecting}
              />

              <TouchableOpacity
                style={[styles.quantityButton, { backgroundColor: ColorMain }]}
                onPress={() => onIncrease(item._id)}
                disabled={isSelecting}
              >
                <Text style={[styles.quantityButtonText, { color: "#fff" }]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomLine} />
    </TouchableOpacity>
  );
});

/* --------------------------- Custom hooks --------------------------- */
function useInvoiceTotals(
  items: (Product & { quantity?: number; total?: number })[]
) {
  const safeItems = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        quantity: it.quantity || 0,
        total: it.total ?? (it.price || 0) * (it.quantity || 0),
      })),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      safeItems.reduce(
        (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
        0
      ),
    [safeItems]
  );

  return { safeItems, totalPrice };
}

/* --------------------------- Main screen --------------------------- */
export default function PaymentInvoiceScreen() {
  const route = useRoute<PaymentRoute>();
  const navigation = useAppNavigation();
  const { items: initialItems } = route.params as {
    items: (Product & { quantity: number; total: number })[];
  };
  // local UI state
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [invoiceDetail, setInvoiceDetail] = useState<ExportInvoiceDetailParams>(
    {
      invoiceId: "",
      items: initialItems,
      total: 0,
      tax: 0,
      date: new Date().toISOString(), // mặc định ngày hiện tại
      note: "",
    }
  );
  const [items, setItems] = useState(() =>
    initialItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      total: item.total || item.price * (item.quantity || 1),
    }))
  );

  // tax UI state
  const [showTaxInputs, setShowTaxInputs] = useState(false);
  const [showTaxResult, setShowTaxResult] = useState(false);
  const [selectedTax, setSelectedTax] = useState<number | null>(null);
  const [totalAfterTax, setTotalAfterTax] = useState<number | null>(null);

  // animations
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedTaxResult = useRef(new Animated.Value(0)).current;

  // derived totals hook
  const { safeItems, totalPrice } = useInvoiceTotals(items);

  const totalTaxDiscount = useMemo(
    () => (selectedTax !== null ? (totalPrice * selectedTax) / 100 : 0),
    [selectedTax, totalPrice]
  );
  const isPayDisabled = useMemo(() => totalPrice === 0, [totalPrice]);

  //Cập nhật invoice khi thay đổi các trường
  useEffect(() => {
    setInvoiceDetail((prev) => ({
      ...prev,
      items: initialItems,
      total: totalAfterTax ?? totalPrice,
      tax: selectedTax ?? 0,
      note: description,
    }));
  }, [items, totalAfterTax, totalPrice, selectedTax, description]);

  // callbacks
  const toggleSelectMode = useCallback(() => {
    setIsSelecting((v) => !v);
    if (isSelecting) {
      setSelectedItems([]);
    }
  }, [isSelecting]);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  }, []);

  const handleDeleteProduct = useCallback(() => {
    setItems((prev) => prev.filter((it) => !selectedItems.includes(it._id)));
    setSelectedItems([]);
    setIsSelecting(false);
  }, [selectedItems]);

  const increaseQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it._id === id
          ? {
              ...it,
              quantity: (it.quantity || 0) + 1,
              total: it.price * ((it.quantity || 0) + 1),
            }
          : it
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it._id === id) {
          const newQ = Math.max((it.quantity || 1) - 1, 0);
          return { ...it, quantity: newQ, total: it.price * newQ };
        }
        return it;
      })
    );
  }, []);

  const changeQuantity = useCallback((id: string, raw: string) => {
    const n = Math.max(Number(raw) || 0, 0);
    setItems((prev) =>
      prev.map((it) =>
        it._id === id ? { ...it, quantity: n, total: it.price * n } : it
      )
    );
  }, []);

  const toggleTaxInputs = useCallback(() => {
    const toValue = showTaxInputs ? 0 : 1;
    Animated.timing(animatedHeight, {
      toValue,
      duration: 220,
      useNativeDriver: false,
    }).start();
    setShowTaxInputs((v) => !v);

    if (showTaxInputs) {
      // closing
      setShowTaxResult(false);
      Animated.timing(animatedTaxResult, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
      setSelectedTax(null);
    }
  }, [showTaxInputs, animatedHeight, animatedTaxResult]);

  const handleSelectTax = useCallback(
    (value: number) => {
      setSelectedTax(value);
      setShowTaxResult(true);
      Animated.timing(animatedTaxResult, {
        toValue: 1,
        duration: 220,
        useNativeDriver: false,
      }).start();
    },
    [animatedTaxResult]
  );

  const handleSaveTax = useCallback(() => {
    if (selectedTax === null) return;
    const discount = totalTaxDiscount;
    setTotalAfterTax(Math.max(totalPrice - discount, 0));
    // close animations
    setShowTaxInputs(false);
    setShowTaxResult(false);
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedTax, totalTaxDiscount, totalPrice, animatedHeight]);

  // ensure totalAfterTax updates when items or tax change
  useEffect(() => {
    if (selectedTax !== null) {
      setTotalAfterTax(
        Math.max(totalPrice - (totalPrice * selectedTax) / 100, 0)
      );
    } else {
      setTotalAfterTax(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPrice, selectedTax]);

  // FlatList optimizations
  const keyExtractor = useCallback((item: Product) => item._id, []);

  const renderItem = useCallback(
    ({ item }: { item: Product & { quantity: number; total: number } }) => (
      <ProductRow
        item={item}
        isSelecting={isSelecting}
        isSelected={selectedItems.includes(item._id)}
        onToggleSelect={handleToggleSelect}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onChangeQuantity={changeQuantity}
      />
    ),
    [
      isSelecting,
      selectedItems,
      handleToggleSelect,
      increaseQuantity,
      decreaseQuantity,
      changeQuantity,
    ]
  );

  const listHeader = useMemo(
    () => (
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            padding: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 17 }}>
            Khách hàng không lấy hoá đơn
          </Text>
          <View>
            <MaterialIcons name="arrow-forward-ios" size={17} color="black" />
          </View>
        </TouchableOpacity>

        <View style={{ backgroundColor: "#fff", marginTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 15,
            }}
          >
            <View style={styles.wrLabelPrd}>
              <Feather name="box" size={24} color="black" />
              <Text style={{ fontSize: 17, fontWeight: "600" }}>
                Sản phẩm đã thêm
              </Text>
            </View>
            {isSelecting ? (
              <View style={{ flexDirection: "row", gap: 15 }}>
                <TouchableOpacity onPress={handleDeleteProduct}>
                  <Text style={{ color: "red", fontWeight: "600" }}>Xoá</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsSelecting(false);
                    setSelectedItems([]);
                  }}
                >
                  <Text style={{ color: "#6c6c6cff", fontWeight: "600" }}>
                    Huỷ
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsSelecting(true)}>
                <MaterialIcons
                  name="check-box-outline-blank"
                  size={24}
                  color="#6c6c6cff"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* FlatList will render product rows below */}
        </View>
      </View>
    ),
    [isSelecting, handleDeleteProduct]
  );

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <FlatList
          data={safeItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListFooterComponent={
            <View style={{ paddingBottom: 180 }}>
              {/* Summary card */}
              <TouchableOpacity
                style={styles.wrLabelPrdAdd}
                onPress={() => navigation.goBack()}
              >
                <FontAwesome
                  name="plus-square-o"
                  size={24}
                  color={colorDarkText}
                />
                <Text style={{ fontSize: 15, fontWeight: "500" }}>
                  Thêm sản phẩm
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 15,
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <View style={[styles.wrLabelPrd, { marginBottom: 10 }]}>
                  <Text style={{ fontSize: 17, fontWeight: "600" }}>
                    Chi tiết thanh toán
                  </Text>
                </View>

                <View style={styles.wrOtherPay}>
                  <Text>Tạm tính</Text>
                  <Text
                    style={{
                      color: textColorMain,
                      fontWeight: "700",
                      fontSize: 17,
                    }}
                  >
                    {totalPrice.toLocaleString("vi-VN")} VND
                  </Text>
                </View>

                <View style={styles.wrOtherPay}>
                  <Text>Khuyến mãi</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text style={{ fontSize: 17 }}>0</Text>
                    <MaterialIcons
                      name="arrow-forward-ios"
                      size={17}
                      color="black"
                    />
                  </View>
                </View>

                <View style={styles.wrOtherPay}>
                  <Text>Phụ thu</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Text style={{ fontSize: 17 }}>0</Text>
                    <MaterialIcons
                      name="arrow-forward-ios"
                      size={17}
                      color="black"
                    />
                  </View>
                </View>

                <View style={styles.wrOtherPay}>
                  <Text>Tổng tiền trước thuế</Text>
                  <Text
                    style={{
                      color: textColorMain,
                      fontWeight: "700",
                      fontSize: 17,
                    }}
                  >
                    {totalPrice.toLocaleString("vi-VN")} VND
                  </Text>
                </View>

                {/* optional: show total in words */}
                {/* <View style={styles.wrOtherPay}>
                  <Text>Tổng tiền (viết bằng chữ)</Text>
                  <Text
                    style={{
                      color: textColorMain,
                      fontWeight: "700",
                      fontSize: 14,
                    }}
                  >
                    {readNumber(totalPrice)} đồng
                  </Text>
                </View> */}

                <View>
                  <View style={styles.wrOtherPay}>
                    <TouchableOpacity
                      onPress={toggleTaxInputs}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flex: 1,
                      }}
                      activeOpacity={0.8}
                    >
                      <Text>Giảm trừ thuế %</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Text style={{ fontSize: 17 }}>{selectedTax ?? 0}</Text>
                        <MaterialIcons
                          name={
                            showTaxInputs
                              ? "keyboard-arrow-up"
                              : "keyboard-arrow-down"
                          }
                          size={22}
                          color="black"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <Animated.View
                    style={{
                      overflow: "hidden",
                      height: animatedHeight.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 52],
                      }),
                      opacity: animatedHeight,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingTop: 8,
                      }}
                    >
                      {TAX_OPTIONS.map((val) => (
                        <TouchableOpacity
                          key={val}
                          style={[
                            styles.selectTaxOption,
                            {
                              borderColor:
                                selectedTax === val ? ColorMain : "#d3d3d3ff",
                              backgroundColor:
                                selectedTax === val ? "#eaf7ff" : "#fff",
                            },
                          ]}
                          onPress={() => handleSelectTax(val)}
                        >
                          <Text
                            style={{
                              color: selectedTax === val ? ColorMain : "#000",
                              fontWeight: selectedTax === val ? "700" : "400",
                            }}
                          >
                            {val}%
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Animated.View>

                  {showTaxResult && (
                    <Animated.View
                      style={{
                        marginTop: 10,
                        opacity: animatedTaxResult,
                        transform: [
                          {
                            translateY: animatedTaxResult.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-6, 0],
                            }),
                          },
                        ],
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>
                          Trừ thuế:&nbsp;
                          <Text
                            style={{ fontWeight: "bold", color: textColorMain }}
                          >
                            {totalTaxDiscount.toLocaleString("vi-VN")} VND
                          </Text>
                        </Text>

                        <TouchableOpacity
                          onPress={handleSaveTax}
                          style={{
                            backgroundColor: ColorMain,
                            paddingVertical: 6,
                            paddingHorizontal: 15,
                            borderRadius: 8,
                          }}
                        >
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            Lưu
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  )}
                </View>

                <View
                  style={[
                    styles.wrOtherPay,
                    {
                      borderTopWidth: 0.5,
                      borderColor: "#e6e6e6ff",
                      paddingTop: 20,
                    },
                  ]}
                >
                  <Text>Tổng tiền thanh toán</Text>
                  <Text
                    style={{
                      color: textColorMain,
                      fontWeight: "700",
                      fontSize: 15,
                    }}
                  >
                    {(totalAfterTax ?? totalPrice).toLocaleString("vi-VN")} VND
                  </Text>
                </View>
              </View>

              <View
                style={{ backgroundColor: "#fff", padding: 15, marginTop: 20 }}
              >
                <View style={styles.wrLabelPrd}>
                  <Text>Ghi chú</Text>
                </View>
                <PaperTextInput
                  placeholder="Nhập ghi chú..."
                  value={description}
                  onChangeText={setDescription}
                  style={styles.paperInput}
                  theme={{
                    colors: {
                      primary: textColorMain,
                      onSurfaceVariant: "#a9a9a9ff",
                    },
                  }}
                />
              </View>
            </View>
          }
          contentContainerStyle={{
            paddingBottom: 0,
            backgroundColor: "#f5f5f5ff",
          }}
          initialNumToRender={10}
          removeClippedSubviews
          maxToRenderPerBatch={10}
        />
      </KeyboardAvoidingView>

      <NavigationBottomPayInvoice
        label="Thanh toán"
        selectedProduct={items}
        totalAfterTax={totalAfterTax}
        disabled={isPayDisabled}
        screen="ExportInvoiceDetailScreen"
        invoiceDetail={invoiceDetail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  bottomLine: {
    alignSelf: "center",
    width: "90%",
    height: 0.7,
    backgroundColor: "#d3d3d3ff",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    minWidth: 40,
    textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quantityButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  wrLabelPrd: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  wrLabelPrdAdd: {
    paddingVertical: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  wrOtherPay: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    marginBottom: 5,
  },
  paperInput: {
    backgroundColor: "white",
  },
  selectTaxOption: {
    borderWidth: 0.5,
    borderColor: "#d3d3d3ff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
});
