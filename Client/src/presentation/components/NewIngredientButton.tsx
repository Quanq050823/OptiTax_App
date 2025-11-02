import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

type Quantity = {
  quantity: number;
  width?: number;
};
export default function NewIngredientButton({ quantity, width }: Quantity) {
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = Animated.loop(
      Animated.sequence([
        // 👇 Hiệu ứng lắc 1 lần
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: -1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // 👇 trở lại vị trí ban đầu
        Animated.timing(rotate, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        // 👇 nghỉ một chút (pause 1 giây)
        Animated.delay(1000),
      ])
    );

    loopAnimation.start();
    return () => loopAnimation.stop();
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-10deg", "10deg"],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.badge,
          {
            transform: [{ scale }, { rotate: rotateInterpolate }],
            width: width ? width : 20,
            height: width ? width : 20,
          },
        ]}
      >
        <Text style={styles.badgeText}>{Number(quantity)}</Text>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -7,
    left: -7,
    backgroundColor: "#df1a1aff",
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
});
