import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import NavigationAccountant from "@/src/navigation/NavigationAccountant";
import NavigationBusiness from "@/src/navigation/NavigationBusiness";
import LoginScreen from "@/src/presentation/screens/Auth/LoginScreen";
import RegisterScreen from "@/src/presentation/screens/Auth/Register";
import VerifyAuth from "@/src/presentation/screens/Auth/VerifyAuth";
import ChooseTaxTypeForHouseholdBusiness from "@/src/presentation/screens/Auth/ChooseTaxTypeForHouseholdBusiness";
import BusinessRegistrationStepTwo from "@/src/presentation/screens/Auth/BusinessRegistrationStepTwo";
import BusinessRegistrationStepThree from "@/src/presentation/screens/Auth/BusinessRegistrationStepThree";
import SelectDigitalSignaturePlan from "@/src/presentation/screens/BusinessOwnerScreen/SelectDigitalSignaturePlan/SelectDigitalSignaturePlan";
import { RootStackParamList } from "@/src/types/route";
import axiosInstance from "@/src/services/API/axios";

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyAuth" component={VerifyAuth} />

      <Stack.Screen name="NavigationBusiness" component={NavigationBusiness} />
      <Stack.Screen
        name="NavigationAccountant"
        component={NavigationAccountant}
      />

      <Stack.Screen
        name="BusinessRegistrationStepTwo"
        component={BusinessRegistrationStepTwo}
      />
      <Stack.Screen
        name="BusinessRegistrationStepThree"
        component={BusinessRegistrationStepThree}
      />
      <Stack.Screen
        name="SelectDigitalSignaturePlan"
        component={SelectDigitalSignaturePlan}
      />
      <Stack.Screen
        name="ChooseTaxTypeForHouseholdBusiness"
        component={ChooseTaxTypeForHouseholdBusiness}
      />
    </Stack.Navigator>
  );
}

export default AppNavigation;
