import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import { Label } from "@react-navigation/elements";
import { StyleSheet, TextInput, View } from "react-native";

function StoreInformation() {
  return (
    <View style={{ flex: 1 }}>
      <ScreenContainer>
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <View style={{ marginTop: 20 }}>
            <Label style={styles.label}>Tên cửa hàng</Label>
            <TextInput value="Tạp Hoá Tú 230" style={styles.input} />
          </View>
          <View style={{ marginTop: 20 }}>
            <Label style={styles.label}>Tên cửa hàng</Label>
            <TextInput value="Tạp Hoá Tú 230" style={styles.input} />
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
});

export default StoreInformation;
