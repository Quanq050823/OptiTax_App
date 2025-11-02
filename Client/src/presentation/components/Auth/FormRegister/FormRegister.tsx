import PositionSelectRegister from "@/src/presentation/components/Auth/PositionSelectRegister";
import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import { UserTypeContext } from "@/src/presentation/Hooks/UserTypeContext";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { register } from "@/src/services/API/authService";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { Props } from "@/src/types/route";

function FormRegister({
  navigation,
  username,
  email,
  setEmail,
  password,
  setUsername,
  setPassword,
  showPassword,
  setShowPassword,
  setSubmit,
  setVeryPassword,
  veryPassword,
}: Props) {
  const [loading, setLoading] = useState(false);
  const { userType, setUserType } = useContext(UserTypeContext);
  const navigate = useAppNavigation();
  console.log(email);

  const handleRegister = async () => {
    // if (!username || !email || !password || !veryPassword || !userType) {
    //   Alert.alert("Không được để trống!");
    //   return;
    // }

    setLoading(true);
    try {
      if (veryPassword !== password) {
        Alert.alert("Mật khẩu xác thực không chính xác");
        setLoading(false);

        return;
      }
      const result = await register({
        name: username,
        email,
        password,
        userType,
      });
      setLoading(false);
      navigate.navigate("BusinessRegistrationStepTwo");
      // setSubmit(true);
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Đăng ký thất bại", error?.message || "Có lỗi xảy ra.");
    }
    // } else {
    //   setLoading(true);
    //   setTimeout(() => {
    //     setLoading(false);
    //     setSubmit(true);
    //     // Xử lý đăng ký xong ở đây
    //   }, 2000);
    // }
  };
  return (
    <View
      style={{
        marginTop: 50,
        width: "100%",
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 10,
      }}
    >
      <TextInput
        label="Nhập tên chủ hộ"
        style={stylesAuth.input}
        onChangeText={setUsername}
        underlineColor={ColorMain}
        activeUnderlineColor={ColorMain}
      />
      <TextInput
        label="Nhập email hoặc số điện thoại"
        style={stylesAuth.input}
        onChangeText={setEmail}
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
      <TextInput
        label="Nhập lại mật khẩu"
        style={stylesAuth.input}
        onChangeText={setVeryPassword}
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
      <PositionSelectRegister />
      <TouchableOpacity
        style={[stylesAuth.btnLogin, { marginTop: 20 }]}
        onPress={handleRegister}
      >
        <Text style={stylesAuth.textBtnLogin}>
          {loading ? <ActivityIndicator color="#fff" /> : "Đăng ký"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 20 }}
        onPress={() => navigation.goBack("Login")}
      >
        <Text style={{ color: textColorMain, fontSize: 15, fontWeight: "700" }}>
          Đăng nhập
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default FormRegister;
