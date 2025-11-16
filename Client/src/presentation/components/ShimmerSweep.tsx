// ShimmerSweep.tsx
import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);

type Props = {
  sweepDuration?: number;
  pauseDuration: number;
  angleDeg?: number;
  intensity?: number;
  bandWidth?: number;
  containerWidth: number; // 👈 bắt buộc
  containerHeight: number; // 👈 bắt buộc
};

export default function ShimmerSweep({
  sweepDuration = 1000,
  pauseDuration,
  angleDeg = 18,
  intensity = 0.35,
  bandWidth,
  containerWidth,
  containerHeight,
}: Props) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!containerWidth) return;
    anim.setValue(0); // 👈 reset rõ ràng
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1.1,
          duration: sweepDuration,
          easing: Easing.bezier(0.85, 0, 0.15, 1),
          useNativeDriver: true,
        }),
        Animated.delay(pauseDuration),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [containerWidth, sweepDuration, pauseDuration]);

  // chạy từ -width -> +width
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-containerWidth, containerWidth],
  });

  const bw = bandWidth ?? Math.max(60, containerWidth * 0.22);

  return (
    <View
      pointerEvents="none"
      style={{
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
        zIndex: -1,
        elevation: 9999, // 👈 Android cần
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: 5, // 👈 rộng hơn
          height: containerHeight * 2,
          backgroundColor: "rgba(255, 255, 255, 0.36)",
          transform: [
            { translateX },
            { translateY: -containerHeight * 0.5 },
            { rotateZ: `${angleDeg}deg` },
          ],
          borderRadius: 12,
          zIndex: 9999,
          elevation: 9999,
        }}
      />
    </View>
  );
}
