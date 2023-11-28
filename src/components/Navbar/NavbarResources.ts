import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "../../utils";
import { Icons } from "../../../assets";
import { Elements } from "./NavbarInterfaces";

const width: number = Dimensions.get("window").width;

export const styles = StyleSheet.create({
  container: {
    width,
    height: Platform.OS === "ios" ? 80 : 65,
    justifyContent: "flex-start",
    backgroundColor: Colors.white,
  },
  navbar: {
    width,
    height: 60,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  icon: {
    tintColor: "rgba(66, 66, 66, .5)",
    width: 30,
    height: 30,
  },
  iconSelected: {
    tintColor: Colors.blackBackground,
  },
});

export const elements: Elements[] = [
  {
    icon: Icons.Home,
    route: "Dashboard",
  },
  {
    icon: Icons.ArrowHorizontal,
    route: "Transaction",
  },
  {
    icon: Icons.Gear,
    route: "Options",
  },
];
