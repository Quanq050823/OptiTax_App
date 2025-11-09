import { ColorMain } from "@/src/presentation/components/colors";
import ModalSyncDashBoard from "@/src/presentation/components/Modal/ModalSyncDashBoard";
import { AntDesign } from "@expo/vector-icons";
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
} from "react-native";


export default function Analytics() {
  const [visiSync, setVisiSync] = useState(false);
 

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  const fade2 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(50)).current;

  const spinValue = useRef(new Animated.Value(0)).current;
  const [isUpdating, setIsUpdating] = useState(false);

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

  const startSync = () => {
    setIsUpdating(true);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000, // quay 3 giây
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      spinValue.setValue(0);
      setIsUpdating(false);
    });
    setVisiSync(true);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ModalSyncDashBoard visible={visiSync} setVisible={setVisiSync} />
      <View style={{ marginTop: 20, width: "100%" }}>
        {/* Nút đồng bộ */}
        <View style={styles.syncWr}>
          {/* Nút đồng bộ */}
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
          <View style={styles.taxContainer}>
            <View style={[styles.taxCard, { backgroundColor: "#dae7ffff" }]}>
              <Text style={styles.taxLabel}>Thuế GTGT</Text>
              <Text style={styles.taxValue}>
                {isUpdating ? "..." : "1.000.000 đ"}
              </Text>
            </View>

            <View style={[styles.taxCard, { backgroundColor: "#d8f7e1ff" }]}>
              <Text style={styles.taxLabel}>Thuế TNCN</Text>
              <Text style={styles.taxValue}>
                {isUpdating ? "..." : "1.402.000 đ"}
              </Text>
            </View>

            <View style={[styles.taxCard, { backgroundColor: "#FFF4E5" }]}>
              <Text style={styles.taxLabel}>TỔNG</Text>
              <Text style={[styles.taxValue, { color: "#FF7B00" }]}>
                {isUpdating ? "..." : "2.000.000 đ"}
              </Text>
            </View>
          </View>
        </View>
        {/* Hạn nộp tờ khai */}
        <View style={styles.deadlineCard}>
          <View style={styles.deadlineLeft}>
            <Text style={styles.deadlineLabel}>Hạn nộp tờ khai tháng 10</Text>
            <Text style={styles.deadlineDate}>20 / 11 / 2025</Text>
          </View>
          <View style={styles.deadlineStatusBox}>
            {/* <AntDesign name="clock-circle" size={14} color="#000" /> */}
            <View
              style={{
                position: "absolute",
                height: 30,
                borderWidth: 0.3,
                left: -10,
                borderColor: "#bebebeff",
              }}
            />
            <Text style={styles.deadlineStatus}>
              <Text
                style={{ fontSize: 40, color: "#FF7B00", fontWeight: "600" }}
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

        <TouchableOpacity style={styles.btnShow}>
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
            Tờ khai 04 / CNKD &nbsp;
            <AntDesign name="folder-open" size={17} color="#fff" />
          </Text>
        </TouchableOpacity>
        {/* Line Chart */}
       
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  syncWr: {
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  syncButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: ColorMain,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  syncHint: {
    marginTop: 12,
    color: "#777",
    fontSize: 14,
  },
  taxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 30,
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
    width: "95%",
    backgroundColor: "#fff",
    alignSelf: "center",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 30,
    // shadowColor: "#9d9d9d",
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 3,
    // elevation: 4,
    borderWidth: 0.5,
    borderColor: ColorMain,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deadlineLeft: {
    flex: 3,
  },
  deadlineLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  deadlineDate: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FF7B00",
    marginTop: 4,
  },
  deadlineStatusBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    flex: 1,
    position: "relative",
    alignContent: "center",
    justifyContent: "center",
  },
  deadlineStatus: {
    marginLeft: 5,
    color: "#000",
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
});
