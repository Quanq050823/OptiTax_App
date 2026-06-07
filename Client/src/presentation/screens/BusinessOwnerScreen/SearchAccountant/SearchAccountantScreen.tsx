import { ColorMain } from "@/src/presentation/components/colors";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function SearchAccountantScreen() {
  const [searchText, setSearchText] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Tìm kiếm kế toán"
            placeholderTextColor={"#9d9d9d"}
            style={styles.inputSearch}
            value={searchText}
            onChangeText={setSearchText}
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
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Feather name="users" size={24} color={ColorMain} />
            </View>
            <Text style={styles.emptyTitle}>Chưa có kế toán viên đề xuất</Text>
            <Text style={styles.emptyDescription}>
              Danh sách sẽ hiển thị khi hệ thống có dữ liệu kế toán viên phù hợp
              với khu vực và nhu cầu của cửa hàng.
            </Text>
          </View>
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
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#eef8f7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  emptyDescription: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#777",
    textAlign: "center",
  },
});
export default SearchAccountantScreen;
