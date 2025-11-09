// useCheckLoginOnMount.ts
import { useEffect, useState } from "react";
import { checkLogin } from "@/src/services/API/authService";
import { useAppNavigation } from "./useAppNavigation";

export function useCheckLoginOnMount() {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const navigation = useAppNavigation();

  useEffect(() => {
    const validate = async () => {
      setLoading(true);
      try {
        const result = await checkLogin();
        console.log("Checking token:", result);

        setIsValid(result.isAuthenticated);

        if (result.isAuthenticated) {
          console.log("Token hợp lệ → redirect");
          navigation.reset({
            index: 0,
            routes: [{ name: "NavigationBusiness" }],
          });
        } else {
          console.log("Token không hợp lệ");
        }
      } catch (err) {
        console.error("Check login failed:", err);
      } finally {
        setLoading(false);
      }
    };
    validate();
  }, []);

  return { isValid, loading };
}
