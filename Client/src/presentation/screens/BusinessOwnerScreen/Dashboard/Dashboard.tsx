import { ColorMain } from "@/src/presentation/components/colors";
import NotCompletedTaxReturnForm from "@/src/presentation/components/NotCompletedTaxReturnForm/NotCompletedTaxReturnForm";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import ChooseTaxTypeForHouseholdBusiness from "@/src/presentation/screens/Auth/ChooseTaxTypeForHouseholdBusiness ";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function Dashboard() {
  const navigate = useAppNavigation();
  const user = {
    state: false,
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", width: "100%" }}>
      <View style={styles.container}>
        {!user.state && <NotCompletedTaxReturnForm />}
      </View>
      {/* <ChooseTaxTypeForHouseholdBusiness /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Dashboard;
