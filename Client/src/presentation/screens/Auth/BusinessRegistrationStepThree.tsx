import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

function BusinessRegistrationStepThree() {
  const route = useRoute();
  const { taxCode }: any = route.params || {};


  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 10 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Xác nhận thông tin kinh doanh</Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingBottom: 50,
    marginTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default BusinessRegistrationStepThree;
