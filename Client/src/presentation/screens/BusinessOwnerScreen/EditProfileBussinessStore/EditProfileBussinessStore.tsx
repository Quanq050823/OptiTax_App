// EditProfileBussinessStore.tsx
import { ColorMain } from "@/src/presentation/components/colors";
import {
  BusinessInforAuth,
  UpdateBusinessAuthStore,
} from "@/src/services/API/profileService";
import { BusinessInfo, FormDataType } from "@/src/types/route";
import { MaterialIcons } from "@expo/vector-icons";
import { Label } from "@react-navigation/elements";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Province from "@/src/presentation/components/Auth/Province/Province";
import provinces from "vietnam-provinces";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { useData } from "@/src/presentation/Hooks/useDataStore";

function EditProfileBussinessStore() {
  const { setData } = useData();

  const navigate = useAppNavigation();
  const [dataStore, setDataStore] = useState<BusinessInfo | undefined>();

  const [provinceList, setProvinceList] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null); // code
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null); // code
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    businessName: "",
    businessType: "",
    taxCode: "",
    address: {
      city: "",
      cityCode: "",
      district: "",
      districtCode: "",
      ward: "Nhà",
      street: "Ngoài Đường",
    },
    phoneNumber: "",
    industry: "Ăn uống",
  });

  // Helper: tìm code tỉnh theo tên
  //   const findProvinceCodeByName = (name?: string) => {
  //     if (!name) return null;
  //     const list = provinces.getProvinces(); // [{name, code}]
  //     const found = list.find((p: any) => p.name.trim() === name.trim());
  //     return found ? String(found.code) : null;
  //   };

  //   // Helper: tìm code quận theo tên & code tỉnh
  //   const findDistrictCodeByName = (
  //     provinceCode: string | null,
  //     districtName?: string
  //   ) => {
  //     if (!provinceCode || !districtName) return null;
  //     const dists = provinces.getDistricts(provinceCode);
  //     const found = dists.find((d: any) => d.name.trim() === districtName.trim());
  //     return found ? String(found.code) : null;
  //   };

  useEffect(() => {
    const fetchDataStore = async () => {
      const res: BusinessInfo = await BusinessInforAuth();
      setDataStore(res);
      setData(res);
      // 1) Cập nhật formData (tên + code nếu có)
      setFormData((prev) => ({
        ...prev,
        businessName: res.businessName ?? "",
        taxCode: res.taxCode ?? "",
        businessType: res.businessType ?? "",
        address: {
          city: res.address?.city ?? "",
          cityCode: res.address?.cityCode ?? "",
          district: res.address?.district ?? "",
          districtCode: res.address?.districtCode ?? "",
          ward: res.address?.ward ?? "",
          street: res.address?.street ?? "",
        },
        phoneNumber: res.phoneNumber ?? "",
      }));

      //   // 2) Tính selectedProvince/selectedDistrict (ưu tiên code, fallback theo tên)
      //   const provinceCode =
      //     res.address?.cityCode ?? findProvinceCodeByName(res.address?.city);

      //   // district code phụ thuộc province code
      //   const districtCode =
      //     res.address?.districtCode ??
      //     findDistrictCodeByName(
      //       provinceCode ?? null,
      //       res.address?.district || ""
      //     );

      //   setSelectedProvince(provinceCode ?? null);
      //   setSelectedDistrict(districtCode ?? null);
    };
    fetchDataStore();
  }, []);

  const handleSubmitUpdateStore = async () => {
    try {
      await UpdateBusinessAuthStore(formData);
      Alert.alert("Cập nhật thông tin cửa hàng thành công");
      navigate.goBack();
    } catch (error) {
      console.log("Lỗi cập nhật thông tin cửa hàng:", error);
    }
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={{ flex: 1, padding: 15, backgroundColor: "#fff" }}>
        <MaterialIcons
          name="store"
          size={50}
          color={ColorMain}
          style={{ alignSelf: "center" }}
        />

        <View style={{ marginTop: 10 }}>
          <Label style={styles.label}>Tên cửa hàng</Label>
          <TextInput
            style={[styles.input, styles.borderInput]}
            value={formData.businessName} // controlled
            onChangeText={(val) =>
              setFormData((prev) => ({ ...prev, businessName: val }))
            }
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Label style={styles.label}>Mã số thuế</Label>
          <TextInput
            style={[styles.input, styles.borderInput]}
            value={formData.taxCode} // controlled
            onChangeText={(val) =>
              setFormData((prev) => ({ ...prev, taxCode: val }))
            }
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Label style={styles.label}>Hình thức kinh doanh</Label>
          <TextInput
            style={[styles.input, styles.borderInput]}
            value={formData.businessType} // controlled
            onChangeText={(val) =>
              setFormData((prev) => ({ ...prev, businessType: val }))
            }
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Label style={styles.label}>Số điện thoại</Label>
          <TextInput
            style={[styles.input, styles.borderInput]}
            value={formData.phoneNumber} // controlled
            onChangeText={(val) =>
              setFormData((prev) => ({ ...prev, phoneNumber: val }))
            }
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <Label style={styles.label}>Địa chỉ</Label>
          <Province
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            setProvinceList={setProvinceList}
            provinceList={provinceList}
            setFormData={setFormData}
            selectedWard={selectedWard}
            setSelectedWard={setSelectedWard}
            formData={formData}
          />
          <View style={{ marginTop: 20 }}>
            <Label style={styles.label}>Số nhà, tên đường</Label>
            <TextInput
              style={[styles.input, styles.borderInput]}
              value={formData.address.street} // controlled
              onChangeText={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    street: val,
                  },
                }))
              }
            />
          </View>

          <TouchableOpacity
            style={styles.btnSave}
            onPress={handleSubmitUpdateStore}
          >
            <Text style={{ color: "#fff" }}>Lưu thông tin thay đổi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: "left",
    fontWeight: "500" as any, // RN StyleSheet yêu cầu string|number, TS đôi khi cần cast
    color: "#858585ff",
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
  btnSave: {
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: ColorMain,
    marginTop: 20,
  },
});

export default EditProfileBussinessStore;
