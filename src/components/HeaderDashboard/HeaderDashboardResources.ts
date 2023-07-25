import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../utils";

const width: number = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    fontFamily: "DosisSemiBold",
    fontSize: 16,
    width: width * 0.6,
  },
  containerRow: {
    flexDirection: "row",
  },
  containerWidth: {
    width: "100%",
  },

  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  icon: {
    width: 25,
    height: 25,
  },
});
