import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../utils";
import { Fonts } from "../../../assets";

const width: number = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    width: width * 0.8,
    height: width * 0.5,
    position: "relative",
    marginBottom: 10,
    backgroundColor: Colors.blackBackground,
    borderRadius: 16,
    overflow: "hidden",
  },
  circle: {
    width: width * 0.5,
    height: width * 0.5,
    position: "absolute",
    backgroundColor: "rgba(249, 249, 251, .2)",
    borderRadius: width,
    zIndex: 10,
    top: "-25%",
    left: "50%",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: Colors.transparent,
    borderStyle: "solid",
    borderTopWidth: 0,
    borderRightWidth: width * 0.4,
    borderBottomWidth: width * 0.8,
    borderLeftWidth: width * 0.4,
    borderTopColor: Colors.transparent,
    borderRightColor: Colors.transparent,
    borderBottomColor: "rgba(249, 249, 251, .2)",
    borderLeftColor: Colors.transparent,
    position: "absolute",
    zIndex: 10,
    top: "40%",
    left: "30%",
  },
  square: {
    width: width * 0.3,
    height: width * 0.3,
    position: "absolute",
    backgroundColor: "rgba(249, 249, 251, .2)",
    zIndex: 10,
    top: "-35%",
    left: "35%",
  },
  containerItems: {
    width: "100%",
    height: "100%",
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 5,
    justifyContent: "space-between",
  },
  textTop: {
    fontFamily: "Dosis",
    color: Colors.white,
  },
  containerIcon: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    left: 0,
    bottom: 0,
  },
  icon: {
    height: 30,
    width: 30,
    tintColor: Colors.white,
  },
  logo: {
    height: width * 0.25,
    width: width * 0.5,
  },
});
