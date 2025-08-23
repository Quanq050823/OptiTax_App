import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import ChooseTaxTypeForHouseholdBusiness from "@/src/presentation/screens/Auth/ChooseTaxTypeForHouseholdBusiness ";
import { MaterialIcons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function NotCompletedTaxReturnForm() {
  const navigate = useAppNavigation();
  return (
    <View style={styles.imgWrapper}>
      <Image
        source={{
          uri: "https://vinatas.com.vn/wp-content/uploads/2019/05/listsmart_ebay-tax-1.png",
        }}
        width={200}
        height={200}
        style={{ opacity: 0.7 }}
      />
      <View
        style={{
          marginTop: 30,
          width: "100%",
          paddingHorizontal: 40,
          alignItems: "center",
        }}
      >
        <Text style={styles.textRegister}>
          Đăng ký tài khoản thành công&nbsp;
          <MaterialIcons name="verified-user" size={18} color={ColorMain} />
        </Text>
        <Text style={{ textAlign: "center", marginTop: 30, color: ColorMain }}>
          Vui lòng hoàn tất các bước đăng ký khai báo thuế để sử dụng dịch vụ!
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigate.navigate("ChooseTaxTypeForHouseholdBusiness")}
        >
          <Text style={{ color: "#fff", fontWeight: "500" }}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>

      {/* <ChooseTaxTypeForHouseholdBusiness /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgWrapper: {
    width: "100%",
    alignItems: "center",
    paddingTop: 80,
  },
  textRegister: {
    fontSize: 18,
    fontWeight: "500",
    color: ColorMain,
  },
  btn: {
    padding: 20,
    backgroundColor: ColorMain,
    marginTop: 30,
    borderRadius: 30,
  },
});
export default NotCompletedTaxReturnForm;
