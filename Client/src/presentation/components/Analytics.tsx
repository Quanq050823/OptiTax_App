import {
  ColorMain,
  textDealineColor,
} from "@/src/presentation/components/colors";
import ModalSyncDashBoard from "@/src/presentation/components/Modal/ModalSyncDashBoard";
import { syncInvoiceIn } from "@/src/services/API/syncInvoiceIn";
import { InvoiceListResponse, InvoiceSummary } from "@/src/types/invoiceIn";
import { ProductInventoryList } from "@/src/types/storage";
import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Dimensions,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Easing,
  TouchableHighlight,
  Alert,
} from "react-native";
import ModalSynchronized from "./Modal/ModalSynchronized";
import { syncDataInvoiceIn } from "@/src/types/syncData";
import { syncProduct } from "@/src/services/API/storageService";
import LoadingScreen from "./Loading/LoadingScreen";
import { LinearGradient } from "expo-linear-gradient";
import ShimmerSweep from "./ShimmerSweep";
import { useAppNavigation } from "../Hooks/useAppNavigation";
import MovingText from "./MovingText";
import { getTotalTaxes } from "@/src/services/API/taxService";
import { useTheme } from "../Hooks/useTheme";
import { useColors } from "../Hooks/useColor";

export default function Analytics() {
  const navigate = useAppNavigation();
  const [visiSync, setVisiSync] = useState(false);
  const [hdrSize, setHdrSize] = useState({ w: 0, h: 0 });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  const fade2 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(50)).current;

  const spinValue = useRef(new Animated.Value(0)).current;
  const [isUpdating, setIsUpdating] = useState(false);
  const [syncDataInvoiceIn, setSyncDataInvoiceIn] = useState<syncDataInvoiceIn>(
    { dateto: "", datefrom: "" }
  );
  const [modalSyncDate, setModalSyncDate] = useState(false);
  const [dataSyncInvoice, setDataSyncInvoice] = useState<
    InvoiceListResponse | undefined
  >();
  const { isDark, setIsDark } = useTheme();
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [totalGTGT, setTotalGTGT] = useState(0);
  const [totalTNCN, setTotalTNCN] = useState(0);

  const fetchTotalTaxes = async () => {
    try {
      const result = await getTotalTaxes();
      setTotalGTGT(result.totalGTGT);
      setTotalTNCN(result.totalTNCN);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    fetchTotalTaxes();
  }, []);

  useEffect(() => {
    // Hiệu ứng khi vào trang
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(fade2, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY2, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animation quay vòng
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const startSync = async () => {
    setLoading(true);
    setIsUpdating(true);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000, // quay 3 giây
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      spinValue.setValue(0);
      // setIsUpdating(false);
    });
    try {
      const resultSyncInvoiceIn = await syncInvoiceIn();
      setDataSyncInvoice(resultSyncInvoiceIn);
      setVisiSync(true);
      await fetchTotalTaxes();
      setLoading(false);
    } catch (e) {
      Alert.alert("Không thể đồng bộ hóa đơn!!");
      setLoading(false);
      console.log(e);
    }
    setLoading(false);
  };
  console.log(dataSyncInvoice, "hihihihi");

  const syncDataInvoiceInWithProductStorage = async () => {
    setLoading(true);
    try {
      setVisiSync(true);
      setModalSyncDate(false);
      const resultSyncInvoiceIn = await syncInvoiceIn();
      setDataSyncInvoice(resultSyncInvoiceIn);
      console.log(resultSyncInvoiceIn, "láldalsdadaw");

      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    console.log("hdrSize", hdrSize);
  }, [hdrSize]);

  return (
    <View style={{ flex: 1 }}>
      <MovingText />
      <LoadingScreen visible={loading} />
      <ModalSyncDashBoard
        visible={visiSync}
        setVisible={setVisiSync}
        syncDate={syncDataInvoiceIn}
        dataSyncInvoice={dataSyncInvoice}
        loading={loading}
      />
      <ModalSynchronized
        loading={loading}
        setLoading={setLoading}
        onSyncInvoiceIn={syncDataInvoiceInWithProductStorage}
        setSyncDataInvoiceIn={setSyncDataInvoiceIn}
        visible={modalSyncDate}
        setVisible={setModalSyncDate}
      />
      <View style={{ width: "100%", position: "relative", flex: 1 }}>
        {/* Nút đồng bộ */}
        <LinearGradient
          colors={["#4dbf99ff", "#3858b1ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 3 }}
          style={styles.syncWr}
        >
          <TouchableOpacity onPress={startSync} activeOpacity={0.8}>
            <Animated.View
              style={[styles.syncButton, { transform: [{ rotate: spin }] }]}
            >
              <AntDesign name="sync" size={36} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
          {/* Text hướng dẫn nhỏ */}
          <Text style={styles.syncHint}>
            {isUpdating ? "Đang đồng bộ dữ liệu..." : "Nhấn để đồng bộ dữ liệu"}
          </Text>
          {/* Khu vực tổng hợp thuế */}
        </LinearGradient>
        {/* Nút đồng bộ */}
        <View
          style={{
            position: "relative",
            paddingHorizontal: 10,
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <View
            style={[styles.taxContainer, { backgroundColor: colors.textDark }]}
          >
            <View style={[styles.taxCard]}>
              <Text style={[styles.taxLabel, { color: colors.textLight }]}>
                Thuế GTGT
              </Text>
              <Text style={[styles.taxValue, { color: colors.textLight }]}>
                {isUpdating ? "..." : `${totalGTGT.toLocaleString("vi-VN")} đ`}
              </Text>
              <View
                style={{
                  position: "absolute",
                  height: 25,
                  borderWidth: 0.3,
                  right: -8,
                  borderColor: "#dadadaff",
                  top: 22,
                }}
              />
            </View>

            <View style={[styles.taxCard]}>
              <Text style={[styles.taxLabel, { color: colors.textLight }]}>
                Thuế TNCN
              </Text>
              <Text style={[styles.taxValue, { color: colors.textLight }]}>
                {isUpdating ? "..." : `${totalTNCN.toLocaleString("vi-VN")} đ`}
              </Text>
              <View
                style={{
                  position: "absolute",
                  height: 25,
                  borderWidth: 0.3,
                  right: -8,
                  borderColor: "#dadadaff",
                  top: 22,
                }}
              />
            </View>

            <View style={[styles.taxCard]}>
              <Text style={[styles.taxLabel, { color: colors.textLight }]}>
                TỔNG
              </Text>
              <Text
                style={[
                  styles.taxValue,
                  { color: isDark ? "#fff" : textDealineColor },
                ]}
              >
                {isUpdating
                  ? "..."
                  : `${(totalGTGT + totalTNCN).toLocaleString("vi-VN")} đ`}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <View style={{ position: "relative" }}>
            <LinearGradient
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setHdrSize({ w: width, h: height }); // 👈 CẬP NHẬT KÍCH THƯỚC
              }}
              colors={["#5be6b7ff", "#6A7DB3"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 3 }}
              style={{
                padding: 5,
                borderRadius: 10,
                shadowColor: "#a1a1a1ff",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                marginTop: 20,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <View
                style={{
                  padding: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <EvilIcons name="calendar" size={24} color="black" />
                <Text style={styles.deadlineLabel}>
                  Hạn nộp tờ khai tháng 10 (Dương lịch)
                </Text>
              </View>
              <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
                <View style={styles.deadlineCard}>
                  <View style={styles.deadlineLeft}>
                    <Text style={styles.deadlineDate}>20 . 11 . 2025</Text>
                  </View>
                  <View style={styles.deadlineStatusBox}>
                    {/* <AntDesign name="clock-circle" size={14} color="#000" /> */}
                    <View
                      style={{
                        position: "absolute",
                        height: 20,
                        borderWidth: 0.3,
                        left: -10,
                        borderColor: textDealineColor,
                        top: 7,
                      }}
                    />
                    {/* <AntDesign
                  name="clock-circle"
                  size={15}
                  color="#696969ff"
                  style={{
                    alignSelf: "flex-start",
                    marginTop: 7,
                  }}
                /> */}
                    <Text style={{ alignSelf: "flex-end", marginBottom: 7 }}>
                      Kết thúc sau
                    </Text>
                    <Text style={styles.deadlineStatus}>
                      <Text
                        style={{
                          fontSize: 30,
                          color: textDealineColor,
                          fontWeight: "600",
                        }}
                      >
                        7
                      </Text>
                      ngày
                    </Text>
                  </View>

                  {/* <TouchableOpacity style={styles.deadlineBtn} activeOpacity={0.8}>
              <Text style={styles.deadlineBtnText}>Xem chi tiết</Text>
            </TouchableOpacity> */}
                </View>
                <View
                  style={{
                    width: "80%",
                    borderTopWidth: 0.5,
                    alignSelf: "center",
                    borderStyle: "dashed",
                  }}
                />
                <TouchableOpacity style={styles.detalDealine}>
                  <Text style={{ color: "#555555ff" }}>Xem chi tiết</Text>
                  <MaterialIcons
                    name="keyboard-double-arrow-right"
                    size={16}
                    color="#555555ff"
                  />
                </TouchableOpacity>
              </View>
              <ShimmerSweep
                sweepDuration={5000}
                pauseDuration={200}
                angleDeg={20}
                intensity={0.7}
                bandWidth={60}
                containerWidth={hdrSize.w}
                containerHeight={hdrSize.h}
              />
            </LinearGradient>
          </View>
          <LinearGradient
            colors={["#4dbf99ff", "#6A7DB3"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 3 }}
            style={styles.btnShow}
          >
            <TouchableOpacity>
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
                Tờ khai 04 / CNKD &nbsp;
                <AntDesign name="folder-open" size={17} color="#fff" />
              </Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={["#FF9966", "#FF5E62"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 3 }}
            style={styles.btnShow}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                width: "100%",
                justifyContent: "center",
              }}
              onPress={() => navigate.navigate("ReportExportScreen")}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: 15,
                }}
              >
                Xuất báo cáo &nbsp;
              </Text>
              <MaterialCommunityIcons
                name="invoice-text-arrow-right"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Line Chart */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  syncWr: {
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 30,
    backgroundColor: "#f1f1f1ff",
    marginBottom: 20,
    paddingBottom: 80,
    position: "relative",
    overflow: "visible",
  },
  syncButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: ColorMain,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#eeeeeeff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: "#fff",
  },
  syncHint: {
    marginTop: 12,
    color: "#fff",
    fontSize: 11,
  },
  taxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    position: "absolute",
    backgroundColor: "#fff",
    top: -80,
    zIndex: 10,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#929292ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  taxCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  taxLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  taxValue: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  deadlineCard: {
    width: "100%",
    backgroundColor: "#ffffffff",
    alignSelf: "center",
    borderRadius: 10,
    paddingTop: 10,
    paddingHorizontal: 18,
    // shadowColor: "#9d9d9d",
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 3,
    // elevation: 4,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 3,
    // borderColor: textDealineColor,
  },
  deadlineLeft: {
    flex: 3,
  },
  deadlineLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000ff",
  },
  deadlineDate: {
    fontSize: 25,
    fontWeight: "700",
    color: textDealineColor,
    marginTop: 4,
  },
  deadlineStatusBox: {
    flexDirection: "row",
    marginTop: 6,
    flex: 2.5,
    position: "relative",
    alignContent: "center",
    justifyContent: "center",
  },
  deadlineStatus: {
    marginLeft: 5,
    color: textDealineColor,
    fontWeight: "500",
    fontSize: 14,
  },
  deadlineBtn: {
    backgroundColor: ColorMain,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  deadlineBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  btnShow: {
    width: "95%",
    backgroundColor: ColorMain,
    marginTop: 30,
    alignSelf: "center",
    borderRadius: 10,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  btnEPIV: {
    width: "95%",
    backgroundColor: "#10B981",
    marginTop: 30,
    alignSelf: "center",
    borderRadius: 10,
    minHeight: 60,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 0.5,
    // borderColor: ColorMain,
  },
  detalDealine: {
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});
