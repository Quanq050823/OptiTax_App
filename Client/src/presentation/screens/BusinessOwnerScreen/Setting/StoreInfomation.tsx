import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { BusinessInforAuth } from "@/src/services/API/profileService";
import { BusinessInfo } from "@/src/types/route";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";

const formatAddress = (address?: BusinessInfo["address"]) => {
  if (!address) return "";
  return [address.street, address.ward, address.district, address.city]
    .filter(Boolean)
    .join(", ");
};

function StoreInformation() {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const result = await BusinessInforAuth();
        setBusiness(result);
      } catch {
        setBusiness(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 32 }} />
          ) : null}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Tên cửa hàng</Text>
            <TextInput
              value={business?.businessName || "Chưa cập nhật"}
              style={styles.input}
              editable={false}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Mã số thuế</Text>
            <TextInput
              value={business?.taxCode || "Chưa cập nhật"}
              style={styles.input}
              editable={false}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              value={business?.phoneNumber || "Chưa cập nhật"}
              style={styles.input}
              editable={false}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              value={formatAddress(business?.address) || "Chưa cập nhật"}
              style={[styles.input, styles.multilineInput]}
              editable={false}
              multiline
            />
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: "left",
    width: "100%",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  multilineInput: {
    minHeight: 82,
    height: "auto",
    paddingVertical: 12,
    textAlignVertical: "top",
  },
});

export default StoreInformation;
