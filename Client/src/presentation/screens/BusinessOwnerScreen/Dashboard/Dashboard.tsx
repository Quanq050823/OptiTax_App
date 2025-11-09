import Analytics from "@/src/presentation/components/Analytics";
import { ColorMain } from "@/src/presentation/components/colors";
import NotCompletedTaxReturnForm from "@/src/presentation/components/NotCompletedTaxReturnForm/NotCompletedTaxReturnForm";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import ChooseTaxTypeForHouseholdBusiness from "@/src/presentation/screens/Auth/ChooseTaxTypeForHouseholdBusiness";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function Dashboard() {
  const navigate = useAppNavigation();
  const user = {
    state: false,
  };
  return (
    <View style={{ flex: 1, width: "100%" }}>
      <ScreenContainer>
        <View style={styles.container}>
          {user.state ? <NotCompletedTaxReturnForm /> : <Analytics />}
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default Dashboard;
