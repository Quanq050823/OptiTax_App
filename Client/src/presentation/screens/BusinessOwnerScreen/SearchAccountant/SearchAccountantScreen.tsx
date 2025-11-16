// import Province from "@/src/presentation/components/Auth/Province/Province";
import Province from "@/src/presentation/components/Auth/Province/Province";
import { ColorMain } from "@/src/presentation/components/colors";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// export default function SearchAccountantScreen() {
//   const [location, setLocation] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [accountants, setAccountants] = useState<any[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const scaleAnim = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(scaleAnim, {
//           toValue: 1,
//           duration: 2000,
//           easing: Easing.out(Easing.ease),
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleAnim, {
//           toValue: 0,
//           duration: 0,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   }, []);
//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") return;

//       const loc = await Location.getCurrentPositionAsync({});
//       setLocation(loc.coords);
//       // Giả lập danh sách kế toán viên gần đó
//       setTimeout(() => {
//         setAccountants([
//           {
//             id: 1,
//             name: "Ho Phat Dat",
//             image:
//               "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/506627763_3603472316463410_8335155321588823965_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=MXj3wLx4YLwQ7kNvwG1IwXj&_nc_oc=Adk_bkcyIVxczQwWnQ22hOP0x_DmRLkLp4GO4yaeGpAbAlAcQrrREqg-Zs_ovaTJCMQ9i-eKIZpno99eP3O9Y8fU&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=FeojimbUwhQA3mi-u5UdFA&oh=00_AfS-Pg69EE4kgX3CX7LeAtRkDq3Q09FNu9UJrZdwe6ZuKQ&oe=689261F6",
//             latitude: loc.coords.latitude + 0.001,
//             longitude: loc.coords.longitude + 0.001,
//           },
//           {
//             id: 2,
//             name: "Ha Opitech",
//             image:
//               "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/503585771_3588140817996560_175827190279647334_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=hz-WPzY7t34Q7kNvwH2hkD6&_nc_oc=Adn0F6Q80zaDPMp2BRuHw_i9XI1uVaEYCt9LBEsiitDCGpE5I6IUip6hqHDNeAtfQM2IhbISsSTqhmfjf9yba0Q_&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=WEQ9FMl2iN-54jY9aq6MLQ&oh=00_AfTjO8IhJUl4O72ewrlEuRHIuDgsWfFHKMYrVwNxj-8uKA&oe=68924135",
//             latitude: loc.coords.latitude - 0.001,
//             longitude: loc.coords.longitude - 0.001,
//           },
//           {
//             id: 3,
//             name: "Ha Opitech 2",
//             image:
//               "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/503585771_3588140817996560_175827190279647334_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=hz-WPzY7t34Q7kNvwH2hkD6&_nc_oc=Adn0F6Q80zaDPMp2BRuHw_i9XI1uVaEYCt9LBEsiitDCGpE5I6IUip6hqHDNeAtfQM2IhbISsSTqhmfjf9yba0Q_&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=WEQ9FMl2iN-54jY9aq6MLQ&oh=00_AfTjO8IhJUl4O72ewrlEuRHIuDgsWfFHKMYrVwNxj-8uKA&oe=68924135",
//             latitude: loc.coords.latitude - 0.002,
//             longitude: loc.coords.longitude - 0.002,
//           },
//         ]);
//         setLoading(false);
//         setShowModal(true);
//       }, 3000); // Loading 3s giả lập
//     })();
//   }, []);

//   if (!location) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#4CAF50" />
//         <Text>Đang xác định vị trí…</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, position: "relative" }}>
//       <MapView
//         style={{ flex: 1 }}
//         provider={PROVIDER_GOOGLE}
//         initialRegion={{
//           latitude: location.latitude,
//           longitude: location.longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//         showsUserLocation
//       >
//         {accountants.map((acc) => (
//           <Marker
//             key={acc.id}
//             coordinate={{
//               latitude: acc.latitude,
//               longitude: acc.longitude,
//             }}
//             title={acc.name}
//             description="Đang hoạt động gần đây"
//           />
//         ))}
//       </MapView>
//       {location && (
//         <Animated.View
//           style={[
//             styles.pulseCircle,
//             {
//               transform: [{ scale: scaleAnim }],
//               top: "40%",
//               left: "30%",
//               marginLeft: -65, // nửa width
//               marginTop: -85, // nửa height
//             },
//           ]}
//         />
//       )}

//       {loading && (
//         <View style={styles.overlay}>
//           <ActivityIndicator size="large" color="#00BCD4" />
//           <Text style={{ color: "#333", marginTop: 8 }}>
//             Đang tìm kiếm kế toán viên gần bạn…
//           </Text>
//         </View>
//       )}

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showModal}
//         onRequestClose={() => setShowModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Danh sách kế toán viên</Text>
//             {accountants.map((acc) => (
//               <View key={acc.id} style={styles.accountantItem}>
//                 <Image
//                   source={{ uri: acc.image || null }}
//                   style={{ width: 80, height: 80, borderRadius: 8 }}
//                 />
//                 <View>
//                   <Text style={{ fontWeight: 800 }}>{acc.name}</Text>
//                   <Text>
//                     Vị trí: ({acc.latitude.toFixed(4)},
//                     {acc.longitude.toFixed(4)})
//                   </Text>
//                   <View style={{ flexDirection: "row", marginTop: 10 }}>
//                     <AntDesign name="star" size={15} color="#f2ea00ff" />
//                     <AntDesign name="star" size={15} color="#f2ea00ff" />
//                     <AntDesign name="star" size={15} color="#f2ea00ff" />
//                     <AntDesign name="star" size={15} color="#f2ea00ff" />
//                     <AntDesign name="star" size={15} color="#f2ea00ff" />
//                   </View>
//                 </View>
//                 <View style={{ justifyContent: "center" }}>
//                   <AntDesign name="arrowright" size={24} color="black" />
//                 </View>
//               </View>
//             ))}

