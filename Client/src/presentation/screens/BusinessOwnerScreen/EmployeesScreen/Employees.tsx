import { getEmployeeList } from "@/src/services/API/employeeService";
import { Employee } from "@/src/types/employees";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";

function EmployeesScreen() {
  const [dataEmployees, setDataEmployees] = useState<Employee[]>([]);

  const fetchDataEmployees = async () => {
    try {
      const res = await getEmployeeList();
      setDataEmployees(res.data);
    } catch (err) {
      Alert.alert("Lỗi lấy dữ liệu");
    }
  };

  useEffect(() => {
    fetchDataEmployees();
  }, []);

  const renderItem = (item: Employee) => {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.code}>{item.code}</Text>
          <Text style={styles.amount}>{item.a.toLocaleString()} ₫</Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.date}>
          {new Date(item.hireDate).toLocaleDateString("vi-VN")}
        </Text>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dataEmployees}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  code: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },
  amount: {
    fontSize: 15,
    fontWeight: "600",
    color: "#28a745",
  },
  description: {
    fontSize: 14,
    color: "#444",
  },
  date: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
});

export default EmployeesScreen;
