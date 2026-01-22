import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const LoadingScreen = ({ visible }: { visible: boolean }) => {
	const animationRef = useRef<LottieView>(null);

	useEffect(() => {
		if (visible && animationRef.current) {
			animationRef.current.play();
		}
	}, [visible]);

	if (!visible) return null;
	return (
		<View style={styles.container}>
			<LottieView
				ref={animationRef}
				source={require("@/assets/animation/invoice loading.json")}
				autoPlay
				loop
				hardwareAccelerationAndroid
				renderMode="AUTOMATIC"
				speed={1}
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
