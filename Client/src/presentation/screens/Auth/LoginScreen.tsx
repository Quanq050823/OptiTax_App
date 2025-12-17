// LoginScreen.tsx
import HeaderLogin from "@/src/presentation/components/Auth/header";
import SignOther from "@/src/presentation/components/Auth/header/SignOther";
import Logo from "@/src/presentation/components/Auth/Logo/Logo";
import { ColorMain } from "@/src/presentation/components/colors";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import { useLogin } from "@/src/presentation/Hooks/useLogin";
import { useCheckLoginOnMount } from "@/src/presentation/Hooks/useCheckLogin";
import { useAppNavigation } from "../../Hooks/useAppNavigation";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useAppNavigation();
  const { handleLogin, loading: loginLoading } = useLogin();
  const { loading: checkLoading } = useCheckLoginOnMount();

  // Load username lưu trước đó
  useEffect(() => {
    const loadUsername = async () => {
      const savedUser = await AsyncStorage.getItem("username");
      if (savedUser) setUsername(savedUser);
    };
    loadUsername();
  }, []);

  if (checkLoading) {
    return <LoadingScreen visible={true} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, backgroundColor: ColorMain }}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <HeaderLogin name="Đăng nhập" />

        <View style={stylesAuth.containerWrapper}>
          <View style={stylesAuth.wrapLogin}>
            <Logo widthLogo={70} heightLogo={65} />

            <View style={{ marginTop: 50, width: "100%" }}>
              <TextInput
                label="Email hoặc số điện thoại"
                style={stylesAuth.input}
                onChangeText={setUsername}
                value={username}
                underlineColor={ColorMain}
                activeUnderlineColor={ColorMain}
                textColor="#000"
              />
              <TextInput
                label="Mật khẩu"
                style={stylesAuth.input}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                underlineColor={ColorMain}
                activeUnderlineColor={ColorMain}
                textColor="#000"
              />

              <TouchableOpacity
                onPress={() => handleLogin(username, password)}
                style={stylesAuth.btnLogin}
                disabled={loginLoading}
              >
                <Text style={stylesAuth.textBtnLogin}>
                  {loginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Text>
              </TouchableOpacity>

              <View style={stylesAuth.actionCase}>
                <TouchableOpacity style={stylesAuth.FogotPass}>
                  <Text style={stylesAuth.FogotPassTitle}>Quên mật khẩu?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={stylesAuth.FogotPass}
                  onPress={() => navigate.navigate("Register")}
                >
                  <Text>
                    Bạn chưa có tài khoản?
                    <Text style={stylesAuth.FogotPassTitle}>Đăng ký</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <SignOther />
          </View>
        </View>

        <LoadingScreen visible={loginLoading} />
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
