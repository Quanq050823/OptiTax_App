import { SvgXml } from "react-native-svg";

const decodeSvg = (base64: string) => {
  const raw = base64.replace("data:image/svg+xml;base64,", "");
  return atob(raw);
};

export default function CaptchaView({
  captchaImage,
}: {
  captchaImage?: string;
}) {
  if (!captchaImage) return null;

  return (
    <SvgXml
      xml={decodeSvg(captchaImage)}
      width={200}
      height={50}
      style={{ backgroundColor: "#9d9d9d69", borderRadius: 3 }}
    />
  );
}
