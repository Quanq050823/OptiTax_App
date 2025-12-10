// import Province from "@/src/presentation/components/Auth/Province/Province";
import Province from "@/src/presentation/components/Auth/Province/Province";
import { ColorMain } from "@/src/presentation/components/colors";
import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityIndicator } from "react-native-paper";
import TaxEON from "@/src/presentation/components/TagEON";
import { LinearGradient } from "expo-linear-gradient";

const mockAccountants = [
  {
    id: 1,
    name: "Hồ Phát Đạt",
    phone: "0901234567",
    address: "123 Trần Hưng Đạo, Quận 1, Thành phố Hồ Chí Minh",
  },
  {
    id: 2,
    name: "Phạm Hà",
    phone: "0912345678",
    address: "45 Hai Bà Trưng, Quận Hải Châu, Thành phố Đà Nẵng",
  },
  {
    id: 3,
    name: "Nguyễn Thế Khang",
    phone: "0987654321",
    address: "10 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  },
  {
    id: 4,
    name: "Trần Đức Quang",
    phone: "0939999999",
    address: "99 Lý Thường Kiệt, Hà Nội",
  },
];

const ratingAcc = () => {
  return (
    <LinearGradient
      colors={["#c1c426ff", "#f0ee76ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 3 }}
      style={{
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 5,
        borderRadius: 5,
        position: "absolute",
        alignSelf: "center",
        bottom: 0,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>
        4.5/5
      </Text>
    </LinearGradient>
  );
};
function SearchAccountantScreen() {
  const [filteredList, setFilteredList] = useState(mockAccountants);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Tìm kiếm kế toán"
            placeholderTextColor={"#9d9d9d"}
            style={styles.inputSearch}
          />
          <Feather
            name="search"
            size={20}
            color="#9d9d9d"
            style={{ position: "absolute", right: 10, top: 7 }}
          />
        </View>
        <View style={styles.wrListAcc}>
          <View style={{ paddingHorizontal: 10 }}>
            <Text
              style={{ fontSize: 17, fontWeight: "700", color: "#7a7a7aff" }}
            >
              Đề xuất
            </Text>
          </View>
          <FlatList
            data={filteredList}
            keyExtractor={(item) => item.id.toString()}
            style={{ marginTop: 20 }}
            renderItem={({ item }) => (
              <View>
                <View
                  style={{
                    paddingVertical: 12,
                    margin: 8,
                    borderRadius: 8,
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <View style={{ position: "relative" }}>
                      <Image
                        source={require("@/assets/images/boy.png")}
                        style={{ width: 60, height: 60 }}
                      />
                      {ratingAcc()}
                    </View>
                  </View>
                  <View style={{ flex: 3, gap: 5 }}>
                    <View style={{ flexDirection: "row", gap: 7 }}>
                      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                      <TaxEON text="EON" />
                    </View>
                    <Text>{item.phone}</Text>
                    <Text>{item.address}</Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",

                      paddingRight: 10,
                    }}
                  >
                    <TouchableOpacity style={styles.btnConnect}>
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: 12,
                        }}
                      >
                        Kết nối
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    width: "90%",
                    borderBottomWidth: 0.5,
                    borderColor: "#9d9d9d",
                    alignSelf: "center",
                  }}
                />
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrListAcc: {
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    backgroundColor: "#fff",
    marginTop: 20,
    borderRadius: 15,
    paddingVertical: 10,
  },
  container: {
    flex: 1,

    backgroundColor: "#fff",
  },
  searchWrapper: {
    width: "100%",
    backgroundColor: "#f7f7f7ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 15,
    flex: 1,
  },
  inputSearch: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
  },
  btnConnect: {
    backgroundColor: "#4dbbbfff",
    padding: 10,
    borderRadius: 10,
  },
});
export default SearchAccountantScreen;
