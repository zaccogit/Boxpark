import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../utils";

const width: number = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 15,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  containerRow: {
    flexDirection: "row",
  },
  containerCenter: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginBottom: 10,
  },
  containerTransactions: {
    width: width * 0.9,
    paddingVertical: 10,
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  transaction: {
    justifyContent: "space-between",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    padding: 10,
    borderColor: "rgba(66, 66, 66, .5)",
    borderStyle: "solid",
  },
});
