import { Product } from "@/src/types/route";
import { useMemo } from "react";

export default function useInvoiceTotals(
  items: (Product & { quantity?: number; total?: number })[]
) {
  const safeItems = useMemo(
    () =>
      items.map((it) => ({
        ...it,
        quantity: it.quantity || 0,
        total: it.total ?? (it.price || 0) * (it.quantity || 0),
      })),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      safeItems.reduce(
        (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
        0
      ),
    [safeItems]
  );

  return { safeItems, totalPrice };
}
