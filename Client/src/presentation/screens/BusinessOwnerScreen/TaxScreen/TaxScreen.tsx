import { ColorMain } from "@/src/presentation/components/colors";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { stylesAuth } from "../../Auth/Styles";

function TaxScreen() {
    const renderItem = () => {
        return (
            <View></View>
        )
    }
  return (
    <View style={{flex: 1, padding: 10}}>
      <View>
        <TouchableOpacity style={styles.btnAdd}>
          <Text style={{color: "#fff"}}>Thêm phiếu</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  btnAdd: {
    backgroundColor: ColorMain,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: 100
  },
});

export default TaxScreen;
