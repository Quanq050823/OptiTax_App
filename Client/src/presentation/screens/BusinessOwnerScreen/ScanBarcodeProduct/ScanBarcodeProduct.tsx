import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { Product, RootStackParamList } from "@/src/types/route";
import { FontAwesome6 } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";

import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
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
  const route = useRoute<any>();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [productScan, setProductScan] = useState<any | null>({
    _id: 0,
    name: "",
    price: 0,
    stock: 0,
    category: "",

    description: "",
  });
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
      console.log(res.data, "Dữ liệu sản phẩm");

      if (res.data && res.data.product) {
        const product: Product = {
          _id: res.data.product._id,
          code: null,
          imageUrl: null,
          name: res.data.product.product_name,
          price: 0,
          stock: 0,
          category: res.data.product.categories,
          description: `${res.data.product.product_name} của thương hiệu ${res.data.product.brands}, dung tích ${res.data.product.quantity}, xuất xứ ${res.data.product.origins}.`,
          attributes: [
            ...(res.data.product.labels_tags || []),
            ...(res.data.product.ingredients_analysis_tags || []),
          ],
          unit: null,
        };
        setProductScan(product);

        navigate.navigate(
          "ProductManager",
          { scannedProduct: product },
          { merge: true }
        );

      } else {
        setProductScan(null);
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
          ) : productScan ? (
            <>
              <Text style={styles.title}>{productScan.productName}</Text>
              <Text>Thương hiệu: {productScan.brands}</Text>
              <Text>
                Loại:
                {typeof productScan.categories === "object"
                  ? Object.values(productScan.categories).join(", ")
                  : productScan.categories}
              </Text>
              <Text>
                Năng lượng: {productScan.nutriments?.["energy-kcal"]} kcal
              </Text>
              <Text>Mã vạch: {productScan.code}</Text>
              <Button
                title="Quét lại"
                onPress={() => {
                  setScannedCode(null);
                  setProductScan(null);
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
