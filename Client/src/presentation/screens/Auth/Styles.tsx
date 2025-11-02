import { ColorMain, textColorMain } from "@/src/presentation/components/colors";
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
    backgroundColor: "#fffffff8",
    paddingHorizontal: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 70,
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
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#9d9d9d",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
    width: "100%",
    color: "#000",
  },
  btnLogin: {
    backgroundColor: ColorMain,
    height: 50,
    borderRadius: 50,
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
    color: textColorMain,
    fontSize: 16,
    fontWeight: "600",
  },
  actionCase: {},
});
