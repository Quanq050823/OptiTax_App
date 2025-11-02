// Province.tsx
import { ColorMain } from "@/src/presentation/components/colors";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import provinces from "vietnam-provinces";
import { FormDataType } from "@/src/types/route";

type ProvinceProps = {
  selectedProvince: string | null; // province code
  setSelectedProvince: (value: string | null) => void;
  selectedDistrict: string | null; // district code
  setSelectedDistrict: (value: string | null) => void;
  setProvinceList: (list: { label: string; value: string }[]) => void;
  provinceList: { label: string; value: string }[];
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  selectedWard?: string | null;
  setSelectedWard?: (value: string | null) => void;
  formData?: FormDataType;
};

function Province({
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
  setProvinceList,
  provinceList,
  setFormData,
  selectedWard,
  setSelectedWard,
  formData,
}: ProvinceProps) {
  const [districtList, setDistrictList] = useState<
    { label: string; value: string }[]
  >([]);
  const [wardList, setWardList] = useState<{ label: string; value: string }[]>(
    []
  );
  useEffect(() => {
    const provs = provinces.getProvinces(); // [{ name, code }]
    const formatted = provs.map((p: any) => ({
      label: p.name,
      value: String(p.code), // luôn cast string
    }));
    setProvinceList(formatted);
  }, [setProvinceList]);

  useEffect(() => {
    if (!selectedProvince) {
      setDistrictList([]);
      return;
    }
    const dists = provinces.getDistricts(String(selectedProvince)); // ép sang string
    const formatted = dists.map((d: any) => ({
      label: d.name,
      value: String(d.code),
    }));
    setDistrictList(formatted);
  }, [selectedProvince]);

  // Lấy danh sách phường
  useEffect(() => {
    if (!selectedDistrict) {
      setWardList([]);
      return;
    }
    const wards = provinces.getWards(String(selectedDistrict)); // ép sang string
    const formatted = wards.map((w: any) => ({
      label: w.name,
      value: String(w.code),
    }));
    setWardList(formatted);
  }, [selectedDistrict]);

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        data={provinceList}
        labelField="label"
        valueField="value"
        placeholder={
          formData?.address.city
            ? formData.address.city
            : "Chọn Tỉnh/ Thành phố"
        }
        placeholderStyle={{ color: "#9d9d9d" }}
        value={selectedProvince}
        onChange={(item) => {
          // Cập nhật formData: tên + code tỉnh, reset quận
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              city: item.label,
              cityCode: item.value,
              district: "",
              districtCode: "",
            },
          }));
          setSelectedProvince(item.value);
          setSelectedDistrict(null);
        }}
      />

      <Dropdown
        style={[styles.dropdown, { marginTop: 10 }]}
        data={districtList}
        labelField="label"
        valueField="value"
        placeholderStyle={{ color: "#9d9d9d" }}
        placeholder={
          formData?.address.district
            ? formData.address.district
            : "Chọn Quận/ Huyện"
        }
        value={selectedDistrict}
        onChange={(item) => {
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              district: item.label,
              districtCode: item.value,
            },
          }));
          setSelectedDistrict(item.value);
        }}
        disable={!selectedProvince}
      />

      <Dropdown
        style={[styles.dropdown, { marginTop: 10 }]}
        data={wardList}
        labelField="label"
        valueField="value"
        placeholder={
          formData?.address.ward ? formData.address.ward : "Chọn Phường/ Xã"
        }
        placeholderStyle={{ color: "#9d9d9d" }}
        value={selectedWard}
        onChange={(item) => {
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              ward: item.label,
              wardCode: item.value,
            },
          }));
          if (setSelectedWard) {
            setSelectedWard(item.value); // chỉ gọi khi không undefined
          }
        }}
        disable={!selectedDistrict}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    flex: 1,
  },
  dropdown: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 2,
    // shadowColor: "#343434ff",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.5,
    // shadowRadius: 1,
    borderWidth: 0.5,
    borderColor: "#cfcfcf",
  },
});

export default Province;
