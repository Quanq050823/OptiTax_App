import { LinearGradient } from "expo-linear-gradient";
import { ColorMain } from "./colors";
import { Text } from "react-native";

type content = {
  text: string;
};
function TaxEON({ text }: content) {
  return (
    <LinearGradient
      colors={[ColorMain, "#516cb6ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 3 }}
      style={{
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 5,
        borderRadius: 5,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 10, fontWeight: "600" }}>
        {text}
      </Text>
    </LinearGradient>
  );
}

export default TaxEON;
