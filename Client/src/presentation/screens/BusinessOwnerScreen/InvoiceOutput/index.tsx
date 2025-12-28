import CaptchaView from "@/src/presentation/components/CaptchaView";
import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import HeaderScreen from "@/src/presentation/components/layout/Header";
import InvoiceOutputList from "@/src/presentation/components/List/InvoiceOutputList";
import InvoiInputList from "@/src/presentation/components/List/InvoiInputList";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ModalCreateProductsByInvoiceOuput from "@/src/presentation/components/Modal/ModalCreateProductsByInvoiceOuput";
import ModalLoginCCT from "@/src/presentation/components/Modal/ModalLoginCCT";
import ModalSetDateSync from "@/src/presentation/components/Modal/ModalSetDateSync";
import ModalSynchronized from "@/src/presentation/components/Modal/ModalSynchronized";
import SearchByName from "@/src/presentation/components/SearchByName";
import { getLocalDate } from "@/src/presentation/Controller/FomatDate";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import { getInvoiceOutputList } from "@/src/services/API/invoiceService";
import { getCapcha, verifyCapchaInput } from "@/src/services/API/syncInvoiceIn";
import { CapchaInfo, InvoiceListResponse } from "@/src/types/invoiceIn";
import { Invoice, InvoiceItemExtra } from "@/src/types/route";
import {
  AntDesign,
  Entypo,
  FontAwesome5,
  Fontisto,
  Ionicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DatePickerInput, DatePickerModal, tr } from "react-native-paper-dates";

