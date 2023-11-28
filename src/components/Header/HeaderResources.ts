import { StyleSheet, Platform, Dimensions } from "react-native";
import { Colors } from "../../utils";
import { Fonts } from "../../../assets";

const width: number = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  header: {
    width,
    height: Platform.OS === "ios" ? 110 : 60,
    backgroundColor: Colors.white,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: Platform.OS === "ios" ? 50 : 0,
    paddingHorizontal: 10,
    borderBottomColor: "#f2f2f2",
    borderStyle: "solid",
    borderBottomWidth: 2,
  },
  containerButton: {
    width: 25,
    height: 25,
  },
  button: {
    width: 25,
    height: 25,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    tintColor: "rgba(66, 66, 66, .5)",
    width: 25,
    height: 25,
  },
  title: {
    fontSize: 20,
    color: Colors.blackBackground,
    fontFamily: "DosisMedium",
  },
});
