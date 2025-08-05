import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { Text, TouchableOpacity, View } from "react-native";

function Invoice() {
  const navigation = useAppNavigation();
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("InvoiceInputScreen")}
      >
        <Text>Quản lý hoá đơn</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Invoice;
