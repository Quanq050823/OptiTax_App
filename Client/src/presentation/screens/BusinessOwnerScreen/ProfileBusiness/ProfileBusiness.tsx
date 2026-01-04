import { ColorMain } from "@/src/presentation/components/colors";

import {
  BusinessInforAuth,
  getUserProfile,
  UpdateUserProfile,
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
type UpdateProfilePayload = Pick<UserProfile, "_id" | "name" | "email">;

function ProfileBusiness() {
  const navigate = useNavigation<NavProp>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState<boolean>(false);
  const [newProfile, setNewProfile] = useState<UpdateProfilePayload>({
    _id: "",
    name: "",
    email: "",
  });
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

      setNewProfile({
        _id: data._id,
        name: data.name,
        email: data.email,
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

  const handleSaveProfile = async () => {
    if (!newProfile.name || !newProfile.email) {
      Alert.alert("Lỗi", "Tên và email không được để trống");
      return;
    }

    setLoading(true);
    try {
      await UpdateUserProfile(newProfile); // ✅ CHỈ 3 FIELD
      Alert.alert("Thành công", "Cập nhật hồ sơ thành công");
      navigate.goBack();
    } catch (error) {
      Alert.alert("Lỗi", "Cập nhật hồ sơ thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

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
                    value={newProfile.name}
                    onChangeText={(text) =>
                      setNewProfile((prev) => ({ ...prev, name: text }))
                    }
                  />
                </View>
                <View style={styles.wrInput}>
                  <Text style={styles.labelInput}>Email</Text>
                  <TextInput
                    placeholder="Tên"
                    style={styles.input}
                    value={newProfile.email}
                    onChangeText={(text) =>
                      setNewProfile((prev) => ({ ...prev, email: text }))
                    }
                  />
                </View>

                <View style={styles.wrInput}>
                  <Text style={styles.labelInput}>Số điện thoại</Text>
                  <TextInput
                    placeholder="Tên"
                    style={styles.input}
                    value={profile.phoneNumber ?? ""}
                    editable={false}
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
              <LinearGradient
                colors={["#4dbf99ff", "#6A7DB3"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 3 }}
                style={styles.btnShow}
              >
                <TouchableOpacity
                  style={[
                    styles.btnChangePass,
                    {
                      backgroundColor: "transparent",
                      shadowColor: "transparent",
                      marginTop: 0,
                    },
                  ]}
                  onPress={handleSaveProfile}
                >
                  <Text style={{ color: "#fff", fontWeight: "500" }}>
                    Lưu hồ sơ
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
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

  textPosition: {
    fontSize: 15,
    marginTop: 20,
    color: "#494949",
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
    elevation: 7,
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
  btnShow: {
    width: "95%",
    backgroundColor: ColorMain,
    marginTop: 30,
    alignSelf: "center",
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ProfileBusiness;
