import FormRegister from "@/src/presentation/components/Auth/FormRegister/FormRegister";
import FormVeryCode from "@/src/presentation/components/Auth/FormRegister/FormVeryCode";
import HeaderLogin from "@/src/presentation/components/Auth/header";
import Logo from "@/src/presentation/components/Auth/Logo/Logo";
import { ColorMain } from "@/src/presentation/components/colors";
import { UserTypeContext } from "@/src/presentation/Hooks/UserTypeContext";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { useContext, useState } from "react";
import { Alert, ImageBackground, View } from "react-native";

type User = {
  id: number;
  username: string;
  password: string;
  userType: number;
};

function RegisterScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [veryPassword, setVeryPassword] = useState("");
  const { userType, setUserType } = useContext(UserTypeContext);
  const [showPassword, setShowPassword] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [code, setCode] = useState("");
  const [userRegister, setUserRegister] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState();
  const handleSubmit = () => {
    if (!username || !password || !veryPassword || !userType) {
      Alert.alert("Không được để trống!");
    } else {
      setSubmit(true);
    }
  };
  const handleVeriCode = () => {
    setLoading(true);
    if (!code) {
      Alert.alert("Không được để trống");
      setLoading(false);
    } else {
      setTimeout(() => {
        setLoading(true);

        // Xử lý đăng ký xong ở đây
        if (userType === 1) {
          navigation.replace("ChooseTaxTypeForHouseholdBusiness");
        } else if (userType === 2) {
          navigation.replace("NavigationAccountant");
        }
      }, 2000);
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
              {submit ? (
                <FormVeryCode
                  setCode={setCode}
                  onVeryCode={handleVeriCode}
                  navigation={navigation}
                  setSubmit={setSubmit}
                  loading={loading}
                />
              ) : (
                <FormRegister
                  username={username}
                  email={email}
                  setEmail={setEmail}
                  setUsername={setUsername}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  navigation={navigation}
                  setSubmit={setSubmit}
                  veryPassword={veryPassword}
                  setVeryPassword={setVeryPassword}
                />
              )}
            </View>
          </ImageBackground>
        </View>
      </View>
    </UserTypeContext.Provider>
  );
}

export default RegisterScreen;
