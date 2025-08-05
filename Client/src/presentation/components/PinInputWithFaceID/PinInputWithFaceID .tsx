import * as LocalAuthentication from "expo-local-authentication";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const PinInputWithFaceID = () => {
  const [pinVisible, setPinVisible] = useState(false);
  const [pin] = useState("123456"); // giả định mã PIN lưu sẵn

  const handleShowPin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes =
      await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (hasHardware && isEnrolled) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Xác thực để hiển thị mã PIN",

        fallbackLabel: "Nhập mã nếu Face ID không thành công",
        cancelLabel: "Hủy",
      });

      if (result.success) {
        setPinVisible(true);
      } else {
        alert("Xác thực thất bại");
      }
    } else {
      alert("Thiết bị không hỗ trợ xác thực sinh trắc học");
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ color: "#6d6d6dff" }}>Mã PIN:</Text>
      <Pressable onPress={handleShowPin}>
        <TextInput
          value={pinVisible ? pin : "••••••"}
          editable={false}
          secureTextEntry={!pinVisible}
          style={{
            backgroundColor: "#f0f0f0",
            padding: 12,
            fontSize: 18,
            marginVertical: 7,
            borderRadius: 6,
          }}
          pointerEvents="none" // Ngăn input bắt sự kiện
        />
      </Pressable>
    </View>
  );
};

export default PinInputWithFaceID;
