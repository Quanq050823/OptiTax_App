import { Ionicons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Pressable, Text, View } from "react-native";

const HeaderNavigation: React.FC<NativeStackHeaderProps> = (props) => {
  return (
    <View
      style={{
        height: 100, // ✅ Chiều cao tùy ý
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        position: "relative",
        paddingTop: 50,
      }}
    >
      <Pressable
        onPress={() => props.navigation.goBack()}
        style={{
          position: "absolute",
          left: 15,

          bottom: 15,
          zIndex: 10,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          flex: 1,
          textAlign: "center",
        }}
      >
        {props.options.title || props.route.name}
      </Text>
    </View>
  );
};

export default HeaderNavigation;
