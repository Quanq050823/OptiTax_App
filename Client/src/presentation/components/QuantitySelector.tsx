import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
type QuantitySelectorProps = {
  quantity: number;
  onChange: (newQuantity: number) => void;
};
const QuantitySelector = ({ quantity, onChange }: QuantitySelectorProps) => {
  const increase = () => onChange(quantity + 1);
  const decrease = () => onChange(quantity > 0 ? quantity - 1 : 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={decrease}>
        <Text style={styles.text}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity style={styles.button} onPress={increase}>
        <Text style={styles.text}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e6e6e6ff",
    borderRadius: 8,
    overflow: "hidden",
    height: 40,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    height: "100%",
    width: 30,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  quantity: {
    paddingHorizontal: 20,
    fontSize: 16,
    minWidth: 30,
  },
});

export default QuantitySelector;
