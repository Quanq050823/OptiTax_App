import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import provinces from "vietnam-provinces";

function Province() {
  const [provinceList, setProvinceList] = useState<
    { label: string; value: string }[]
  >([]);
  const [districtList, setDistrictList] = useState<
    { label: string; value: string }[]
  >([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

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
      <Text style={styles.label}>Chọn Tỉnh / Thành phố</Text>
      <Dropdown
        style={styles.dropdown}
        data={provinceList}
        labelField="label"
        valueField="value"
        placeholder="Chọn tỉnh"
        value={selectedProvince}
        onChange={(item) => setSelectedProvince(item.value)}
      />

      <Text style={[styles.label, { marginTop: 20 }]}>Chọn Quận / Huyện</Text>
      <Dropdown
        style={styles.dropdown}
        data={districtList}
        labelField="label"
        valueField="value"
        placeholder="Chọn quận"
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
