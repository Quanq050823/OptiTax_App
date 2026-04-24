import { ColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import { syncDataInvoiceIn } from "@/src/types/syncData";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import CaptchaView from "../CaptchaView";
import { LinearGradient } from "expo-linear-gradient";

type ModalOpen = {
	visible: boolean;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	onSyncInvoiceOut: () => Promise<void>;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	sourceImg?: string;
	setCapchacode: React.Dispatch<React.SetStateAction<string>>;
	capchaCode: string;
	onGetCaptcha: () => Promise<void>;
	selectDateCpn: boolean;
	setSelecDateCpn: React.Dispatch<React.SetStateAction<boolean>>;
	onSyncInvoiceIn?: (data: syncDataInvoiceIn) => Promise<void>;
};

function ModalSynchronized({
	visible,
	setVisible,
	onSyncInvoiceOut,
	loading,
	setLoading,
	sourceImg,
	setCapchacode,
	capchaCode,
	onGetCaptcha,
	selectDateCpn,
	setSelecDateCpn,
}: ModalOpen) {
	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();
	const [open, setOpen] = useState<"start" | "end" | null>(null);

	const isDisableSync = !startDate || !endDate || loading;

	const getMonthRange = (date: Date) => ({
		startDate: new Date(date.getFullYear(), date.getMonth(), 1),
		endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
	});

	const onConfirm = ({ date }: { date?: Date }) => {
		if (!date || !open) return;
		if (open === "start") {
			setStartDate(date);
			setEndDate(undefined);
		} else {
			if (!startDate) return;
			const { startDate: ms, endDate: me } = getMonthRange(startDate);
			if (date < ms || date > me) return;
			setEndDate(date);
		}
		setOpen(null);
	};

	const getEndDateRange = (start: Date) => {
		const today = new Date();
		const monthEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0);
		return { startDate: start, endDate: monthEnd > today ? today : monthEnd };
	};

	const formatDate = (date?: Date) =>
		date
			? `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
					.toString()
					.padStart(2, "0")}/${date.getFullYear()}`
			: "";

	return (
		<Modal
			animationType="fade"
			transparent
			visible={visible}
			statusBarTranslucent
			onRequestClose={() => setVisible(false)}
		>
			<Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.keyboardView}
				>
					<Pressable style={styles.sheet} onPress={() => {}}>
						<LoadingScreen visible={loading} />

						{/* Grabber */}
						<View style={styles.grabber} />

						{selectDateCpn ? (
							/* ── CAPTCHA STEP ── */
							<>
								<View style={styles.headerRow}>
									<View style={styles.headerLeft}>
										<MaterialIcons name="security" size={20} color={ColorMain} />
										<Text style={styles.title}>Xác thực captcha</Text>
									</View>
									<TouchableOpacity
										hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
										onPress={() => {
											setVisible(false);
											setSelecDateCpn(false);
										}}
									>
										<Ionicons name="close-circle" size={26} color="#aaa" />
									</TouchableOpacity>
								</View>

								<Text style={styles.subtitle}>
									Nhập mã captcha hiển thị bên dưới để tiếp tục
								</Text>

								<View style={styles.captchaCard}>
									<CaptchaView captchaImage={sourceImg} />
								</View>

								<View style={styles.captchaInputWrapper}>
									<MaterialIcons
										name="vpn-key"
										size={18}
										color="#888"
										style={styles.captchaIcon}
									/>
									<TextInput
										placeholder="Nhập mã captcha..."
										placeholderTextColor="#aaa"
										style={styles.captchaInput}
										value={capchaCode}
										onChangeText={setCapchacode}
										autoCapitalize="none"
										autoCorrect={false}
									/>
								</View>

								<SyncButton
									disabled={!capchaCode.trim() || loading}
									loading={loading}
									label="Xác nhận & đồng bộ"
									onPress={onSyncInvoiceOut}
								/>
							</>
						) : (
							/* ── DATE STEP ── */
							<>
								<View style={styles.headerRow}>
									<View style={styles.headerLeft}>
										<MaterialIcons name="sync" size={20} color={ColorMain} />
										<Text style={styles.title}>Đồng bộ hóa đơn</Text>
									</View>
									<TouchableOpacity
										hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
										onPress={() => setVisible(false)}
									>
										<Ionicons name="close-circle" size={26} color="#aaa" />
									</TouchableOpacity>
								</View>

								<Text style={styles.subtitle}>
									Chọn khoảng ngày lập hóa đơn cần đồng bộ
								</Text>

								<DatePickerModal
									locale="vi"
									mode="single"
									visible={!!open}
									date={open === "start" ? startDate : endDate}
									onConfirm={onConfirm}
									onDismiss={() => setOpen(null)}
									validRange={
										open === "end" && startDate
											? getEndDateRange(startDate)
											: undefined
									}
								/>

								<View style={styles.dateRow}>
									<DateField
										label="Từ ngày"
										value={formatDate(startDate)}
										onPress={() => setOpen("start")}
									/>
									<View style={styles.dateSeparator}>
										<MaterialIcons name="arrow-forward" size={18} color="#aaa" />
									</View>
									<DateField
										label="Đến ngày"
										value={formatDate(endDate)}
										onPress={() => startDate && setOpen("end")}
										disabled={!startDate}
									/>
								</View>

								{startDate && endDate && (
									<View style={styles.rangeBadge}>
										<MaterialIcons
											name="info-outline"
											size={14}
											color={ColorMain}
										/>
										<Text style={styles.rangeText}>
											{formatDate(startDate)} – {formatDate(endDate)}
										</Text>
									</View>
								)}

								<SyncButton
									disabled={isDisableSync}
									loading={loading}
									label="Tiếp theo"
									onPress={async () => {
										await onGetCaptcha();
										setSelecDateCpn(true);
									}}
								/>
							</>
						)}
					</Pressable>
				</KeyboardAvoidingView>
			</Pressable>
		</Modal>
	);
}

