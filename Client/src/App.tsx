import AppNavigation from "@/src/navigation/Navigation";
import { DataProvider, useData } from "@/src/presentation/Hooks/useDataStore";
import { UserTypeProvider } from "@/src/presentation/Hooks/UserTypeContext";
import { BusinessInforAuth } from "@/src/services/API/profileService";
import { BusinessInfo } from "@/src/types/route";
import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import { Buffer } from "buffer";
import { useFonts } from "expo-font";

import { ActivityIndicator, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider } from "./presentation/Hooks/useTheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
global.Buffer = Buffer;

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
  const [loaded] = useFonts({
    Montserrat: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    // MontserratBold: require("./assets/fonts/Montserrat-Bold.ttf"),
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <DataProvider>
          <UserTypeProvider>
            <ThemeProvider>
              <View style={{ flex: 1 }}>
                <AppNavigation />
              </View>
            </ThemeProvider>
          </UserTypeProvider>
        </DataProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
