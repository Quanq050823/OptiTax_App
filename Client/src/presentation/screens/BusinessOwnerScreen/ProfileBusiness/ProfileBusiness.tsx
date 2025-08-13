import { ColorMain } from "@/src/presentation/components/colors";
import PinInputWithFaceID from "@/src/presentation/components/PinInputWithFaceID/PinInputWithFaceID ";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { getUserProfile } from "@/src/services/API/profileService";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Label } from "@react-navigation/elements";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
function ProfileBusiness() {
  const navigate = useNavigation<NavigationProp<RootStackParamList>>();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  console.log(profile);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ScrollView>
          {profile ? (
            <>
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Avatar.Image size={70} source={{ uri: profile.imageUrl }} />
                <Text style={styles.textPosition}>
                  {profile.userType === 1 ? "Hộ kinh doanh" : "Kế toán viên"}
                </Text>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#ecececff",
                    padding: 5,
                    marginTop: 15,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#9d9d9d",
                  }}
                >
                  <Text>Chỉnh sửa thông tin</Text>
                </TouchableOpacity>
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
                    defaultValue={profile.email}
                    editable={false}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Label style={styles.label}>Tên chủ hộ </Label>
                  <TextInput
                    placeholder=""
                    style={[styles.input, styles.borderInput]}
                    defaultValue={profile.name}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Label style={styles.label}>Tên của hàng </Label>
                  <TextInput
                    placeholder=""
                    style={[styles.input, styles.borderInput]}
                    defaultValue="Tú 230"
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
                    style={[
                      styles.input,
                      styles.borderInput,
                      { marginBottom: 0 },
                    ]}
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
            </>
          ) : (
            <></>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.changePassWrapper}
          onPress={() => navigate.navigate("ChangePasswordScreen")}
        >
          <Text style={{ color: "#fff" }}>Thay đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10, position: "relative" },
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
  changePassWrapper: {
    width: "100%",
    height: 50,
    position: "absolute",
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    left: 10,
    borderRadius: 10,
    backgroundColor: ColorMain,
  },
});
export default ProfileBusiness;
