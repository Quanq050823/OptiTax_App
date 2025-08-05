import { ColorMain } from "@/src/presentation/components/colors";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import * as React from "react";

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function SettingScreen() {
  const navigation = useAppNavigation();
  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("StoreInformationScreen")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="shop" size={20} color={ColorMain} />

            <Text style={styles.text}>Thông tin cửa hàng</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={ColorMain}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("ProfileBusiness")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome5 name="user-alt" size={20} color={ColorMain} />

            <Text style={styles.text}>Thông tin tài khoản</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={ColorMain}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("LanguagesScreen")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="language" size={20} color={ColorMain} />
            <Text style={styles.text}>Thiết lập ngôn ngữ</Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color={ColorMain}
          />
        </TouchableOpacity>
      </ScreenContainer>
    </View>
  );
}
const styles = StyleSheet.create({
  item: {
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    shadowColor: "#545454ff",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: ColorMain,
    marginLeft: 10,
  },
});

export default SettingScreen;
