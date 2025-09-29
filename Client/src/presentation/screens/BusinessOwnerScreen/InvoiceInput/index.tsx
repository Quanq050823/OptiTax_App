import { ColorMain } from "@/src/presentation/components/colors";
import InvoiInputList from "@/src/presentation/components/List/InvoiInputList";
import ModalCreateProductsByInvoiceInput from "@/src/presentation/components/Modal/ModalCreateProductsByInvoiceInput";
import ModalLoginCCT from "@/src/presentation/components/Modal/ModalEditProduct/ModalLoginCCT";

import ModalSynchronized from "@/src/presentation/components/Modal/ModalSynchronized";
import SearchByName from "@/src/presentation/components/SearchByName";
import { useData } from "@/src/presentation/Hooks/useDataStore";
import { getInvoiceInputList } from "@/src/services/API/invoiceService";
import {
  BusinessInforAuth,
  getUserProfile,
} from "@/src/services/API/profileService";
import {
  getInvoiceIn,
  getInvoiceInById,
  syncInvoiceIn,
} from "@/src/services/API/syncInvoiceIn";
import { InvoiceSummary } from "@/src/types/invoiceIn";
import { Invoice, Profile, UserProfile } from "@/src/types/route";
import { syncDataInvoiceIn } from "@/src/types/syncData";
import { AntDesign, FontAwesome5, Fontisto } from "@expo/vector-icons";
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

function InvoiceInput() {
  const { data } = useData();

  const [visible, setVisible] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [openLogin, setOpenLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoiceDataSync, setInvoiceDataSync] = useState<InvoiceSummary[]>([]);
  const [syncDataInvoiceIn, setSyncDataInvoiceIn] = useState<syncDataInvoiceIn>(
    { dateto: "", datefrom: "" }
  );
  console.log(syncDataInvoiceIn, "Dataa sync");

  const spinValue = useRef(new Animated.Value(0)).current;
  const [openListProductSynchronized, setOpenListProductSynchronized] =
    useState(false);

  const fetchListInvoice = async () => {
    try {
      const data = await getInvoiceInputList();
      setInvoices(data.data ?? []);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      setVisible(true);
    }, 2000);
  };

  const handleSyncInvoiceIn = async () => {
    try {
      if (!syncDataInvoiceIn) return;
      const res = await syncInvoiceIn(syncDataInvoiceIn);
      setInvoiceDataSync(res as InvoiceSummary[]);
    } catch {
      Alert.alert("Lỗi lấy dữ liệu!");
    }
  };

  useEffect(() => {
    const fetchInvoiceSync = async () => {
      try {
        const res = await getInvoiceIn();
        console.log("👉 res:", res);

        setInvoiceDataSync(res);
      } catch {
        console.log("Không có dữ liệu");
      }
    };

    fetchInvoiceSync();
  }, []);
  console.log(data?._id, "data ic");

  return (
    <View style={{ flex: 1 }}>
      {/* <HeaderScreen /> */}
      <View style={styles.searchWrapper}>
        <SearchByName label="Tìm kiếm nhà cung cấp" />
        <View style={{ flex: 1, alignItems: "center", paddingRight: 20 }}>
          <TouchableOpacity>
            <FontAwesome5 name="calendar-alt" size={24} color={ColorMain} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.synchronizedWrapper}>
        <TouchableOpacity
          style={styles.btnSyn}
          onPress={() => setOpenListProductSynchronized(true)}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>
            Tạo sản phẩm &nbsp;
            <AntDesign name="plus" size={15} color="#fff" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSyn}
          onPress={() => setOpenLogin(true)}
        >
          <Text style={{ color: "#fff", fontSize: 14 }}>
            Đăng nhập &nbsp;
            <AntDesign name="plus" size={15} color="#fff" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnSyn}
          onPress={handleLoadingSynchronized}
        >
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

      <InvoiInputList invoicesData={invoiceDataSync} />
      <ModalSynchronized
        visible={visible}
        setVisible={setVisible}
        setSyncDataInvoiceIn={setSyncDataInvoiceIn}
        onSyncInvoiceIn={handleSyncInvoiceIn}
      />
      <ModalLoginCCT
        visible={openLogin}
        openLogin={openLogin}
        setOpenLogin={setOpenLogin}
      />
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
  },
  synchronizedWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
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
