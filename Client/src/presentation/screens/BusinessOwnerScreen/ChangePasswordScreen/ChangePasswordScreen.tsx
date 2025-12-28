import { ColorMain } from "@/src/presentation/components/colors";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function ChangePasswordScreen() {
  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          width: "100%",
          paddingVertical: 20,
        }}
      >
        <View>
          <Text style={styles.label}>Mật khẩu cũ</Text>
          <TextInput
            style={styles.inputOldPass}
            placeholder="Nhập mật khẩu cũ"
          ></TextInput>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.inputOldPass}
            placeholder="Nhập mật khẩu mới"
          ></TextInput>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <TextInput
            style={styles.inputOldPass}
            placeholder="Xác nhận mật khẩu mới"
          ></TextInput>
        </View>
        <TouchableOpacity style={styles.btnChangePassWrapper}>
          <Text style={{ color: "#fff", fontWeight: "500" }}>Thay đổi</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: "left",
    marginBottom: 5,
    color: "#7c7b7bff",
    fontWeight: 500,
  },
  inputOldPass: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  btnChangePassWrapper: {
    width: "100%",
    height: 50,
    backgroundColor: ColorMain,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginTop: 20,
  },
});
export default ChangePasswordScreen;
