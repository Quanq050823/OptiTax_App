import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
import InvoiceSyncList from "@/src/presentation/components/List/InvoiceSyncList";
import InvoiInputList from "@/src/presentation/components/List/InvoiInputList";
import {
  getProductsInventory,
  syncProduct,
} from "@/src/services/API/storageService";
import { InvoiceListResponse, InvoiceSummary } from "@/src/types/invoiceIn";
import { ProductInventory, ProductInventoryList } from "@/src/types/storage";
import { syncDataInvoiceIn } from "@/src/types/syncData";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useAppNavigation } from "../../Hooks/useAppNavigation";
import LoadingScreen from "../Loading/LoadingScreen";
import TagItem from "../TagItem";
import NewIngredientButton from "../NewIngredientButton";

interface ModalSyncDashBoardType {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  syncDate: syncDataInvoiceIn;
  dataSyncInvoice: InvoiceListResponse | undefined;
  loading: boolean;
}
function formatDate(dateString: string) {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("/");
  return `${day}/${month}/${year}`;
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
        name: "Phần mềm quản lý bán hàng",
        quantity: 1,
        price: 5000000,
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
function ModalSyncDashBoard({
  visible,
  setVisible,
  syncDate,
  dataSyncInvoice,
}: ModalSyncDashBoardType) {
  const [dataSyncProductStorage, setDataSyncProductStorage] = useState<
    ProductInventory[]
  >([]);
  const navigate = useAppNavigation();
  const [loading, setLoading] = useState(false);
  // const [productStorage, setProductStorage] = useState<ProductInventory[]>([]);
  const from = new Date(syncDate.datefrom);
  const to = new Date(syncDate.dateto);
  useEffect(() => {
    if (!visible) return; // Chỉ sync khi modal được mở
    const syncProductStorage = async () => {
      setLoading(true);
      try {
        const resul = await syncProduct();
        const fetchStorage = await getProductsInventory();
        const unsyncedProducts = fetchStorage.data.filter(
          (item) => item.syncStatus === false
        );
        setDataSyncProductStorage(unsyncedProducts);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    syncProductStorage();
  }, [visible]);

  // const filteredInvoices = dataSyncProductStorage?.filter((prd) => {
  //   const prodDate = new Date(prd.createdAt ?? "");
  //   const from = new Date(syncDate.datefrom);
  //   const to = new Date(syncDate.dateto);

  //   return prodDate >= from && prodDate <= to;
  // });
  // console.log(filteredInvoices);

  const handleMoveStorage = () => {
    setVisible(false);
    navigate.navigate("NewIngredientList");
    setLoading(false);
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setVisible(false)}
      style={{ zIndex: 100 }}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      {/* <LoadingScreen visible={loading} /> */}
      <View style={styles.modalContent}>
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
            setLoading(false);
          }}
          style={{ position: "absolute", right: 15, top: 15 }}
        >
          <MaterialIcons name="cancel" size={24} color={ColorMain} />
        </TouchableOpacity>
        <View style={styles.labelModal}>
          <Text
            style={{ fontSize: 19, fontWeight: "600", color: textColorMain }}
          >
            Cập nhật đồng bộ
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: textColorMain,
              marginTop: 20,
            }}
          >
            {formatDate(syncDate.datefrom) ?? "-"} -
            {formatDate(syncDate.dateto) ?? "—"}
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
            shadowColor: "#707070ff",
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
              <Text style={styles.textResultSync}>
                {dataSyncInvoice?.sync ?? 0}
              </Text>
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
              <Text style={styles.textResultSync}>
                {dataSyncInvoice?.skip ?? 0}
              </Text>
            </View>
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text style={{ color: "#cf3030ff", fontWeight: "600" }}>
                Hoá đơn lỗi
              </Text>
              <Text style={styles.textResultSync}>
                {dataSyncInvoice?.fail ?? 0}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            backgroundColor: "#fff",
            padding: 10,
            borderRadius: 10,
            shadowColor: "#707070ff",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.25,
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              paddingVertical: 10,
              minHeight: 60,
            }}
          >
            <AntDesign name="dropbox" size={20} color="#858585ff" />
            <Text
              style={{ fontSize: 17, fontWeight: "600", color: "#858585ff" }}
            >
              Nguyên liệu từ hoá đơn
            </Text>
          </View>
          <FlatList
            data={dataSyncProductStorage}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#fff",
                  marginBottom: 20,
                  borderRadius: 8,
                  padding: 10,
                  shadowColor: "#000",
                  shadowOpacity: 0.22,
                  shadowRadius: 3,
                  shadowOffset: { width: 0, height: 0 },
                  position: "relative",
                  minHeight: 50,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: -10,
                    right: 5,
                    flexDirection: "row",
                    gap: 7,
                  }}
                >
                  <View style={styles.tagNew}>
                    <Text
                      style={{ color: "#fff", fontWeight: "500", fontSize: 12 }}
                    >
                      Mới
                    </Text>
                  </View>
                  <View style={styles.tagDate}>
                    <Text
                      style={{ color: "#fff", fontWeight: "500", fontSize: 12 }}
                    >
                      {item.createdAt.split("T")[0]}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  {item.name}
                </Text>
                <Text>Số lượng: {item.stock}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: "#999" }}>
                Không có hoá đơn nào trong khoảng ngày đã chọn
              </Text>
            }
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          />
          {/* <View style={{ paddingVertical: 50, alignItems: "center" }}>
              <Text>Không có sản phẩm nào từ hoá đơn</Text>
            </View> */}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
            paddingHorizontal: 10,
            marginVertical: 20,
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
            onPress={handleMoveStorage}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Đến kho</Text>
            <View style={styles.notifycation}>
              <Text
                style={{
                  textAlign: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {dataSyncProductStorage.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  notifycation: {
    height: 20,
    width: 20,
    borderRadius: 50,
    backgroundColor: "red",
    position: "absolute",
    zIndex: 1,
    top: -5,
    right: -5,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#f8f8f8ff",
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
    position: "relative",
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
    borderRadius: 10,
    flex: 1,
    borderWidth: 0.5,
    borderColor: ColorMain,
    marginTop: 20,
  },
  tagDate: {
    backgroundColor: ColorMain,
    paddingHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 2,
  },
  tagNew: {
    backgroundColor: "#da3838ff",
    paddingHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 2,
  },
});

export default ModalSyncDashBoard;
