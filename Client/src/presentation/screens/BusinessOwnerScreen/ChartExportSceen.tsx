import { ColorMain } from "@/src/presentation/components/colors";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

function ChartExport() {
  const screenWidth = Dimensions.get("window").width;
  const dataPriceMouth = [
    2000, 4500, 2800, 8000, 9900, 4300, 5500, 6000, 1000, 7800, 1200, 3000,
  ];

  const totalPriceYear = dataPriceMouth.reduce((sum, value) => sum + value, 0);

  const dataInvoice = [20, 45, 28, 80, 99];

  const formattedTotal = totalPriceYear
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const totalInvoiceYear = dataInvoice.reduce((sum, value) => sum + value, 0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const translateY = useRef(new Animated.Value(50)).current;
  const fade2 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(50)).current;
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
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
              yAxisLabel="" // ✅ thêm dòng này
              yAxisSuffix="đ" // ✅ hoặc "%" hay "k" tuỳ ý
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
      </ScrollView>
    </View>
  );
}

export default ChartExport;
