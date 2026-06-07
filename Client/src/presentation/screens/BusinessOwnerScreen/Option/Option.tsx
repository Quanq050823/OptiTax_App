import { ColorMain } from "@/src/presentation/components/colors";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { useColors } from "@/src/presentation/Hooks/useColor";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import { useTheme } from "@/src/presentation/Hooks/useTheme";
import {
	BusinessInforAuth,
	getUserProfile,
	updateUserAvatar,
} from "@/src/services/API/profileService";
import { Profile, UserProfile } from "@/src/types/route";
import {
	AntDesign,
	Feather,
	FontAwesome6,
	Ionicons,
	MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const getInitials = (value?: string) => {
	if (!value) return "EO";
	return value
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((word) => word.charAt(0).toUpperCase())
		.join("");
};

function Option() {
	const navigate = useAppNavigation();
	const { data, setData } = useData();
	const [profile, setProfile] = React.useState<Profile | null>(null);
	const { isDark, setIsDark } = useTheme();
	const colors = useColors();
	const [uploadingAvatar, setUploadingAvatar] = React.useState(false);

	const fetchProfile = async () => {
		try {
			const data: UserProfile = await getUserProfile();
			const dataBussiness = await BusinessInforAuth();
			setProfile({
				...data,
				businessName: dataBussiness?.businessName,
				address: dataBussiness?.address,
				phoneNumber: dataBussiness?.phoneNumber,
				taxCode: dataBussiness?.taxCode,
				password: dataBussiness?.password,
				businessType: dataBussiness?.businessType,
			});
		} catch (error) {
			console.error("Error fetching profile:", error);
		}
	};

	const handlePickAvatar = async () => {
		const permission =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permission.status !== "granted") {
			Alert.alert("Thông báo", "Bạn cần cấp quyền thư viện ảnh để đổi avatar");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.75,
		});

		if (result.canceled || !result.assets?.[0]) return;

		const image = result.assets[0];
		setUploadingAvatar(true);
		try {
			const updated = await updateUserAvatar(
				{
					uri: image.uri,
					name: image.fileName || "avatar.jpg",
					type: image.mimeType || "image/jpeg",
				},
				profile?.name,
			);
			setProfile((prev) => (prev ? { ...prev, ...updated } : (updated as Profile)));
			setData((prev) => (prev ? { ...prev, ...updated } : (updated as Profile)));
			Alert.alert("Thành công", "Đã cập nhật ảnh đại diện");
		} catch {
			Alert.alert("Lỗi", "Không thể cập nhật ảnh đại diện");
		} finally {
			setUploadingAvatar(false);
		}
	};

	React.useEffect(() => {
		fetchProfile();
	}, []);
	const displayName = profile?.businessName || profile?.name || data?.businessName || data?.name;
	const avatarUrl = profile?.avatar || data?.avatar;
	return (
		<View style={{ flex: 1, width: "100%" }}>
			{/* <HeaderScreen /> */}
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{
					backgroundColor: isDark ? "#111111ff" : "#e9f2f2db",
				}}
			>
				<View style={{ paddingHorizontal: 10, alignItems: "center" }}>
					<View
						style={[styles.UserWrapper, { backgroundColor: colors.textDark }]}
					>
						<LinearGradient
							colors={[ColorMain, "#5b74b8ff"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 3 }}
							style={{
								borderRadius: 50,
								alignItems: "center",
								padding: 5,
								width: "100%",
								flexDirection: "row",
								paddingHorizontal: 10,
								paddingVertical: 10,
								shadowColor: "#00000033",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.3,
								shadowRadius: 4,
								elevation: 5,
							}}
						>
							<TouchableOpacity
								style={styles.avatarAction}
								activeOpacity={0.8}
								onPress={handlePickAvatar}
								disabled={uploadingAvatar}
							>
								{avatarUrl ? (
									<Image source={{ uri: avatarUrl }} style={styles.avatar} />
								) : (
									<View style={styles.avatarFallback}>
										<Text style={styles.avatarFallbackText}>
											{getInitials(displayName)}
										</Text>
									</View>
								)}
								<View style={styles.avatarEditBadge}>
									{uploadingAvatar ? (
										<ActivityIndicator size={12} color="#fff" />
									) : (
										<Feather name="camera" size={13} color="#fff" />
									)}
								</View>
							</TouchableOpacity>
							<View
								style={{
									justifyContent: "space-between",
									flex: 1,
									marginLeft: 15,
									height: 60,
								}}
							>
								<Text style={styles.name} numberOfLines={1}>
									{displayName || "Tài khoản EON"}
								</Text>
								<Text style={styles.role}>{profile?.email}</Text>
								<Text style={styles.role}>
									{profile?.userType === 1 ? "Hộ kinh doanh" : "Kế toán viên"}
								</Text>
							</View>
							<TouchableOpacity
								style={styles.actionProfile}
								onPress={() => navigate.navigate("ProfileBusiness")}
							>
								<AntDesign name="setting" size={24} color="#fff" />
							</TouchableOpacity>
						</LinearGradient>
					</View>
					<View style={[styles.wrItem, { backgroundColor: colors.textDark }]}>
						<TouchableOpacity
							style={styles.item}
							onPress={() => navigate.navigate("StoreScreen")}
						>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<AntDesign name="shopping" size={17} color={colors.textLight} />
								<Text style={[styles.titleItem, { color: colors.textLight }]}>
									Cửa hàng
								</Text>
							</View>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Text
									style={{
										color: "#9d9d9d",
										marginRight: 5,
									}}
								>
									{profile?.businessName || "Chưa cập nhật"}
								</Text>
								<MaterialIcons
									name="keyboard-arrow-right"
									size={20}
									color={colorText}
								/>
							</View>
						</TouchableOpacity>
						<TouchableOpacity style={styles.item}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<FontAwesome6
									name="file-invoice"
									size={17}
									color={colors.textLight}
								/>
								<Text style={[styles.titleItem, { color: colors.textLight }]}>
									Quản lý hoá đơn
								</Text>
							</View>
							<MaterialIcons
								name="keyboard-arrow-right"
								size={20}
								color={colorText}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.item}
							onPress={() => navigate.navigate("ProductManager")}
						>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<AntDesign name="product" size={17} color={colors.textLight} />
								<Text style={[styles.titleItem, { color: colors.textLight }]}>
									Quản lý sản phẩm
								</Text>
							</View>

							<MaterialIcons
								name="keyboard-arrow-right"
								size={20}
								color={colorText}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.item}
							onPress={() => navigate.navigate("ProductManager")}
						>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Feather name="users" size={17} color={colors.textLight} />
								<Text style={[styles.titleItem, { color: colors.textLight }]}>
									Quản lý khách hàng
								</Text>
							</View>

							<MaterialIcons
								name="keyboard-arrow-right"
								size={20}
								color={colorText}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={styles.item}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Ionicons name="moon" size={17} color={colors.textLight} />
								<Text style={[styles.titleItem, { color: colors.textLight }]}>
									Chế độ tối
								</Text>
							</View>

							<Switch
								value={isDark}
								onValueChange={setIsDark}
								trackColor={{ false: "#d1d1d1", true: "#3c88acff" }}
							/>
						</TouchableOpacity>
						<TouchableOpacity style={styles.item}>
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Feather name="settings" size={17} color={colors.textLight} />
								<Text style={[styles.titleItem, { color: colors.textLight }]}>
									Cài đặt
								</Text>
							</View>

							<MaterialIcons
								name="keyboard-arrow-right"
								size={20}
								color={colorText}
							/>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const colorText = "#585858ff";
