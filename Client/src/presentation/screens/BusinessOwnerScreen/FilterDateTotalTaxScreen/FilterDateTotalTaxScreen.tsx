import { ColorMain } from "@/src/presentation/components/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";

const getDateRange = (type: string) => {
  const now = new Date();
  let from: Date;
  let to: Date = new Date();

  switch (type) {
    case "today":
      from = new Date(now.setHours(0, 0, 0, 0));
      to = new Date();
      break;

    case "yesterday":
      from = new Date();
      from.setDate(from.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      to = new Date(from);
      to.setHours(23, 59, 59, 999);
      break;

    case "week":
      const day = now.getDay() || 7;
      from = new Date(now);
      from.setDate(now.getDate() - day + 1);
      from.setHours(0, 0, 0, 0);
      break;

    case "month":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;

    case "quarter":
      const quarter = Math.floor(now.getMonth() / 3);
      from = new Date(now.getFullYear(), quarter * 3, 1);
      to = new Date(now.getFullYear(), quarter * 3 + 3, 0);
      break;

    case "year":
      from = new Date(now.getFullYear(), 0, 1);
      to = new Date(now.getFullYear(), 11, 31);
      break;

    default:
      return { from: null, to: null };
  }

  return { from, to };
};
const formatDate = (date: Date | null) =>
  date ? `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}` : "";

function FilterDateTotalTaxScreen() {
  const featuresDate = [
    { label: "Hôm nay", key: "today" },
    { label: "Hôm qua", key: "yesterday" },
    { label: "Tuần này", key: "week" },
    { label: "Tháng này", key: "month" },
    { label: "Quý này", key: "quarter" },
    { label: "Năm nay", key: "year" },
    { label: "Tất cả", key: "all" },
  ];

  const [selected, setSelected] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  return (
    <View style={{ flex: 1, paddingVertical: 10 }}>
      <View style={styles.wrField}>
        <Text style={{ fontWeight: "500", color: "#696969ff" }}>Thời gian</Text>
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 20,
            marginTop: 10,
          }}
        >
          {featuresDate.map((item, index) => {
            const isActive = selected === index;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelected(index);

                  if (item.key === "all") {
                    setFromDate(null);
                    setToDate(null);
                    return;
                  }

                  const { from, to } = getDateRange(item.key);
                  setFromDate(from);
                  setToDate(to);
                }}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  borderWidth: 0.5,
                  borderColor: isActive ? "#fff" : "#9d9d9d",
                  backgroundColor: isActive ? "#059e91b6" : "#fff",
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    color: isActive ? "#fff" : "#696969ff",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.wrField}>
        <Text style={{ fontWeight: "500", color: "#696969ff" }}>
          Lựa chọn chi tiết
        </Text>
        <View
          style={{
            marginTop: 20,
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            value={formatDate(fromDate)}
            placeholder="Từ ngày"
            contentStyle={{ backgroundColor: "transparent" }}
            style={{ backgroundColor: "transparent", flex: 1 }}
            underlineColor="#9d9d9d"
            activeUnderlineColor="#1d9bacff"
          />
          <TouchableOpacity style={{ position: "absolute", right: 20 }}>
            <FontAwesome5 name="calendar-alt" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            value={formatDate(toDate)}
            placeholder="Đến ngày"
            contentStyle={{ backgroundColor: "transparent" }}
            style={{ backgroundColor: "transparent", flex: 1 }}
            underlineColor="#9d9d9d"
            activeUnderlineColor="#1d9bacff"
          />
          <TouchableOpacity style={{ position: "absolute", right: 20 }}>
            <FontAwesome5 name="calendar-alt" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={[ColorMain, "#6A7DB3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 3 }}
          style={{
            borderRadius: 5,
            flexDirection: "row",
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center", padding: 15 }}
          >
            <Text style={{ color: "#fff", fontWeight: "500", fontSize: 15 }}>
              Lưu lại
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrField: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,
  },
});

export default FilterDateTotalTaxScreen;
