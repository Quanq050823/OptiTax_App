import React from "react";
import {
  ImageBackground,

  StyleSheet,
  View,
  ViewProps,
} from "react-native";

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
}

const ScreenContainer = ({
  children,
  style,
  ...rest
}: ScreenContainerProps) => {
  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={require("@/assets/images/background.png")}
      resizeMode="cover"
    >
      <View style={[styles.container, style]} {...rest}>
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10, // ✅ Padding ngang mặc định
  },
});

export default ScreenContainer;
