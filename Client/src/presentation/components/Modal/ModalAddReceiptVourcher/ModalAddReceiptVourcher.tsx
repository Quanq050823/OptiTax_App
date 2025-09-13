import { ColorMain } from "@/src/presentation/components/colors";
import { phieuThu } from "@/src/types/route";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

function ModalAddReceiptVourcher({
  voteReceipt,
  setVoteReceipt,
  visible,
  setVisible,
}: {
  voteReceipt: phieuThu[];
  setVoteReceipt: React.Dispatch<React.SetStateAction<phieuThu[]>>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const [receiver, setReceiver] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [modalVoucerType, setModalVoucerType] = useState<boolean>(false);
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [typeVoucher, setTypeVoucher] = useState<string>("");
  const formatMoney = useCallback((text: string) => {
    // Xóa tất cả ký tự không phải số
    const cleaned = text.replace(/\D/g, "");

    // Format theo hàng nghìn
    const formatted = cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    setAmount(formatted);
  }, []);

  const data = useMemo(
    () => [
      { label: "Nhóm A", value: "A" },
      { label: "Nhóm B", value: "B" },
    ],
    []
  );

  const dataTypeVoucher = useMemo(
    () => [
      { label: "Bán nguyên liệu", value: "ban_nguyen_lieu" },
      { label: "Bán ve chai", value: "ban_ve_chai" },
    ],
    []
  );

  const handleCreateReceipt = () => {
    setVisible(false);
    setAmount("");
    setReceiver("");
    setDocumentNumber("");
    setTypeVoucher("");
  };
  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVisible(false)}
        style={{ zIndex: 100 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Pressable style={styleModal.overlay}>
            <View style={[styleModal.modalContent, { height: "90%" }]}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <Text style={styleModal.modalText}>Thêm phiếu thu</Text>
                  <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={{ position: "absolute", right: 0 }}
                  >
                    <AntDesign name="close" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styleModal.label}>Mã phiếu thu</Text>
                  <TextInput
                    placeholder="155508XXX(Mã tự động)"
                    style={[
                      styleModal.input,
                      styleModal.borderInput,
                      { backgroundColor: "#f5f5f5" },
                    ]}
                    editable={false}
                  />
                </View>
                <View>
                  <Text style={styleModal.label}>Nhóm người nộp</Text>
                  <Dropdown
                    style={[
                      styleModal.dropdown,
                      styleModal.borderInput,
                      { marginBottom: 15 },
                    ]}
                    placeholderStyle={styleModal.placeholderStyle}
                    selectedTextStyle={styleModal.selectedTextStyle}
                    data={data}
                    labelField="label"
                    valueField="value"
                    placeholder="Chọn nhóm người nhận --"
                    value={receiver}
                    onChange={(item) => {
                      setReceiver(item.value);
                    }}
                  />
                </View>
                <View>
                  <Text style={styleModal.label}>Số chứng từ</Text>
                  <TextInput
                    placeholder=""
                    value={documentNumber}
                    style={[styleModal.input, styleModal.borderInput]}
                    onChangeText={(text) => setDocumentNumber(text)}
                  />
                </View>
                <View>
                  <Text style={styleModal.label}>Mã phiếu thu</Text>
                  <TextInput
                    placeholder=""
                    style={[styleModal.input, styleModal.borderInput]}
                  />
                </View>
                <View>
                  <Text style={styleModal.label}>Người nộp</Text>
                  <TextInput
                    placeholder=""
                    style={[styleModal.input, styleModal.borderInput]}
                  />
                </View>
                <View>
                  <Text style={styleModal.label}>Giá trị phiếu thu - VND</Text>
                  <TextInput
                    placeholder="0đ"
                    value={amount}
                    style={[styleModal.input, styleModal.borderInput]}
                    keyboardType="numeric"
                    onChangeText={formatMoney}
                  />
                </View>
                <View>
                  <Text style={styleModal.label}>Loại phiếu thu</Text>
                  <TouchableOpacity
                    style={[
                      styleModal.input,
                      styleModal.borderInput,
                      {
                        backgroundColor: "#f5f5f5",
                        justifyContent: "space-between",
                        flexDirection: "row",
                        alignItems: "center",
                      },
                    ]}
                    onPress={() => {
                      setModalVoucerType(true);
                      setVisible(false);
                    }}
                  >
                    {typeVoucher ? (
                      <Text style={{ color: "#000", fontSize: 16 }}>
                        {typeVoucher}
                      </Text>
                    ) : (
                      <>
                        <Text style={{ color: "#9d9d9d", fontSize: 16 }}>
                          Chọn loại phiếu thu
                        </Text>
                        <Feather name="arrow-right" size={24} color="#9d9d9d" />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styleModal.label}>Ghi chú</Text>
                  <TextInput
                    placeholder=""
                    style={[styleModal.input, styleModal.borderInput]}
                    multiline
                  />
                </View>
              </ScrollView>
              <View
                style={{
                  width: "100%",
                  position: "absolute",
                  bottom: 10,
                  justifyContent: "center",
                  left: 15,
                }}
              >
                <TouchableOpacity
                  style={styleModal.btnSubmit}
                  onPress={handleCreateReceipt}
                >
                  <Text style={{ color: "#fff", fontWeight: "500" }}>
                    Tạo phiếu
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        visible={modalVoucerType}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVoucerType(false)}
        style={{ zIndex: 100 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Pressable style={styleModal.overlay}>
            <View
              style={[
                styleModal.modalContent,
                {
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  position: "relative",
                },
              ]}
            >
              <ScrollView>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <Text style={styleModal.modalText}>Chọn loại phiếu thu</Text>
                  <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={{ position: "absolute", right: 0 }}
                  >
                    <AntDesign name="close" size={24} color={ColorMain} />
                  </TouchableOpacity>
                </View>
                {dataTypeVoucher.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => {
                      setTypeVoucher(item.label);
                      setModalVoucerType(false);
                      setVisible(true);
                    }}
                  >
                    <View
                      style={{
                        paddingVertical: 15,
                        borderBottomWidth: 1,
                        borderColor: "#ccc",
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item.label}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styleModal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "95%",
    backgroundColor: "#fff",
    paddingVertical: 24,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingBottom: 50,
    overflow: "hidden",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    color: ColorMain,
    fontWeight: "700",
  },
  label: {
    textAlign: "left",
    marginBottom: 5,
    color: ColorMain,
    fontWeight: "500",
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    shadowColor: ColorMain,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    width: "100%",
    height: 50,
    paddingHorizontal: 10,
    color: "#333",
    backgroundColor: "#fff",
  },
  borderInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  dropdown: {
    height: 50,

    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    position: "relative",
  },
  placeholderStyle: {
    color: "#9d9d9d",
  },
  selectedTextStyle: {
    color: "#000",
  },
  btnSubmit: {
    width: "100%",
    height: 50,
    backgroundColor: ColorMain,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ModalAddReceiptVourcher;
