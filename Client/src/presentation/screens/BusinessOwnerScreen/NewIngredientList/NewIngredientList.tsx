import { ColorMain } from "@/src/presentation/components/colors";
import LoadingScreen from "@/src/presentation/components/Loading/LoadingScreen";
import ModalAddCategoryByProductStorage from "@/src/presentation/components/Modal/ModalAddCategoryByProductStorage";
import { getProductsInventory } from "@/src/services/API/storageService";
import { ProductInventory } from "@/src/types/storage";
import {
  AntDesign,
  Entypo,
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const ITEM_MARGIN = 8;
const ITEM_WIDTH = (screenWidth - ITEM_MARGIN * 3) / 2;

function NewIngredientList() {
  const [newIngredientList, setNewIngredientList] = useState<
    ProductInventory[]
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [productSelected, setProductSelected] = useState<ProductInventory[]>(
    []
  );
  const [openModalAddCate, setOpenModalAddCate] = useState(false);
  const fetchDataProductInventory = async (append = false) => {
    setLoading(true);

    try {
      const res = await getProductsInventory();
      const unsyncedProducts = res.data.filter(
        (item) => item.syncStatus === false
      );
      setNewIngredientList(unsyncedProducts);
    } catch {
      console.log("Lỗi! Chưa có dữ liệu!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDataProductInventory();
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDataProductInventory();
    setRefreshing(false);
  }, []);

  const handleSelect = (product: ProductInventory) => {
    setSelectedIds((prev) =>
      prev.includes(product._id)
        ? prev.filter((id) => id !== product._id)
        : [...prev, product._id]
    );

    setProductSelected((prev) =>
      prev.some((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product]
    );
  };
  const renderItem: ListRenderItem<ProductInventory> = ({ item }) => {
    const isSelected = selectedIds.includes(item._id);

    return (
      <TouchableOpacity key={item._id} onPress={() => handleSelect(item)}>
        <View
          style={[
            styles.card,
            {
              width: ITEM_WIDTH,
              marginHorizontal: ITEM_MARGIN / 2,
              position: "relative",
            },
          ]}
        >
          {selected && (
            <MaterialCommunityIcons
              style={styles.checked}
              name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
              size={22}
              color={isSelected ? ColorMain : "#888"}
            />
          )}

          <View style={{ flex: 1, alignItems: "center", width: "80%" }}>
            <Image source={{ uri: item.imageURL }} style={styles.image} />

            <Text style={styles.name}>{item.name}</Text>
            {/* <Text style={styles.detail}>Giá: {item.stock.toString()}đ</Text> */}

            <Text style={styles.detail}>Số lượng: {item.stock}</Text>
            <Text style={styles.detail}>Danh mục: {item.unit}</Text>
          </View>
        </View>
        <View style={styles.tagNew}>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
            Mới
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <LoadingScreen visible={loading} />

      <View
        style={{
          padding: 10,
          justifyContent: "flex-end",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={styles.btnSyn}
          onPress={() => setSelected(!selected)}
        >
          {!selected ? (
            <>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Chọn </Text>
              <MaterialCommunityIcons name="select" size={17} color="#fff" />
            </>
          ) : (
            <>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Hủy </Text>
              <AntDesign name="close" size={17} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={newIngredientList}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: 80,
          paddingHorizontal: 5,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginTop: 20,
        }}
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF6B00"]} // màu xoay (Android)
            tintColor="#FF6B00" // màu xoay (iOS)
            title="Đang tải dữ liệu..."
          />
        }
      />
      {selected && (
        <TouchableOpacity
          onPress={() => setOpenModalAddCate(true)}
          disabled={productSelected.length > 0 ? false : true}
          style={[
            styles.btnSyn,
            {
              position: "absolute",
              bottom: 30,
              alignSelf: "center",
              paddingHorizontal: 30,
              paddingVertical: 20,
              borderRadius: 50,
              opacity: productSelected.length > 0 ? 1 : 0.5,
            },
          ]}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            Phân loại ({productSelected.length})
          </Text>
          {/* <Entypo name="arrow-right" size={17} color="#fff" /> */}
        </TouchableOpacity>
      )}
      <ModalAddCategoryByProductStorage
        visible={openModalAddCate}
        setVisible={setOpenModalAddCate}
        loading={loading}
        setLoading={setLoading}
        listProductAdd={productSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  card: {
    backgroundColor: "#ffffffff",
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 200,

    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    position: "relative",
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
    marginTop: 10,
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
  btnSyn: {
    backgroundColor: ColorMain,
    padding: 8,
    borderRadius: 10,
    minWidth: 70,
    marginTop: 10,
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  tagNew: {
    padding: 5,
    backgroundColor: "#df1a1aff",
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    position: "absolute",
    right: 4,
    top: -7,
  },
  checked: {
    position: "absolute",
    left: 7,
    top: 7,
  },
});
export default NewIngredientList;
