import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

import {
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  colorDarkText,
  ColorMain,
  textColorMain,
} from "@/src/presentation/components/colors";
import { useEffect, useRef, useState } from "react";
import NavigationBottomPayInvoice from "@/src/presentation/components/NavigationBottomPayInvoice";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";

type PaymentRoute = RouteProp<RootStackParamList, "PaymentInvoiceScreen">;
const listTaxOptions = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "5", value: 5 },
];

// enable LayoutAnimation on Android if needed (kept for completeness)
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function PaymentInvoiceScreen() {
  const route = useRoute<PaymentRoute>();
  const navigation = useAppNavigation();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { items: initialItems } = route.params as { items: Product[] };

  const [description, setDescription] = useState("");
  const [items, setItems] = useState(
    initialItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      total: item.price * (item.quantity || 1),
    }))
  );

  // tax UI state
  const [showTaxInputs, setShowTaxInputs] = useState(false);
  const [showTaxResult, setShowTaxResult] = useState(false);
  const [selectedTax, setSelectedTax] = useState<number | null>(null);
  const [totalAfterTax, setTotalAfterTax] = useState<number | null>(null);

  // Animated values
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedTaxResult = useRef(new Animated.Value(0)).current;

  const handleDeleteProduct = () => {
    setItems((prev) => prev.filter((it) => !selectedItems.includes(it._id)));
    setSelectedItems([]);
    setIsSelecting(false);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };
  // derived totals
  const totalPriceSelect =
    items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    ) || 0;

  const isPayDisabled = totalPriceSelect === 0;

  const totalTaxDiscount =
    selectedTax !== null ? (totalPriceSelect * selectedTax) / 100 : 0;

  // animate tax dropdown open/close
  const toggleTaxInputs = () => {
    const toValue = showTaxInputs ? 0 : 1;
    Animated.timing(animatedHeight, {
      toValue,
      duration: 220,
      useNativeDriver: false,
    }).start();
    setShowTaxInputs((v) => !v);
    // if closing, also hide tax result (optional)
    if (showTaxInputs) {
      setShowTaxResult(false);
      Animated.timing(animatedTaxResult, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
      setSelectedTax(null);
    }
  };

  // when select a tax %
  const handleSelectTax = (value: number) => {
    setSelectedTax(value);
    setShowTaxResult(true);
    Animated.timing(animatedTaxResult, {
      toValue: 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  // quantity handlers update items array (source of truth)
  const increaseQuantity = (id: string) => {
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
  };

  const decreaseQuantity = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it._id === id) {
          const newQ = Math.max((it.quantity || 1) - 1, 0);
          return { ...it, quantity: newQ, total: it.price * newQ };
        }
        return it;
      })
    );
  };

  const changeQuantity = (id: string, raw: string) => {
    const n = Math.max(Number(raw) || 0, 0);
    setItems((prev) =>
      prev.map((it) =>
        it._id === id ? { ...it, quantity: n, total: it.price * n } : it
      )
    );
  };

  // when user presses "Lưu" — apply discount to total (not change items)
  const handleSaveTax = () => {
    if (selectedTax === null) return;
    const discount = totalTaxDiscount;
    setTotalAfterTax(Math.max(totalPriceSelect - discount, 0));
    // optional: close tax inputs
    setShowTaxInputs(false);
    setShowTaxResult(false);
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    // reset total after tax if items change
    handleSaveTax();
  }, [items]);

  const renderItem = ({ item }: { item: any }) => {
    const isSelected = selectedItems.includes(item._id);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          // Nếu đang ở chế độ chọn thì click vào item sẽ toggle chọn
          if (isSelecting) {
            setSelectedItems((prev) =>
              prev.includes(item._id)
                ? prev.filter((id) => id !== item._id)
                : [...prev, item._id]
            );
          }
        }}
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
            {/* Hiển thị checkbox nếu đang trong chế độ chọn */}
            {isSelecting && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedItems((prev) =>
                    prev.includes(item._id)
                      ? prev.filter((id) => id !== item._id)
                      : [...prev, item._id]
                  );
                }}
              >
                <MaterialIcons
                  name={isSelected ? "check-box" : "check-box-outline-blank"}
                  size={24}
                  color={isSelected ? ColorMain : "#6c6c6cff"}
                />
              </TouchableOpacity>
            )}

            {/* Ảnh sản phẩm */}
            <Image
              source={require("@/assets/images/no-image-news.png")}
              style={styles.image}
            />

            {/* Thông tin sản phẩm */}
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.detail}>
                Giá: {item.price?.toLocaleString()}đ
              </Text>
              <Text style={styles.detail}>Còn: {item.stock}</Text>
            </View>

            {/* Ô tăng giảm số lượng */}
            <View style={{ right: 10, position: "absolute" }}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => decreaseQuantity(item._id)}
                  disabled={isSelecting}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={(item.quantity || 0).toString()}
                  onChangeText={(val) => changeQuantity(item._id, val)}
                  editable={!isSelecting}
                />

                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    { backgroundColor: ColorMain },
                  ]}
                  onPress={() => increaseQuantity(item._id)}
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
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ backgroundColor: "#f5f5f5ff", flex: 1 }}
          contentContainerStyle={{ paddingBottom: 180 }}
        >
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
                <Feather name="box" size={24} col or="black" />
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

            {items.map((it) => (
              <View key={it._id}>{renderItem({ item: it })}</View>
            ))}

            <TouchableOpacity
              style={styles.wrLabelPrdAdd}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome
                name="plus-square-o"
                size={24}
                color={colorDarkText}
              />
              <Text>Thêm sản phẩm</Text>
            </TouchableOpacity>
          </View>

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
                {totalPriceSelect.toLocaleString("vi-VN")} VND
              </Text>
            </View>

            <View style={styles.wrOtherPay}>
              <Text>Khuyến mãi</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
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
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
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
                {totalPriceSelect.toLocaleString("vi-VN")} VND
              </Text>
            </View>

            {totalAfterTax !== null && (
              <View style={styles.wrOtherPay}>
                <Text>Tổng tiền sau thuế</Text>
                <Text
                  style={{
                    color: textColorMain,
                    fontWeight: "700",
                    fontSize: 17,
                  }}
                >
                  {totalAfterTax.toLocaleString("vi-VN")} VND
                </Text>
              </View>
            )}

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
                  {listTaxOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.selectTaxOption,
                        {
                          borderColor:
                            selectedTax === option.value
                              ? ColorMain
                              : "#d3d3d3ff",
                          backgroundColor:
                            selectedTax === option.value ? "#eaf7ff" : "#fff",
                        },
                      ]}
                      onPress={() => handleSelectTax(option.value)}
                    >
                      <Text
                        style={{
                          color:
                            selectedTax === option.value ? ColorMain : "#000",
                          fontWeight:
                            selectedTax === option.value ? "700" : "400",
                        }}
                      >
                        {option.label}%
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
          </View>

          <View style={{ backgroundColor: "#fff", padding: 15, marginTop: 20 }}>
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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* bottom navigation (passes selectedProduct items unchanged) */}
      <NavigationBottomPayInvoice
        label="Thanh toán"
        selectedProduct={items}
        totalAfterTax={totalAfterTax}
        disabled={isPayDisabled}
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

export default PaymentInvoiceScreen;
