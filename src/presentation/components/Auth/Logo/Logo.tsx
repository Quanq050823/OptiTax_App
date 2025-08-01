import { stylesAuth } from "@/src/presentation/screens/Auth/Styles";
import { Image, Text } from "react-native";
type LogoProps = {
  widthLogo?: number;
  heightLogo?: number;
};
function Logo({ widthLogo, heightLogo }: LogoProps) {

  return (
    <>
      <Image
        source={{
          uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png",
        }}
        height={heightLogo}
        width={widthLogo}
        style={{ marginTop: 70 }}
      />
      <Text style={stylesAuth.title}>TAX DEMO</Text>
    </>
  );
}

export default Logo;
