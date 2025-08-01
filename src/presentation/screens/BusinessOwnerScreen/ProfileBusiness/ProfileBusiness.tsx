import PinInputWithFaceID from "@/src/presentation/components/PinInputWithFaceID/PinInputWithFaceID ";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Label } from "@react-navigation/elements";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Avatar } from "react-native-paper";
function ProfileBusiness() {
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Avatar.Image
            size={70}
            source={{ uri: "https://i.pravatar.cc/100" }}
          />
          <Text style={styles.textPosition}>Hộ kinh doanh</Text>
        </View>
        <View style={{ flex: 1, width: "100%", marginTop: 20 }}>
          <View style={{ marginTop: 10 }}>
            <Label style={styles.label}>Tên đăng nhập </Label>
            <TextInput
              placeholder=""
              style={[
                styles.input,
                styles.borderInput,
                { color: "#494949ff", backgroundColor: "#edededff" },
              ]}
              defaultValue="Khang03"
              editable={false}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Label style={styles.label}>Tên chủ hộ </Label>
            <TextInput
              placeholder=""
              style={[styles.input, styles.borderInput]}
              defaultValue="Tax Demo"
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Label style={styles.label}>Số điện thoại </Label>
            <TextInput
              placeholder=""
              style={[styles.input, styles.borderInput]}
              defaultValue="0987654321"
            />
          </View>
          <PinInputWithFaceID />

          <Label style={styles.label}>Thông tin kinh doanh</Label>
          <View
            style={{
              position: "relative",
              alignItems: "center",
              flexDirection: "row",
              height: 50,
              width: "100%",
            }}
          >
            <TextInput
              placeholder=""
              style={[styles.input, styles.borderInput, { marginBottom: 0 }]}
              defaultValue="Xem chi tiết"
              editable={false}
              onPress={() => navigate.navigate("AboutScreen")}
            />
            <AntDesign
              name="arrowright"
              size={24}
              color="black"
              style={{ position: "absolute", right: 10 }}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  label: {
    textAlign: "left",
    fontWeight: 500,
    color: "#6d6d6dff",
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    color: "#333",
    backgroundColor: "#fff",
  },
  borderInput: {
    borderWidth: 1,
    borderColor: "#d5d5d5ff",
    borderRadius: 10,
  },
  textPosition: {
    fontSize: 20,
    marginTop: 20,
    color: "#494949",
  },
});
export default ProfileBusiness;
