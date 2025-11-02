import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import {
  BusinessInforAuth,
  getUserProfile,
} from "@/src/services/API/profileService";
import { Profile, UserProfile } from "@/src/types/route";
import {
  AntDesign,
  Feather,
  FontAwesome6,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
          backgroundColor: "#e9f2f2db",
        }}
      >
        <View style={{ paddingHorizontal: 10, alignItems: "center" }}>
          <View style={styles.UserWrapper}>
            <LinearGradient
              colors={[ColorMain, "#5b74b8ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 3 }}
              style={{
                borderTopLeftRadius: 15,
                borderBottomRightRadius: 15,
                alignItems: "center",
                padding: 5,
                width: "100%",
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 20,
                shadowColor: "#00000033",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Avatar.Image
                size={70}
                source={{ uri: "https://i.pravatar.cc/100" }}
              />
              <View
                style={{
                  justifyContent: "space-between",
                  flex: 1,
                  marginLeft: 15,
                  height: 60,
                }}
              >
                <Text style={styles.name}>{profile?.businessName}</Text>
                <Text style={styles.role}>{profile?.email}</Text>
                <Text style={styles.role}>
                  {profile?.userType === 1 ? "Hộ kinh doanh" : "Kế toán viên"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.actionProfile}
                onPress={() => navigate.navigate("ProfileBusiness")}
              >
                <AntDesign name="setting" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
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
          <View style={styles.wrItem}>
            <TouchableOpacity style={styles.item}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome6 name="file-invoice" size={17} color="black" />
                <Text style={styles.titleItem}>Quản lý hoá đơn</Text>
              </View>
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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign name="product" size={17} color="black" />
                <Text style={styles.titleItem}>Quản lý sản phẩm</Text>
              </View>

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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="users" size={17} color="black" />
                <Text style={styles.titleItem}>Quản lý khách hàng</Text>
              </View>

              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color={colorText}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Feather name="settings" size={17} color="black" />
                <Text style={styles.titleItem}>Cài đặt</Text>
              </View>

              <MaterialIcons
                name="keyboard-arrow-right"
                size={20}
                color={colorText}
              />
            </TouchableOpacity>
          </View>
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
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  role: {
    fontSize: 13,
    color: "#fff",
  },
  actionProfile: {
    padding: 5,
    borderRadius: 5,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "transparent",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    // shadowColor: "#a7a7a7ff",
    // shadowOffset: { width: 0, height: 1 },
    // shadowRadius: 8,
    // shadowOpacity: 0.2,
    // elevation: 5,
  },
  titleItem: { fontSize: 15, color: "#000", fontWeight: "500", marginLeft: 10 },
  dataDev: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#a7a7a7ff",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 5,
  },
});
export default Option;
