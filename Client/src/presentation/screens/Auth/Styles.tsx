import { ColorMain } from "@/src/presentation/components/colors";
import { StyleSheet } from "react-native";

export const stylesAuth = StyleSheet.create({
  containerWrapper: {
    flex: 1,
    // shadowColor: "#333",
    // shadowOffset: { width: 0, height: -5 },
    // shadowOpacity: 0.5,
    // shadowRadius: 3,
    // elevation: 100,
  },
  container: {
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 18,
    textShadowColor: ColorMain,
    color: ColorMain,
    fontWeight: "bold",
    marginTop: 10,
  },
  wrapLogin: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f3f3f3df",
    paddingHorizontal: 10,
  },
  inputWrapper: {
    position: "relative",
  },
  iconShowPass: {
    position: "absolute",
    right: 12,
    top: 10,
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    width: "100%",
  },
  btnLogin: {
    backgroundColor: ColorMain,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  textBtnLogin: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  FogotPass: {
    marginTop: 20,
    alignItems: "center",
  },
  FogotPassTitle: {
    color: ColorMain,
  },
  actionCase: { flexDirection: "row", justifyContent: "space-between" },
});
