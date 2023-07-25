import { StyleSheet } from "react-native";
import { Colors } from "../../utils";

export const styles = StyleSheet.create({
  containerText: {
    height: 40,
    backgroundColor: Colors.white,
    borderColor: Colors.graySemiDark,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: "solid",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 18,
  },
  containerRow: {
    flexDirection: "row",
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "rgba(0,0,0,.5)",
  },
  containerIcon: {
    position: "absolute",
    right: 8,
    top: 5,
  },
  input: {
    width: "100%",
    height: 40,
    color: Colors.black,
    fontSize: 16,
    fontFamily: "Dosis",
    paddingLeft: 8,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
