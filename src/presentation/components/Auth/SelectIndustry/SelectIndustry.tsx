import { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const data = [
  // 🔰 1. Dịch vụ ăn uống
  { label: "Quán ăn, nhà hàng", value: "food_restaurant" },
  { label: "Quán cà phê, trà sữa", value: "cafe_tea" },
  { label: "Bán đồ ăn nhanh, thức ăn vỉa hè", value: "fast_street_food" },
  { label: "Dịch vụ đặt tiệc, nấu ăn tại nhà", value: "catering_home" },

  // 🔰 2. Bán lẻ hàng hóa
  { label: "Tạp hóa", value: "grocery" },
  { label: "Shop thời trang, quần áo, giày dép", value: "fashion_shop" },
  { label: "Cửa hàng điện thoại, linh kiện", value: "mobile_store" },
  { label: "Bán đồ gia dụng, nội thất", value: "household_goods" },
  { label: "Hiệu thuốc (theo điều kiện hành nghề)", value: "pharmacy" },

  // 🔰 3. Sản xuất – chế biến thủ công
  { label: "Sản xuất bánh kẹo, thực phẩm khô", value: "food_production" },
  { label: "Gia công đồ gỗ, sắt, cơ khí nhỏ", value: "handcraft_metal_wood" },
  { label: "Dệt may, thêu thùa, đan lát thủ công", value: "textile_handcraft" },
  { label: "Làm nem, giò chả, mắm…", value: "traditional_food" },

  // 🔰 4. Dịch vụ cá nhân
  { label: "Cắt tóc, làm tóc, nail, spa", value: "personal_beauty" },
  { label: "Giặt ủi, sửa chữa đồ gia dụng", value: "laundry_repair" },
  { label: "Sửa xe, rửa xe máy/ô tô", value: "vehicle_service" },
  { label: "Giữ trẻ, trông trẻ tại nhà", value: "babysitting" },

  // 🔰 5. Dịch vụ vận tải & giao nhận
  { label: "Giao hàng (shipper)", value: "delivery" },
  { label: "Xe ôm công nghệ", value: "motor_taxi" },
  { label: "Vận tải hàng hóa nhỏ", value: "freight_transport" },
  { label: "Cho thuê xe, xe du lịch", value: "car_rental" },

  // 🔰 6. Giáo dục & đào tạo
  { label: "Gia sư", value: "tutor" },
  { label: "Trung tâm dạy thêm, học ngoại ngữ", value: "education_center" },
  {
    label: "Dạy nghề: tin học, kế toán, làm đẹp…",
    value: "vocational_training",
  },

  // 🔰 7. Nông nghiệp – chăn nuôi
  { label: "Trồng rau, cây cảnh (bán tại chợ)", value: "farming_plants" },
  { label: "Chăn nuôi nhỏ lẻ: gà, vịt, lợn…", value: "small_livestock" },
  {
    label: "Kinh doanh nông sản, vật tư nông nghiệp",
    value: "agriculture_trade",
  },

  // 🔰 8. Thương mại điện tử
  { label: "Bán hàng online (Facebook, Shopee…)", value: "online_selling" },
  { label: "Kinh doanh livestream", value: "livestream_business" },
  { label: "Dropshipping", value: "dropshipping" },
];
function SelectIndustry() {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  return (
    <Dropdown
      style={[styleSelect.dropdown, isFocus && { borderColor: "#5A67D8" }]}
      placeholderStyle={styleSelect.placeholderStyle}
      selectedTextStyle={styleSelect.selectedTextStyle}
      inputSearchStyle={styleSelect.inputSearchStyle}
      iconStyle={styleSelect.iconStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder={!isFocus ? "Chọn ngành nghề kinh doanh" : "..."}
      searchPlaceholder="Tìm kiếm..."
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item.value);
        setIsFocus(false);
      }}
    />
  );
}

const styleSelect = StyleSheet.create({
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdown: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    elevation: 2,
    marginTop: 7,
  },
  placeholderStyle: {
    color: "#999",
  },
  selectedTextStyle: {
    color: "#000",
  },
});
export default SelectIndustry;
