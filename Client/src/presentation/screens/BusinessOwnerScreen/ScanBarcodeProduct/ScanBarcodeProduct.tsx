import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { FontAwesome6 } from "@expo/vector-icons";
import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
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
  const isScanning = useRef(false);

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
        setError("Không tìm thấy thông tin sản phẩm cho mã vạch này.");
      }
    } catch {
      setError("Dữ liệu sản phẩm không thể tìm thấy");
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
      ) : (
        <ScrollView contentContainerStyle={styles.result}>
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#FF6B00" />
              <Text style={styles.loadingText}>Đang tra cứu sản phẩm...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorBox}>
              <FontAwesome6 name="circle-xmark" size={52} color="#EF4444" />
              <Text style={styles.errorTitle}>Không tìm thấy</Text>
              <Text style={styles.errorMsg}>{error}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => {
                  isScanning.current = false;
                  setScannedCode(null);
                  setError(null);
                }}
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
});

export default ScanBarcodeProduct;
