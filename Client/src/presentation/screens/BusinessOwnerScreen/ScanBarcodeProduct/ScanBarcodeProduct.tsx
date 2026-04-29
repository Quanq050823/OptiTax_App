import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { searchBarcodeViaSerpApi } from "@/src/services/API/storageService";
import { SerpApiProduct } from "@/src/types/storage";
import { FontAwesome6 } from "@expo/vector-icons";
import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function ScanBarcodeProduct() {
  const navigate = useAppNavigation();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<'openfoodfacts' | 'serpapi'>('openfoodfacts');
  const [serpResults, setSerpResults] = useState<SerpApiProduct[] | null>(null);
  const isScanning = useRef(false);

  const reset = () => {
    isScanning.current = false;
    setScannedCode(null);
    setError(null);
    setSerpResults(null);
  };

  const navigateWithSerpProduct = (p: SerpApiProduct, code: string) => {
    const scannedProduct = {
      _id: code,
      code,
      name: p.name,
      imageUrl: p.imageUrl,
      imageURL: p.imageUrl,
      price: p.price,
      stock: 0,
      category: "",
      description: [
        p.name && `Tên: ${p.name}`,
        p.brand && `Thương hiệu: ${p.brand}`,
      ]
        .filter(Boolean)
        .join(", "),
      attributes: [],
      unit: null,
    };
    navigate.navigate("InventoryManagementScreen", { scannedProduct });
    reset();
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>App cần quyền truy cập camera</Text>
        <Button onPress={requestPermission} title="Cho phép" />
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (isScanning.current) return;
    isScanning.current = true;

    setScannedCode(data);
    setLoading(true);
    setError(null);
    setLoadingStep('openfoodfacts');
    try {
      const res = await axios.get<any>(
        `https://world.openfoodfacts.net/api/v2/product/${data}.json`,
        {
          headers: {
            "User-Agent": "OptiTax/1.0 (contact@dattax.vn)",
          },
        }
      );

      if (res.data && res.data.product) {
        const p = res.data.product;
        const scannedProduct = {
          _id: p._id,
          code: data,
          name: p.product_name ?? "",
          imageUrl: p.image_front_url ?? null,
          imageURL: p.image_front_url ?? null,
          price: 0,
          stock: 0,
          category: p.categories ?? "",
          description: [
            p.product_name && `Tên: ${p.product_name}`,
            p.brands && `Thương hiệu: ${p.brands}`,
            p.quantity && `Dung tích: ${p.quantity}`,
            p.origins && `Xuất xứ: ${p.origins}`,
          ]
            .filter(Boolean)
            .join(", "),
          attributes: [
            ...(p.labels_tags || []),
            ...(p.ingredients_analysis_tags || []),
          ],
          unit: null,
        };

        navigate.navigate("InventoryManagementScreen", { scannedProduct });
        setScannedCode(null);
        isScanning.current = false;
      } else {
        // Fallback: try SerpApi Google Shopping
        setLoadingStep('serpapi');
        try {
          const serpRes = await searchBarcodeViaSerpApi(data);
          setSerpResults(serpRes.data);
        } catch {
          setError("Không tìm thấy thông tin sản phẩm cho mã vạch này.");
        }
      }
    } catch {
      // OpenFoodFacts request failed — still try SerpApi
      setLoadingStep('serpapi');
      try {
        const serpRes = await searchBarcodeViaSerpApi(data);
        setSerpResults(serpRes.data);
      } catch {
        setError("Dữ liệu sản phẩm không thể tìm thấy");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {!scannedCode ? (
        <CameraView
          style={{ flex: 1, width: "100%", height: "100%" }}
          facing={facing}
          onBarcodeScanned={handleBarcodeScanned}
        />
      ) : serpResults ? (
        // ── SerpApi picker ──
        <View style={{ flex: 1, width: "100%", backgroundColor: "#F8FAFC" }}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Chọn sản phẩm đúng</Text>
            <Text style={styles.pickerSubtitle}>
              Mã vạch: {scannedCode} • {serpResults.length} kết quả từ Google Shopping
            </Text>
          </View>

          <FlatList
            data={serpResults}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{ padding: 16, gap: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultCard}
                onPress={() => navigateWithSerpProduct(item, scannedCode!)}
                activeOpacity={0.75}
              >
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.resultThumb}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={[styles.resultThumb, styles.resultThumbPlaceholder]}>
                    <FontAwesome6 name="box" size={24} color="#CBD5E1" />
                  </View>
                )}
                <View style={styles.resultInfo}>
                  <View style={styles.resultNameRow}>
                    <Text style={styles.resultName} numberOfLines={2}>{item.name}</Text>
                    <View style={[
                      styles.sourceBadge,
                      item.source === "icheck" ? styles.sourceBadgeIcheck : styles.sourceBadgeShopping,
                    ]}>
                      <Text style={[
                        styles.sourceBadgeText,
                        item.source === "icheck" ? styles.sourceBadgeTextIcheck : styles.sourceBadgeTextShopping,
                      ]}>
                        {item.source === "icheck" ? "iCheck" : "Shopping"}
                      </Text>
                    </View>
                  </View>
                  {item.brand && item.source !== "icheck" && (
                    <Text style={styles.resultBrand} numberOfLines={1}>{item.brand}</Text>
                  )}
                  {item.price > 0 && (
                    <Text style={styles.resultPrice}>
                      ~{item.price.toLocaleString("vi-VN")} đ
                    </Text>
                  )}
                  {item.rating && (
                    <Text style={styles.resultRating}>★ {item.rating}</Text>
                  )}
                </View>
                <View style={styles.selectBtn}>
                  <Text style={styles.selectBtnText}>Chọn</Text>
                </View>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity style={styles.skipBtn} onPress={reset}>
                <Text style={styles.skipBtnText}>Không có sản phẩm nào đúng — Quét lại</Text>
              </TouchableOpacity>
            }
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.result}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#FF6B00" />
              <Text style={styles.loadingText}>
                {loadingStep === 'serpapi'
                  ? 'Đang tìm trên iCheck & Google Shopping...'
                  : 'Đang tra cứu sản phẩm...'}
              </Text>
              {loadingStep === 'serpapi' && (
                <Text style={styles.loadingSubText}>Ưu tiên iCheck → Google Shopping</Text>
              )}
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <FontAwesome6 name="circle-xmark" size={52} color="#EF4444" />
              <Text style={styles.errorTitle}>Không tìm thấy</Text>
              <Text style={styles.errorMsg}>{error}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={reset}
              >
                <Text style={styles.retryBtnText}>Quét lại</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      )}

      {!scannedCode && (
        <TouchableOpacity
          onPress={() =>
            setFacing((cur) => (cur === "back" ? "front" : "back"))
          }
          style={{ position: "absolute", bottom: 40 }}
        >
          <FontAwesome6 name="camera-rotate" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  result: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingBox: {
    alignItems: "center",
    gap: 14,
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  loadingText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "500",
  },
  loadingSubText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: -4,
  },
  errorBox: {
    alignItems: "center",
    gap: 12,
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    width: "100%",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  errorMsg: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 8,
    backgroundColor: "#FF6B00",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  // Serp picker
  pickerHeader: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  pickerSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
  },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  resultThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
  },
  resultThumbPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
  resultNameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    flexWrap: "wrap",
  },
  resultName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    lineHeight: 20,
    flexShrink: 1,
  },
  sourceBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: "flex-start",
  },
  sourceBadgeIcheck: {
    backgroundColor: "#DCFCE7",
  },
  sourceBadgeShopping: {
    backgroundColor: "#F1F5F9",
  },
  sourceBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  sourceBadgeTextIcheck: {
    color: "#16A34A",
  },
  sourceBadgeTextShopping: {
    color: "#64748B",
  },
  resultBrand: {
    fontSize: 12,
    color: "#64748B",
  },
  resultPrice: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "600",
  },
  resultRating: {
    fontSize: 11,
    color: "#F59E0B",
  },
  selectBtn: {
    backgroundColor: "#FF6B00",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  selectBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  skipBtn: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  skipBtnText: {
    fontSize: 13,
    color: "#94A3B8",
    textDecorationLine: "underline",
  },
});

export default ScanBarcodeProduct;
