import Logo from "@/src/presentation/components/Auth/Logo/Logo";
import Province from "@/src/presentation/components/Auth/Province/Province";
import SelectImage from "@/src/presentation/components/Auth/SelectImage/SelectImage";
import SelectIndustry from "@/src/presentation/components/Auth/SelectIndustry/SelectIndustry";
import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { Label } from "@react-navigation/elements";
import { CommonActions } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";

function BusinessRegistrationStepTwo({ navigation }: Props) {
  const navigate = useAppNavigation();
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [provinceList, setProvinceList] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [taxCode, setTaxcode] = useState<string | null>(null);
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 10 }}
    >
      <View style={stylesBST.container}>
        <View style={stylesAuth.wrapLogin}>
          <Logo widthLogo={40} heightLogo={35} />
          <View style={{ flex: 1, width: "100%", marginTop: 30 }}>
            <Text style={stylesBST.label}>
              Xác minh thông tin hộ kinh doanh
            </Text>
            <View style={{ width: "100%", marginTop: 20 }}>
              <Label style={stylesBST.labelInput}>
                Nhập tên hộ kinh doanh:
              </Label>
              <TextInput
                label="Nhập đúng theo giấy phép ĐKKD..."
                style={stylesBST.input}
                // onChangeText={setCode}
                underlineColor={ColorMain}
                activeUnderlineColor={ColorMain}
                theme={{
                  colors: {
                    onSurfaceVariant: "#9d9d9d",
                  },
                }}
              />
            </View>
            <View style={{ width: "100%", marginTop: 10 }}>
              <Label style={stylesBST.labelInput}>
                Mã hộ kinh doanh (Mã số thuế):
              </Label>
              <TextInput
                label="Do cơ quan thuế cấp..."
                style={stylesBST.input}
                underlineColor={ColorMain}
                activeUnderlineColor={ColorMain}
                placeholderTextColor={"#fff"}
                onChangeText={(value) => setTaxcode(value)}
                theme={{
                  colors: {
                    onSurfaceVariant: "#9d9d9d",
                    primary: ColorMain, // ✅ label khi focus
                    text: "#000", // ✅ nội dung gõ vào
                  },
                }}
              />
            </View>

            {/* <View style={{ width: "100%", marginTop: 10, height: 80 }}>
              <Label style={stylesBST.labelInput}>Ngày cấp:</Label>
              <DatePickerInput
                locale="en"
                label="Trên giấy phép ĐKKD..."
                value={inputDate}
                onChange={(d) => setInputDate(d)}
                inputMode="start"
                style={{ backgroundColor: "#fff" }}
                theme={{
                  colors: {
                    primary: ColorMain, // 🔵 Màu label và outline khi focus
                    text: "#000", // 🖋️ Màu nội dung gõ vào
                    onSurfaceVariant: "#9d9d9d",
                  },
                }}
              />
            </View> */}

            <View style={{ marginTop: 16 }}>
              <Label style={stylesBST.labelInput}>Địa chỉ:</Label>
              <Province
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                setProvinceList={setProvinceList}
                provinceList={provinceList}
              />
            </View>

            <View style={{ marginTop: 30 }}>
              <Label style={stylesBST.labelInput}>Ngành nghề kinh doanh:</Label>
              <SelectIndustry />
            </View>

            {/* <View style={{ width: "100%", marginTop: 30 }}>
              <Label style={stylesBST.labelInput}>
                Số giấy phép kinh doanh / đăng ký kinh doanh:
              </Label>
              <TextInput
                label="Nhập số GPKD/DKKD"
                style={stylesBST.input}
                underlineColor={ColorMain}
                activeUnderlineColor={ColorMain}
                theme={{
                  colors: {
                    primary: ColorMain, // màu khi focus
                    text: "#000", // màu nội dung
                    placeholder: "#9d9d9d", // 🔥 chính là label khi chưa focus
                    onSurfaceVariant: "#9d9d9d",
                  },
                }}
              />
            </View>
            <View style={{ width: "100%", marginTop: 30 }}>
              <Label style={stylesBST.labelInput}>
                Ảnh chụp GPKD (File upload mặt trước/đủ trang)
              </Label>
              <SelectImage />
            </View> */}
            <TouchableOpacity
              style={[stylesAuth.btnLogin, { marginTop: 20 }]}
              onPress={() =>
                // navigate.navigate("BusinessRegistrationStepThree", {
                //   taxCode: taxCode,
                // })
                navigate.navigate("NavigationBusiness")
              }
            >
              <Text style={stylesAuth.textBtnLogin}>
                {loading ? <ActivityIndicator color="#fff" /> : "Gửi"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const stylesBST = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingBottom: 50,
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",

    width: "100%",
    marginTop: 5,
  },
  label: {
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    fontWeight: 500,
  },
  labelInput: {
    textAlign: "left",
    fontWeight: 800,
  },
});
export default BusinessRegistrationStepTwo;
