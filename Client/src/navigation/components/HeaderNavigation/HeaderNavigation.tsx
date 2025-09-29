import { ColorMain } from "@/src/presentation/components/colors";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Platform, Pressable, Text, View } from "react-native";

const HeaderNavigation: React.FC<NativeStackHeaderProps> = (props) => {
  return (
    <View
      style={{
        height: Platform.OS === "ios" ? 100 : 60, // ✅ Chiều cao tùy ý
        backgroundColor: ColorMain,
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
    </View>
  );
};

export default HeaderNavigation;
