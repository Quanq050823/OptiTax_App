import { ColorMain } from "@/src/presentation/components/colors";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Label } from "@react-navigation/elements";
import * as React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
function HomeScreen(): React.JSX.Element {
  const navigate = useAppNavigation();

  // const navigate = useAppNavigation(); // Removed duplicate declaration
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
      navigate: () => {
        navigate.navigate("SearchAccountantScreen");
      },
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
  ];

  const features2 = [
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
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <ScreenContainer>
        <ScrollView>
          <View style={styles.container}>
            <Label
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 10,
                textAlign: "left",
                padding: 10,
              }}
            >
              Tính năng
            </Label>
            <View style={styles.gridContainer}>
              {features.map((item, index) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.item}
                  onPress={item.navigate || (() => {})}
                >
                  {item.notify ? (
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
                        {item.notify}
                      </Text>
                    </View>
                  ) : null}
                  {item.icon}
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.container}>
            <Label
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 10,
                textAlign: "left",
                padding: 10,
              }}
            >
              Tính năng khác
            </Label>
            <View style={styles.gridContainer}>
              {features2.map((item, index) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.item}
                  onPress={item.navigate || (() => {})}
                >
                  {item.notify ? (
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
                        {item.notify}
                      </Text>
                    </View>
                  ) : null}
                  {item.icon}
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.container}>
            <Label
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 10,
                textAlign: "left",
                padding: 10,
              }}
            >
              Nhân viên
            </Label>
            <View style={styles.gridContainer}>
              {accfeatures.map((item, index) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.item}
                  onPress={item.navigate || (() => {})}
                >
                  {item.notify ? (
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
                        {item.notify}
                      </Text>
                    </View>
                  ) : null}
                  {item.icon}
                  <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
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
      height: 1,
    },
    marginBottom: 20,
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
    width: SCREEN_WIDTH / 4,
    height: 80,
    marginHorizontal: 10,
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
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
});
export default HomeScreen;
