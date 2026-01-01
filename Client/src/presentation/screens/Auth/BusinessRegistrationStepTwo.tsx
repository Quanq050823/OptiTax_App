import Logo from "@/src/presentation/components/Auth/Logo/Logo";
import Province from "@/src/presentation/components/Auth/Province/Province";
import SelectIndustry from "@/src/presentation/components/Auth/SelectIndustry/SelectIndustry";
import { ColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import {
	CreateBusinessAuth
} from "@/src/services/API/profileService";
import { FormDataType, Props } from "@/src/types/route";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ImageBackground,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { TextInput } from "react-native-paper";

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
		taxType: "",
		address: {
			city: null,
			district: null,
			ward: "Nhà",
			street: "Ngoài Đường",
		},
		phoneNumber: "",
		industry: "Ăn uống",
		password: "",
		tax_filing_frequency: 2,
	});

	const handleSubmitInfoBuss = async () => {
		setLoading(true);

		const {
			businessName,
			businessType,
			taxCode,
			taxType,
			address,
			phoneNumber,
			industry,
			password,
			tax_filing_frequency,
		} = formData;

		// Kiểm tra các trường bắt buộc
		if (
			!businessName.trim() ||
			!businessType.trim() ||
			!taxType.trim() ||
			!taxCode.trim() ||
			!phoneNumber.trim() ||
			!industry.trim() ||
			!address.city ||
			!address.district ||
			!password?.trim() ||
			!tax_filing_frequency
		) {
			Alert.alert(
				"Thiếu thông tin",
				"Vui lòng điền đầy đủ tất cả các trường bắt buộc."
			);
			setLoading(false);
			return;
		}

		try {
			await CreateBusinessAuth(formData);
			setLoading(false);
			navigate.navigate("NavigationBusiness");
		} catch (error: any) {
			setLoading(false);
			Alert.alert("Xác minh thất bại", error?.message || "Có lỗi xảy ra.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ImageBackground
			style={[stylesBST.containerImg]}
			source={require("@/assets/images/background.png")}
			resizeMode="cover"
		>
			<ScrollView keyboardShouldPersistTaps="handled">
				<View style={stylesBST.container}>
					<View style={stylesBST.wrapInfo}>
						<Logo widthLogo={40} heightLogo={35} />
						<View style={{ flex: 1, width: "100%", marginTop: 30 }}>
							<Text style={stylesBST.label}>
								Xác minh thông tin hộ kinh doanh
							</Text>
							<View style={{ width: "100%", marginTop: 50 }}>
								<Text style={stylesBST.labelInput}>
									Tên kinh doanh
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

							<View style={{ width: "100%", marginTop: 10 }}>
								<Text style={stylesBST.labelInput}>
									Mật khẩu tài khoản thuế
									<Text style={{ color: "red", fontWeight: "500" }}>*</Text>
								</Text>
								<TextInput
									label="Mật khẩu đăng nhập cổng thuế điện tử..."
									style={stylesBST.input}
									secureTextEntry
									placeholderTextColor={"#fff"}
									onChangeText={(val) =>
										setFormData((prev) => ({ ...prev, password: val }))
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

							<View style={{ marginTop: 30 }}>
								<Text style={stylesBST.labelInput}>
									Hình thức nộp thuế
									<Text style={{ color: "red", fontWeight: "500" }}> *</Text>
								</Text>
								<View style={{ marginTop: 5 }}>
									<TouchableOpacity
										style={[
											stylesBST.radioOption,
											formData.tax_filing_frequency === 1 &&
												stylesBST.radioOptionSelected,
										]}
										onPress={() =>
											setFormData((prev) => ({
												...prev,
												tax_filing_frequency: 1,
											}))
										}
									>
										<View style={stylesBST.radioCircle}>
											{formData.tax_filing_frequency === 1 && (
												<View style={stylesBST.selectedRb} />
											)}
										</View>
										<Text style={stylesBST.radioText}>Nộp theo tháng</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={[
											stylesBST.radioOption,
											formData.tax_filing_frequency === 2 &&
												stylesBST.radioOptionSelected,
										]}
										onPress={() =>
											setFormData((prev) => ({
												...prev,
												tax_filing_frequency: 2,
											}))
										}
									>
										<View style={stylesBST.radioCircle}>
											{formData.tax_filing_frequency === 2 && (
												<View style={stylesBST.selectedRb} />
											)}
										</View>
										<Text style={stylesBST.radioText}>Nộp theo quý</Text>
									</TouchableOpacity>
								</View>
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
			<LoadingScreen visible={loading} />
		</ImageBackground>
	);
}

const stylesBST = StyleSheet.create({
	containerImg: {
		flex: 1,
	},
	container: {
		flex: 1,
		width: "100%",
		paddingBottom: 50,
	},
	input: {
		fontSize: 16,
		marginBottom: 15,
		shadowColor: "#cfcfcf",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.5,
		shadowRadius: 2,
		width: "100%",
		marginTop: 5,
		borderRadius: 5,
		height: 50,
		borderWidth: 0.5,
		borderColor: "#cfcfcf",
		backgroundColor: "#fff",
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
		fontWeight: "600",
		fontSize: 15,
		color: "#555555ff",
	},
	btn: {
		backgroundColor: ColorMain,
		height: 50,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		width: "40%",
	},
	wrapInfo: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		paddingHorizontal: 20,
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		paddingTop: 70,
	},
	radioOption: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 12,
		paddingHorizontal: 15,
		backgroundColor: "#fff",
		borderRadius: 8,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#e0e0e0",
	},
	radioOptionSelected: {
		borderColor: ColorMain,
		backgroundColor: "#f0f8ff",
	},
	radioCircle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: ColorMain,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	selectedRb: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: ColorMain,
	},
	radioText: {
		fontSize: 15,
		color: "#555555ff",
		fontWeight: "500",
	},
});
export default BusinessRegistrationStepTwo;
