import AppNavigation from "@/src/navigation/Navigation";
import { UserTypeProvider } from "@/src/presentation/Hooks/UserTypeContext";
import * as React from "react";
import { View } from "react-native";

function App() {
  return (
    <UserTypeProvider>
      <View style={{ flex: 1 }}>
        <AppNavigation />
      </View>
    </UserTypeProvider>
  );
}

export default App;
