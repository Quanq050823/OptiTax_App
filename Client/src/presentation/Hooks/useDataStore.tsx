import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import { createContext, useContext, useEffect, useState } from "react";

// context.tsx
interface DataContextType {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}
interface DataProviderProps {
  children: React.ReactNode;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState(null);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
