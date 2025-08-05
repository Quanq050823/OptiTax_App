import { ColorMain } from "@/src/presentation/components/colors";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

function FormVeryCode({
  setCode,
  onVeryCode,
  loading,
  navigation,
  setSubmit,
}: Props) {
  return (
    <View style={{ marginTop: 20, width: "100%", flex: 1 }}>
      <TouchableOpacity
        style={styleLabel.titleWrapper}
        onPress={() => setSubmit(false)}
      >
        <Ionicons name="arrow-back" size={17} color={ColorMain} />
        <Text style={styleLabel.text}>Trở lại</Text>
      </TouchableOpacity>
      <Text style={{ marginBottom: 20, color: ColorMain, marginTop: 50 }}>
        Mã xác nhận được gửi đến 0987654321
      </Text>
      <TextInput
        label="Nhập mã xác nhận..."
        style={stylesAuth.input}
        onChangeText={setCode}
        underlineColor={ColorMain}
        activeUnderlineColor={ColorMain}
      />
      <TouchableOpacity
        style={[stylesAuth.btnLogin, { marginTop: 10 }]}
        onPress={onVeryCode}
      >
        <Text style={stylesAuth.textBtnLogin}>
          {loading ? <ActivityIndicator color="#fff" /> : "Xác nhận"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <AntDesign name="reload1" size={15} color="#2e90ff" />
        <Text style={{ marginLeft: 8, color: "#2e90ff" }}>Gửi lại mã</Text>
      </TouchableOpacity>
    </View>
  );
}
const styleLabel = StyleSheet.create({
  titleWrapper: {
    flexDirection: "row",
    width: "100%",
  },
  text: {
    marginLeft: 5,
    color: ColorMain,
  },
});
export default FormVeryCode;
