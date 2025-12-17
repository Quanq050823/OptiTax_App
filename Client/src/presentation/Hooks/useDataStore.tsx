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
import { getTaxList } from "@/src/services/API/taxService";
import { getVoucherPayment } from "@/src/services/API/voucherService";
import { InvoiceSummary } from "@/src/types/invoiceIn";
import { Invoice, Profile, UserProfile } from "@/src/types/route";
import { TaxItem } from "@/src/types/tax";
import { PaymentVoucher, VoucherPaymentResponse } from "@/src/types/voucher";
import { createContext, useContext, useEffect, useState } from "react";

// context.tsx
interface DataContextType {
  data?: Profile;
  setData: React.Dispatch<React.SetStateAction<Profile | undefined>>;
  invoicesInput: Invoice[];
  invoicesOutput: Invoice[];
  taxList: TaxItem[];
  invoiceInputDataSync: InvoiceSummary[];
  voucherPayList: PaymentVoucher[];
  setInvoicesInput: React.Dispatch<React.SetStateAction<Invoice[]>>;
  setInvoicesOutput: React.Dispatch<React.SetStateAction<Invoice[]>>;
  fetchData: () => Promise<void>;
}
interface DataProviderProps {
  children: React.ReactNode;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
export const DataProvider = ({ children }: DataProviderProps) => {
  const [data, setData] = useState<Profile | undefined>();
  const [invoicesInput, setInvoicesInput] = useState<Invoice[]>([]);
  const [invoicesOutput, setInvoicesOutput] = useState<Invoice[]>([]);
  const [invoiceInputDataSync, setInvoiceInputDataSync] = useState<
    InvoiceSummary[]
  >([]);
  const [voucherPayList, setVoucherPayList] = useState<PaymentVoucher[]>([]);
  const [taxList, setTaxList] = useState<TaxItem[]>([]);
  const fetchData = async () => {
    try {
      const user: UserProfile = await getUserProfile();
      const business = await BusinessInforAuth();
      setData({
        ...user,
        businessName: business?.businessName,
        address: business?.address,
        phoneNumber: business?.phoneNumber,
        taxCode: business?.taxCode,
        password: business?.password,
      });

      const invoiceInSync = await getInvoiceIn();
      setInvoiceInputDataSync(invoiceInSync);
      // const res = await getInvoiceInputList();
      // setInvoicesInput(res.data ?? []);

      const data = await getInvoiceOutputList();
      setInvoicesOutput(data.data ?? []);

      const dataTax = await getTaxList();
      setTaxList(dataTax.data);

      const voucherData: VoucherPaymentResponse = await getVoucherPayment();
      console.log(voucherData, "voucher payment");
      setVoucherPayList(voucherData.data);
    } catch (error) {
      return;
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
        invoicesOutput,
        setInvoicesOutput,
        fetchData,
        invoiceInputDataSync,
        taxList,
        voucherPayList,
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