const styles = StyleSheet.create({
	UserWrapper: {
		marginBottom: 10,
		paddingVertical: 10,
		borderRadius: 20,
		flexDirection: "row",
		paddingHorizontal: 5,
		backgroundColor: "#fff",
		marginTop: 10,
	},
	name: {
		fontSize: 20,
		color: "#fff",
		fontWeight: "700",
	},
	role: {
		fontSize: 13,
		color: "#fff",
	},
	actionProfile: {
		padding: 5,
		borderRadius: 5,
	},
	avatarAction: {
		width: 74,
		height: 74,
		position: "relative",
	},
	avatar: {
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 2,
		borderColor: "#ffffff",
	},
	avatarFallback: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: "#e8f3f1",
		borderWidth: 2,
		borderColor: "#ffffff",
		alignItems: "center",
		justifyContent: "center",
	},
	avatarFallbackText: {
		color: "#1f7a70",
		fontSize: 20,
		fontWeight: "800",
	},
	avatarEditBadge: {
		position: "absolute",
		right: 0,
		bottom: 2,
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: "#1f7a70",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
		borderColor: "#ffffff",
	},
	item: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		backgroundColor: "transparent",
		paddingVertical: 15,
		paddingHorizontal: 10,
		borderRadius: 8,
		// shadowColor: "#a7a7a7ff",
		// shadowOffset: { width: 0, height: 1 },
		// shadowRadius: 8,
		// shadowOpacity: 0.2,
		// elevation: 5,
	},
	titleItem: { fontSize: 15, color: "#000", fontWeight: "500", marginLeft: 10 },
	dataDev: {
		flexDirection: "row",
		alignItems: "center",
	},
	wrItem: {
		backgroundColor: "#fff",
		borderRadius: 20,
		paddingVertical: 10,
		paddingHorizontal: 10,
		shadowColor: "#a7a7a7ff",
		shadowOffset: { width: 0, height: 1 },
		shadowRadius: 8,
		shadowOpacity: 0.2,
		elevation: 5,
	},
});
export default Option;
