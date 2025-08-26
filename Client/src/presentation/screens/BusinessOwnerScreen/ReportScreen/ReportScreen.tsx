import Analytics from "@/src/presentation/components/Analytics";
import ReportItem from "@/src/presentation/components/ReportItem";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function ReportScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // 👉 chỗ này bạn gọi API hoặc load lại dữ liệu
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setRefreshing(false);
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flex: 1, backgroundColor: "#e3e3e3ff", width: "100%" }}>
        <View style={{ backgroundColor: "#fff", paddingTop: 10 }}>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Tổng quan</Text>
            <Text style={[styles.title, { color: "#5a8bf5ff" }]}>
              Tháng này
              <MaterialIcons
                name="arrow-drop-down"
                size={20}
                color="#5a8bf5ff"
              />
            </Text>
          </View>
          <ReportItem />
        </View>
        <Analytics />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  headerTitle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
});

export default ReportScreen;
