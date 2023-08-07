import { StyleSheet } from "react-native";
import { Colors } from "../../utils";

export const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 85,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.blackBackground,
    borderRadius: 30,
    shadowColor: Colors.blackBackground,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  icon: {
    tintColor: Colors.white,
    width: 50,
    height: 50,
  },
  text: {
    color: Colors.black,
    fontSize: 13,
    fontFamily: "DosisSemiBold",
    marginVertical: 10,
  },
});
