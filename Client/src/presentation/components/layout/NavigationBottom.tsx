import {
  ColorMain,
  iconNavigationColor,
  textColorMain,
} from "@/src/presentation/components/colors";
import NewIngredientButton from "@/src/presentation/components/NewIngredientButton";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { TabType } from "@/src/types/route";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import React, { JSX, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from "react-native";
import { he } from "react-native-paper-dates";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import ShimmerSweep from "../ShimmerSweep";
import { useColors } from "../../Hooks/useColor";
import { useTheme } from "../../Hooks/useTheme";

interface NavigationBottomProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}

const NavigationBottom: React.FC<NavigationBottomProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { width } = Dimensions.get("window");
  const insets = useSafeAreaInsets();
  const TAB_COUNT = 5;
  const TAB_WIDTH = width / TAB_COUNT;
  const [hdrSize, setHdrSize] = useState({ w: 0, h: 0 });
  const { isDark } = useTheme();

  const colors = useColors();
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
            color={
              focused ? ColorMain : isDark ? colors.iconNaviBot : "#676767ff"
            }
          />
        ),
      },
      {
        name: "Tiện ích",
        icon: (focused) => (
          <Ionicons
            name="apps-sharp"
            size={24}
            color={
              focused ? ColorMain : isDark ? colors.iconNaviBot : "#676767ff"
            }
          />
        ),
      },
      {
        name: "Xuất HĐ",
        icon: (focused) => (
          <View
            style={{
              position: "relative",
              width: 24,
              height: 25,
            }}
          >
            <View
              style={{
                position: "absolute",
                top: -50, // nổi lên
                left: "50%",
                transform: [{ translateX: -35 }], // luôn căn giữa
                width: 70,
                height: 70,
                backgroundColor: ColorMain,
                borderRadius: 50,
                borderColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
                borderWidth: 3,
              }}
            >
              <LottieView
                source={require("@/assets/animation/export invoice icon.json")}
                autoPlay
                loop
                style={{ width: 50, height: 50 }}
              />
            </View>
          </View>
        ),
      },
      {
        name: "Thông báo",
        icon: (focused) => (
          <Ionicons
            name="notifications"
            size={24}
            color={
              focused ? ColorMain : isDark ? colors.iconNaviBot : "#676767ff"
            }
          />
        ),
        NewIngredientButton: <NewIngredientButton width={20} quantity={3} />,
      },
      {
        name: "Tuỳ chọn",
        icon: (focused) => (
          <FontAwesome
            name="user"
            size={24}
            color={
              focused ? ColorMain : isDark ? colors.iconNaviBot : "#676767ff"
            }
          />
        ),
      },
    ],
    [isDark, colors]
  );

  const navigation = useAppNavigation();
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
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.textDark,
          height: 80 + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          bottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View style={styles.ItemWrapper}>
        {/* Nền di chuyển dưới icon */}
        {/* <Animated.View
          style={[
            styles.indicator,
            { width: TAB_WIDTH * 0.87, backgroundColor: ColorMain },
            animatedIndicator,
          ]}
        /> */}

        {itemNavigate.map((item, idx) => {
          const focused = activeTab === item.name;

          return (
            <TouchableOpacity
              key={item.name}
              style={styles.tabItem}
              onPress={() => {
                if (item.name === "Xuất HĐ") {
                  navigation.navigate("ExportInvoicePayment"); // 👈 thay bằng tên screen thật của bạn
                  return;
                }

                setActiveTab(item.name as TabType);
                activeIndex.value = idx;
              }}
            >
              {item.icon(focused)}
              <Text
                style={[
                  styles.label,
                  {
                    color: focused
                      ? ColorMain
                      : isDark
                      ? colors.iconNaviBot
                      : "#676767ff",
                  },
                  focused && styles.focusedLabel,
                  item.name === "Xuất HĐ" && {
                    fontWeight: "700",
                    color: textColorMain,
                  }, // ✅ thêm dòng này
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
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    elevation: 5,
    borderRadius: 30,
    position: "absolute",
    alignSelf: "center",
    paddingTop: 6,
  },
  ItemWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "relative",
  },
  tabItem: {
    width: Dimensions.get("window").width / 5,
    alignItems: "center",
    gap: 0,
    zIndex: 2,
    paddingTop: 12,
    justifyContent: "center",
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
    borderRadius: 20,
    left: 5,
    top: 10,
    zIndex: 1,
  },
});

export default NavigationBottom;
