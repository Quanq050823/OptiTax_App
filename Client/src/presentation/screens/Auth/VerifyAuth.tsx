import FormRegister from "@/src/presentation/components/Auth/FormRegister/FormRegister";
import FormVeryCode from "@/src/presentation/components/Auth/FormRegister/FormVeryCode";
import HeaderLogin from "@/src/presentation/components/Auth/header";
import Logo from "@/src/presentation/components/Auth/Logo/Logo";
import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { UserTypeContext } from "@/src/presentation/Hooks/UserTypeContext";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { getUserProfile } from "@/src/services/API/profileService";
import { useContext, useEffect, useState } from "react";
import { Alert, ImageBackground, Text, View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { usePathname } from "expo-router";

type User = {
  id: number;
  username: string;
  password: string;
  userType: number;
};
type RootStackNav = StackNavigationProp<RootStackParamList>;

function VerifyAuth({ navigation }: Props) {
  const { userType, setUserType } = useContext(UserTypeContext);
  useEffect(() => {
    fetchProfile();
  }, [userType]);

  const [profile, setProfile] = useState<any>(null);
  const path = usePathname();
  console.log("📍 Current route:", path);
  const fetchProfile = async () => {
    try {
      const data = (await getUserProfile()) as any;
      if (data.isVerified === true) {
        if (userType === 1) {
          navigation.replace("BusinessRegistrationStepTwo");
        } else if (userType === 2) {
          navigation.replace("NavigationAccountant");
        }
      }
    } catch (error) {
      navigation.replace("Login");
    }
  };

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      <View style={{ flex: 1, backgroundColor: ColorMain }}>
        <HeaderLogin name={"Đăng ký"} />
        <View style={stylesAuth.containerWrapper}>
          <View
            style={{
              position: "absolute",
              top: -7,
              left: -20,
              width: "110%",
              right: 0,
              height: 50,
              backgroundColor: "rgba(36, 36, 36, 0.12)",
              borderTopLeftRadius: 100,
              borderTopRightRadius: 100,
              shadowColor: "#333",
              shadowOffset: { width: 0, height: 7 },
              shadowOpacity: 1,
              shadowRadius: 3,
              elevation: 10,
            }}
          />
          <ImageBackground
            style={[stylesAuth.container, { backgroundColor: ColorMain }]}
            source={require("@/assets/images/themeLogin.jpg")}
            resizeMode="cover"
          >
            <View style={stylesAuth.wrapLogin}>
              <Logo widthLogo={70} heightLogo={65} />

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "600",
                  marginVertical: 100,
                }}
              >
                Đang xác minh tài khoản
              </Text>
            </View>
          </ImageBackground>
        </View>
      </View>
    </UserTypeContext.Provider>
  );
}

export default VerifyAuth;
