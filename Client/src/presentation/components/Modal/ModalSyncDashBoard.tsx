import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import InvoiceSyncList from "@/src/presentation/components/List/InvoiceSyncList";
import InvoiInputList from "@/src/presentation/components/List/InvoiInputList";
import { InvoiceSummary } from "@/src/types/invoiceIn";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalSyncDashBoardType {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const mockInvoices: InvoiceSummary[] = [
  {
    _id: "inv001",
    id: "HD001",
    kyHieu: "AA/23E",
    soHoaDon: "0001234",
    mauSo: "01GTKT0/001",
    ngayLap: "2025-10-25",
    ngayKy: "2025-10-25",
    loaiHoaDon: "Hóa đơn GTGT",
    maCQT: "0101234567",
    maTraCuu: "ABC123XYZ",
    nguoiBan: {
      ten: "Công ty TNHH Thương mại Dịch vụ Sao Việt",
      mst: "0109876543",
      diaChi: "12 Nguyễn Văn Cừ, Quận 1, TP.HCM",
      stk: "123456789 - Vietcombank CN TP.HCM",
    },
    nguoiMua: {
      ten: "Công ty Cổ phần TechSoft",
      mst: "0314567890",
      diaChi: "45 Lê Lợi, Quận 1, TP.HCM",
    },
    thanhToan: {
      hinhThuc: "Chuyển khoản",
      trangThai: "Đã thanh toán",
    },
    tien: {
      truocThue: 5000000,
      thue: 500000,
      tong: 5500000,
      bangChu: "Năm triệu năm trăm nghìn đồng",
      thueSuat: "10%",
      dvtte: "VND",
    },
    hdhhdvu: [
      {
        tenHang: "Phần mềm quản lý bán hàng",
        soLuong: 1,
        donGia: 5000000,
        thanhTien: 5000000,
        thueSuat: "10%",
      },
    ],
    trangThaiHoaDon: "Đã phát hành",
    createdAt: "2025-10-25T10:00:00Z",
    updatedAt: "2025-10-25T10:10:00Z",
  },
  {
    _id: "inv002",
    id: "HD002",
    kyHieu: "BB/23E",
    soHoaDon: "0005678",
    mauSo: "02GTTT0/002",
    ngayLap: "2025-11-01",
    ngayKy: "2025-11-01",
    loaiHoaDon: "Hóa đơn bán hàng",
    maCQT: "0208765432",
    maTraCuu: "XYZ987ABC",
    nguoiBan: {
      ten: "Cửa hàng Điện máy Minh Tâm",
      mst: "0402345678",
      diaChi: "88 Trần Hưng Đạo, Hà Nội",
      stk: null,
    },
    nguoiMua: {
      ten: "Nguyễn Văn A",
      mst: "",
      diaChi: "123 Lê Duẩn, Hà Nội",
    },
    thanhToan: {
      hinhThuc: "Tiền mặt",
      trangThai: "Chưa thanh toán",
    },
    tien: {
      truocThue: 1500000,
      thue: 150000,
      tong: 1650000,
      bangChu: "Một triệu sáu trăm năm mươi nghìn đồng",
      thueSuat: "10%",
      dvtte: "VND",
    },
    hdhhdvu: [
      {
        tenHang: "Máy sấy tóc Philips",
        soLuong: 1,
        donGia: 1500000,
        thanhTien: 1500000,
        thueSuat: "10%",
      },
    ],
    trangThaiHoaDon: "Chờ ký",
    createdAt: "2025-11-01T09:30:00Z",
    updatedAt: "2025-11-01T09:35:00Z",
  },
  {
    _id: "inv003",
    id: "HD003",
    kyHieu: "CC/23E",
    soHoaDon: "0009012",
    mauSo: "03GTKT0/003",
    ngayLap: "2025-09-10",
    ngayKy: "2025-09-11",
    loaiHoaDon: "Hóa đơn điện tử",
    maCQT: "0306543210",
    maTraCuu: "INV003XYZ",
    nguoiBan: {
      ten: "Công ty TNHH Sản xuất Hòa Phát",
      mst: "0302223334",
      diaChi: "KCN VSIP, Bình Dương",
      stk: "999888777 - BIDV CN Bình Dương",
    },
    nguoiMua: {
      ten: "Công ty CP Dịch vụ Nam Long",
      mst: "0312233445",
      diaChi: "Tòa nhà Etown, Quận Tân Bình, TP.HCM",
    },
    thanhToan: {
      hinhThuc: "Chuyển khoản",
      trangThai: "Đang xử lý",
    },
    tien: {
      truocThue: 12000000,
      thue: 1200000,
      tong: 13200000,
      bangChu: "Mười ba triệu hai trăm nghìn đồng",
      thueSuat: "10%",
      dvtte: "VND",
    },
    hdhhdvu: [
      {
        tenHang: "Thiết bị cơ khí",
        soLuong: 3,
        donGia: 4000000,
        thanhTien: 12000000,
        thueSuat: "10%",
      },
    ],
    trangThaiHoaDon: "Đã gửi CQT",
    createdAt: "2025-09-10T14:00:00Z",
    updatedAt: "2025-09-11T08:00:00Z",
  },
];
function ModalSyncDashBoard({ visible, setVisible }: ModalSyncDashBoardType) {
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
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={{ position: "absolute", right: 15, top: 15 }}
          >
            <MaterialIcons name="cancel" size={24} color={ColorMain} />
          </TouchableOpacity>
          {/* <InvoiceSyncList invoicesData={mockInvoices} /> */}
          <View style={styles.labelModal}>
            <Text
              style={{ fontSize: 17, fontWeight: "600", color: textColorMain }}
            >
              Cập nhật đồng bộ
            </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
              paddingVertical: 20,
              paddingBottom: 40,
              shadowColor: "#9d9d9d",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.25,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
              }}
            >
              <FontAwesome6 name="file-invoice" size={17} color="#858585ff" />
              <Text
                style={{ fontSize: 17, fontWeight: "600", color: "#858585ff" }}
              >
                Hoá đơn mua vào
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <View
                style={{ alignItems: "center", position: "relative", flex: 1 }}
              >
                <View
                  style={{
                    position: "absolute",
                    height: 30,
                    borderWidth: 0.3,
                    borderColor: "#d0d0d0ff",
                    right: 0,
                  }}
                />
                <Text style={{ fontWeight: "600", color: textColorMain }}>
                  Hoá đơn mới
                </Text>
                <Text style={styles.textResultSync}>0</Text>
              </View>
              <View
                style={{ alignItems: "center", position: "relative", flex: 1 }}
              >
                <View
                  style={{
                    position: "absolute",
                    height: 30,
                    borderWidth: 0.3,
                    borderColor: "#d0d0d0ff",
                    right: 0,
                  }}
                />
                <Text style={{ fontWeight: "600", color: "#23609aff" }}>
                  Hoá đơn đã có
                </Text>
                <Text style={styles.textResultSync}>0</Text>
              </View>
              <View style={{ alignItems: "center", flex: 1 }}>
                <Text style={{ color: "#cf3030ff", fontWeight: "600" }}>
                  Hoá đơn lỗi
                </Text>
                <Text style={styles.textResultSync}>0</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: 20,
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
              }}
            >
              <AntDesign name="dropbox" size={20} color="#858585ff" />
              <Text
                style={{ fontSize: 17, fontWeight: "600", color: "#858585ff" }}
              >
                Nguyên liệu từ hoá đơn
              </Text>
            </View>

            <View style={{ paddingVertical: 50, alignItems: "center" }}>
              <Text>Không có sản phẩm nào từ hoá đơn</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
              paddingHorizontal: 10,
            }}
          >
            <TouchableOpacity
              style={styles.btnExitModalSync}
              //   onPress={onAddOrEditProductInventory}
            >
              <Text style={{ color: ColorMain, fontWeight: "600" }}>Xong</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnSaveVoucher}
              //   onPress={onAddOrEditProductInventory}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Lưu và tạo sản phẩm
              </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: "#f4f4f4ff",
    borderRadius: 12,
    height: "95%",
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
    flex: 1,
  },
  labelModal: {
    alignItems: "center",
  },
  textResultSync: {
    fontSize: 17,
  },
  btnExitModalSync: {
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    flex: 1,
    borderWidth: 0.5,
    borderColor: ColorMain,
  },
});

export default ModalSyncDashBoard;
