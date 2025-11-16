import { useState } from "react";
import { Alert } from "react-native";
import { logout as apiLogout } from "@/src/services/API/authService";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useAppNavigation();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const result = await apiLogout();
      console.log("Logout result:", result);

      // Chuyển về trang login sau khi logout
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error: any) {
      Alert.alert("Đăng xuất thất bại", error?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, loading };
};
