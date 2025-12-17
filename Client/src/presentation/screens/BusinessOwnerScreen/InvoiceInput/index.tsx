import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import InvoiInputList from "@/src/presentation/components/List/InvoiInputList";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ModalCreateProductsByInvoiceInput from "@/src/presentation/components/Modal/ModalCreateProductsByInvoiceInput";
import ModalLoginCCT from "@/src/presentation/components/Modal/ModalLoginCCT";

import ModalSynchronized from "@/src/presentation/components/Modal/ModalSynchronized";
import SearchByName from "@/src/presentation/components/SearchByName";
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
import { AntDesign, FontAwesome5, Fontisto } from "@expo/vector-icons";
import { log } from "console";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { tr } from "react-native-paper-dates";

function InvoiceInput() {
  const { data } = useData();

  const [visible, setVisible] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [openLogin, setOpenLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceDataSync, setInvoiceDataSync] = useState<InvoiceSummary[]>([]);
  const [listInvoiceDataSync, setListInvoiceDataSync] = useState<RawInvoice[]>(
    []
  );
  const [dataVerifyCapcha, setDataVerifyCapcha] = useState<
    CapchaInfo | undefined
  >(undefined);
  const [syncDataInvoiceIn, setSyncDataInvoiceIn] = useState<syncDataInvoiceIn>(
    { dateto: "", datefrom: "" }
  );

  const spinValue = useRef(new Animated.Value(0)).current;
  const [openListProductSynchronized, setOpenListProductSynchronized] =
    useState(false);
  const [capchaCode, setCapchacode] = useState("");

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
      setVisible(true);
    }, 2000);
  };

  const handleGetCapcha = async () => {
    setLoading(true);

    try {
      if (!data?.taxCode || !data?.password) {
        Alert.alert("Không có thông tin đăng nhập");
        throw new Error("Thiếu mã số thuế hoặc mật khẩu");
      }

      const res = await getCapcha(data.taxCode, data.password);

      setDataVerifyCapcha(res);
      setVisible(true);
      setLoading(false);
    } catch (err) {
      Alert.alert("Lỗi lấy dữ liệu!");
    } finally {
      setLoading(false); // 👈 luôn chạy
    }
  };
  console.log(dataVerifyCapcha?.sessionId, "session");

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
        "input"
      );

      console.log("VERIFY CAPTCHA RES:", res);

      const total = res?.invoices?.datas?.length ?? 0;
      Alert.alert(`Số hóa đơn: ${total}`);
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

  return (
    <View style={{ flex: 1, position: "relative", paddingHorizontal: 10 }}>
      <LoadingScreen visible={loading} />
      {/* <HeaderScreen /> */}
      <View style={styles.searchWrapper}>
        <SearchByName label="Tìm kiếm nhà cung cấp" />
        <View style={{ flex: 1, alignItems: "center", paddingRight: 20 }}>
          <TouchableOpacity>
            <FontAwesome5 name="calendar-alt" size={24} color={textColorMain} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.synchronizedWrapper}>
        {/* <TouchableOpacity
          style={styles.btnSyn}
          onPress={() => setOpenListProductSynchronized(true)}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>
            Tạo sản phẩm &nbsp;
            <AntDesign name="plus" size={15} color="#fff" />
          </Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={styles.btnSyn}
          onPress={() => setOpenLogin(true)}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>
            Đăng nhập &nbsp;
            <AntDesign name="plus" size={15} color="#fff" />
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.btnSyn} onPress={handleGetCapcha}>
          <Text style={{ color: "#fff", fontSize: 14 }}>
            {loading ? (
              <>
                Đang đồng bộ &nbsp;
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Fontisto name="spinner-refresh" size={13} color="#fff" />
                </Animated.View>
              </>
            ) : (
              <>
                Đồng bộ &nbsp;
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Fontisto name="spinner-refresh" size={13} color="#fff" />
                </Animated.View>
              </>
            )}
          </Text>
        </TouchableOpacity>
      </View>
      <ModalCreateProductsByInvoiceInput
        setOpenListProductSynchronized={setOpenListProductSynchronized}
        openListProductSynchronized={openListProductSynchronized}
        invoicesData={invoices}
      />

      <InvoiInputList invoicesData={listInvoiceDataSync} />
      <ModalSynchronized
        sourceImg={dataVerifyCapcha?.captchaImage}
        visible={visible}
        setCapchacode={setCapchacode}
        capchaCode={capchaCode}
        setVisible={setVisible}
        setSyncDataInvoiceIn={setSyncDataInvoiceIn}
        onSyncInvoiceIn={handleVerifyCapchaSync}
        loading={loading}
        setLoading={setLoading}
      />
      <ModalLoginCCT openLogin={openLogin} setOpenLogin={setOpenLogin} />
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
  },
  btnSyn: {
    backgroundColor: ColorMain,
    padding: 10,
    borderRadius: 10,
  },
  rotato: {},
});

export default InvoiceInput;
