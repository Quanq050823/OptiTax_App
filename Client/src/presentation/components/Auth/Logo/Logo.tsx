import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { Text } from "react-native";
type LogoProps = {
  widthLogo?: number;
  heightLogo?: number;
};
function Logo({ widthLogo, heightLogo }: LogoProps) {
  return (
    <>
      <Text style={stylesAuth.title}>EON SOFTWARE</Text>
    </>
  );
}

export default Logo;
