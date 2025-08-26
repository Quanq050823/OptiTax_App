import { ColorMain } from "@/src/presentation/components/colors";
import React, { useEffect, useRef } from "react";
import { ScrollView, Text, View, Dimensions, Animated } from "react-native";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Analytics() {
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

  useEffect(() => {
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

    // Chart 2 có độ trễ
    Animated.parallel([
      Animated.timing(fade2, {
        toValue: 1,
        duration: 800,
        delay: 200, // 👈 delay 0.5s
        useNativeDriver: true,
      }),
      Animated.timing(translateY2, {
        toValue: 0,
        duration: 800,
        delay: 200, // 👈 delay 0.5s
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  return (
    <ScrollView>
      <View style={{ backgroundColor: "#fff", marginTop: 20, width: "100%" }}>
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY }] }}
        >
          <View
            style={{
              marginBottom: 50,
              marginTop: 20,
              shadowColor: "#eaeaeaff",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 6,
            }}
          >
            {/* Line Chart */}
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
                datasets: [
                  {
                    data: dataPriceMouth,
                  },
                ],
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: "#3F4E87",
                backgroundGradientFrom: "#3F4E87",
                backgroundGradientTo: "#6A7DB3",
                color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              }}
              formatYLabel={
                (value) =>
                  parseInt(value)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "tr" // 👈 thêm dấu chấm
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
        <Animated.View
          style={{ opacity: fade2, transform: [{ translateY: translateY2 }] }}
        >
          <View style={{ marginBottom: 50 }}>
            {/* Bar Chart */}
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
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: "#3F4E87",
                backgroundGradientFrom: "#3F4E87",
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
        <View style={{ width: "100%", alignItems: "center" }}>
          {/* Pie Chart */}
          <Text style={{ marginLeft: 16, fontWeight: "600" }}>
            Tỉ lệ dịch vụ
          </Text>
          <PieChart
            data={[
              {
                name: "Chữ ký số",
                population: 215,
                color: "#3F4E87",
                legendFontColor: "#333",
                legendFontSize: 14,
              },
              {
                name: "Hoá đơn",
                population: 280,
                color: "#6A7DB3",
                legendFontColor: "#333",
                legendFontSize: 14,
              },
              {
                name: "Khác",
                population: 120,
                color: "#A9B7D9",
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
