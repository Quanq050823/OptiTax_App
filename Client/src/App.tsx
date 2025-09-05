import AppNavigation from "@/src/navigation/Navigation";
import { DataProvider, useData } from "@/src/presentation/Hooks/useDataStore";
import { UserTypeProvider } from "@/src/presentation/Hooks/UserTypeContext";
import { BusinessInforAuth } from "@/src/services/API/profileService";
import { BusinessInfo } from "@/src/types/route";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";

import { View } from "react-native";
import { PaperProvider } from "react-native-paper";

// const linking = {
//   prefixes: ["taxdemo://"],
//   config: {
//     screens: {
//       Authentication: {
//         screens: {
//           ConfirmEmail: "authentication/confirm-email",
//         },
//       },
//     },
//   },
// };


function App() {

  return (
    <PaperProvider>
      <DataProvider>
        <UserTypeProvider>
          <View style={{ flex: 1 }}>
            <AppNavigation />
          </View>
        </UserTypeProvider>
      </DataProvider>
    </PaperProvider>
  );
}

export default App;
