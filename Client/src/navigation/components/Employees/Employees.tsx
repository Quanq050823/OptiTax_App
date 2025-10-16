import { StyleSheet, Text, View } from "react-native";
import CustomDrawerItem from "../CustomDrawer/CustomDrawerItem";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

function Employees(props: any) {
  return (
    <View>
      <View>
        <Text style={styles.title}>Quản lý nhân viên</Text>
      </View>
      <CustomDrawerItem
        label="Nhân viên"
        screenName="ExployeesScreen"
        icon={(focused, color, size) => (
          <FontAwesome name="users" size={20} color={color} />
        )}
        onPress={() =>
          props.navigation.navigate("HomeLayout", {
            screen: "EmployeesScreen",
          })
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9d9d9d",
    marginVertical: 10,
  },
});

export default Employees;
