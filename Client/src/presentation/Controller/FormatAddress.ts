import { Address } from "@/src/types/route";

const formatAddress = (address?: Address | null): string => {
  if (!address) return "";

  const parts = [address.street, address.ward, address.district, address.city];

  return parts.filter(Boolean).join(", ");
};
export { formatAddress };
