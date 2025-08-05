import { createDrawerNavigator } from "@react-navigation/drawer";

import React from "react";

import HomeScreenAccountant from "@/src/presentation/screens/AccountantScreen/HomeScreen";

// const HomeLayout = () => {
//   const Stack = createNativeStackNavigator<RootStackParamList>();

//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="HomeScreen"
//         options={{ title: "Home" }}
//         component={HomeScreen}
//       />
//       <Stack.Screen
//         name="AboutScreen"
//         options={{ title: "About" }}
//         component={AboutScreen}
//       />
//     </Stack.Navigator>
//   );
// };
const NavigationAccountant = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { width: 300 },
        headerStyle: { height: 100 },
        drawerActiveTintColor: "#000",
        headerTintColor: "black",
        headerShown: false,
      }}
      //   drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="HomeScreenAccountant"
        options={{
          title: "Trang Chủ",
        }}
        component={HomeScreenAccountant}
      />
    </Drawer.Navigator>
  );
};

export default NavigationAccountant;
