import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";

function Option() {
  const navigate = useAppNavigation();
  return (
    <View style={{ flex: 1, width: "100%" }}>
      {/* <HeaderScreen /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: "#f7f7f7ff",
          paddingHorizontal: 5,
        }}
      >
        <View>
          <View style={styles.UserWrapper}>
            <Avatar.Image
              size={70}
              source={{ uri: "https://i.pravatar.cc/100" }}
            />
            <Text style={styles.name}>Tú 230</Text>
            <Text style={styles.role}>Hộ kinh doanh</Text>
            <TouchableOpacity
              style={styles.actionProfile}
              onPress={() => navigate.navigate("ProfileBusiness")}
            >
              <Text style={{ fontWeight: 500 }}>Xem trang cá nhân</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.titleItem}>Quản lý hoá đơn</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={colorText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigate.navigate("ProductManager")}
          >
            <Text style={styles.titleItem}>Quản lý sản phẩm</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={colorText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigate.navigate("ProductManager")}
          >
            <Text style={styles.titleItem}>Quản lý khách hàng</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={colorText}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.titleItem}>Cài đặt</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={colorText}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const colorText = "#585858ff";
const styles = StyleSheet.create({
  UserWrapper: {
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 8,
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    color: colorText,
    fontWeight: 600,
  },
  role: {
    fontSize: 13,
    color: colorText,
  },
  actionProfile: {
    backgroundColor: "#e7e7e7ff",
    marginTop: 20,
    padding: 5,
    borderRadius: 5,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#a7a7a7ff",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 7,
  },
  titleItem: { fontSize: 15, color: colorText, fontWeight: "500" },
});
export default Option;
