import { ColorMain } from "@/src/presentation/components/colors";
import ModalSyncDashBoard from "@/src/presentation/components/Modal/ModalSyncDashBoard";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Dimensions,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Easing,
  TouchableHighlight,
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
  const [visiSync, setVisiSync] = useState(false);
  const dataPriceMouth = [
    2000, 4500, 2800, 8000, 9900, 4300, 5500, 6000, 1000, 7800, 1200, 3000,
  ];
  const totalPriceYear = dataPriceMouth.reduce((sum, value) => sum + value, 0);
  const formattedTotal = totalPriceYear
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const dataInvoice = [20, 45, 28, 80, 99];
  const totalInvoiceYear = dataInvoice.reduce((sum, value) => sum + value, 0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  const fade2 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(50)).current;

  const spinValue = useRef(new Animated.Value(0)).current;
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Hiệu ứng khi vào trang
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(fade2, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY2, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animation quay vòng
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const startSync = () => {
    setIsUpdating(true);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000, // quay 3 giây
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      spinValue.setValue(0);
      setIsUpdating(false);
    });
    setVisiSync(true);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ModalSyncDashBoard visible={visiSync} setVisible={setVisiSync} />
      <View style={{ marginTop: 20, width: "100%" }}>
        {/* Nút đồng bộ */}
        <View style={styles.syncWr}>
          {/* Nút đồng bộ */}
          <TouchableOpacity onPress={startSync} activeOpacity={0.8}>
            <Animated.View
              style={[styles.syncButton, { transform: [{ rotate: spin }] }]}
            >
              <AntDesign name="sync" size={36} color="#fff" />
            </Animated.View>
          </TouchableOpacity>

          {/* Text hướng dẫn nhỏ */}
          <Text style={styles.syncHint}>
            {isUpdating ? "Đang đồng bộ dữ liệu..." : "Nhấn để đồng bộ dữ liệu"}
          </Text>

          {/* Khu vực tổng hợp thuế */}
          <View style={styles.taxContainer}>
            <View style={[styles.taxCard, { backgroundColor: "#dae7ffff" }]}>
              <Text style={styles.taxLabel}>Thuế GTGT</Text>
              <Text style={styles.taxValue}>
                {isUpdating ? "..." : "1.000.000 đ"}
              </Text>
            </View>

            <View style={[styles.taxCard, { backgroundColor: "#d8f7e1ff" }]}>
              <Text style={styles.taxLabel}>Thuế TNCN</Text>
              <Text style={styles.taxValue}>
                {isUpdating ? "..." : "1.402.000 đ"}
              </Text>
            </View>

            <View style={[styles.taxCard, { backgroundColor: "#FFF4E5" }]}>
              <Text style={styles.taxLabel}>TỔNG</Text>
              <Text style={[styles.taxValue, { color: "#FF7B00" }]}>
                {isUpdating ? "..." : "2.000.000 đ"}
              </Text>
            </View>
          </View>
        </View>
        {/* Hạn nộp tờ khai */}
        <View style={styles.deadlineCard}>
          <View style={styles.deadlineLeft}>
            <Text style={styles.deadlineLabel}>Hạn nộp tờ khai tháng 10</Text>
            <Text style={styles.deadlineDate}>20 / 11 / 2025</Text>
          </View>
          <View style={styles.deadlineStatusBox}>
            {/* <AntDesign name="clock-circle" size={14} color="#000" /> */}
            <View
              style={{
                position: "absolute",
                height: 30,
                borderWidth: 0.3,
                left: -10,
                borderColor: "#bebebeff",
              }}
            />
            <Text style={styles.deadlineStatus}>
              <Text
                style={{ fontSize: 40, color: "#FF7B00", fontWeight: "600" }}
              >
                7
              </Text>
              ngày
            </Text>
          </View>
          {/* <TouchableOpacity style={styles.deadlineBtn} activeOpacity={0.8}>
            <Text style={styles.deadlineBtnText}>Xem chi tiết</Text>
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity style={styles.btnShow}>
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
            Tờ khai 04 / CNKD &nbsp;
            <AntDesign name="folder-open" size={17} color="#fff" />
          </Text>
        </TouchableOpacity>
        {/* Line Chart */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY }] }}
        >
          <View
            style={{
              marginBottom: 50,
              marginTop: 50,
              shadowColor: "#eaeaeaff",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 6,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                color: ColorMain,
                marginLeft: 16,
              }}
            >
              Tổng doanh thu (2025)
            </Text>
            <LineChart
              data={{
                labels: [
                  "T1",
                  "T2",
                  "T3",
                  "T4",
                  "T5",
                  "T7",
                  "T8",
                  "T9",
                  "T10",
                  "T11",
                  "T12",
                ],
                datasets: [{ data: dataPriceMouth }],
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: ColorMain,
                backgroundGradientFrom: ColorMain,
                backgroundGradientTo: "#6A7DB3",
                color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              }}
              formatYLabel={(value) =>
                parseInt(value)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "tr"
              }
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 12,
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                fontWeight: "600",
                fontSize: 27,
                textAlign: "center",
                color: ColorMain,
              }}
            >
              {formattedTotal}.000 VND
            </Text>
          </View>
        </Animated.View>

        {/* Bar Chart */}
        <Animated.View
          style={{ opacity: fade2, transform: [{ translateY: translateY2 }] }}
        >
          <View style={{ marginBottom: 50 }}>
            <Text
              style={{
                fontWeight: "600",
                fontSize: 16,
                color: ColorMain,
                marginLeft: 16,
              }}
            >
              Hoá đơn
            </Text>
            <BarChart
              data={{
                labels: ["T1", "T2", "T3", "T4", "T5"],
                datasets: [{ data: dataInvoice }],
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: ColorMain,
                backgroundGradientFrom: ColorMain,
                backgroundGradientTo: "#6A7DB3",
                color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 12,
                alignSelf: "center",
              }}
            />
            <Text
              style={{
                fontWeight: "600",
                fontSize: 18,
                textAlign: "center",
                color: ColorMain,
              }}
            >
              Số hoá đơn (2025) / {totalInvoiceYear}
            </Text>
          </View>
        </Animated.View>

        {/* Pie Chart */}
        <View style={{ width: "100%", alignItems: "center", marginBottom: 80 }}>
          <Text style={{ marginLeft: 16, fontWeight: "600" }}>
            Tỉ lệ dịch vụ
          </Text>
          <PieChart
            data={[
              {
                name: "Chữ ký số",
                population: 215,
                color: ColorMain,
                legendFontColor: "#333",
                legendFontSize: 14,
              },
              {
                name: "Hoá đơn",
                population: 280,
                color: "#58d7b5ff",
                legendFontColor: "#333",
                legendFontSize: 14,
              },
              {
                name: "Khác",
                population: 120,
                color: "#93ffe9ff",
                legendFontColor: "#333",
                legendFontSize: 14,
              },
            ]}
            width={screenWidth}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="16"
            absolute
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  syncWr: {
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  syncButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: ColorMain,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  syncHint: {
    marginTop: 12,
    color: "#777",
    fontSize: 14,
  },
  taxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
  },
  taxCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  taxLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  taxValue: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  deadlineCard: {
    width: "95%",
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 30,
    // shadowColor: "#9d9d9d",
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 3,
    // elevation: 4,
    borderWidth: 0.5,
    borderColor: ColorMain,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deadlineLeft: {
    flex: 3,
  },
  deadlineLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  deadlineDate: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FF7B00",
    marginTop: 4,
  },
  deadlineStatusBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    flex: 1,
    position: "relative",
    alignContent: "center",
    justifyContent: "center",
  },
  deadlineStatus: {
    marginLeft: 5,
    color: "#000",
    fontWeight: "500",
    fontSize: 14,
  },
  deadlineBtn: {
    backgroundColor: ColorMain,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  deadlineBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  btnShow: {
    width: "95%",
    backgroundColor: ColorMain,
    marginTop: 30,
    alignSelf: "center",
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
