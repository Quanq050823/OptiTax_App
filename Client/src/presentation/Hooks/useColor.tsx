import { useTheme } from "./useTheme";

export function useColors() {
  const { isDark } = useTheme();

  return {
    textLight: isDark ? "#fff" : "#141414ff",
    textDark: isDark ? "#000" : "#fff",
    textDealine: "#3BA99C",
    iconNavigation: "#3F4E87",
    background: isDark ? "#000000ff" : "#fff",
    iconNaviBot: "#d1d1d1ff",
  };
}
