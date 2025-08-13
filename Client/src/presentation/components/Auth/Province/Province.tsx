import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import provinces from "vietnam-provinces";

type ProvinceProps = {
  selectedProvince: string | null;
  setSelectedProvince: (value: string | null) => void;
  selectedDistrict: string | null;
  setSelectedDistrict: (value: string | null) => void;
  setProvinceList: (list: { label: string; value: string }[]) => void;
  provinceList: { label: string; value: string }[];
};
function Province({
  selectedProvince,
  setSelectedProvince,
  selectedDistrict,
  setSelectedDistrict,
  setProvinceList,
  provinceList,
}: ProvinceProps) {
  const [districtList, setDistrictList] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const provs = provinces.getProvinces(); // lấy tất cả tỉnh/thành
    const formatted = provs.map((item) => ({
      label: item.name,
      value: item.code, // dùng mã để load quận
    }));
    setProvinceList(formatted);
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const districts = provinces.getDistricts(selectedProvince);
      const formatted = districts.map((item: { name: any; code: any }) => ({
        label: item.name,
        value: item.code,
      }));
      setDistrictList(formatted);
      setSelectedDistrict(null); // reset quận nếu đổi tỉnh
    }
  }, [selectedProvince]);
  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>Chọn Tỉnh / Thành phố</Text> */}
      {useMemo(
        () => (
          <Dropdown
            style={styles.dropdown}
            data={provinceList}
            labelField="label"
            valueField="value"
            placeholder="Chọn Tỉnh/ Thành phố"
            value={selectedProvince}
            onChange={(item) => setSelectedProvince(item.value)}
          />
        ),
        [provinceList, selectedProvince, setSelectedProvince]
      )}

      <Text style={[styles.label, { marginTop: 10 }]}></Text>
      <Dropdown
        style={styles.dropdown}
        data={districtList}
        labelField="label"
        valueField="value"
        placeholder="Chọn Quận/ Huyện"
        value={selectedDistrict}
        onChange={(item) => setSelectedDistrict(item.value)}
        disable={!selectedProvince}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { marginTop: 10 },
  dropdown: {
    height: 60,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  label: {
    marginBottom: 4,
    color: "#9d9d9d",
    fontWeight: "bold",
  },
});
export default Province;
