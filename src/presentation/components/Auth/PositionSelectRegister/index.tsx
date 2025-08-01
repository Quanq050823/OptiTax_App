import { RoleContext } from "@/src/presentation/Hooks/RoleContext";
import React, { useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const data = [
  { label: "Hộ kinh doanh", value: "business" },
  { label: "Kế toán viên", value: "tax" },
];

const PositionSelectRegister = () => {
  const { role, setRole } = useContext(RoleContext);

  useEffect(() => {
    console.log("✅ Vai trò đã cập nhật:", role);
  }, [role]);

  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Chọn chức vụ --"
        value={role}
        onChange={(item) => {
          setRole(item.value);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    width: "100%",
  },
  dropdown: {
    height: 50,

    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    position: "relative",
  },
  placeholderStyle: {
    color: "#333",
  },
  selectedTextStyle: {
    color: "#000",
  },
});

export default PositionSelectRegister;
