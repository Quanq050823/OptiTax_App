import { ColorMain } from "@/src/presentation/components/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

function HeaderScreen() {
  const navigation = useNavigation();

  return (
    <View style={styleHeader.container}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={{}}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={{ alignItems: "center" }}>
        <Image
          source={{
            uri: "https://www.ncodetechnologies.com/images/icons/react-native-icn(512x512).png",
          }}
          style={{ width: 150, height: 50, resizeMode: "contain" }}
        />
      </View>
      <TouchableOpacity>
        <AntDesign name="message1" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
const styleHeader = StyleSheet.create({
  container: {
    height: 110,
    paddingTop: Platform.OS === "ios" ? 50 : 50,
    width: "100%",
    backgroundColor: ColorMain,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 6,
    zIndex: 1,
    justifyContent: "space-between",
  },
});

export default HeaderScreen;
