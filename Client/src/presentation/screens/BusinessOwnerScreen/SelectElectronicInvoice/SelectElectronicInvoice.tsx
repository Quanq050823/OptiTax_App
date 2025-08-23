import { ColorMain } from "@/src/presentation/components/colors";
import NaviBottomPay from "@/src/presentation/components/NaviBottomPay";
// import QuantitySelector from "@/src/presentation/components/QuantitySelector";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type SelectElectronicInvoiceRouteProp = RouteProp<
  RootStackParamList,
  "SelectElectronicInvoice"
>;
type InvoiceItem = {
  id: number;
  label: string;
  description: string;
  price: number;
};
const dataInvoice = [
  {
    id: 1,
    label: "Gói 300 hoá đơn (OPT-300)",
    description: "390.000/Gói ~ 1.300/Hoá đơn",
    // quantity: 0,
    price: 390000,
  },
  {
    id: 2,
    label: "Gói 500 hoá đơn (OPT-500)",
    description: "490.000/Gói ~ 980/Hoá đơn",
    // quantity: 0,
    price: 490000,
  },
  {
    id: 3,
    label: "Gói 1000 hoá đơn (OPT-1000)",
    description: "790.000/Gói ~ 790/Hoá đơn",
    // quantity: 0,
    price: 790000,
  },
  {
    id: 4,
    label: "Gói 2000 hoá đơn (OPT-300)",
    description: "1.190.000/Gói ~ 595/Hoá đơn",
    // quantity: 0,
    price: 1190000,
  },
];
function SelectElectronicInvoice() {
  const route = useRoute<SelectElectronicInvoiceRouteProp>();
  const { digitalSignature } = route.params;

  // chỉ cho phép chọn 1 item
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(
    null
  );

  const toggleSelectInvoice = (item: InvoiceItem) => {
    setSelectedInvoice((prev) => (prev?.id === item.id ? null : item));
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      <ScreenContainer>
        <ScrollView>
          <View style={styles.container}>
            {dataInvoice.map((item) => {
              const isSelected = selectedInvoice?.id === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleSelectInvoice(item)}
                  style={[
                    styles.item,
                    isSelected && styles.optionSelected, // bo viền xanh nếu chọn
                  ]}
                  activeOpacity={0.8}
                >
                  <View key={item.id}>
                    <View style={{}}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          borderBottomWidth: 1,
                          paddingBottom: 10,
                          borderColor: "#ebebebff",
                        }}
                      >
                        <Text style={styles.name}>{item.label}</Text>

                        <View
                          style={[
                            styles.radio,
                            isSelected && styles.radioSelected,
                          ]}
                        />
                      </View>
                      <Text style={{ color: "#757575ff", marginTop: 10 }}>
                        {item.description}
                      </Text>
                    </View>
                    <View style={styles.flexActionItem}>
                      {/* <QuantitySelector
                      quantity={selected?.quantity ?? 0}
                      onChange={(q: any) => handleQuantityChange(item, q)}
                    /> */}

                      <TouchableOpacity>
                        <Text
                          style={{
                            color: ColorMain,
                            paddingRight: 10,
                            fontWeight: "500",
                          }}
                        >
                          Xem chi tiết
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </ScreenContainer>
      <NaviBottomPay
        label="Tiến hành thanh toán"
        screen="PaymentScreen" // 👉 đổi sang màn thanh toán thay vì HomeScreen
        selectedItems={[
          ...(digitalSignature
            ? [{ label: digitalSignature.label, price: digitalSignature.price }]
            : []),
          ...(selectedInvoice
            ? [{ label: selectedInvoice.label, price: selectedInvoice.price }]
            : []),
        ]}
        params={{
          digitalSignature,
          invoice: selectedInvoice,
        }}
        selectedInvoice={selectedInvoice}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 15,
    shadowColor: "#7e7e7eff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    borderRadius: 5,
    shadowRadius: 5,
    marginHorizontal: 4,
    marginBottom: 20,
  },
  name: {
    fontWeight: "700",
    color: ColorMain,
    fontSize: 16,
  },
  flexActionItem: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionSelected: {
    borderColor: ColorMain,
    backgroundColor: "#EAF2FF",
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 2 },
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
    alignSelf: "center",
  },
  radioSelected: {
    backgroundColor: "#3F4E87",
    borderColor: "#fff",
  },
});

export default SelectElectronicInvoice;
