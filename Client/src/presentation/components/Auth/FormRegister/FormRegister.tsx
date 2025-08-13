import PositionSelectRegister from "@/src/presentation/components/Auth/PositionSelectRegister";
import { ColorMain } from "@/src/presentation/components/colors";
import { RoleContext } from "@/src/presentation/Hooks/RoleContext";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

function FormRegister({
  navigation,
  username,
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
  const { role, setRole } = useContext(RoleContext);
  const handleRegister = () => {
    if (!username || !password || !veryPassword || !role) {
      Alert.alert("Không được để trống!");
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSubmit(true);
        // Xử lý đăng ký xong ở đây
      }, 2000);
    }
  };
  return (
    <View
      style={{
        marginTop: 70,
        width: "100%",
        flex: 1,
        alignItems: "center",
      }}
    >
      <TextInput
        label="Nhập email hoặc số điện thoại"
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
        <Text style={{ color: ColorMain }}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

export default FormRegister;
