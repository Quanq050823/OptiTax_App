import ScreenContainer from "@/src/presentation/components/ScreenContainer/ScreenContainer";
import * as React from "react";
import { Text, View } from "react-native";

function AboutScreen() {
  return (
    <ScreenContainer>
      <View style={{ flex: 1 }}>
        {/* <HeaderScreen /> */}
        <Text>About Page</Text>
      </View>
    </ScreenContainer>
  );
}

export default AboutScreen;
