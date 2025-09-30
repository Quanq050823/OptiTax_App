import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";
import {
  getInvoiceInputList,
  getInvoiceOutputList,
} from "@/src/services/API/invoiceService";
import {
  BusinessInforAuth,
  getUserProfile,
} from "@/src/services/API/profileService";
import { getInvoiceIn } from "@/src/services/API/syncInvoiceIn";
import { InvoiceSummary } from "@/src/types/invoiceIn";
import { Invoice, Profile, UserProfile } from "@/src/types/route";
import { createContext, useContext, useEffect, useState } from "react";

// context.tsx
interface DataContextType {
  data: Profile | null;
  invoicesInput: Invoice[];
  invoicesOuput: Invoice[];
  setData: React.Dispatch<React.SetStateAction<Profile | null>>;
  setInvoicesInput: React.Dispatch<React.SetStateAction<Invoice[]>>;
  setInvoicesOutput: React.Dispatch<React.SetStateAction<Invoice[]>>;
  fetchData: () => Promise<void>;
  invoiceDataSync: InvoiceSummary[];
}
interface DataProviderProps {
  children: React.ReactNode;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState<Profile | null>(null);
  const [invoicesInput, setInvoicesInput] = useState<Invoice[]>([]);
  const [invoicesOuput, setInvoicesOutput] = useState<Invoice[]>([]);
  const [invoiceDataSync, setInvoiceDataSync] = useState<InvoiceSummary[]>([]);

  const fetchData = async () => {
    try {
      const user: UserProfile = await getUserProfile();
      const business = await BusinessInforAuth();
      setData({
        ...user,
        businessName: business?.businessName,
        address: business?.address,
        phoneNumber: business?.phoneNumber,
      });

      const res = await getInvoiceInputList();
      setInvoicesInput(res.data ?? []);

      const data = await getInvoiceOutputList();
      setInvoicesOutput(data.data ?? []);

      const invoiceInSync = await getInvoiceIn();
      setInvoiceDataSync(invoiceInSync);
    } catch (error) {
      console.error("❌ Error fetchData:", error);
    }
  };

  // fetch ngay khi app chạy
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        invoicesInput,
        setInvoicesInput,
        invoicesOuput,
        setInvoicesOutput,
        fetchData,
        invoiceDataSync,
      }}
    >
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
