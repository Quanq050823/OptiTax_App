// src/context/RoleContext.ts
import { createContext } from "react";

export const RoleContext = createContext<{
  role: string;
  setRole: (value: string) => void;
}>({
  role: "",
  setRole: () => {},
});
