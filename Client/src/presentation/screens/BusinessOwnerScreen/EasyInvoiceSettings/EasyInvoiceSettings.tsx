import { ColorMain } from "@/src/presentation/components/colors";
import {
	BusinessInforAuth,
	UpdateEasyInvoiceInfo,
} from "@/src/services/API/profileService";
import { RootStackParamList } from "@/src/types/route";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ActivityIndicator,
} from "react-native";

type NavProp = StackNavigationProp<RootStackParamList>;

interface EasyInvoiceInfo {
	account: string;
	password: string;
	mst: string;
	serial: string;
}

function EasyInvoiceSettings() {
	const navigate = useNavigation<NavProp>();
	const isFocused = useIsFocused();
	const [loading, setLoading] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [easyInvoiceInfo, setEasyInvoiceInfo] = useState<EasyInvoiceInfo>({
		account: "",
		password: "",
		mst: "",
		serial: "",
	});

	const fetchEasyInvoiceInfo = async () => {
		setLoading(true);
		try {
			const dataBusiness = await BusinessInforAuth();
			if (dataBusiness?.easyInvoiceInfo) {
				setEasyInvoiceInfo({
					account: dataBusiness.easyInvoiceInfo.account || "",
					password: dataBusiness.easyInvoiceInfo.password || "",
					mst: dataBusiness.easyInvoiceInfo.mst || "",
					serial: dataBusiness.easyInvoiceInfo.serial || "",
				});
			}
		} catch (error) {
			Alert.alert("Lỗi", "Không thể tải thông tin tài khoản EasyInvoice");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isFocused) {
			fetchEasyInvoiceInfo();
		}
	}, [isFocused]);

	const handleSave = async () => {
		// Validation
		if (!easyInvoiceInfo.account.trim()) {
			Alert.alert("Lỗi", "Tên tài khoản không được để trống");
			return;
		}

		setSaving(true);
		try {
			await UpdateEasyInvoiceInfo(easyInvoiceInfo);
			Alert.alert("Thành công", "Cập nhật thông tin EasyInvoice thành công");
		} catch (error: any) {
			Alert.alert(
				"Lỗi",
				error?.message || "Cập nhật thông tin thất bại, vui lòng thử lại",
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color={ColorMain} />
				<Text style={styles.loadingText}>Đang tải thông tin...</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<MaterialCommunityIcons
					name="invoice-text"
					size={60}
					color={ColorMain}
				/>
				<Text style={styles.headerTitle}>Tài khoản EasyInvoice</Text>
				<Text style={styles.headerSubtitle}>
					Quản lý thông tin kết nối với hệ thống EasyInvoice
				</Text>
			</View>

			<View style={styles.formContainer}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>
						Tên tài khoản <Text style={styles.required}>*</Text>
					</Text>
					<TextInput
						style={styles.input}
						placeholder="Nhập tên tài khoản EasyInvoice"
						value={easyInvoiceInfo.account}
						onChangeText={(text) =>
							setEasyInvoiceInfo({ ...easyInvoiceInfo, account: text })
						}
						autoCapitalize="none"
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Mật khẩu</Text>
					<View style={styles.passwordContainer}>
						<TextInput
							style={styles.passwordInput}
							placeholder="Nhập mật khẩu"
							value={easyInvoiceInfo.password}
							onChangeText={(text) =>
								setEasyInvoiceInfo({ ...easyInvoiceInfo, password: text })
							}
							secureTextEntry={!showPassword}
							autoCapitalize="none"
						/>
						<TouchableOpacity
							style={styles.eyeIcon}
							onPress={() => setShowPassword(!showPassword)}
						>
							<AntDesign
								name={showPassword ? "eye" : "eyeo"}
								size={20}
								color="#666"
							/>
						</TouchableOpacity>
					</View>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Mã số thuế (MST)</Text>
					<TextInput
						style={styles.input}
						placeholder="Nhập mã số thuế"
						value={easyInvoiceInfo.mst}
						onChangeText={(text) =>
							setEasyInvoiceInfo({ ...easyInvoiceInfo, mst: text })
						}
						keyboardType="numeric"
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Serial / Pattern</Text>
					<TextInput
						style={styles.input}
						placeholder="Ví dụ: 2C26MAA (năm 2026)"
						value={easyInvoiceInfo.serial}
						onChangeText={(text) =>
							setEasyInvoiceInfo({ ...easyInvoiceInfo, serial: text })
						}
						autoCapitalize="characters"
					/>
					<Text style={styles.helperText}>
						Pattern hóa đơn phải khớp với năm hiện tại (ví dụ: 2C26MAA cho năm
						2026)
					</Text>
				</View>

				<View style={styles.infoBox}>
					<AntDesign name="infocirlce" size={16} color="#666" />
					<Text style={styles.infoText}>
						Thông tin này sẽ được sử dụng để kết nối và đồng bộ hóa dữ liệu với
						hệ thống EasyInvoice.
					</Text>
				</View>

				<TouchableOpacity
					style={[styles.saveButton, saving && styles.saveButtonDisabled]}
					onPress={handleSave}
					disabled={saving}
				>
					{saving ? (
						<ActivityIndicator color="#fff" />
					) : (
						<>
							<AntDesign name="save" size={20} color="#fff" />
							<Text style={styles.saveButtonText}>Lưu thông tin</Text>
						</>
					)}
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
	loadingText: {
		marginTop: 10,
		fontSize: 16,
		color: "#666",
	},
	header: {
		backgroundColor: "#fff",
		padding: 24,
		alignItems: "center",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginTop: 12,
	},
	headerSubtitle: {
		fontSize: 14,
		color: "#666",
		marginTop: 8,
		textAlign: "center",
	},
	formContainer: {
		padding: 20,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	required: {
		color: "red",
	},
	input: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
	},
	passwordContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
	},
	passwordInput: {
		flex: 1,
		padding: 12,
		fontSize: 16,
	},
	eyeIcon: {
		padding: 12,
	},
	infoBox: {
		flexDirection: "row",
		backgroundColor: "#e3f2fd",
		padding: 12,
		borderRadius: 8,
		marginBottom: 24,
		gap: 8,
	},
	infoText: {
		flex: 1,
		fontSize: 13,
		color: "#666",
		lineHeight: 18,
	},
	saveButton: {
		backgroundColor: ColorMain,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
		borderRadius: 8,
		gap: 8,
	},
	saveButtonDisabled: {
		backgroundColor: "#ccc",
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
	},
	helperText: {
		fontSize: 12,
		color: "#666",
		marginTop: 4,
		fontStyle: "italic",
	},
});

export default EasyInvoiceSettings;
