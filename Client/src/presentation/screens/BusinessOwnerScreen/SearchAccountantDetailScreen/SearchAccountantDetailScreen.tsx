import Province from "@/src/presentation/components/Auth/Province/Province";
import { ColorMain } from "@/src/presentation/components/colors";
import { FormDataType } from "@/src/types/route";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { ActivityIndicator } from "react-native-paper";
export default function SearchAccountantDetailScreen() {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scaleAnim = useState(new Animated.Value(0))[0];
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [provinceList, setProvinceList] = useState<
    { label: string; value: string }[]
  >([]);
  const [formData, setFormData] = useState<FormDataType>({
    businessName: "",
    businessType: "",
    taxCode: "",
    taxType: "",
    address: {
      city: null,
      district: null,
      ward: "",
      street: "",
    },
    phoneNumber: "",
    industry: "",
  });
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setLoading(false);
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Đang xác định vị trí…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <View>
        <Province
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          setProvinceList={setProvinceList}
          provinceList={provinceList}
          formData={formData}
          setFormData={setFormData}
        />
      </View>
      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
      >
      </MapView>
      {location && (
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              transform: [{ scale: scaleAnim }],
              top: "40%",
              left: "30%",
              marginLeft: -65, // nửa width
              marginTop: -85, // nửa height
            },
          ]}
        />
      )}

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#00BCD4" />
          <Text style={{ color: "#333", marginTop: 8 }}>
            Đang xác định khu vực của bạn…
          </Text>
        </View>
      )}

      {!loading && (
        <View style={styles.emptyOverlay}>
          <View style={styles.emptyIcon}>
            <Feather name="users" size={22} color={ColorMain} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emptyTitle}>Chưa có kế toán viên gần bạn</Text>
            <Text style={styles.emptyText}>
              Khi hệ thống có dữ liệu kế toán viên phù hợp, danh sách sẽ xuất
              hiện trên bản đồ này.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 3,
    alignItems: "center",
  },
  emptyOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 24,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eef8f7",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  emptyText: {
    marginTop: 4,
    color: "#777",
    fontSize: 12,
    lineHeight: 17,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#e5e5e5ff",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
    bottom: 0,
    position: "absolute",
    height: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  accountantItem: {
    paddingVertical: 20,
    marginBottom: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 8,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pulseCircle: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: "50%",
    backgroundColor: "rgba(0, 188, 212, 0.3)",
  },
  searchBtn: {
    width: 100,
    height: 40,
    backgroundColor: ColorMain,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
});
