import { ColorMain } from "@/src/presentation/components/colors";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Searchbar, shadow } from "react-native-paper";

function CustomerManagerScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
      <View style={styles.shadow}>
        <Searchbar
          placeholder="Tìm kiếm khách hàng"
          onChangeText={setSearchQuery}
          value={searchQuery}
          icon="magnify"
          style={{ backgroundColor: "#fff" }}
          iconColor={ColorMain}
          placeholderTextColor={ColorMain}
        />
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{
              height: "100%",
              paddingVertical: 10,
            }}
          >
            <Image
              source={{
                uri: "https://www.okoone.com/wp-content/uploads/2024/06/React-native-2-logo.png",
                width: 70,
                height: 70,
              }}
              style={{ backgroundColor: "#e5e5e5ff", borderRadius: "50%" }}
            />
          </View>
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              flex: 1,
            }}
          >
            <View>
              <Text style={styles.nameCustomer}>Nguyễn Văn A</Text>
            </View>
            <View>
              <Text style={styles.text}>0987654321</Text>
              <Text style={styles.text}>
                Man Thiện, Tăng Nhơn Phú A, Thành phố Thủ Đức
              </Text>
            </View>
            <View style={styles.nickname}>
              <Text style={{ color: "#fff" }}>Thành viên</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: ColorMain,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 3 },
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    height: 150,
  },
  shadow: {
    shadowColor: ColorMain,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 1 },
  },
  nameCustomer: { fontSize: 15, fontWeight: "700" },
  text: {
    color: "#6c6c6cff",
    marginTop: 5,
  },
  nickname: {
    padding: 5,
    backgroundColor: ColorMain,
    width: 100,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default CustomerManagerScreen;
