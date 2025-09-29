import { ColorMain } from "@/src/presentation/components/colors";

import {
  BusinessInforAuth,
  getUserProfile,
} from "@/src/services/API/profileService";
import { Profile, RootStackParamList, UserProfile } from "@/src/types/route";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
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
      console.error("Error fetching profile:", error);
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
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <Avatar.Image size={70} source={{ uri: profile._id }} />
              <Text
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
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, width: "100%", marginTop: 20 }}>
              {/* <View style={{ marginTop: 10 }}>
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
                </View> */}
              <TouchableOpacity
                style={[styles.rolesWrapper, { alignItems: "center" }]}
                onPress={() => navigate.navigate("EditProfileBussinessStore")}
              >
                <Text
                  style={[
                    styles.label,
                    { color: "#fff", fontSize: 17, fontWeight: "700" },
                  ]}
                >
                  {profile.businessName}
                </Text>
                <Text style={[styles.label, { color: "#fff", fontSize: 13 }]}>
                  <Entypo name="location-pin" size={15} color="#fff" />
                  {profile.address.street},{profile.address.ward},
                  {profile.address.district}
                  {profile.address.city}
                </Text>
                <Text style={[styles.label, { color: "#fff", fontSize: 13 }]}>
                  <FontAwesome name="phone" size={13} color="#fff" />
                  &nbsp;
                  {profile.phoneNumber}
                </Text>
              </TouchableOpacity>
              {/* <View style={{ marginTop: 20 }}>
                <Te style={styles.label}>Tên hộ kinh doanh</Te>
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
                    defaultValue={profile.businessName}
                    editable={false}
                    // onPress={() => navigate.navigate("AboutScreen")}
                  />
                  <AntDesign
                    name="arrowright"
                    size={24}
                    color="black"
                    style={{ position: "absolute", right: 10 }}
                  />
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Label style={styles.label}>Số điện thoại </Label>
                <TextInput
                  placeholder=""
                  style={[styles.input, styles.borderInput]}
                  defaultValue="0987654321"
                />
              </View>
              <PinInputWithFaceID /> */}
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
});
export default ProfileBusiness;
