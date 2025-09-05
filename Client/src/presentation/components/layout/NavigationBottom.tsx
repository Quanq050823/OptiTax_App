import { iconNavigationColor } from "@/src/presentation/components/colors";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { JSX, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface NavigationBottomProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}

const NavigationBottom: React.FC<NavigationBottomProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const colorFocus = (name: string) => {
    if (activeTab === name) {
      return iconNavigationColor;
    } else {
      return "#9d9d9d";
    }
  };
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
            color={focused ? iconNavigationColor : "#9d9d9d"}
          />
        ),
      },
      {
        name: "Tiện ích",
        icon: (focused) => (
          <AntDesign
            name="appstore1"
            size={24}
            color={focused ? iconNavigationColor : "#9d9d9d"}
          />
        ),
      },

      {
        name: "Thông báo",
        icon: (focused) => (
          <Ionicons
            name="notifications"
            size={24}
            color={focused ? iconNavigationColor : "#9d9d9d"}
          />
        ),
      },
      {
        name: "Tuỳ chọn",
        icon: (focused) => (
          <FontAwesome
            name="user"
            size={24}
            color={focused ? iconNavigationColor : "#9d9d9d"}
          />
        ),
      },
    ],
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.ItemWrapper}>
        {itemNavigate.map((item, idx) => {
          const focused = activeTab === item.name;

          return (
            <TouchableOpacity
              key={item.name}
              style={{ alignItems: "center", width: "20%" }}
              onPress={() => setActiveTab(item.name as TabType)}
            >
              {item.icon(focused)}
              <Text
                style={[
                  { color: colorFocus(item.name), marginTop: 3, fontSize: 11 },
                  focused && {
                    textShadowColor: iconNavigationColor,
                    // textShadowOffset: { width: 0, height: 0 },
                    // textShadowRadius: 2,
                    fontWeight: 800,
                  },
                ]}
              >
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* <TouchableOpacity
        style={{ alignItems: "center", width: "20%" }}
        onPress={() => setActiveTab("invoice")}
      >
        <FontAwesome
          name="file-text-o"
          size={24}
          color={colorFocus("invoice")}
        />
        <Text style={{ color: colorFocus("invoice") }}>Invoice</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ alignItems: "center", width: "20%" }}
        onPress={() => setActiveTab("about")}
      >
        <FontAwesome
          name="file-text-o"
          size={24}
          color={colorFocus("about")}
        />
        <Text>About</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: "center", width: "20%" }}>
        <AntDesign name="home" size={24} color="black" />
        <Text>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ alignItems: "center", width: "20%" }}>
        <AntDesign name="home" size={24} color="black" />
        <Text>Hoá đơn</Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 80,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    elevation: 5,
  },
  ItemWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
export default NavigationBottom;
