import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View, Text } from "react-native";

const messages = [
  "Chúc bạn một ngày làm việc hiệu quả",
  "Báo cáo hôm nay đã sẵn sàng",
  "Đừng quên đồng bộ dữ liệu định kỳ",
  "Kiểm tra chứng từ mới trước khi lập báo cáo",
  "Theo dõi hạn kê khai để chủ động công việc",
];

export default function MovingText() {
  const translateX = useRef(new Animated.Value(-300)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  const animate = () => {
    // Bước 1: text trượt từ trái ra giữa
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Giữ 2 giây
      setTimeout(() => {
        // Bước 2: trượt ra phải và mờ dần
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: 300,
            duration: 600,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Reset vị trí, đổi text và chạy lại
          setIndex((prev) => (prev + 1) % messages.length);
          translateX.setValue(-300);
          opacity.setValue(0);
          animate();
        });
      }, 2000);
    });
  };

  useEffect(() => {
    animate();
  }, []);

  return (
    <LinearGradient
      colors={["#E6FFFA", "#EDF2FF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 3 }}
      style={styles.container}
    >
      <Animated.Text
        style={[
          styles.text,
          {
            opacity,
            transform: [{ translateX }],
          },
        ]}
      >
        {messages[index]}
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#FFF1F2",
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6d6d6dff",
  },
});
