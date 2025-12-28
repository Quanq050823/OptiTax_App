import { ColorMain } from "@/src/presentation/components/colors";

import {
  BusinessInforAuth,
  getUserProfile,
} from "@/src/services/API/profileService";
import { Profile, RootStackParamList, UserProfile } from "@/src/types/route";
import {
  Entypo,
  Feather,
  FontAwesome,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
type NavProp = StackNavigationProp<RootStackParamList>;

function ProfileBusiness() {
  const navigate = useNavigation<NavProp>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const isFocused = useIsFocused();

  const fetchProfile = async () => {
    try {
      const data: UserProfile = await getUserProfile();
      const dataBussiness = await BusinessInforAuth();
      setProfile({
        ...data,
        businessName: dataBussiness?.businessName,
        address: dataBussiness?.address,
        phoneNumber: dataBussiness?.phoneNumber,
      });
    } catch (error) {
      Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại", [
        {
          text: "Đăng nhập lại",
          onPress: () => {
            // Xử lý điều hướng về màn Login
            navigate.replace("Login");
          },
          style: "default", // hoặc "cancel", "destructive"
        },
      ]);
    }
  };
  useEffect(() => {
    if (isFocused) {
      fetchProfile();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {profile ? (
          <>
            <View style={styles.wrInfo}>
              <TouchableOpacity style={{ position: "relative" }}>
                <Avatar.Image size={70} source={{ uri: profile._id }} />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: ColorMain,
                    borderRadius: 20,
                    padding: 4,
                  }}
                >
                  <Feather name="edit" size={15} color="#fff" />
                </View>
              </TouchableOpacity>
              <View style={styles.wrField}>
                <View style={styles.wrInput}>
                  <Text style={styles.labelInput}>Tên</Text>
                  <TextInput
                    placeholder="Tên"
                    style={styles.input}
                    defaultValue={profile.name}
                  />
                </View>
                <View style={styles.wrInput}>
                  <Text style={styles.labelInput}>Email</Text>
                  <TextInput
                    placeholder="Tên"
                    style={styles.input}
                    defaultValue={profile.email}
                  />
                </View>

                <View style={styles.wrInput}>
                  <Text style={styles.labelInput}>Số điện thoại</Text>
                  <TextInput
                    placeholder="Tên"
                    style={styles.input}
                    defaultValue="0987654321"
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.btnChangePass}
                onPress={() => navigate.navigate("ChangePasswordScreen")}
              >
                <Text style={{ color: "#fff", fontWeight: "500" }}>
                  Thay đổi mật khẩu
                </Text>
                <MaterialIcons name="password" size={17} color="#fff" />
              </TouchableOpacity>
              {/* <Text
                style={{
                  fontSize: 24,
                  color: "#494949",
                  marginTop: 10,
                  fontWeight: "600",
                }}
              >
                {profile.name}
              </Text>
              <Text style={styles.textPosition}>{profile.email}</Text>

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
                onPress={() => navigate.navigate("EditProfileScreen")}
              >
                <Text>
                  Chỉnh sửa thông tin
                  <AntDesign name="edit" size={15} color="black" />
                </Text>
              </TouchableOpacity> */}
            </View>
          </>
        ) : (
          <></>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    position: "relative",
    paddingBottom: 90,
    backgroundColor: "#fff",
  },
  label: {
    textAlign: "left",
    fontWeight: 500,
    color: "#6d6d6dff",
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    // shadowColor: "#9d9d9d",
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3,
    // elevation: 5,
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    color: "#333",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#afafafff",
    borderRadius: 10,
  },
  borderInput: {
    borderWidth: 1,
    borderColor: "#d5d5d5ff",
    borderRadius: 10,
  },
  textPosition: {
    fontSize: 15,
    marginTop: 20,
    color: "#494949",
  },
  changePassWrapper: {
    width: "90%",
    height: 50,
    position: "absolute",
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: ColorMain,
  },
  rolesWrapper: {
    backgroundColor: ColorMain,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    flex: 1,
    marginTop: 20,
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    marginHorizontal: 5,
  },
  wrInfo: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 10,
  },
  wrInput: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  labelInput: { marginBottom: 5, fontWeight: "500", color: "#868686ff" },
  wrField: {
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 15,
    borderColor: "#bdbdbdff",
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    backgroundColor: "#fff",
  },
  btnChangePass: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: "#246192ff",
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 5,
    gap: 7,
  },
});
export default ProfileBusiness;
