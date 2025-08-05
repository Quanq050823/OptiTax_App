import Feather from "@expo/vector-icons/Feather";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type FileType = {
  uri: string;
  name?: string;
  type?: string;
  size?: number;
};

const SelectImage = () => {
  const [file, setFile] = useState<FileType | null>(null);

  // 📄 Chọn PDF hoặc ảnh từ thư viện
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFile({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType,
          size: asset.size,
        });
        console.log("Document selected:", asset);
      }
    } catch (err) {
      console.error("DocumentPicker Error:", err);
    }
  };

  // 📸 Chụp ảnh từ camera
  const takePhoto = async () => {
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPerm.status !== "granted") {
      Alert.alert("Thông báo", "Bạn cần cấp quyền camera để chụp ảnh");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setFile({
        uri: image.uri,
        name: image.fileName || "photo.jpg",
        type: image.type || "image/jpeg",
        size: image.fileSize,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ảnh chụp GPKD (PDF/JPG)</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={pickDocument}>
          <Text style={styles.buttonText}>
            <Feather name="file" size={15} color="black" /> Chọn tệp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>
            <Feather name="camera" size={15} color="black" /> Chụp ảnh
          </Text>
        </TouchableOpacity>
      </View>

      {file && (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.fileInfo}>
            Đã chọn: {file.name || file.uri.split("/").pop()}
          </Text>

          {file.uri && file.type !== "application/pdf" && (
            <Image
              source={{ uri: file.uri }}
              style={{
                width: 200,
                height: 150,
                marginTop: 10,
                borderRadius: 8,
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 7
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: "#9d9d9d",
  },
  buttonText: {
    color: "#000",
    textAlign: "center",
  },
  fileInfo: {
    marginTop: 8,
    fontStyle: "italic",
    color: "#444",
  },
});

export default SelectImage;
