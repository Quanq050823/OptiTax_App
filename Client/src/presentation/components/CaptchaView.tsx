import { SvgXml } from "react-native-svg";

const getSvgXml = (captchaImage: string): string => {
  const trimmed = captchaImage.trimStart();
  if (trimmed.startsWith("<svg") || trimmed.startsWith("<?xml")) {
    return captchaImage;
  }
  // legacy base64 path
  const raw = captchaImage.replace("data:image/svg+xml;base64,", "");
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
      xml={getSvgXml(captchaImage)}
      width={200}
      height={50}
      style={{ backgroundColor: "#9d9d9d69", borderRadius: 3 }}
    />
  );
}
