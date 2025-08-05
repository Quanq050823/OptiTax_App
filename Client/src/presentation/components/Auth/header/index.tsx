import { ColorMain } from "@/src/presentation/components/colors";
import { StyleSheet, Text, View } from "react-native";

function HeaderLogin({name}) {
  return (
    <View style={styles.headerLogin}>
      <Text style={styles.title}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerLogin: {
    height: 150,
    backgroundColor: ColorMain,
    justifyContent: "center",
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  title: { fontSize: 30, fontWeight: 500, color: "#fff" },
});
export default HeaderLogin;
