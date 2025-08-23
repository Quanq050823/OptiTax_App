import { ColorMain } from "@/src/presentation/components/colors";
import NaviBottomPay from "@/src/presentation/components/NaviBottomPay";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function SelectDigitalSignaturePlan() {
  const digitalSignatureData = [
    {
      label: "OpiTechCA Cá nhân PSO (Công dân)",
      value: "1",
      timeUse: "12 Tháng",
      price: 100000,
    },
    {
      label: "OpiTechCA Nâng cao 1 năm",
      value: "2",
      timeUse: "12 Tháng",
      price: 400000,
    },
    {
      label: "OpiTechCA Nâng cao 2 năm ",
      value: "3",
      timeUse: "24 Tháng",
      price: 600000,
    },
  ];
  const navigate = useAppNavigation();
  const [selected, setSelected] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleSelectType = () => {
    if (!selected) {
      Alert.alert("Vui lòng chọn một gói chữ ký số!");
      return;
    }

    const selectedItem = digitalSignatureData.find((i) => i.value === selected);

    if (!selectedItem) {
      Alert.alert("Không tìm thấy gói chữ ký số đã chọn!");
      return;
    }

    navigate.navigate("SelectElectronicInvoice", {
      digitalSignature: selectedItem,
    });
  };

  // if (selected === "ke-khai") {
  //   navigate.navigate("SelectDigitalSignaturePlan");
  // } else if (selected === "khoan") {
  //   Alert.alert("chưa tạo ");
  // }

  const handleSelectItem = (item: any) => {
    if (selected === item.value) {
      // Bấm lại thì bỏ chọn
      setSelected(null);
      setTotalPrice(0);
    } else {
      setSelected(item.value);
      setTotalPrice(item.price);
    }
  };
  const renderItem = ({ item }: any) => (
    <TouchableOpacity key={item.value} onPress={() => handleSelectItem(item)}>
      <View
        style={[styles.item, selected === item.value && styles.optionSelected]}
      >
        {/* Header */}
        <View
          style={[
            styles.itemHeader,
            {
              borderBottomWidth: 1,
              borderColor: "#dadfeaff",
              flexDirection: "row",
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={styles.headerText}>{item.label}</Text>
          <View
            style={[
              styles.radio,
              selected === item.value && styles.radioSelected,
            ]}
          />
        </View>

        {/* Body */}
        <View style={[styles.itemHeader, { marginTop: 1 }]}>
          <View style={{ paddingVertical: 10 }}>
            <View style={styles.content}>
              <Text style={styles.textContent}>Thời gian sử dụng</Text>
              <Text
                style={[
                  styles.textContent,
                  { color: "#2a2a2aff", fontWeight: "700" },
                ]}
              >
                {item.timeUse}
              </Text>
            </View>
            <View style={[styles.content, { marginTop: 10 }]}>
              <Text style={styles.textContent}>Phí dịch vụ</Text>
              <Text
                style={[
                  styles.textContent,
                  { color: ColorMain, fontWeight: "800", fontSize: 16 },
                ]}
              >
                {item.price} VND
              </Text>
            </View>
            <View
              style={{ width: "100%", alignItems: "flex-end", marginTop: 20 }}
            >
              <TouchableOpacity>
                <Text style={{ color: "#105697ff", fontWeight: "500" }}>
                  Xem chi tiết
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScreenContainer>
        <FlatList
          data={digitalSignatureData}
          keyExtractor={(item) => item.value}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 20 }}
        />

        {/* <TouchableOpacity
          style={[
            styles.actionPage,
            {
              backgroundColor: ColorMain,
              flexDirection: "row",
              paddingHorizontal: 15,
            },
          ]}
          onPress={handleSelectType}
        >
          <Text style={styles.textAction}>Tiếp theo</Text>
          <AntDesign
            name="arrowright"
            size={18}
            color="#fff"
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity> */}
      </ScreenContainer>
      <NaviBottomPay
        label={"Tiếp theo"}
        screen="SelectElectronicInvoice"
        // totalPrice={totalPrice}
        selectedItems={
          selected
            ? digitalSignatureData
                .filter((item) => item.value === selected)
                .map((item) => ({ label: item.label, price: item.price }))
            : []
        }
        params={
          selected
            ? {
                digitalSignature: digitalSignatureData.find(
                  (i) => i.value === selected
                ),
              }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 7,
    marginBottom: 20,
  },
  itemHeader: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    height: "auto",
    borderRadius: 7,
  },
  headerText: {
    color: ColorMain,
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 7,
  },
  textContent: {
    fontSize: 14,
    color: "#666666ff",
    fontWeight: "500",
  },

  optionSelected: {
    borderColor: ColorMain,
    backgroundColor: "#EAF2FF",
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    elevation: 2,
    borderRadius: 7,
    borderWidth: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cfcfcfff",
  },
  radioSelected: {
    backgroundColor: "#3F4E87",
    borderColor: "#fff",
  },
  actionPage: {
    position: "absolute",
    paddingVertical: 15,
    borderRadius: 50,
    minWidth: 100,
    alignItems: "center",
    bottom: 30,
    right: 30,
  },
  textAction: {
    color: "#fff",
    fontWeight: 500,
  },
});
export default SelectDigitalSignaturePlan;
