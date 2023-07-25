import { StyleSheet } from "react-native";
import { Colors } from "../../utils";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: Colors.gray,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: "solid",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    height: 50,
    marginTop:5,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: "rgba(0,0,0,.5)",
  },
  containerIcon: {
    position: "absolute",
    right: 8,
    top: 10,
  },
  input: {
    width: "100%",
    height: 50,
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
