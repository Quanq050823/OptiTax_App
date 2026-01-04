import { ColorMain } from "@/src/presentation/components/colors";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HeaderNavigation: React.FC<NativeStackHeaderProps> = (props) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={{
          paddingTop: Platform.OS === "android" ? insets.top : 0,
        }}
      ></View>
      <LinearGradient
        colors={["#4dbf99ff", "#6A7DB3"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 3 }}
        style={{
          height: Platform.OS === "ios" ? 100 : 60, // ✅ Chiều cao tùy ý
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          position: "relative",
          paddingTop: Platform.OS === "ios" ? 50 : 0,
        }}
      >
        <Pressable
          onPress={() => props.navigation.goBack()}
          style={{
            position: "absolute",
            left: 15,

            bottom: Platform.OS === "ios" ? 15 : 15,
            zIndex: 10,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
            color: "#fff",
          }}
        >
          {props.options.title || props.route.name}
        </Text>
      </LinearGradient>
    </>
  );
};

export default HeaderNavigation;
