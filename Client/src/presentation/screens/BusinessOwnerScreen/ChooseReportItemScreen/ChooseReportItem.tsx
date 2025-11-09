import ChooseAnalyticsItem from "@/src/presentation/components/ChooseAnalyticsItem";
import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const featerChooseReportItem = [
  { label: "Tài chính", value: 1, component: () => <ChooseAnalyticsItem /> },
  { label: "Hoá đơn", value: 2, component: () => <Text>Hoá đơn</Text> },
  { label: "Đơn hàng", value: 3, component: () => <Text>Đơn hàng</Text> },
  { label: "Tồn kho", value: 4, component: () => <Text>Tồn kho</Text> },
];

function ChooseReportItem() {
  const [active, setActive] = useState<number>(1);
  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: active,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [active]);

  const ActiveComponent =
    featerChooseReportItem.find((item) => item.value === active)?.component ||
    null;

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
          backgroundColor: "#f6f6f6ff",
        }}
      >
        <FlatList
          data={featerChooseReportItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value.toString()}
          renderItem={({ item }) => {
            const isActive = item.value === active;

            const borderBottomWidth = animatedValue.interpolate({
              inputRange: [item.value - 1, item.value, item.value + 1],
              outputRange: [0, 2, 0],
              extrapolate: "clamp",
            });

            return (
              <TouchableOpacity
                onPress={() => setActive(item.value)}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.item,
                    {
                      borderBottomWidth,
                      borderColor: ColorMain,
                    },
                  ]}
                >
                  <Text style={[styles.text, isActive && styles.activeText]}>
                    {item.label}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Render nội dung component */}
      <View style={{ flex: 1, padding: 15 }}>
        {ActiveComponent ? <ActiveComponent /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f3f3",
    flex: 1,
  },
  item: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 5,
    paddingTop: 20,
  },
  text: {
    color: "#333",
    fontSize: 14,
  },
  activeText: {
    color: textColorMain,
    fontWeight: "bold",
  },
});

export default ChooseReportItem;