/* ─── Sub-components ─────────────────────────────────────── */

function DateField({
	label,
	value,
	onPress,
	disabled,
}: {
	label: string;
	value: string;
	onPress: () => void;
	disabled?: boolean;
}) {
	return (
		<TouchableOpacity
			style={[styles.dateField, disabled && styles.dateFieldDisabled]}
			onPress={onPress}
			activeOpacity={0.7}
		>
			<Text style={styles.dateFieldLabel}>{label}</Text>
			<View style={styles.dateFieldInner}>
				<Text style={[styles.dateFieldValue, !value && styles.datePlaceholder]}>
					{value || "dd/mm/yyyy"}
				</Text>
				<MaterialIcons
					name="calendar-today"
					size={16}
					color={disabled ? "#ccc" : ColorMain}
				/>
			</View>
		</TouchableOpacity>
	);
}

function SyncButton({
	disabled,
	loading,
	label,
	onPress,
}: {
	disabled: boolean;
	loading: boolean;
	label: string;
	onPress: () => void;
}) {
	return (
		<LinearGradient
			colors={disabled ? ["#d0d0d0", "#bdbdbd"] : ["#4dbf99", "#6A7DB3"]}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 0 }}
			style={styles.syncBtn}
		>
			<TouchableOpacity
				disabled={disabled}
				onPress={onPress}
				style={styles.syncBtnInner}
				activeOpacity={0.85}
			>
				{loading ? (
					<ActivityIndicator size="small" color="#fff" />
				) : (
					<>
						<MaterialIcons name="sync" size={18} color="#fff" />
						<Text style={styles.syncBtnText}>{label}</Text>
					</>
				)}
			</TouchableOpacity>
		</LinearGradient>
	);
}

/* ─── Styles ─────────────────────────────────────────────── */

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.45)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	keyboardView: {
		width: "100%",
	},
	sheet: {
		backgroundColor: "#fff",
		borderRadius: 20,
		width: "100%",
		paddingHorizontal: 20,
		paddingBottom: 24,
		paddingTop: 12,
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: -3 },
				shadowOpacity: 0.1,
				shadowRadius: 8,
			},
			android: {
				elevation: 12,
			},
		}),
	},
	grabber: {
		display: "none",
	},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 6,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	title: {
		fontSize: 17,
		fontWeight: "700",
		color: "#1a1a2e",
		letterSpacing: 0.2,
	},
	subtitle: {
		fontSize: 13,
		color: "#888",
		marginBottom: 20,
		lineHeight: 18,
	},
	/* Date fields */
	dateRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 12,
	},
	dateSeparator: {
		marginTop: 14,
	},
	dateField: {
		flex: 1,
		backgroundColor: "#f5f6fa",
		borderRadius: 12,
		padding: 12,
		borderWidth: 1,
		borderColor: "#e8e8ee",
	},
	dateFieldDisabled: {
		opacity: 0.5,
	},
	dateFieldLabel: {
		fontSize: 11,
		color: "#999",
		marginBottom: 4,
		fontWeight: "500",
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	dateFieldInner: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	dateFieldValue: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1a1a2e",
	},
	datePlaceholder: {
		color: "#bbb",
		fontWeight: "400",
	},
	rangeBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		backgroundColor: "#edf8f4",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 6,
		marginBottom: 4,
		alignSelf: "flex-start",
	},
	rangeText: {
		fontSize: 12,
		color: ColorMain,
		fontWeight: "500",
	},
	/* Captcha */
	captchaCard: {
		alignSelf: "center",
		borderRadius: 12,
		overflow: "hidden",
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#e8e8ee",
	},
	captchaInputWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f5f6fa",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e8e8ee",
		paddingHorizontal: 12,
		marginBottom: 8,
		height: 50,
	},
	captchaIcon: {
		marginRight: 8,
	},
	captchaInput: {
		flex: 1,
		fontSize: 15,
		color: "#1a1a2e",
	},
	/* Button */
	syncBtn: {
		borderRadius: 14,
		marginTop: 16,
		overflow: "hidden",
	},
	syncBtnInner: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		paddingVertical: 15,
	},
	syncBtnText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 15,
		letterSpacing: 0.3,
	},
});

export default ModalSynchronized;
