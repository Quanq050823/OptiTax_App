import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
}

const ScreenContainer = ({
  children,
  style,
  ...rest
}: ScreenContainerProps) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10, // ✅ Padding mặc định cho mọi trang
    backgroundColor: "#f7f7f7ff", // hoặc theme
    paddingHorizontal: 10, // ✅ Padding ngang mặc định
  },
});

export default ScreenContainer;
