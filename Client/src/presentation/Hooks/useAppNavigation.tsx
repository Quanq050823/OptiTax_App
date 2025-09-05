import { RootStackParamList } from "@/src/types/route";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export const useAppNavigation = () => {
  return useNavigation<NavigationProp<RootStackParamList>>();
};
