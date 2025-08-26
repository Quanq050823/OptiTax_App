import Logo from "@/src/presentation/components/Auth/Logo/Logo";
import Province from "@/src/presentation/components/Auth/Province/Province";
import SelectImage from "@/src/presentation/components/Auth/SelectImage/SelectImage";
import SelectIndustry from "@/src/presentation/components/Auth/SelectIndustry/SelectIndustry";
import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { BusinessInforAuth } from "@/src/services/API/profileService";
import { TokenStorage } from "@/src/utils/tokenStorage";
import { Label } from "@react-navigation/elements";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

  const [formData, setFormData] = useState<FormDataType>({
    businessName: "",
    businessType: "",
    taxCode: "",
    address: {
      city: null,
      district: null,
      ward: "Nhà",
      street: "Ngoài Đường",
    },
    phoneNumber: "",
    industry: "Ăn uống",
  });

  console.log(formData);

  const handleSubmitInfoBuss = async () => {
    const {
      businessName,
      businessType,
      taxCode,
      address,
      phoneNumber,
      industry,
    } = formData;

    // Kiểm tra các trường bắt buộc
    if (
      !businessName.trim() ||
      !businessType.trim() ||
      !taxCode.trim() ||
      !phoneNumber.trim() ||
      !industry.trim() ||
      !address.city ||
      !address.district
    ) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng điền đầy đủ tất cả các trường bắt buộc."
      );
      return;
    }

    setLoading(true);
    try {
      await BusinessInforAuth(formData);
      setLoading(false);
      navigate.navigate("NavigationBusiness");
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Xác minh thất bại", error?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      <View style={stylesBST.container}>
        <View style={stylesAuth.wrapLogin}>
          <Logo widthLogo={40} heightLogo={35} />
          <View style={{ flex: 1, width: "100%", marginTop: 30 }}>
            <Text style={stylesBST.label}>
              Xác minh thông tin hộ kinh doanh
            </Text>
            <View style={{ width: "100%", marginTop: 50 }}>
              <Text style={stylesBST.labelInput}>
                Tên hộ kinh doanh
                <Text style={{ color: "red", fontWeight: "500" }}>*</Text>
              </Text>
              <TextInput
                label="Nhập đúng theo giấy phép ĐKKD..."
                style={stylesBST.input}
                // onChangeText={setCode}
                // underlineColor={ColorMain}
                // activeUnderlineColor={ColorMain}
                theme={{
                  colors: {
                    onSurfaceVariant: "#9d9d9d",
                  },
                }}
                onChangeText={(val) =>
                  setFormData((prev) => ({ ...prev, businessName: val }))
                }
              />
            </View>
            <View style={{ width: "100%", marginTop: 10 }}>
              <Text style={stylesBST.labelInput}>
                Số điện thoại
                <Text style={{ color: "red", fontWeight: "500" }}> *</Text>
              </Text>
              <TextInput
                label="Số điện thoại kinh doanh"
                style={stylesBST.input}
                // underlineColor={ColorMain}
                // activeUnderlineColor={ColorMain}
                placeholderTextColor={"#fff"}
                onChangeText={(val) =>
                  setFormData((prev) => ({ ...prev, phoneNumber: val }))
                }
                theme={{
                  colors: {
                    onSurfaceVariant: "#9d9d9d",
                    primary: ColorMain,
                    text: "#000",
                  },
                }}
              />
            </View>
            <View style={{ width: "100%", marginTop: 10 }}>
              <Text style={stylesBST.labelInput}>
                Mã hộ kinh doanh (Mã số thuế)
                <Text style={{ color: "red", fontWeight: "500" }}>*</Text>
              </Text>
              <TextInput
                label="Do cơ quan thuế cấp..."
                style={stylesBST.input}
                // underlineColor={ColorMain}
                // activeUnderlineColor={ColorMain}
                placeholderTextColor={"#fff"}
                onChangeText={(val) =>
                  setFormData((prev) => ({ ...prev, taxCode: val }))
                }
                theme={{
                  colors: {
                    onSurfaceVariant: "#9d9d9d",
                    primary: ColorMain,
                    text: "#000",
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
              <Text style={stylesBST.labelInput}>
                Địa chỉ
                <Text style={{ color: "red", fontWeight: "500" }}> *</Text>
              </Text>
              <Province
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
                selectedDistrict={selectedDistrict}
                setSelectedDistrict={setSelectedDistrict}
                setProvinceList={setProvinceList}
                provinceList={provinceList}
                setFormData={setFormData}
              />
            </View>

            <View style={{ marginTop: 30 }}>
              <Text style={stylesBST.labelInput}>
                Ngành nghề kinh doanh
                <Text style={{ color: "red", fontWeight: "500" }}> *</Text>
              </Text>
              <SelectIndustry setFormData={setFormData} />
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
            <View style={{ width: "100%", alignItems: "flex-end" }}>
              <TouchableOpacity
                style={[stylesBST.btn, { marginTop: 30 }]}
                // onPress={() =>
                //   // navigate.navigate("BusinessRegistrationStepThree", {
                //   //   taxCode: taxCode,
                //   // })
                //   navigate.navigate("NavigationBusiness")
                // }
                onPress={handleSubmitInfoBuss}
              >
                <Text style={stylesAuth.textBtnLogin}>
                  {loading ? <ActivityIndicator color="#fff" /> : "Tiếp theo"}
                </Text>
              </TouchableOpacity>
            </View>
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
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    width: "100%",
    marginTop: 5,
    borderRadius: 8,
  },
  label: {
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    fontWeight: 500,
    color: ColorMain,
  },
  labelInput: {
    textAlign: "left",
    fontWeight: 400,
    fontSize: 15,
  },
  btn: {
    backgroundColor: ColorMain,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
  },
});
export default BusinessRegistrationStepTwo;
