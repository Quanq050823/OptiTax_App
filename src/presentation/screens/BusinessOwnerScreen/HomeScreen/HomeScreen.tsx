import { ColorMain } from "@/src/presentation/components/colors";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const features = [
  {
    key: "invoice",
    label: "Hóa đơn",
    icon: <MaterialIcons name="receipt" size={32} color="#4CAF50" />,
    notify: 1,
  },
  {
    key: "connect",
    label: "Kết nối KT",
    icon: <FontAwesome name="users" size={32} color="#2196F3" />,
    notify: 2,
  },
  {
    key: "report",
    label: "Báo cáo",
    icon: <FontAwesome name="bar-chart" size={32} color="#FF9800" />,
  },
  {
    key: "input",
    label: "Nhập hàng",
    icon: <FontAwesome name="download" size={32} color="#9C27B0" />,
  },
  {
    key: "output",
    label: "Xuất hàng",
    icon: <FontAwesome name="upload" size={32} color="#00BCD4" />,
  },
  {
    key: "expense",
    label: "Chi phí",
    icon: <FontAwesome name="money" size={32} color="#FF5722" />,
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
  },
  {
    key: "promotion",
    label: "Khuyến mãi",
    icon: <FontAwesome name="gift" size={32} color="#E91E63" />,
  },
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
function HomeScreen(): React.JSX.Element {
  const navigate = useAppNavigation();

  const [currentPage, setCurrentPage] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const pageCount = Math.ceil(features.length / 10); // phân trang

  const grouped: any[] = [];
  for (let i = 0; i < features.length; i += 10) {
    grouped.push(features.slice(i, i + 10));
  }

  const renderItem = ({ item }: { item: (typeof grouped)[0] }) => (
    <View style={styles.page}>
      <View style={styles.row}>
        {item.slice(0, 5).map((i: (typeof features)[0]) => (
          <TouchableOpacity key={i.key} style={styles.item}>
            {i.notify ? (
              <View style={styles.notifycation}>
                <Text
                  style={{
                    textAlign: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  1
                </Text>
              </View>
            ) : null}
            {i.icon}
            <Text style={styles.label}>{i.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {item.slice(5, 10).map((i: (typeof features)[0]) => (
          <TouchableOpacity key={i.key} style={styles.item}>
            {i.icon}
            <Text style={styles.label}>{i.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // const handlePress = (key: string) => {
  //   // điều hướng tuỳ mục
  //   console.log("Clicked", key);
  // };
  const TOTAL_PAGES = grouped.length;

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <ScreenContainer>
        <View style={styles.container}>
          <Animated.FlatList
            data={grouped}
            renderItem={renderItem}
            horizontal
            pagingEnabled
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          />
          <View style={{ width: "100%", alignItems: "center" }}>
            <View style={styles.paginationContainer}>
              <Animated.View
                style={[
                  styles.paginationHighlight,
                  {
                    transform: [
                      {
                        translateX: scrollX.interpolate({
                          inputRange: [0, 30 * (TOTAL_PAGES - 1)],
                          outputRange: [0, 30 - 30 / TOTAL_PAGES],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingBottom: 10,
  },
  page: {
    width: SCREEN_WIDTH,
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  item: {
    alignItems: "center",
    width: SCREEN_WIDTH / 5,
    height: 80,
  },
  notifycation: {
    height: 13,
    width: 13,
    borderRadius: "50%",
    backgroundColor: "red",
    position: "absolute",
    zIndex: 1,
    top: -5,
    right: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  paginationContainer: {
    width: 30,
    height: 4,
    backgroundColor: "#ccc", // màu xám nền
    borderRadius: 3,
    overflow: "hidden",
  },
  paginationHighlight: {
    width: 30 / 2, // chiếm 50% chiều rộng
    height: 4,
    backgroundColor: ColorMain,
  },
});
export default HomeScreen;
