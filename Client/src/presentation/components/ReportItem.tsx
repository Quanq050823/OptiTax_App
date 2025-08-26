import { ColorMain } from "@/src/presentation/components/colors";
import { FlatList, StyleSheet, Text, View } from "react-native";

function ReportItem() {
  const dataItem = [
    {
      id: 1,
      title: "Cơ hội đang thực hiện",
      sales: "325",
      beforeMouthSales: "300 triệu",
      backgroundColor: ColorMain,
    },
    {
      id: 2,
      title: "Doanh số đã thực hiện",
      sales: "359 Triệu",
      beforeMouthSales: "480 triệu",
      backgroundColor: "#059d75ff",
    },
    {
      id: 3,
      title: "Doanh số vọng (còn lại)",
      sales: "590",
      beforeMouthSales: "700 triệu",
      backgroundColor: "#e46a1eff",
    },
    {
      id: 4,
      title: "Tỷ lệ hoàn tất",
      sales: "325",
      beforeMouthSales: "69,44 %",
      backgroundColor: ColorMain,
    },
  ];

  const renderItem = ({ item }: any) => (
    <View
      style={[styles.itemWrapper, { backgroundColor: item.backgroundColor }]}
    >
      <Text style={styles.text}>{item.title}</Text>
      <Text style={[styles.text, { fontSize: 18, fontWeight: "700" }]}>
        {item.sales}
      </Text>
      <Text style={[styles.text, { fontSize: 14, fontWeight: "500" }]}>
        Tháng trước: {item.beforeMouthSales}
      </Text>
    </View>
  );
  return (
    <View>
      <FlatList
        data={dataItem}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // 👈 hiển thị 2 cột
        contentContainerStyle={{ padding: 8 }}
        scrollEnabled={false} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    minHeight: 100,
    flex: 1,
    margin: 5,
    borderRadius: 12,
    padding: 8,
    justifyContent: "space-between",
  },
  text: {
    color: "#fff",
  },
});
export default ReportItem;
