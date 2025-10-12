import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ColorMain } from "../colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { useState } from "react";
import { AddTax } from "@/src/types/tax";

interface ModalAddVoucherTaxProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  //   onAddOrEditProductInventory: () => Promise<void>;
  newVoucherTax: AddTax;
  setNewVoucherTax: React.Dispatch<React.SetStateAction<AddTax>>;
  onAddVoucherTax: () => Promise<void>;
}
function ModalAddVoucherTax({
  visible,
  setVisible,
  newVoucherTax,
  setNewVoucherTax,
  onAddVoucherTax,
}: ModalAddVoucherTaxProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setVisible(false)}
      style={{ zIndex: 100 }}
    >
      <Pressable style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                position: "relative",
                width: "100%",
              }}
            >
              <Text style={styles.modalText}>Tạo Phiếu Mới</Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={{ position: "absolute", right: 10 }}
              >
                <MaterialIcons name="cancel" size={24} color={ColorMain} />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.labelInput}>Mã Phiếu </Text>
              <TextInput
                placeholder={"PT1..."}
                style={styles.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(text) => {
                  setNewVoucherTax({ ...newVoucherTax, code: text });
                }}
                defaultValue={newVoucherTax?.code}
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.labelInput}>Số tiền (VND) </Text>
              <TextInput
                placeholder={"1xxx "}
                style={styles.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(text) => {
                  setNewVoucherTax({ ...newVoucherTax, amount: Number(text) });
                }}
                defaultValue={newVoucherTax?.amount.toString()}
                keyboardType="numeric"
              />
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.labelInput}>Mô tả</Text>
              <TextInput
                placeholder={"Thuế ABC..."}
                style={styles.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(text) => {
                  setNewVoucherTax({
                    ...newVoucherTax,
                    description: text,
                  });
                }}
                defaultValue={newVoucherTax?.description}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.labelInput}>Ghi chú</Text>
              <TextInput
                placeholder={"Tiền thuế ..."}
                style={styles.input}
                placeholderTextColor={"#9d9d9d"}
                onChangeText={(text) => {
                  setNewVoucherTax({
                    ...newVoucherTax,
                    note: text,
                  });
                }}
                defaultValue={newVoucherTax?.note}
                multiline
              />
            </View>

            <TouchableOpacity
              style={styles.btnSaveVoucher}
              //   onPress={onAddOrEditProductInventory}
              onPress={onAddVoucherTax}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Lưu Phiếu
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#ffffffff",
    borderRadius: 12,
    height: "95%",
    padding: 10,
    paddingTop: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    color: ColorMain,
    fontWeight: "700",
  },
  btnSaveVoucher: {
    alignItems: "center",
    backgroundColor: ColorMain,
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },

  input: {
    height: 50,
    width: "98%",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    // shadowColor: "#313131ff",
    // shadowOffset: { width: 0, height: 0.5 },
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
    // elevation: 5,
    borderWidth: 1,
    borderColor: "#a8a8a8ff",
    marginHorizontal: 5,
  },
  labelInput: {
    textAlign: "left",
    marginBottom: 7,
    color: ColorMain,
    fontWeight: "600",
  },
});
export default ModalAddVoucherTax;
