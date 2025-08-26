import AppNavigation from "@/src/navigation/Navigation";
import { UserTypeProvider } from "@/src/presentation/Hooks/UserTypeContext";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
const linking = {
  prefixes: ["taxdemo://"],
  config: {
    screens: {
      Authentication: {
        screens: {
          ConfirmEmail: "authentication/confirm-email",
        },
      },
    },
  },
};
function App() {
  return (
    <PaperProvider>
      <UserTypeProvider>
        <View style={{ flex: 1 }}>
          <AppNavigation />
        </View>
      </UserTypeProvider>
    </PaperProvider>
  );
}

export default App;
