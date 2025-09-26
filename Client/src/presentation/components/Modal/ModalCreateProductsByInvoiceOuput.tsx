import { ColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ModalAddProduct from "@/src/presentation/components/Modal/ModalAddProduct/ModalAddProduct";
import { Invoice, InvoiceProduct } from "@/src/types/route";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";

type NewProduct = {
  name: string;
  code: string;
  category: string;
  unit: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  attributes: { key: string; value: string }[];
};
interface ModalAddProductProps {
  openListProductSynchronized: boolean;
  setOpenListProductSynchronized: (
    openListProductSynchronized: boolean
  ) => void;
  invoicesData: Invoice[];
  //   onAddProduct: any;
  //   setName: (name: string) => void;
  //   setPrice: (price: number) => void;
  //   setStock: (quantity: string) => void;
  //   setCode: (code: string) => void;
  //   setDescription: (description: string) => void;
  //   setCategory: (category: string) => void;
  //   name: string;
  //   code: string;
  //   category: string;
  //   description: string;
}
const screenWidth = Dimensions.get("window").width;
const ITEM_MARGIN = 8;
const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;
const products = [
  {
    _id: 1,
    name: "cà phê",
    price: 20000,
    stock: 20,
    imageUrl:
      "https://file.hstatic.net/200000438087/article/matcha_a65500b758c14866a36d3d73c_d7bc515652214595a8e3268cfaf03824.jpg",
  },
  {
    _id: 2,
    name: "cà phê",
    price: 20000,
    stock: 20,
    imageUrl:
      "https://file.hstatic.net/200000438087/article/matcha_a65500b758c14866a36d3d73c_d7bc515652214595a8e3268cfaf03824.jpg",
  },
  {
    _id: 3,
    name: "cà phê",
    price: 20000,
    stock: 20,
    imageUrl:
      "https://file.hstatic.net/200000438087/article/matcha_a65500b758c14866a36d3d73c_d7bc515652214595a8e3268cfaf03824.jpg",
  },
];
function ModalCreateProductsByInvoiceOuput({
  openListProductSynchronized,
  setOpenListProductSynchronized,
  invoicesData,
}: ModalAddProductProps) {
  const [productSynchronized, setProductSynchronized] = useState<
    InvoiceProduct[]
  >([]);
  const [loading, setLoading] = useState(false);
  const gifSource = require("@/assets/images/icons_loading_smooth.gif"); // path tới file GIF
  const [startCreate, setStartCreate] = useState(false);
  const [visible, setVisible] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    code: "",
    category: "",
    unit: "",
    price: 0,
    description: "",
    imageUrl: "",
    stock: 0,
    attributes: [],
  }); //   useEffect(() => {}, [invoicesData]);

  //   console.log(JSON.stringify(productSynchronized, null, 2));
  const handleCreateSynchronized = () => {
    setStartCreate(true);
    setLoading(true);
    if (invoicesData && invoicesData.length > 0) {
      // flatMap để dàn phẳng tất cả sản phẩm từ nhiều hóa đơn
      const productData: InvoiceProduct[] = invoicesData.flatMap(
        (invoice) => invoice.hdhhdvu || []
      );

      const groupedProducts = Object.values(
        productData.reduce((acc, item) => {
          if (!acc[item.ten]) {
            acc[item.ten] = {
              ...item,
              sluong: Number(item.sluong),
              thtien: Number(item.thtien),
            };
          } else {
            acc[item.ten].sluong += Number(item.sluong);
            acc[item.ten].thtien += Number(item.thtien);
          }
          return acc;
        }, {} as Record<string, any>)
      );

      // Sắp xếp theo stt
      groupedProducts.sort((a, b) => Number(a.stt) - Number(b.stt));

      setTimeout(() => {
        setLoading(false);
        setProductSynchronized(groupedProducts);
      }, 1000);
    }
  };
  const renderItem = ({ item }: any) => (
    <TouchableOpacity>
      <View
        style={[
          styleModal.card,
          {
            width: ITEM_WIDTH,
            marginHorizontal: ITEM_MARGIN / 2,
            position: "relative",
          },
        ]}
      >
        <View style={{ flex: 1, alignItems: "center", width: "80%" }}>
          <Image
            source={{
              uri: "data:image/png;base64,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",
            }}
            style={styleModal.image}
          />
          <Text style={styleModal.name}>{item.ten}</Text>
          <Text style={styleModal.detail}>
            Giá: {item.dgia.toLocaleString()}đ
          </Text>
          {/* <Text style={styleModal.detail}>Số lượng: {item.sluong}</Text> */}
          <TouchableOpacity
            style={[styleModal.btnCreate, { marginTop: 20 }]}
            onPress={() => setVisible(true)}
          >
            <Text style={{ color: "#fff" }}>Cập nhập</Text>
          </TouchableOpacity>
        </View>
        <ModalAddProduct
          visible={visible}
          setVisible={setVisible}
          newProduct={item}
          setProductSynchronized={setProductSynchronized}
          setNewProduct={setNewProduct}
        />
        {/* {showAction === item.code && (
          <>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <MaterialIcons
                name="delete-outline"
                size={24}
                color="red"
                onPress={() => handleDeleteProduct(item._id)}
              />
              <AntDesign
                name="edit"
                size={24}
                color={ColorMain}
                onPress={() => handleOpenModalEditProduct(item._id)}
              />
            </View>
            <View
              style={{
                position: "absolute",
                flex: 1,
                backgroundColor: "#24408f1a",
                zIndex: -10,
                inset: 0,
                borderRadius: 8,
              }}
            ></View>
          </>
        )} */}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={openListProductSynchronized}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setOpenListProductSynchronized(false)}
      style={{ zIndex: 100 }}
    >
      <Pressable style={styleModal.overlay}>
        <View style={styleModal.modalContent}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              position: "relative",
              width: "100%",
              marginTop: 20,
            }}
          >
            <Text style={styleModal.modalText}>
              Sản phẩm đồng bộ từ hoá đơn
            </Text>
            <TouchableOpacity
              onPress={() => setOpenListProductSynchronized(false)}
              style={{ position: "absolute", right: 20 }}
            >
              <MaterialIcons name="cancel" size={24} color={ColorMain} />
            </TouchableOpacity>
          </View>

          {!startCreate ? (
            <View style={{ flex: 1, alignItems: "center", marginTop: 100 }}>
              <TouchableOpacity
                style={styleModal.btnCreate}
                onPress={handleCreateSynchronized}
              >
                <Text style={{ color: "#fff" }}>Bắt đầu tạo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <FlatList
                data={productSynchronized}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                extraData={loading}
                contentContainerStyle={{
                  paddingBottom: 80,
                  paddingHorizontal: 5,
                  marginTop: 20,
                }}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
                numColumns={2}
              />
              {/* {loading && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    zIndex: 1,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#747474b6",
                    borderRadius: 10,
                  }}
                >
                  <Image
                    source={gifSource}
                    style={{
                      width: 300,
                      height: 300,
                    }}
                    resizeMode="contain"
                  />
                  <Text style={{ color: "#fff" }}>Đang tạo...</Text>
                </View>
              )} */}
              <LoadingScreen visible={loading} />
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styleModal = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2f80ed",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fcfcfcff",
    paddingVertical: 0,
    borderRadius: 12,
    height: "90%",
    position: "relative",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    color: ColorMain,
    fontWeight: "700",
  },
  AddButton: {
    marginTop: 10,
    backgroundColor: ColorMain,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: 100,
    textAlign: "center",
  },
  AddText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },

  input: {
    height: 50,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cccccccc",
  },
  labelInput: { textAlign: "left", marginBottom: 7, color: ColorMain },
  card: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 200,

    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#2f80ed",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
  },
  addText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  shadow: {
    shadowColor: ColorMain,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 1 },
  },
  btnCreate: {
    backgroundColor: ColorMain,
    padding: 10,
    borderRadius: 10,
  },
});

export default ModalCreateProductsByInvoiceOuput;
