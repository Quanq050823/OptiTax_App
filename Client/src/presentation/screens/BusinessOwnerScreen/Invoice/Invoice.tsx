import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import InvoiceInput from "@/src/presentation/screens/BusinessOwnerScreen/InvoiceInput";
import InvoiceOutput from "@/src/presentation/screens/BusinessOwnerScreen/InvoiceOutput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_WIDTH = SCREEN_WIDTH / 2;

const TABS = [
	{
		key: "input",
		label: "Hoá đơn nhập",
		icon: "invoice-import" as const,
	},
	{
		key: "output",
		label: "Hoá đơn xuất",
		icon: "file-export" as const,
	},
];

function Invoice() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [loading, setLoading] = useState(false);
	const indicatorX = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.spring(indicatorX, {
			toValue: activeIndex * TAB_WIDTH,
			useNativeDriver: true,
			tension: 60,
			friction: 10,
		}).start();
	}, [activeIndex]);

	return (
		<View style={{ flex: 1 }}>
			{/* Tab bar */}
			<View style={styles.tabBar}>
				{TABS.map((tab, index) => {
					const isSelected = activeIndex === index;
					return (
						<TouchableOpacity
							key={tab.key}
							style={styles.tabItem}
							onPress={() => setActiveIndex(index)}
							activeOpacity={0.7}
						>
							<MaterialCommunityIcons
								name={tab.icon}
								size={20}
								color={isSelected ? textColorMain : "#B0B0B0"}
								style={{ marginBottom: 2 }}
							/>
							<Text
								style={[styles.tabLabel, isSelected && styles.tabLabelActive]}
								numberOfLines={1}
							>
								{tab.label}
							</Text>
						</TouchableOpacity>
					);
				})}

				{/* Sliding indicator */}
				<Animated.View
					style={[
						styles.indicator,
						{ transform: [{ translateX: indicatorX }] },
					]}
				/>
			</View>

			{/* Content */}
			<ScreenContainer>
				{activeIndex === 0 ? (
					<InvoiceInput />
				) : (
					<InvoiceOutput loading={loading} setLoading={setLoading} />
				)}
			</ScreenContainer>

			<LoadingScreen visible={loading} />
		</View>
	);
}

const styles = StyleSheet.create({
	tabBar: {
		flexDirection: "row",
		height: 56,
		backgroundColor: "#fff",
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.08,
				shadowRadius: 6,
			},
			android: {
				elevation: 4,
			},
		}),
		zIndex: 10,
	},
	tabItem: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 4,
	},
	tabLabel: {
		fontSize: 13,
		color: "#B0B0B0",
		fontWeight: "500",
	},
	tabLabelActive: {
		color: textColorMain,
		fontWeight: "700",
	},
	indicator: {
		position: "absolute",
		bottom: 0,
		left: 0,
		width: TAB_WIDTH,
		height: 3,
		backgroundColor: ColorMain,
		borderRadius: 3,
	},
});

export default Invoice;
