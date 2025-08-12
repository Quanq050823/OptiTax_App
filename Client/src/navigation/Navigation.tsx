import NavigationAccountant from "@/src/navigation/NavigationAccountant";
import NavigationBusiness from "@/src/navigation/NavigationBusiness";
import BusinessRegistrationStepThree from "@/src/presentation/screens/Auth/BusinessRegistrationStepThree";
import BusinessRegistrationStepTwo from "@/src/presentation/screens/Auth/BusinessRegistrationStepTwo";
import LoginScreen from "@/src/presentation/screens/Auth/LoginScreen";
import RegisterScreen from "@/src/presentation/screens/Auth/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View } from "react-native";

// export type RootStackParamList = {
//   Login: undefined;
//   Register: undefined;
//   NavigationBusiness: undefined;
//   NavigationAccountant: undefined;
// };

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigation() {
	return (
		<View
			style={{
				flex: 1,
				paddingBottom: 0,
				backgroundColor: "#fff",
			}}
		>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen
					name="NavigationBusiness"
					component={NavigationBusiness}
				/>
				<Stack.Screen
					name="BusinessRegistrationStepTwo"
					component={BusinessRegistrationStepTwo}
				/>
				<Stack.Screen
					name="BusinessRegistrationStepThree"
					component={BusinessRegistrationStepThree}
				/>
				<Stack.Screen name="Register" component={RegisterScreen} />

				<Stack.Screen
					name="NavigationAccountant"
					component={NavigationAccountant}
				/>
			</Stack.Navigator>
		</View>
	);
}

export default AppNavigation;
