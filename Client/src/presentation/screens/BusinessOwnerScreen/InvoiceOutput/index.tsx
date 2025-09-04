import { ColorMain } from "@/src/presentation/components/colors";
import HeaderScreen from "@/src/presentation/components/layout/Header";
import InvoiceOutputList from "@/src/presentation/components/List/InvoiceOutputList";
import InvoiInputList from "@/src/presentation/components/List/InvoiInputList";
import ModalCreateProductsByInvoiceOuput from "@/src/presentation/components/Modal/ModalCreateProductsByInvoiceOuput";
import ModalLoginCCT from "@/src/presentation/components/Modal/ModalEditProduct/ModalLoginCCT";
import ModalSynchronized from "@/src/presentation/components/Modal/ModalSynchronized";
import SearchByName from "@/src/presentation/components/SearchByName";
import {
  getInvoiceList,
  getInvoiceOutputList,
} from "@/src/services/API/invoiceService";
import { Invoice } from "@/src/types/route";
import { AntDesign, FontAwesome5, Fontisto } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function InvoiceOutput() {
  const [visible, setVisible] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [openLogin, setOpenLogin] = useState(false);
  const [openListProductSynchronized, setOpenListProductSynchronized] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const fetchListInvoice = async () => {
    try {
      const data = await getInvoiceOutputList();
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
      setOpenLogin(true);
    }, 2000);
  };
  return (
    <View style={{ flex: 1 }}>
      {/* <HeaderScreen /> */}
      <View style={styles.searchWrapper}>
        <SearchByName label="Tìm kiếm mã hoá đơn" />
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
      <ModalCreateProductsByInvoiceOuput
        setOpenListProductSynchronized={setOpenListProductSynchronized}
        openListProductSynchronized={openListProductSynchronized}
        invoicesData={invoices}
      />
      <InvoiceOutputList invoicesData={invoices} />
      <ModalSynchronized visible={visible} setVisible={setVisible} />
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
});

export default InvoiceOutput;
