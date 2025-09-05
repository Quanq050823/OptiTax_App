import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/src/types/route";

export const useAppRoute = <T extends keyof RootStackParamList>() => {
  return useRoute<RouteProp<RootStackParamList, T>>();
};