type InvoiceOutputProps = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function InvoiceOutput({ loading, setLoading }: InvoiceOutputProps) {
  const { data } = useData();
  const [visible, setVisible] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [openLogin, setOpenLogin] = useState(false);
  const [openListProductSynchronized, setOpenListProductSynchronized] =
    useState(false);
  const [selectDateCpn, setSelecDateCpn] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [openSelectedDate, setOpenSelectedDate] = useState(false);
  const [openModalDate, setOpenModalDate] = useState(false);
  const [startDateFil, setStartDateFil] = useState<Date | undefined>();
  const [endDateFil, setEndDateFil] = useState<Date | undefined>();
  const [dataVerifyCapcha, setDataVerifyCapcha] = useState<
    CapchaInfo | undefined
  >(undefined);
  const [capchaCode, setCapchacode] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const spinValue = useRef(new Animated.Value(0)).current;
  const navigate = useAppNavigation();
  const fetchListInvoice = async () => {
    setLoading(true);
    try {
      const data = await getInvoiceOutputList();
      setInvoices(data.data);
      setLoading(false);
    } catch (error) {
      Alert.alert("Không tìm thấy dữ liệu hoá đơn");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListInvoice();
  }, []);

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (loading) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000, // 1 vòng / giây
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [loading]);
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const handleLoadingSynchronized = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenLogin(true);
    }, 2000);
  };

  const handleGetCapcha = async () => {
    setLoading(true);
    try {
      if (!data?.taxCode || !data?.password) {
        Alert.alert("Không có thông tin đăng nhập");
        return;
      }

      const res = await getCapcha(data.taxCode, data.password);
      setDataVerifyCapcha(res);
    } catch (err) {
      Alert.alert("Lỗi lấy captcha!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCapchaSync = async () => {
    setLoading(true);
    try {
      if (!dataVerifyCapcha?.sessionId || !capchaCode) {
        Alert.alert("Sai captcha hoặc sessionId");
        return;
      }

      const res = await verifyCapchaInput(
        dataVerifyCapcha.sessionId,
        capchaCode,
        "output"
      );

      const total = res?.invoices?.datas?.length ?? 0;
      Alert.alert(
        "Thông báo",
        `Số hóa đơn: ${total}`,
        [
          {
            text: "OK",
            onPress: () => {
              setVisible(false);
              setSelecDateCpn(false);
              fetchListInvoice(); // 👈 gọi hàm tại đây
            },
          },
        ],
        { cancelable: false }
      );
      setCapchacode("");
    } catch (err: any) {
      console.log("HANDLE VERIFY ERROR:", err);
      console.log("MESSAGE:", err?.response?.data?.message);

      Alert.alert(
        "Lỗi",
        err?.response?.data?.message ?? "Xác thực captcha thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  const normalizeEndDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!startDateFil || !endDateFil) return true;

    const invoiceDate = new Date(inv.ncnhat); // ✅ DATE THẬT

    return (
      invoiceDate >= startDateFil && invoiceDate <= normalizeEndDate(endDateFil)
    );
  });
  const clearDateFilter = () => {
    setStartDateFil(undefined);
    setEndDateFil(undefined);
  };
  return (
    <View style={{ flex: 1, paddingHorizontal: 10 }}>
      {/* <HeaderScreen /> */}
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
      <View style={styles.searchWrapper}>
        <SearchByName label="Tìm kiếm mã hoá đơn" />
        {/* <View style={{ flex: 1, alignItems: "center", paddingRight: 20 }}>
          <TouchableOpacity>
            <FontAwesome5 name="calendar-alt" size={24} color={ColorMain} />
          </TouchableOpacity>
        </View> */}
      </View>
      <View style={styles.synchronizedWrapper}>
        {/* <TouchableOpacity
          style={styles.btnSyn}
          onPress={() => setOpenListProductSynchronized(true)}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>
            Xuất hóa đơn &nbsp;
            <AntDesign name="plus" size={15} color="#fff" />
          </Text>
        </TouchableOpacity> */}
        {/* <LinearGradient
          colors={[ColorMain, "#6A7DB3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 3 }}
          style={{ borderRadius: 5 }}
        >
          <TouchableOpacity
            style={styles.btnSyn}
            onPress={() => navigate.navigate("ExportInvoicePayment")}
          >
            <Text style={{ color: "#fff", fontSize: 14 }}>
              Xuất HĐ &nbsp;
              <AntDesign name="plus" size={15} color="#fff" />
            </Text>
          </TouchableOpacity>
        </LinearGradient> */}

        <LinearGradient
          colors={[ColorMain, "#6A7DB3"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 3 }}
          style={{ borderRadius: 5 }}
        >
          <TouchableOpacity
            style={styles.btnSyn}
            onPress={() => setVisible(true)}
          >
            <Text style={{ color: "#fff", fontSize: 14 }}>
              {loading ? (
                <>
                  Đang đồng bộ &nbsp;
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Entypo name="arrow-bold-down" size={13} color="#fff" />
                  </Animated.View>
                </>
              ) : (
                <>
                  Đồng bộ &nbsp;
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Entypo name="arrow-bold-down" size={13} color="#fff" />
                  </Animated.View>
                </>
              )}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity
          style={[
            styles.btnSyn,
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              borderWidth: 0.5,
              borderColor: textColorMain,
              borderRadius: 5,
            },
          ]}
          onPress={() => {
            if (!startDateFil || !endDateFil) {
              setOpenSelectedDate(true);
            }
          }}
        >
          <Text style={{ color: textColorMain, fontWeight: "500" }}>
            {startDateFil && endDateFil
              ? `${startDateFil.toLocaleDateString()} - ${endDateFil.toLocaleDateString()}`
              : "Tất cả"}
          </Text>

          {startDateFil && endDateFil ? (
            <Ionicons
              name="close"
              size={16}
              color={textColorMain}
              onPress={clearDateFilter} // 🔥 xoá filter
            />
          ) : (
            <Ionicons name="options" size={15} color={textColorMain} />
          )}
        </TouchableOpacity>
      </View>
      <ModalCreateProductsByInvoiceOuput
        setOpenListProductSynchronized={setOpenListProductSynchronized}
        openListProductSynchronized={openListProductSynchronized}
        invoicesData={invoices}
      />
      <InvoiceOutputList
        invoicesData={filteredInvoices}
        fetchData={fetchListInvoice}
      />
      {/* <ModalSynchronized visible={visible} setVisible={setVisible} /> */}
      <ModalLoginCCT openLogin={openLogin} setOpenLogin={setOpenLogin} />
      <ModalSynchronized
        sourceImg={dataVerifyCapcha?.captchaImage}
        visible={visible}
        setCapchacode={setCapchacode}
        capchaCode={capchaCode}
        setVisible={setVisible}
        onSyncInvoiceOut={handleVerifyCapchaSync}
        onGetCaptcha={handleGetCapcha}
        loading={loading}
        setLoading={setLoading}
        setSelecDateCpn={setSelecDateCpn}
        selectDateCpn={selectDateCpn}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
      />
      <ModalSetDateSync visible={openModalDate} setVisible={setOpenModalDate} />
    </View>
  );
}
const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#d8d7d7ff",
    marginTop: 20,
  },
  synchronizedWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 50,
  },
  btnSyn: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 10,
  },
});

export default InvoiceOutput;
