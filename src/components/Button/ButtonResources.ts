import { StyleSheet } from "react-native";
import { Colors } from "../../utils";
export const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.blackBackground,
    borderRadius: 12,
    shadowColor: Colors.blackBackground,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginBottom: 10,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: Colors.blackBackground,
  },
  buttonCancel: {
    backgroundColor: Colors.white,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray,
    shadowColor: Colors.transparent,
    borderColor: Colors.transparent,
  },
  icon: {
    tintColor: Colors.white,
    marginRight: 8,
    width: 30,
    height: 30,
  },
  text: {
    fontSize: 15,
    color: Colors.white,
    fontFamily: "Dosis",
  },
  textCancel: {
    color: Colors.black,
  },
});
