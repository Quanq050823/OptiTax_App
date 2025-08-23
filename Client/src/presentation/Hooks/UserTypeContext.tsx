// src/context/RoleContext.ts
import { createContext, useState } from "react";

export const UserTypeContext = createContext<{
  userType: number;
  setUserType: (value: number) => void;
}>({
  userType: 0,
  setUserType: () => {},
});

export const UserTypeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userType, setUserType] = useState(0);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};
