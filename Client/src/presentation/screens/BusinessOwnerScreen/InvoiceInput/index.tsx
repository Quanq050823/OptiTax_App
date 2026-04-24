import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import InvoiInputList from "@/src/presentation/components/List/InvoiInputList";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ModalCreateProductsByInvoiceInput from "@/src/presentation/components/Modal/ModalCreateProductsByInvoiceInput";
import ModalLoginCCT from "@/src/presentation/components/Modal/ModalLoginCCT";

import ModalSynchronized from "@/src/presentation/components/Modal/ModalSynchronized";
import SearchByName from "@/src/presentation/components/SearchByName";
import { getLocalDate } from "@/src/presentation/Controller/FomatDate";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import { getInvoiceInputList } from "@/src/services/API/invoiceService";
import {
	BusinessInforAuth,
	getUserProfile,
} from "@/src/services/API/profileService";
import {
	getCapcha,
	getInvoiceIn,
	getInvoiceInById,
	syncInvoiceIn,
	verifyCapchaInput,
} from "@/src/services/API/syncInvoiceIn";
import { CapchaInfo, InvoiceSummary, RawInvoice } from "@/src/types/invoiceIn";
import { Invoice, Profile, UserProfile } from "@/src/types/route";
import { syncDataInvoiceIn } from "@/src/types/syncData";
import { GdtTokenStorage } from "@/src/utils/tokenStorage";
import {
	AntDesign,
	Entypo,
	FontAwesome5,
	Fontisto,
	Ionicons,
} from "@expo/vector-icons";
import { log } from "console";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
	Alert,
	Animated,
	Easing,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { DatePickerModal, tr } from "react-native-paper-dates";

