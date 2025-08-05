import { ColorMain } from "@/src/presentation/components/colors";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function SignOther() {
  return (
    <View
      style={{
        width: "100%",
        marginTop: 50,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <View style={[styles.container, { left: 60 }]} />

        <Text style={styles.title}>Khác</Text>
        <View style={[styles.container, { right: 60 }]} />
      </View>
      <TouchableOpacity>
        <View style={styles.loginOther}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png",
            }}
            width={30}
            height={30}
            style={styles.imageLoginOther}
          />
          <Text style={{ color: ColorMain }}>Đăng nhập với Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    width: "20%",
    position: "absolute",
    marginTop: 7,
    borderColor: "#9d9d9d",
  },
  title: { color: "#9d9d9d" },
  loginOther: {
    borderWidth: 1,
    padding: 15,
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: 5,
    borderColor: ColorMain,
  },
  imageLoginOther: {
    position: "absolute",
    left: 15,
  },
});

export default SignOther;
