import { ColorMain } from "@/src/presentation/components/colors";
import HeaderScreen from "@/src/presentation/components/layout/Header";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RadioButton } from "react-native-paper";

function ChooseTaxTypeForHouseholdBusiness() {
  const [selected, setSelected] = useState("");
  const navigate = useAppNavigation();
  const options = [
    {
      label: "Kê khai",
      value: "ke-khai",
      description:
        "Doanh nghiệp tự kê khai doanh thu, chi phí và tính thuế dựa trên báo cáo định kỳ.",
      icon: (
        <FontAwesome
          name="file-text"
          size={24}
          color={selected == "ke-khai" ? ColorMain : "#9d9d9d"}
        />
      ),
    },
    {
      label: "Khoán",
      value: "khoan",
      description:
        "Cơ quan thuế ấn định mức thuế cố định hàng tháng/quý dựa trên ước tính doanh thu.",
      icon: (
        <FontAwesome5
          name="coins"
          size={24}
          color={selected == "khoan" ? ColorMain : "#9d9d9d"}
        />
      ),
    },
  ];

  const handleSelectType = () => {
    if (!selected) {
      Alert.alert("Vui lòng chọn một hình thức!");
      return;
    }

    if (selected === "ke-khai") {
      navigate.navigate("SelectDigitalSignaturePlan");
    } else if (selected === "khoan") {
      Alert.alert("chưa tạo ");
    }
  };
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScreenContainer>
        <View style={styles.container}>
          {/* <View style={styles.titleWrapper}>
            <Text style={styles.title}>Chọn hình thức khai báo thuế</Text>
          </View> */}

          {/* <View style={styles.itemWrapper}>
            <Text>Khoán</Text>
          </View> */}
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                selected === option.value && styles.optionSelected,
              ]}
              onPress={() => setSelected(option.value)}
            >
              <View
                style={[
                  styles.radio,
                  selected === option.value && styles.radioSelected,
                ]}
              />
              <View
                style={{ marginLeft: 20, paddingVertical: 10, width: "70%" }}
              >
                <Text style={styles.optionText}>{option.label}</Text>
                <Text style={{ color: "#828282ff", marginTop: 10 }}>
                  {option.description}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 15,
                  height: "100%",
                  paddingVertical: 10,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: 70,
                }}
              >
                {option.icon}
              </View>
            </TouchableOpacity>
          ))}

          {/* {selected ? (
            <Text style={styles.selectedText}>
              Bạn đã chọn: {selected === "ke-khai" ? "Kê khai" : "Khoán"}
            </Text>
          ) : null} */}
          <TouchableOpacity style={{ marginTop: 50 }}>
            <Text
              style={{
                textAlign: "center",
                width: "100%",
                color: ColorMain,
              }}
            >
              Xem hướng dẫn chi tiết
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
      <View
        style={{
          position: "absolute",
          bottom: 40,
          flexDirection: "row",
          justifyContent: "flex-end",
          width: "100%",
          paddingHorizontal: 30,
        }}
      >
        {/* <TouchableOpacity
          style={[
            styles.actionPage,
            {
              backgroundColor: "#fff",
              shadowColor: ColorMain,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.5,
            },
          ]}
          onPress={() => navigate.goBack()}
        >
          <Text style={{ color: ColorMain }}>Trở về</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[
            styles.actionPage,
            {
              backgroundColor: ColorMain,
              flexDirection: "row",
              paddingHorizontal: 15,
            },
          ]}
          onPress={handleSelectType}
        >
          <Text style={styles.textAction}>Tiếp theo</Text>
          <AntDesign
            name="arrowright"
            size={18}
            color="#fff"
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
  },
  titleWrapper: { alignItems: "center", marginBottom: 80 },
  title: {
    fontSize: 20,
    color: ColorMain,
    fontWeight: "500",
  },
  itemWrapper: {
    width: "100%",
    height: 100,
    borderRadius: 5,
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    elevation: 2,
    backgroundColor: "#fff",
    padding: 10,
    flexDirection: "row",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    marginBottom: 10,
    minHeight: 100,
    backgroundColor: "#fff",
  },
  optionSelected: {
    borderColor: ColorMain,
    backgroundColor: "#EAF2FF",
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    elevation: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cfcfcfff",
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#3F4E87",
    borderColor: "#fff",
  },
  optionText: {
    fontSize: 17,
    color: "#000",
    fontWeight: "800",
  },
  selectedText: {
    marginTop: 15,
    fontSize: 16,
    fontStyle: "italic",
  },
  actionPage: {
    paddingVertical: 15,
    borderRadius: 50,
    minWidth: 100,
    alignItems: "center",
  },
  textAction: {
    color: "#fff",
    fontWeight: 500,
  },
});
export default ChooseTaxTypeForHouseholdBusiness;
