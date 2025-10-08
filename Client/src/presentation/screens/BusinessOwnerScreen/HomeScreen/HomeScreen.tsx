import { ColorMain } from "@/src/presentation/components/colors";
import FeatureItem from "@/src/presentation/components/FeatureItem/FeatureItem";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MlkitOcr from "react-native-mlkit-ocr";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import ScanInvoice from "@/src/presentation/components/ScanInvoice/ScanInvoice";

type FileType = {
  uri: string;
  name?: string;
  type?: string;
  size?: number;
};
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const GOOGLE_CLOUD_VISION_API_KEY = "AIzaSyAkxhcKWHtiwW1aOg8Um6YTU7By1S1PGkM";
function HomeScreen(): React.JSX.Element {
  const navigate = useAppNavigation();
  const [file, setFile] = React.useState<FileType | null>(null);

  // const navigate = useAppNavigation(); // Removed duplicate declaration
  const features = [
    {
      key: "connect",
      label: "Kết nối KT",
      icon: <FontAwesome name="user" size={32} color="#009688" />,
      notify: 2,
      navigate: () => {
        navigate.navigate("SearchAccountantScreen");
      },
    },
    {
      key: "report",
      label: "Báo cáo",
      icon: <FontAwesome name="bar-chart" size={32} color="#FF9800" />,
      navigate: () => {
        navigate.navigate("ReportScreen");
      },
    },
    // {
    //   key: "capture invoices",
    //   label: "Quét hoá đơn",
    //   icon: <AntDesign name="scan1" size={24} color="black" />,
    //   navigate: () => openCamera(setImageUri),
    // },
    {
      key: "customers",
      label: "Khách hàng",
      icon: <FontAwesome name="users" size={32} color="#2196F3" />,
      navigate: () => navigate.navigate("CustomerManagerScreen"),
    },
    {
      key: "input",
      label: "Nhập hàng",
      icon: <FontAwesome name="download" size={32} color="#9C27B0" />,
      navigate: () => navigate.navigate("InputProductsScreen"),
    },
    {
      key: "output",
      label: "Xuất hàng",
      icon: <FontAwesome name="upload" size={32} color="#00BCD4" />,
    },
    // {
    //   key: "expense",
    //   label: "Chi phí",
    //   icon: <FontAwesome name="money" size={32} color="#FF5722" />,
    // },
    {
      key: "exportInvoice",
      label: "Xuất báo cáo",
      icon: <FontAwesome6 name="file-export" size={24} color="#FF5722" />,
      navigate: () => navigate.navigate("ReportExportScreen"),
    },
  ];

  const features2 = [
    {
      key: "tax",
      label: "Thuế",
      icon: <FontAwesome5 name="money-bill-wave" size={24} color="#0e4224ff" />,
      navigate: () => navigate.navigate("TaxScreen"),

    },
    {
      key: "staff",
      label: "Nhân sự",
      icon: <FontAwesome name="id-card" size={32} color="#3F51B5" />,
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <FontAwesome name="cogs" size={32} color="#9E9E9E" />,
      navigate: () => {
        navigate.navigate("SettingScreen");
      },
    },
    {
      key: "stock",
      label: "Tồn kho",
      icon: <MaterialIcons name="store" size={32} color="#607D8B" />,
    },
    {
      key: "orders",
      label: "Đơn hàng",
      icon: <MaterialIcons name="shopping-cart" size={32} color="#8BC34A" />,
    },
    {
      key: "customers",
      label: "Khách hàng",
      icon: <FontAwesome name="user" size={32} color="#009688" />,
    },
    {
      key: "supplier",
      label: "Nhà cung cấp",
      icon: <FontAwesome name="truck" size={32} color="#795548" />,
    },
    {
      key: "salary",
      label: "Lương",
      icon: <FontAwesome name="credit-card" size={32} color="#673AB7" />,
    },
    {
      key: "timekeeping",
      label: "Chấm công",
      icon: <MaterialIcons name="schedule" size={32} color="#FF9800" />,
      notify: 3,
    },
    {
      key: "promotion",
      label: "Khuyến mãi",
      icon: <FontAwesome name="gift" size={32} color="#E91E63" />,
    },
  ];

  const featuresInvoice = [
    {
      key: "invoice",
      label: "Hóa đơn",
      icon: <MaterialIcons name="receipt" size={32} color={ColorMain} />,
      notify: 1,
      navigate: () => navigate.navigate("InvoiceScreen"),
    },

    {
      key: "ReceiptVoucher",
      label: "Phiếu thu",
      icon: (
        <MaterialCommunityIcons name="cash-plus" size={32} color={ColorMain} />
      ),
      notify: 1,
      navigate: () => {
        navigate.navigate("ReceiptVoucherScreen");
      },
    },
    {
      key: "ReceiptVoucher",
      label: "Phiếu chi",
      icon: (
        <MaterialCommunityIcons name="cash-minus" size={32} color={ColorMain} />
      ),
      notify: 1,
      navigate: () => {
        navigate.navigate("PaymentVoucherScreen");
      },
    },
  ];
  const accfeatures = [
    {
      key: "notification",
      label: "Thông báo",
      icon: <MaterialIcons name="notifications" size={32} color="#2196F3" />,
    },
    {
      key: "analytics",
      label: "Phân tích",
      icon: <MaterialIcons name="insights" size={32} color="#4CAF50" />,
    },
    {
      key: "contract",
      label: "Hợp đồng",
      icon: <FontAwesome name="file-text" size={32} color="#607D8B" />,
    },
    {
      key: "support",
      label: "Hỗ trợ",
      icon: <MaterialIcons name="support-agent" size={32} color="#FF5722" />,
    },
    {
      key: "about",
      label: "Giới thiệu",
      icon: <FontAwesome name="info-circle" size={32} color="#9E9E9E" />,
    },
  ];
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  const [ocrResult, setOcrResult] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const runOcr = async (imageUri: string) => {
    try {
      setLoading(true);

      // ✂️ Resize ảnh xuống (ví dụ chiều rộng max 800px)
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log("Resized image URI:", manipulatedImage.uri);

      const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const body = {
        requests: [
          {
            image: {
              content: base64,
            },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      };

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();
      const text =
        data.responses?.[0]?.fullTextAnnotation?.text || "Không nhận diện được";
      setOcrResult(text.split("\n"));
    } catch (error) {
      console.error("OCR error:", error);
      Alert.alert("Lỗi", "Không nhận diện được văn bản. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  const selectImage = async () => {
    // Yêu cầu quyền truy cập thư viện

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      Alert.alert("Bạn cần cấp quyền truy cập thư viện ảnh để tiếp tục.");
      return;
    }

    // Mở thư viện
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      runOcr(uri);
    }
  };
  const openCamera = async (setImageUri: (uri: string | null) => void) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.status !== "granted") {
      Alert.alert(
        "Quyền truy cập bị từ chối",
        "Bạn cần cho phép truy cập camera để tiếp tục."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      runOcr(result.assets[0].uri);
    }
  };
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#f7f7f7ff", paddingHorizontal: 10 }}
      >
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 10,
              textAlign: "left",
              padding: 10,
            }}
          >
            Tính năng
          </Text>
          <View style={styles.gridContainer}>
            {features.map((item, index) => (
              <FeatureItem key={index} item={item} />
            ))}
          </View>
        </View>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 10,
              textAlign: "left",
              padding: 10,
            }}
          >
            Hoá đơn - Phiếu
          </Text>
          <View style={styles.gridContainer}>
            {featuresInvoice.map((item, index) => (
              <FeatureItem key={index} item={item} />
            ))}
          </View>
        </View>
        {/* <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Button title="Chọn ảnh hóa đơn" onPress={selectImage} />

          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={{ width: "100%", height: 300, marginVertical: 10 }}
              resizeMode="contain"
            />
          )}

          {loading && <ActivityIndicator size="large" color="blue" />}
        </ScrollView>
        <ScanInvoice
          imageUri={imageUri}
          ocrResult={ocrResult}
          loading={loading}
          setImageUri={setImageUri}
          setOcrResult={setOcrResult}
          setLoading={setLoading}
        />
        {file && (
          <View style={{ marginTop: 12 }}>
            <Text>Đã chọn: {file.name || file.uri.split("/").pop()}</Text>

            {file.uri && file.type !== "application/pdf" && (
              <Image
                source={{ uri: file.uri }}
                style={{
                  width: 200,
                  height: 150,
                  marginTop: 10,
                  borderRadius: 8,
                }}
              />
            )}
          </View>
        )} */}
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 10,
              textAlign: "left",
              padding: 10,
            }}
          >
            Tính năng khác
          </Text>
          <View style={styles.gridContainer}>
            {features2.map((item, index) => (
              <FeatureItem key={index} item={item} />
            ))}
          </View>
        </View>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginLeft: 10,
              textAlign: "left",
              padding: 10,
            }}
          >
            Nhân viên
          </Text>
          <View style={styles.gridContainer}>
            {accfeatures.map((item, index) => (
              <FeatureItem key={index} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBlockEnd: 10,
    borderRadius: 10,
    shadowColor: "#9d9d9d",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.22,
    elevation: 3,
    marginBottom: 20,
    marginTop: 10,
  },
  page: {
    width: SCREEN_WIDTH,
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
});
export default HomeScreen;
