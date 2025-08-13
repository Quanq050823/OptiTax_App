import HeaderLogin from "@/src/presentation/components/Auth/header";
import SignOther from "@/src/presentation/components/Auth/header/SignOther";
import Logo from "@/src/presentation/components/Auth/Logo/Logo";
import { ColorMain } from "@/src/presentation/components/colors";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { useState } from "react";
import { login } from "@/src/services/API/authService";
import {
  Alert,
  ImageBackground,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    setLoading(true);
    const result = await login({ username, password });
    console.log("Login result:", result);
    try {
      setLoading(false);
      navigation.replace("NavigationBusiness");
      //   if (result?.role === 1) {
      //   } else if (result?.role === 0) {
      //     navigation.replace("NavigationAccountant");
      //   } else {
      //     Alert.alert(
      //       "Đăng nhập thành công",
      //       "Không xác định vai trò người dùng."
      //     );
      //   }
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Đăng nhập thất bại", error?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: ColorMain }}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />
      <HeaderLogin name={"Đăng nhập"} />

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
            <View style={{ marginTop: 50, width: "100%" }}>
              <TextInput
                label="Email hoặc số điện thoại"
                style={stylesAuth.input}
                onChangeText={setUsername}
                underlineColor={ColorMain}
                activeUnderlineColor={ColorMain}
              />
              <TextInput
                label="Mật khẩu"
                style={stylesAuth.input}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                underlineColor={ColorMain}
                activeUnderlineColor={ColorMain}
              />

              {/* <TouchableOpacity
                  style={stylesAuth.iconShowPass}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FontAwesome name="eye" size={20} color="#9d9d9d" />
                  ) : (
                    <FontAwesome name="eye-slash" size={20} color="#9d9d9d" />
                  )}
                </TouchableOpacity> */}
              <TouchableOpacity
                onPress={handleLogin}
                style={stylesAuth.btnLogin}
                disabled={loading}
              >
                <Text style={stylesAuth.textBtnLogin}>
                  {loading ? "Loading..." : "Đăng nhập"}
                </Text>
              </TouchableOpacity>
              <View style={stylesAuth.actionCase}>
                <TouchableOpacity style={stylesAuth.FogotPass}>
                  <Text style={stylesAuth.FogotPassTitle}>Quên mật khẩu?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={stylesAuth.FogotPass}
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={stylesAuth.FogotPassTitle}>
                    Đăng ký tài khoản
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <SignOther />
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

export default LoginScreen;
