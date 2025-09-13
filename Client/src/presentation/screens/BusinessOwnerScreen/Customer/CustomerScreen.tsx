import { ColorMain } from "@/src/presentation/components/colors";
import { getCustomerList } from "@/src/services/API/customerService";
import { Customer, CustomerListResponse } from "@/src/types/customer";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar, shadow } from "react-native-paper";
import { ListRenderItemInfo } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useAppNavigation } from "@/src/presentation/Hooks/useAppNavigation";

function CustomerManagerScreen() {
  const navigate = useAppNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [listCustomer, setListCustomer] = useState<Customer[]>([]);
  const [filteredCustomer, setFilteredCustomer] = useState<Customer[]>([]);
  console.log(searchQuery);

  useEffect(() => {
    const getListCustomer = async () => {
      try {
        const res: CustomerListResponse = await getCustomerList();
        console.log("API res:", res);

        setListCustomer(res);
        setFilteredCustomer(res);
      } catch (error) {
        console.log(error);
      }
    };
    getListCustomer();
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (text.trim() === "") {
      setFilteredCustomer(listCustomer); // reset khi clear
      return;
    }

    const lowerText = text.toLowerCase();
    const filtered = listCustomer.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerText) ||
        item.code.toLowerCase().includes(lowerText) ||
        item.phoneNumber.toLowerCase().includes(lowerText)
    );

    setFilteredCustomer(filtered);
  };

  console.log("helllo các bạn yêu của Khang và sau đây khang sẽ thử thách");

  const renderCustomerItem = ({ item }: ListRenderItemInfo<Customer>) => (
    <View style={styles.container}>
      <View
        style={{
          height: "100%",
          paddingVertical: 10,
        }}
      >
        <Image
          source={{
            uri: "https://static.vecteezy.com/system/resources/thumbnails/014/396/452/small_2x/comic-style-user-icon-with-transparent-background-file-png.png",
            width: 70,
            height: 70,
          }}
          style={{ backgroundColor: ColorMain, borderRadius: 50 }}
        />
      </View>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          flex: 1,
        }}
      >
        <View>
          <Text style={styles.nameCustomer}>{item.name}</Text>
        </View>
        <View>
          <Text style={styles.text}>{item.phoneNumber}</Text>
          <Text style={styles.text}>
            {item.address
              ? `${item.address.street}, ${item.address.ward}, ${item.address.district}, ${item.address.city}`
              : "Chưa có địa chỉ"}
          </Text>
        </View>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.nicknameWrapper}>
            <View style={styles.nickname}>
              <Text style={{ color: "#fff" }}>{item.tags[1]}</Text>
            </View>
            <View style={[styles.nickname, { backgroundColor: "#ff6347ff" }]}>
              <Text style={{ color: "#fff" }}>{item.tags[0]}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
  return (
    <View style={{ flex: 1, paddingVertical: 20, paddingHorizontal: 10 }}>
      <View style={styles.wrHead}>
        <Searchbar
          placeholder="Tìm kiếm khách hàng"
          onChangeText={handleSearch}
          value={searchQuery}
          icon="magnify"
          style={styles.search}
          iconColor={ColorMain}
          placeholderTextColor={ColorMain}
        />
        <TouchableOpacity
          style={styles.btnAddCustomer}
          onPress={() => navigate.navigate("CreateCustomerScreen")}
        >
          <FontAwesome5 name="user-plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredCustomer}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderCustomerItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: ColorMain,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 3 },
    marginTop: 20,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    flex: 1,
  },
  wrHead: {
    flexDirection: "row",
    gap: 10,
  },
  search: {
    backgroundColor: "#fff",
    flex: 5,
    shadowColor: ColorMain,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 1 },
  },
  btnAddCustomer: {
    flex: 1,
    backgroundColor: ColorMain,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    shadowColor: ColorMain,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 1 },
  },
  nameCustomer: { fontSize: 15, fontWeight: "700" },
  text: {
    color: "#6c6c6cff",
    marginTop: 5,
  },
  nickname: {
    padding: 5,
    backgroundColor: ColorMain,
    maxWidth: 180,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  nicknameWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default CustomerManagerScreen;
