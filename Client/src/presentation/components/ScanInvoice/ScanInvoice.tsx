import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

interface ScanInvoiceProps {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
  ocrResult: string[];
  setOcrResult: (result: string[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function ScanInvoice({
  imageUri,
  setImageUri,
  ocrResult,
  setOcrResult,
  loading,
  setLoading,
}: ScanInvoiceProps) {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>

      {ocrResult?.length > 0 && (
        <>
          <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10 }}>
            Văn bản nhận diện:
          </Text>
          {ocrResult.map((line, index) => (
            <Text key={index} style={{ marginVertical: 2 }}>
              {line}
            </Text>
          ))}
        </>
      )}
    </ScrollView>
  );
}

export default ScanInvoice;
