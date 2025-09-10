import { ColorMain } from "@/src/presentation/components/colors";
import { StyleSheet, Text, View } from "react-native";

type TagItem = {
  content: string;
};
function TagItem({ content }: TagItem) {
  return (
    <>
      <View
        style={{
          backgroundColor: ColorMain, // xanh lá hoặc đổi thành xanh bạn muốn
          paddingVertical: 4,
          paddingHorizontal: 10,
          borderRadius: 6,
          alignSelf: "flex-start",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3, // Android

          position: "absolute",
          top: 0,
          right: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>
          {content}
        </Text>
      </View>
      <View style={styles.backTag}></View>
    </>
  );
}

const styles = StyleSheet.create({
  backTag: {
    position: "absolute",
    top: 0.2,
    right: 20,
    height: 20,
    backgroundColor: ColorMain,
    zIndex: -1, // nằm dưới toàn bộ nội dung trong cha
    width: 90,
    borderTopLeftRadius: 12,
  },
});
export default TagItem;
