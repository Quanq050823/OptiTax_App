import { ColorMain } from "@/src/presentation/components/colors";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function FeatureItem({ item }: any) {
  return (
    <TouchableOpacity
      key={item.key}
      style={styles.item}
      onPress={item.navigate || (() => {})}
    >
      <View
        style={{
          backgroundColor: "#b9d6e93c",
          padding: 8,
          borderRadius: 10, // nếu muốn bo tròn
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          minWidth: 50,
        }}
      >
        {item.notify ? (
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
              {item.notify}
            </Text>
          </View>
        ) : null}
        {item.icon}
      </View>
      <Text style={styles.label}>{item.label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    width: SCREEN_WIDTH / 4,
    height: 80,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  notifycation: {
    height: 13,
    width: 13,
    borderRadius: "50%",
    backgroundColor: "red",
    position: "absolute",
    zIndex: 1,
    top: -5,
    right: -5,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  paginationContainer: {
    width: 30,
    height: 4,
    backgroundColor: "#ccc", // màu xám nền
    borderRadius: 3,
    overflow: "hidden",
  },
  paginationHighlight: {
    width: 30 / 2, // chiếm 50% chiều rộng
    height: 4,
    backgroundColor: ColorMain,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
});

export default FeatureItem;