function InvoiceInput() {
	const { data } = useData();
	const [selectDateCpn, setSelecDateCpn] = useState(false);

	const [visible, setVisible] = useState(false);
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [openLogin, setOpenLogin] = useState(false);
	const [loading, setLoading] = useState(false);
	const [invoiceDataSync, setInvoiceDataSync] = useState<InvoiceSummary[]>([]);
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [openSelectedDate, setOpenSelectedDate] = useState(false);
	const [openModalDate, setOpenModalDate] = useState(false);
	const [startDateFil, setStartDateFil] = useState<Date | undefined>();
	const [endDateFil, setEndDateFil] = useState<Date | undefined>();
	const [listInvoiceDataSync, setListInvoiceDataSync] = useState<RawInvoice[]>(
		[],
	);
	const [dataVerifyCapcha, setDataVerifyCapcha] = useState<
		CapchaInfo | undefined
	>(undefined);
	const [syncDataInvoiceIn, setSyncDataInvoiceIn] = useState<syncDataInvoiceIn>(
		{ dateto: "", datefrom: "" },
	);

	const spinValue = useRef(new Animated.Value(0)).current;
	const [openListProductSynchronized, setOpenListProductSynchronized] =
		useState(false);
	const [capchaCode, setCapchacode] = useState("");

	const spinAnimation = () => {
		spinValue.setValue(0);
		Animated.timing(spinValue, {
			toValue: 1,
			duration: 1000,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start(({ finished }) => {
			if (finished && loading) {
				spinAnimation();
			}
		});
	};

	useEffect(() => {
		if (loading) {
			spinAnimation();
		} else {
			spinValue.stopAnimation(() => {
				spinValue.setValue(0);
			});
		}
	}, [loading]);

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});
	const handleLoadingSynchronized = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setVisible(true);
		}, 2000);
	};

	const handleGetCapcha = async () => {
		setLoading(true);
		try {
			// Kiểm tra GDT token còn hạn (24h) → bỏ qua bước captcha
			const cachedToken = await GdtTokenStorage.get();
			if (cachedToken) {
				const syncRes = await syncInvoiceIn(cachedToken);
				const { sync = 0, skip = 0, fail = 0 } = (syncRes as any) ?? {};
				Alert.alert(
					"Đồng bộ hoàn tất",
					`Mới: ${sync}  |  Đã có: ${skip}  |  Lỗi: ${fail}`,
				);
				const updated = await getInvoiceIn();
				setListInvoiceDataSync(updated);
				return;
			}

			const res = await getCapcha();
			setDataVerifyCapcha(res);
			setVisible(true);
		} catch (err) {
			Alert.alert("Lỗi lấy captcha!");
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyCapchaSync = async () => {
		setLoading(true);
		try {
			if (!dataVerifyCapcha?.ckey || !capchaCode) {
				Alert.alert("Vui lòng nhập mã captcha");
				return;
			}
			if (!data?.taxCode || !data?.password) {
				Alert.alert("Không có thông tin đăng nhập");
				return;
			}

			const authRes = await verifyCapchaInput(
				data.taxCode,
				data.password,
				capchaCode,
				dataVerifyCapcha.ckey,
			);

			const gdtToken = authRes.token;
			await GdtTokenStorage.save(gdtToken);
			const syncRes = await syncInvoiceIn(gdtToken);

			setCapchacode("");
			setVisible(false);
			setSelecDateCpn(false);

			const { sync = 0, skip = 0, fail = 0 } = (syncRes as any) ?? {};
			Alert.alert(
				"Đồng bộ hoàn tất",
				`Mới: ${sync}  |  Đã có: ${skip}  |  Lỗi: ${fail}`,
			);

			// Tải lại danh sách
			const updated = await getInvoiceIn();
			setListInvoiceDataSync(updated);
		} catch (err: any) {
			console.log("HANDLE VERIFY ERROR:", err);
			Alert.alert(
				"Lỗi",
				err?.message ?? "Xác thực captcha hoặc đồng bộ thất bại",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchInvoiceSync = async () => {
			setLoading(true);
			try {
				const res = await getInvoiceIn();
				setLoading(false);

				setListInvoiceDataSync(res);
			} catch {
				console.log("Không có dữ liệu");
				setLoading(true);
			}
		};

		fetchInvoiceSync();
	}, []);

	const normalizeStartDate = (date: Date) => {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);
		return d;
	};

	const normalizeEndDate = (date: Date) => {
		const d = new Date(date);
		d.setHours(23, 59, 59, 999);
		return d;
	};
	const filteredInvoices = listInvoiceDataSync.filter((inv) => {
		if (!startDateFil || !endDateFil) return true;
		if (!inv.ngayLap) return false;

		const invoiceDate = new Date(inv.ngayLap);
		if (isNaN(invoiceDate.getTime())) return false;

		const start = normalizeStartDate(startDateFil);
		const end = normalizeEndDate(endDateFil);

		return invoiceDate >= start && invoiceDate <= end;
	});
	const clearDateFilter = () => {
		setStartDateFil(undefined);
		setEndDateFil(undefined);
	};
	return (
		<View style={{ flex: 1, position: "relative", paddingHorizontal: 10 }}>
			<DatePickerModal
				locale="vi"
				mode="range"
				visible={openSelectedDate}
				startDate={startDateFil}
				endDate={endDateFil}
				onDismiss={() => setOpenSelectedDate(false)}
				onConfirm={({ startDate, endDate }) => {
					setOpenSelectedDate(false);
					setStartDateFil(startDate);
					setEndDateFil(endDate);
				}}
			/>
			<LoadingScreen visible={loading} />
			{/* <HeaderScreen /> */}
			{/* Toolbar: search + date filter */}
			<View style={styles.toolbar}>
				<View style={styles.searchWrap}>
					<SearchByName label="Tìm kiếm nhà cung cấp" />
				</View>
				<TouchableOpacity
					style={[
						styles.calBtn,
						startDateFil && endDateFil && styles.calBtnActive,
					]}
					onPress={() => {
						if (startDateFil && endDateFil) {
							clearDateFilter();
						} else {
							setOpenSelectedDate(true);
						}
					}}
				>
					<Ionicons
						name={startDateFil && endDateFil ? "close" : "calendar-outline"}
						size={20}
						color={startDateFil && endDateFil ? "#fff" : textColorMain}
					/>
				</TouchableOpacity>
			</View>
			{startDateFil && endDateFil && (
				<View style={styles.chipWrap}>
					<View style={styles.chip}>
						<Ionicons name="calendar" size={12} color={textColorMain} />
						<Text style={styles.chipText}>
							{startDateFil.toLocaleDateString("vi-VN")} –{" "}
							{endDateFil.toLocaleDateString("vi-VN")}
						</Text>
					</View>
				</View>
			)}
			<ModalCreateProductsByInvoiceInput
				setOpenListProductSynchronized={setOpenListProductSynchronized}
				openListProductSynchronized={openListProductSynchronized}
				invoicesData={invoices}
			/>

			<InvoiInputList invoicesData={filteredInvoices} />
			<ModalSynchronized
				sourceImg={dataVerifyCapcha?.captchaImage}
				visible={visible}
				setCapchacode={setCapchacode}
				capchaCode={capchaCode}
				setVisible={setVisible}			onSyncInvoiceOut={handleVerifyCapchaSync}				onSyncInvoiceIn={handleVerifyCapchaSync}
				loading={loading}
				setLoading={setLoading}
				onGetCaptcha={handleGetCapcha}
				setSelecDateCpn={setSelecDateCpn}
				selectDateCpn={selectDateCpn}
			/>
			<ModalLoginCCT openLogin={openLogin} setOpenLogin={setOpenLogin} />
		</View>
	);
}
const styles = StyleSheet.create({
	toolbar: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginTop: 12,
	},
	searchWrap: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 12,
		overflow: "hidden",
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.06,
				shadowRadius: 4,
			},
			android: { elevation: 2 },
		}),
	},
	calBtn: {
		width: 44,
		height: 44,
		borderRadius: 12,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 1 },
				shadowOpacity: 0.06,
				shadowRadius: 4,
			},
			android: { elevation: 2 },
		}),
	},
	calBtnActive: {
		backgroundColor: textColorMain,
	},
	chipWrap: {
		marginTop: 8,
	},
	chip: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		alignSelf: "flex-start",
		backgroundColor: "#f0fdf8",
		borderWidth: 1,
		borderColor: textColorMain,
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 5,
	},
	chipText: {
		fontSize: 12,
		color: textColorMain,
		fontWeight: "500",
	},
});

export default InvoiceInput;
