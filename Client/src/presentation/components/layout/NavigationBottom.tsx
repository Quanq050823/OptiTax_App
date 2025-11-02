import {
  ColorMain,
  iconNavigationColor,
} from "@/src/presentation/components/colors";
import { TabType } from "@/src/types/route";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { JSX, useMemo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface NavigationBottomProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}

const NavigationBottom: React.FC<NavigationBottomProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { width } = Dimensions.get("window");
  const TAB_COUNT = 4;
  const TAB_WIDTH = width / TAB_COUNT;

  const itemNavigate: {
    name: TabType;
    icon: (focused: boolean) => JSX.Element;
  }[] = useMemo(
    () => [
      {
        name: "Trang chủ",
        icon: (focused) => (
          <AntDesign
            name="home"
            size={24}
            color={focused ? "#fff" : "#676767ff"}
          />
        ),
      },
      {
        name: "Tiện ích",
        icon: (focused) => (
          <Ionicons
            name="apps-sharp"
            size={24}
            color={focused ? "#fff" : "#676767ff"}
          />
        ),
      },
      {
        name: "Thông báo",
        icon: (focused) => (
          <Ionicons
            name="notifications"
            size={24}
            color={focused ? "#fff" : "#676767ff"}
          />
        ),
      },
      {
        name: "Tuỳ chọn",
        icon: (focused) => (
          <FontAwesome
            name="user"
            size={24}
            color={focused ? "#fff" : "#676767ff"}
          />
        ),
      },
    ],
    []
  );

  // Dùng reanimated để di chuyển nền
  const activeIndex = useSharedValue(
    itemNavigate.findIndex((i) => i.name === activeTab)
  );

  const animatedIndicator = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(activeIndex.value * TAB_WIDTH, {
          duration: 300,
        }),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.ItemWrapper}>
        {/* Nền di chuyển dưới icon */}
        <Animated.View
          style={[
            styles.indicator,
            { width: TAB_WIDTH - 20, backgroundColor: ColorMain },
            animatedIndicator,
          ]}
        />

        {itemNavigate.map((item, idx) => {
          const focused = activeTab === item.name;

          return (
            <TouchableOpacity
              key={item.name}
              style={styles.tabItem}
              onPress={() => {
                setActiveTab(item.name as TabType);
                activeIndex.value = idx;
              }}
            >
              {item.icon(focused)}
              <Text
                style={[
                  styles.label,
                  { color: focused ? "#fff" : "#313131ff" },
                  focused && styles.focusedLabel,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 90,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    elevation: 5,
    borderRadius: 30,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  ItemWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
  },
  tabItem: {
    width: Dimensions.get("window").width / 4,
    alignItems: "center",
    gap: 0,
    zIndex: 2,
    paddingTop: 15,
  },
  label: {
    fontSize: 11,
  },
  focusedLabel: {
    fontWeight: "800",
  },
  indicator: {
    position: "absolute",
    height: 50,
    borderRadius: 30,
    left: 10,
    top: 10,
    zIndex: 1,
  },
});

export default NavigationBottom;
