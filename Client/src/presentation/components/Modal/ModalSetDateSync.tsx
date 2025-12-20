import { Modal, StyleSheet, Text, View } from "react-native";

type ModalProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
function ModalSetDateSync({ visible, setVisible }: ModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      //   onRequestClose={}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}></View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fafafaff",
    paddingHorizontal: 10,
    borderRadius: 8,
    width: "95%",
    minHeight: 200,
    alignItems: "center",
    paddingVertical: 20,
    position: "relative",
  },
});
export default ModalSetDateSync;
