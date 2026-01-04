import { ColorMain } from "@/src/presentation/components/colors";
import * as React from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import { Text, Card } from "react-native-paper";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

type NotificationType = "system" | "invoice" | "tax" | "payment";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

const notifications: NotificationItem[] = [
  {
    id: "1",
    type: "system",
    title: "Cập nhật phiên bản 2.0",
    description: "Ứng dụng đã thêm chức năng đồng bộ hoá đơn tự động.",
    time: "2 giờ trước",
    isRead: false,
  },
  {
    id: "2",
    type: "invoice",
    title: "Hoá đơn #12345 phát hành thành công",
    description: "Khách hàng A đã nhận được hoá đơn.",
    time: "Hôm qua, 10:30",
    isRead: true,
  },
  {
    id: "3",
    type: "tax",
    title: "Đến hạn nộp tờ khai quý 3",
    description: "Bạn cần nộp tờ khai trước 30/09/2025.",
    time: "3 ngày trước",
    isRead: false,
  },
  {
    id: "4",
    type: "payment",
    title: "Gia hạn chữ ký số",
    description: "Hạn sử dụng chữ ký số còn 7 ngày.",
    time: "1 tuần trước",
    isRead: false,
  },
];

function NotificationCard({ item }: { item: NotificationItem }) {
  return (
    <Card
      style={{
        margin: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        elevation: 0,
      }}
      contentStyle={{
        backgroundColor: item.isRead ? "#f0f0f0" : "#ffffff",
        borderRadius: 5,
      }}
    >
      <Card.Title
        title={item.title}
        subtitle={item.time}
        titleStyle={{
          color: "#000",
          fontSize: 18,
          fontWeight: "bold",
        }}
        subtitleStyle={{
          color: "#838383ff",
          fontSize: 14,
        }}
      />
      <Card.Content>
        <Text style={{ color: "#000" }}>{item.description}</Text>
      </Card.Content>
    </Card>
  );
}
export default function NotificationScreen() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "all", title: "Tất cả" },
    // { key: "system", title: "Hệ thống" },
    { key: "invoice", title: "Hoá đơn" },
    { key: "tax", title: "Tờ khai" },
    { key: "payment", title: "Thanh toán" },
  ]);

  const filteredData =
    routes[index].key === "all"
      ? notifications
      : notifications.filter((n) => n.type === routes[index].key);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Chỉ render TabBar */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={() => null} // Không render scene trong TabView
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: ColorMain }}
            style={{ backgroundColor: "white" }}
            activeColor={ColorMain}
            inactiveColor="gray"
          />
        )}
        // Giới hạn chiều cao
        style={{ maxHeight: 70 }}
      />

      {/* List hiển thị bên dưới */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationCard item={item} />}
      />
    </View>
  );
}
