import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const LoadingScreen = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;
  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/animation/invoice loading.json")}
        autoPlay
        loop
        style={{ width: 150, height: 150 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(153, 153, 153, 0.3)",
    zIndex: 9999,
    elevation: 9999,
  },
});
export default LoadingScreen;
