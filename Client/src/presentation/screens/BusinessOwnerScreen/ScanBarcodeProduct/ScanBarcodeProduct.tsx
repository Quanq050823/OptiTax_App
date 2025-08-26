import { FontAwesome6 } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
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
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
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
    if (scannedCode) return; // tránh scan nhiều lần

    setScannedCode(data);
    setLoading(true);
    try {
      const res = await axios.get<any>(
        `https://world.openfoodfacts.org/api/v2/product/${data}.json`
      );
      if (res.data && res.data.product) {
        setProduct(res.data.product);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
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
            <ActivityIndicator size="large" color="blue" />
          ) : product ? (
            <>
              <Text style={styles.title}>{product.product_name}</Text>
              <Text>Thương hiệu: {product.brands}</Text>
              <Text>Loại: {product.categories}</Text>
              <Text>
                Năng lượng: {product.nutriments?.["energy-kcal"]} kcal
              </Text>
              <Text>Mã vạch: {product.code}</Text>
              <Button
                title="Quét lại"
                onPress={() => {
                  setScannedCode(null);
                  setProduct(null);
                }}
              />
            </>
          ) : (
            <>
              <Text>Không tìm thấy sản phẩm</Text>
              <Button
                title="Thử lại"
                onPress={() => {
                  setScannedCode(null);
                }}
              />
            </>
          )}
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
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default ScanBarcodeProduct;
