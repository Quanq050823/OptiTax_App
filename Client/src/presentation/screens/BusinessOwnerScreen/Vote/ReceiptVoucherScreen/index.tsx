import { ColorMain } from "@/src/presentation/components/colors";
import ModalAddReceiptVourcher from "@/src/presentation/components/Modal/ModalAddReceiptVourcher/ModalAddReceiptVourcher";
import { phieuThu } from "@/src/types/route";
import { AntDesign } from "@expo/vector-icons";
import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function ReceiptVoucherScreen() {
  const [voteReceipt, setVoteReceipt] = React.useState<phieuThu[]>([]);
  const [visible, setVisible] = React.useState(false);
  return (
    <View style={{ flex: 1, width: "100%", position: "relative" }}>
      {!voteReceipt.length ? (
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            paddingTop: 50,
          }}
        >
          <Image
            source={{
              uri: "https://png.pngtree.com/png-clipart/20230407/original/pngtree-money-bag-icon-illustration-and-collection-of-png-image_9032796.png",
              width: 150,
              height: 150,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 10,
              color: "#9d9d9d",
            }}
          >
            Chưa có phiếu thu nào
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, width: "100%" }}></View>
      )}
      <ModalAddReceiptVourcher
        voteReceipt={voteReceipt}
        setVoteReceipt={setVoteReceipt}
        visible={visible}
        setVisible={setVisible}
      />

      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 30,
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity
          style={styles.btnCreateVoucherReceipt}
          onPress={() => setVisible(true)}
        >
          <AntDesign name="plus" size={24} color="#fff" />
          <Text style={{ color: "#fff", fontWeight: "500", marginLeft: 5 }}>
            Tạo phiếu thu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnCreateVoucherReceipt: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: ColorMain,
    flexDirection: "row",
    backgroundColor: ColorMain,
  },
});
export default ReceiptVoucherScreen;
