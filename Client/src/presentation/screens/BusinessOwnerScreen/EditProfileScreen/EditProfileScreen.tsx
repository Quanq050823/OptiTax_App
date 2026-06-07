import { ColorMain } from "@/src/presentation/components/colors";
import ModalUpdatePhoneBussiness from "@/src/presentation/components/Modal/ModalUpdatePhoneBussiness";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { getUserProfile } from "@/src/services/API/profileService";
import { UserProfile } from "@/src/types/route";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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

const getInitials = (value?: string) => {
  if (!value) return "EO";
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

function EditProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useAppNavigation();
  const [visibleModalEditProfile, setVisibleModalEditProfile] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data: UserProfile = await getUserProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  return (
    <ScrollView style={{ flex: 1, position: "relative" }}>
      <View style={styles.container}>
        <View
          style={{
            width: 80,
            height: 80,
            position: "relative",
            alignSelf: "center",
          }}
        >
          {profile?.avatar ? (
            <Avatar.Image size={80} source={{ uri: profile.avatar }} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{getInitials(profile?.name)}</Text>
            </View>
          )}
          <View
            style={{
              position: "absolute",
              inset: 0,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              padding: 4,
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <MaterialCommunityIcons
              name="camera-plus-outline"
              size={28}
              color="#fff"
            />
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Tên chủ hộ </Text>
          <TextInput
            style={[styles.input, styles.borderInput]}
            value={profile?.name}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder=""
            style={[
              styles.input,
              styles.borderInput,
              { color: "#494949ff", backgroundColor: "#edededff" },
            ]}
            value={profile?.email}
            editable={false}
          />
        </View>

        <View style={{ marginTop: 10, flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Họ chủ hộ</Text>
            <TextInput
              style={[styles.input, styles.borderInput]}
              placeholder="Nhập họ"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Tên chủ hộ</Text>
            <TextInput
              style={[styles.input, styles.borderInput]}
              placeholder="Nhập tên"
            />
          </View>
        </View>
        {profile?.phone ? (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Tên chủ hộ </Text>
            <TextInput
              style={[styles.input, styles.borderInput]}
              value={profile?.name}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.changePassWrapper}
            onPress={() => setVisibleModalEditProfile(true)}
          >
            <Text style={{ color: ColorMain }}>
              Cập nhật số điện thoại&nbsp;
              <MaterialIcons name="phone-enabled" size={15} color={ColorMain} />
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.changePassWrapper}
          onPress={() => navigate.navigate("ChangePasswordScreen")}
        >
          <Text style={{ color: ColorMain }}>Đổi mật khẩu</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.btnSave}
        // onPress={() => navigate.navigate("ChangePasswordScreen")}
      >
        <Text style={{ color: "#fff" }}>Lưu</Text>
      </TouchableOpacity>
      <ModalUpdatePhoneBussiness
        visible={visibleModalEditProfile}
        setVisible={setVisibleModalEditProfile}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 90,
    paddingTop: 20,
  },
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
    fontSize: 15,
    marginTop: 20,
    color: "#494949",
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e8f3f1",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    color: "#1f7a70",
    fontSize: 22,
    fontWeight: "800",
  },
  btnSave: {
    width: "95%",
    height: 50,
    position: "absolute",
    bottom: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: ColorMain,
  },
  changePassWrapper: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorMain,
    height: 50,
  },
});
export default EditProfileScreen;
