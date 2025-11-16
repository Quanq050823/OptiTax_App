import { ColorMain } from "@/src/presentation/components/colors";
import NewIngredientButton from "@/src/presentation/components/NewIngredientButton";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
import { LinearGradient } from "expo-linear-gradient";

import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type HeaderProps = {
  activeTab: string;
};
function HeaderScreen({ activeTab }: HeaderProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = useData();
  const isHome = activeTab === "Trang chủ";
  const [hasShadow, setHasShadow] = React.useState(false);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setHasShadow(scrollY > 5); // Nếu cuộn xuống hơn 5px thì bật shadow
  };
  return (
    <LinearGradient
      colors={isHome ? ["#fff", "#fff"] : [ColorMain, "#6A7DB3"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 3 }}
      style={[
        isHome && {
          borderBottomWidth: 0.2,
          borderColor: "#ccccccff",
        },
        {
          shadowColor: ColorMain,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 10,
          shadowRadius: 5,
          elevation: 6,
        },
      ]}
    >
      <View style={[styleHeader.container]}>
        {/* <View style={{ alignItems: "center" }}>
        <Image
          source={require("@/assets/images/icon_header.png")}
          style={{ width: 150, height: 70, resizeMode: "contain" }}
        />
      </View> */}
        <View>
          <Text style={[styleHeader.name, !isHome && { color: "#fff" }]}>
            <FontAwesome
              name="user-circle-o"
              size={20}
              color={isHome ? ColorMain : "#fff"}
            />
            &nbsp;
            {data?.businessName}
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <TouchableOpacity style={{ position: "relative" }}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={isHome ? ColorMain : "#fff"}
            />
            <NewIngredientButton quantity={1} width={15} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={{}}>
            <Ionicons
              name="menu"
              size={27}
              color={isHome ? ColorMain : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}
const styleHeader = StyleSheet.create({
  container: {
    height: Platform.OS === "ios" ? 100 : 80,
    paddingTop: Platform.OS === "ios" ? 50 : 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",

    zIndex: 100,
    justifyContent: "space-between",
    // backgroundColor: ColorMain,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: ColorMain,
  },
});

export default HeaderScreen;
