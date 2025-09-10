import NavigationAccountant from "@/src/navigation/NavigationAccountant";
import NavigationBusiness from "@/src/navigation/NavigationBusiness";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import BusinessRegistrationStepThree from "@/src/presentation/screens/Auth/BusinessRegistrationStepThree";
import BusinessRegistrationStepTwo from "@/src/presentation/screens/Auth/BusinessRegistrationStepTwo";
import ChooseTaxTypeForHouseholdBusiness from "@/src/presentation/screens/Auth/ChooseTaxTypeForHouseholdBusiness ";
import LoginScreen from "@/src/presentation/screens/Auth/LoginScreen";
import RegisterScreen from "@/src/presentation/screens/Auth/Register";
import VerifyAuth from "@/src/presentation/screens/Auth/VerifyAuth";
import SelectDigitalSignaturePlan from "@/src/presentation/screens/BusinessOwnerScreen/SelectDigitalSignaturePlan/SelectDigitalSignaturePlan";
import TaxDeclaration from "@/src/presentation/screens/BusinessOwnerScreen/SelectDigitalSignaturePlan/SelectDigitalSignaturePlan";
import {
  BusinessInforAuth,
  getUserProfile,
} from "@/src/services/API/profileService";
import { Profile, RootStackParamList, UserProfile } from "@/src/types/route";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { View } from "react-native";

// export type RootStackParamList = {
//   Login: undefined;
//   Register: undefined;
//   NavigationBusiness: undefined;
//   NavigationAccountant: undefined;
// };

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigation() {
  const navigate = useAppNavigation();

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    checkToken();
  }, []);

  if (loading) return null; // hoặc loader
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: 0,
        backgroundColor: "#fff",
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn && <Stack.Screen name="Login" component={LoginScreen} />}
        <Stack.Screen
          name="NavigationBusiness"
          component={NavigationBusiness}
        />

        <Stack.Screen name="VerifyAuth" component={VerifyAuth} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen
          name="ChooseTaxTypeForHouseholdBusiness"
          component={ChooseTaxTypeForHouseholdBusiness}
        />
        <Stack.Screen
          name="SelectDigitalSignaturePlan"
          component={SelectDigitalSignaturePlan}
        />

        <Stack.Screen
          name="BusinessRegistrationStepThree"
          component={BusinessRegistrationStepThree}
        />

        <Stack.Screen
          name="NavigationAccountant"
          component={NavigationAccountant}
        />
      </Stack.Navigator>
    </View>
  );
}

export default AppNavigation;
