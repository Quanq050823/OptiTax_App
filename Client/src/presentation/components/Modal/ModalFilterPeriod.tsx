import React, { useState } from "react";
import {
	Modal,
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ModalFilterPeriodProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	filterPeriodType: "month" | "quarter" | "all";
	setFilterPeriodType: (type: "month" | "quarter" | "all") => void;
	filterYear: number;
	setFilterYear: (year: number) => void;
	filterPeriod: number | undefined;
	setFilterPeriod: (period: number | undefined) => void;
}

const ModalFilterPeriod: React.FC<ModalFilterPeriodProps> = ({
	visible,
	setVisible,
	filterPeriodType,
	setFilterPeriodType,
	filterYear,
	setFilterYear,
	filterPeriod,
	setFilterPeriod,
}) => {
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
	const months = Array.from({ length: 12 }, (_, i) => i + 1);
	const quarters = [1, 2, 3, 4];

	const handleApply = () => {
		setVisible(false);
	};

	const handleReset = () => {
		setFilterPeriodType("all");
		setFilterYear(currentYear);
		setFilterPeriod(undefined);
	};

	return (
		<Modal
			visible={visible}
			transparent={true}
			animationType="slide"
			onRequestClose={() => setVisible(false)}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Lọc theo thời gian</Text>
						<TouchableOpacity onPress={() => setVisible(false)}>
							<MaterialIcons name="close" size={24} color="#333" />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.modalContent}>
						{/* Period Type Selection */}
						<Text style={styles.sectionTitle}>Loại thời gian</Text>
						<View style={styles.buttonGroup}>
							<TouchableOpacity
								style={[
									styles.optionButton,
									filterPeriodType === "all" && styles.optionButtonActive,
								]}
								onPress={() => {
									setFilterPeriodType("all");
									setFilterPeriod(undefined);
								}}
							>
								<Text
									style={[
										styles.optionButtonText,
										filterPeriodType === "all" && styles.optionButtonTextActive,
									]}
								>
									Tất cả
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.optionButton,
									filterPeriodType === "month" && styles.optionButtonActive,
								]}
								onPress={() => {
									setFilterPeriodType("month");
									setFilterPeriod(undefined);
								}}
							>
								<Text
									style={[
										styles.optionButtonText,
										filterPeriodType === "month" &&
											styles.optionButtonTextActive,
									]}
								>
									Theo tháng
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[
									styles.optionButton,
									filterPeriodType === "quarter" && styles.optionButtonActive,
								]}
								onPress={() => {
									setFilterPeriodType("quarter");
									setFilterPeriod(undefined);
								}}
							>
								<Text
									style={[
										styles.optionButtonText,
										filterPeriodType === "quarter" &&
											styles.optionButtonTextActive,
									]}
								>
									Theo quý
								</Text>
							</TouchableOpacity>
						</View>

						{/* Year Selection */}
						<Text style={styles.sectionTitle}>Năm</Text>
						<View style={styles.yearGrid}>
							{years.map((year) => (
								<TouchableOpacity
									key={year}
									style={[
										styles.yearButton,
										filterYear === year && styles.yearButtonActive,
									]}
									onPress={() => setFilterYear(year)}
								>
									<Text
										style={[
											styles.yearButtonText,
											filterYear === year && styles.yearButtonTextActive,
										]}
									>
										{year}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						{/* Month Selection */}
						{filterPeriodType === "month" && (
							<>
								<Text style={styles.sectionTitle}>Tháng (tùy chọn)</Text>
								<View style={styles.periodGrid}>
									{months.map((month) => (
										<TouchableOpacity
											key={month}
											style={[
												styles.periodButton,
												filterPeriod === month && styles.periodButtonActive,
											]}
											onPress={() =>
												setFilterPeriod(
													filterPeriod === month ? undefined : month
												)
											}
										>
											<Text
												style={[
													styles.periodButtonText,
													filterPeriod === month &&
														styles.periodButtonTextActive,
												]}
											>
												T{month}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</>
						)}

						{/* Quarter Selection */}
						{filterPeriodType === "quarter" && (
							<>
								<Text style={styles.sectionTitle}>Quý (tùy chọn)</Text>
								<View style={styles.periodGrid}>
									{quarters.map((quarter) => (
										<TouchableOpacity
											key={quarter}
											style={[
												styles.periodButton,
												filterPeriod === quarter && styles.periodButtonActive,
											]}
											onPress={() =>
												setFilterPeriod(
													filterPeriod === quarter ? undefined : quarter
												)
											}
										>
											<Text
												style={[
													styles.periodButtonText,
													filterPeriod === quarter &&
														styles.periodButtonTextActive,
												]}
											>
												Q{quarter}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</>
						)}
					</ScrollView>

					<View style={styles.modalFooter}>
						<TouchableOpacity style={styles.resetButton} onPress={handleReset}>
							<Text style={styles.resetButtonText}>Đặt lại</Text>
						</TouchableOpacity>
						<LinearGradient
							colors={["#4dbf99ff", "#3858b1ff"]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={styles.applyButton}
						>
							<TouchableOpacity
								onPress={handleApply}
								style={{
									flex: 1,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text style={styles.applyButtonText}>Áp dụng</Text>
							</TouchableOpacity>
						</LinearGradient>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContainer: {
		backgroundColor: "#fff",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		maxHeight: "80%",
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "700",
		color: "#333",
	},
	modalContent: {
		padding: 20,
	},
	sectionTitle: {
		fontSize: 15,
		fontWeight: "600",
		color: "#333",
		marginTop: 15,
		marginBottom: 10,
	},
	buttonGroup: {
		flexDirection: "row",
		gap: 10,
	},
	optionButton: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 15,
		borderRadius: 10,
		backgroundColor: "#f5f5f5",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "transparent",
	},
	optionButtonActive: {
		backgroundColor: "#e8f5f1",
		borderColor: "#4dbf99ff",
	},
	optionButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#666",
	},
	optionButtonTextActive: {
		color: "#4dbf99ff",
	},
	yearGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	yearButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		backgroundColor: "#f5f5f5",
		borderWidth: 2,
		borderColor: "transparent",
	},
	yearButtonActive: {
		backgroundColor: "#e8f5f1",
		borderColor: "#4dbf99ff",
	},
	yearButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#666",
	},
	yearButtonTextActive: {
		color: "#4dbf99ff",
	},
	periodGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	periodButton: {
		width: "22%",
		paddingVertical: 10,
		borderRadius: 10,
		backgroundColor: "#f5f5f5",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "transparent",
	},
	periodButtonActive: {
		backgroundColor: "#e8f5f1",
		borderColor: "#4dbf99ff",
	},
	periodButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#666",
	},
	periodButtonTextActive: {
		color: "#4dbf99ff",
	},
	modalFooter: {
		flexDirection: "row",
		padding: 20,
		gap: 10,
		borderTopWidth: 1,
		borderTopColor: "#f0f0f0",
	},
	resetButton: {
		flex: 1,
		paddingVertical: 15,
		borderRadius: 10,
		backgroundColor: "#f5f5f5",
		alignItems: "center",
	},
	resetButtonText: {
		fontSize: 15,
		fontWeight: "600",
		color: "#666",
	},
	applyButton: {
		flex: 1,
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
	},
	applyButtonText: {
		fontSize: 15,
		fontWeight: "600",
		color: "#fff",
	},
});

export default ModalFilterPeriod;
