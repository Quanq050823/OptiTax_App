import { AntDesign } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";
import { useData } from "../Hooks/useDataStore";
import { exportTax04CNKD } from "../Controller/taxDeclaration/exportTax04CNKD";
import { useEffect, useState } from "react";
import { getTotalTaxes } from "@/src/services/API/taxService";

function ButtonToKhai() {
  const { data, invoicesOutput } = useData();
  const [totalGTGT, setTotalGTGT] = useState(0);
  const [totalTNCN, setTotalTNCN] = useState(0);

  const fetchTotalTaxes = async () => {
    try {
      const result = await getTotalTaxes();
      setTotalGTGT(result.totalGTGT);
      setTotalTNCN(result.totalTNCN);
    } catch (error) {
      return;
    }
  };
  useEffect(() => {
    fetchTotalTaxes();
  }, []);
  return (
    <TouchableOpacity
      onPress={() =>
        exportTax04CNKD(data, invoicesOutput, totalGTGT, totalTNCN)
      }
    >
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
        Tờ khai 04 / CNKD &nbsp;
        <AntDesign name="folder-open" size={17} color="#fff" />
      </Text>
    </TouchableOpacity>
  );
}

export default ButtonToKhai;
