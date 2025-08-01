import { ColorMain } from "@/src/presentation/components/colors";
import { DrawerItem } from "@react-navigation/drawer";
import { useNavigationState } from "@react-navigation/native";
import React from "react";
import { TextStyle, ViewStyle } from "react-native";

type Props = {
  label: string;
  screenName: string;
  icon: (focused: boolean, color: string, size: number) => React.ReactNode;
  colorActive?: string;
  backgroundActive?: string;
  onPress?: () => void;
};

const CustomDrawerItem = ({
  label,
  screenName,
  icon,
  colorActive = ColorMain,
  backgroundActive = "#f0f0f0",
  onPress,
}: Props) => {
  const isFocused = useNavigationState(
    (state) => state.routes[state.index].name === screenName
  );
  return (
    <DrawerItem
      label={label}
      icon={({ color, size }) =>
        icon(isFocused, isFocused ? colorActive : color, size)
      }
      labelStyle={
        {
          color: isFocused ? colorActive : "#333",
          fontWeight: isFocused ? "bold" : "normal",
        } as TextStyle
      }
      style={
        {
          backgroundColor: isFocused ? backgroundActive : "transparent",
          borderRadius: 8,
        } as ViewStyle
      }
      onPress={onPress ?? (() => {})}
    />
  );
};
export default CustomDrawerItem;
