import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function ChooseAnalyticsItem() {
  const slideAnim = useRef(new Animated.Value(30)).current; // vị trí Y ban đầu (dưới 30px)
  const opacityAnim = useRef(new Animated.Value(0)).current; // độ mờ ban đầu
  const navigate = useAppNavigation();
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderItem = (label: string, index: number, screen: string) => (
    <Animated.View
      key={index}
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        key={index}
        onPress={() => navigate.navigate(screen as any)}
        style={{ alignItems: "center" }}
      >
        <Ionicons name="analytics-sharp" size={40} color="#3F4E87" />
        <Text style={[styles.title, { color: "#3F4E87" }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View>
      {[1, 2, 3].map((row) => (
        <View key={row} style={styles.wrapper}>
          {renderItem("Doanh thu", row * 2 - 1, "ChartExportScreen")}
          {renderItem("Doanh thu", row * 2, "")}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  container: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
  },
});

export default ChooseAnalyticsItem;
