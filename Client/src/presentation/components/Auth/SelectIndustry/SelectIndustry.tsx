import { ColorMain } from "@/src/presentation/components/colors";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
const data = [
	// 🔰 1. Dịch vụ ăn uống
	{
		label: "Quán ăn, nhà hàng",
		value: "food_restaurant",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Quán cà phê, trà sữa",
		value: "cafe_tea",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Bán đồ ăn nhanh, thức ăn vỉa hè",
		value: "fast_street_food",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Dịch vụ đặt tiệc, nấu ăn tại nhà",
		value: "catering_home",
		taxType: "SERVICE_WITH_MATERIAL",
	},

	// 🔰 2. Bán lẻ hàng hóa
	{ label: "Tạp hóa", value: "grocery", taxType: "GOODS_SUPPLY" },
	{
		label: "Shop thời trang, quần áo, giày dép",
		value: "fashion_shop",
		taxType: "GOODS_SUPPLY",
	},
	{
		label: "Cửa hàng điện thoại, linh kiện",
		value: "mobile_store",
		taxType: "GOODS_SUPPLY",
	},
	{
		label: "Bán đồ gia dụng, nội thất",
		value: "household_goods",
		taxType: "GOODS_SUPPLY",
	},
	{
		label: "Hiệu thuốc (theo điều kiện hành nghề)",
		value: "pharmacy",
		taxType: "GOODS_SUPPLY",
	},

	// 🔰 3. Sản xuất – chế biến thủ công
	{
		label: "Sản xuất bánh kẹo, thực phẩm khô",
		value: "food_production",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Gia công đồ gỗ, sắt, cơ khí nhỏ",
		value: "handcraft_metal_wood",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Dệt may, thêu thùa, đan lát thủ công",
		value: "textile_handcraft",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Làm nem, giò chả, mắm…",
		value: "traditional_food",
		taxType: "SERVICE_WITH_MATERIAL",
	},

	// 🔰 4. Dịch vụ cá nhân
	{
		label: "Cắt tóc, làm tóc, nail, spa",
		value: "personal_beauty",
		taxType: "SERVICE_NO_MATERIAL",
	},
	{
		label: "Giặt ủi, sửa chữa đồ gia dụng",
		value: "laundry_repair",
		taxType: "SERVICE_NO_MATERIAL",
	},
	{
		label: "Sửa xe, rửa xe máy/ô tô",
		value: "vehicle_service",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Giữ trẻ, trông trẻ tại nhà",
		value: "babysitting",
		taxType: "SERVICE_NO_MATERIAL",
	},

	// 🔰 5. Dịch vụ vận tải & giao nhận
	{
		label: "Giao hàng (shipper)",
		value: "delivery",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Xe ôm công nghệ",
		value: "motor_taxi",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Vận tải hàng hóa nhỏ",
		value: "freight_transport",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Cho thuê xe, xe du lịch",
		value: "car_rental",
		taxType: "SERVICE_NO_MATERIAL",
	},

	// 🔰 6. Giáo dục & đào tạo
	{ label: "Gia sư", value: "tutor", taxType: "SERVICE_NO_MATERIAL" },
	{
		label: "Trung tâm dạy thêm, học ngoại ngữ",
		value: "education_center",
		taxType: "SERVICE_NO_MATERIAL",
	},
	{
		label: "Dạy nghề: tin học, kế toán, làm đẹp…",
		value: "vocational_training",
		taxType: "SERVICE_NO_MATERIAL",
	},

	// 🔰 7. Nông nghiệp – chăn nuôi
	{
		label: "Trồng rau, cây cảnh (bán tại chợ)",
		value: "farming_plants",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Chăn nuôi nhỏ lẻ: gà, vịt, lợn…",
		value: "small_livestock",
		taxType: "SERVICE_WITH_MATERIAL",
	},
	{
		label: "Kinh doanh nông sản, vật tư nông nghiệp",
		value: "agriculture_trade",
		taxType: "GOODS_SUPPLY",
	},

	// 🔰 8. Thương mại điện tử
	{
		label: "Bán hàng online (Facebook, Shopee…)",
		value: "online_selling",
		taxType: "GOODS_SUPPLY",
	},
	{
		label: "Kinh doanh livestream",
		value: "livestream_business",
		taxType: "OTHER_BUSINESS",
	},
	{ label: "Dropshipping", value: "dropshipping", taxType: "OTHER_BUSINESS" },
];

type Industry = {
	setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

function SelectIndustry({ setFormData }: Industry) {
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
			dropdownPosition="top"
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
				setFormData((prev) => ({
					...prev,
					businessType: item.label,
					taxType: item.taxType,
				}));
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
		elevation: 2,
		marginTop: 7,
		shadowColor: ColorMain,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.22,
	},
	placeholderStyle: {
		color: "#999",
	},
	selectedTextStyle: {
		color: "#000",
	},
});
export default SelectIndustry;