//             <TouchableOpacity
//               onPress={() => setShowModal(false)}
//               style={styles.closeButton}
//             >
//               <Text style={{ color: "#fff" }}>Đóng</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   overlay: {
//     position: "absolute",
//     top: 20,
//     alignSelf: "center",
//     backgroundColor: "#fff",
//     padding: 12,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     elevation: 3,
//     alignItems: "center",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     width: "100%",
//     backgroundColor: "#e5e5e5ff",
//     paddingVertical: 20,
//     borderRadius: 12,
//     alignItems: "center",
//     bottom: 0,
//     position: "absolute",
//     height: "80%",
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 12,
//   },
//   accountantItem: {
//     paddingVertical: 20,
//     marginBottom: 20,
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     width: "90%",
//     borderRadius: 8,
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   closeButton: {
//     marginTop: 16,
//     backgroundColor: "#2196F3",
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   pulseCircle: {
//     position: "absolute",
//     width: 300,
//     height: 300,
//     borderRadius: "50%",
//     backgroundColor: "rgba(0, 188, 212, 0.3)",
//   },
// });
const mockAccountants = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    address: "123 Trần Hưng Đạo, Quận 1, Thành phố Hồ Chí Minh",
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    address: "45 Hai Bà Trưng, Quận Hải Châu, Thành phố Đà Nẵng",
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0987654321",
    address: "10 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0939999999",
    address: "99 Lý Thường Kiệt, Hà Nội",
  },
];

function SearchAccountantScreen() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [filteredList, setFilteredList] = useState(mockAccountants);
  const [provinceList, setProvinceList] = useState<
    { label: string; value: string }[]
  >([]);
  console.log("Selected Province:", selectedProvince);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Text style={{ fontWeight: "500" }}>Lựa chọn địa điểm </Text>
        <View>
          <Province
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            setProvinceList={setProvinceList}
            provinceList={provinceList}
          />
        </View>
        <View style={{ marginTop: 20, width: "100%", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              const provinceName = provinceList.find(
                (item) => item.value === selectedProvince
              )?.label;
              const normalize = (str: string) =>
                str
                  .toLowerCase()
                  .replace(/(tp\.?|tỉnh|thành phố)/g, "")
                  .trim();
              const filtered = mockAccountants.filter((acc) =>
                normalize(acc.address).includes(normalize(provinceName || ""))
              );
              setFilteredList(filtered);
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Tìm kiếm</Text>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 20,
              borderBottomWidth: 1,
              borderColor: "#d1d1d1ff",
              width: "80%",
            }}
          ></View>

          <FlatList
            data={filteredList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  padding: 12,
                  margin: 8,
                  borderRadius: 8,
                  backgroundColor: "#f1f1f1",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                <Text>SĐT: {item.phone}</Text>
                <Text>Địa chỉ: {item.address}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  searchWrapper: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    flex: 1,
  },
  searchBtn: {
    width: 100,
    height: 40,
    backgroundColor: ColorMain,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
});
export default SearchAccountantScreen;
