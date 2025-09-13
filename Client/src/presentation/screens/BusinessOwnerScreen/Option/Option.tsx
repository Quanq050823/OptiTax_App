import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import {
  BusinessInforAuth,
  getUserProfile,
} from "@/src/services/API/profileService";
import { Profile, UserProfile } from "@/src/types/route";
import {  AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";

function Option() {
  const navigate = useAppNavigation();
  // const { data } = useData();
  const [data, setData] = React.useState({});
  const [profile, setProfile] = React.useState<Profile | null>(null);

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
  React.useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <View style={{ flex: 1, width: "100%" }}>
      {/* <HeaderScreen /> */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: "#f7f7f7ff",
        }}
      >
        <View style={{ paddingHorizontal: 5, alignItems: "center" }}>
          <View style={styles.UserWrapper}>
            <View>
              <Avatar.Image
                size={70}
                source={{ uri: "https://i.pravatar.cc/100" }}
              />
            </View>
            <View
              style={{
                justifyContent: "space-between",
                flex: 1,
                marginLeft: 15,
                height: 60,
              }}
            >
              <Text style={styles.name}>{profile?.businessName}</Text>
              <Text style={styles.role}>{profile?.name}</Text>
              <Text style={styles.role}>
                {profile?.userType === 1 ? "Hộ kinh doanh" : "Kế toán viên"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionProfile}
              onPress={() => navigate.navigate("ProfileBusiness")}
            >
              <AntDesign name="setting" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: "#efefefff",
              flex: 1,
              width: "90%",
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 20,
              marginBottom: 20,
              justifyContent: "space-between",
            }}
          >
            <View style={styles.dataDev}>
              <Text>Thu nhập: </Text>
              <Text style={{ fontWeight: "600" }}>70,5</Text>
              <AntDesign name="arrow-up" size={15} color="green" />
            </View>
            <View style={styles.dataDev}>
              <Text>Thu nhập: </Text>
              <Text style={{ fontWeight: "600" }}>70,5</Text>
              <AntDesign name="arrow-up" size={15} color="red" />
            </View>
          </View>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.titleItem}>Quản lý hoá đơn</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={colorText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigate.navigate("ProductManager")}
          >
            <Text style={styles.titleItem}>Quản lý sản phẩm</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={colorText}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigate.navigate("ProductManager")}
          >
            <Text style={styles.titleItem}>Quản lý khách hàng</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={colorText}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.titleItem}>Cài đặt</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={20}
              color={colorText}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const colorText = "#585858ff";
const styles = StyleSheet.create({
  UserWrapper: {
    marginBottom: 10,
    paddingVertical: 20,
    borderRadius: 8,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  name: {
    marginTop: 10,
    fontSize: 20,
    color: colorText,
    fontWeight: 600,
  },
  role: {
    fontSize: 13,
    color: colorText,
  },
  actionProfile: {
    marginTop: 20,
    padding: 5,
    borderRadius: 5,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    shadowColor: "#a7a7a7ff",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 5,
    marginBottom: 7,
  },
  titleItem: { fontSize: 15, color: colorText, fontWeight: "500" },
  dataDev: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default Option;
