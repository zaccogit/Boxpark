import React, { ReactNode } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Fonts } from "../../assets";
import { Colors } from "../utils";

const width: number = Dimensions.get("window").width;

interface Props {
  image: ReactNode;
  text: string;
}

const SlideItem = ({ image, text }: Props) => {
  return (
    <View style={[styles.view]}>
      {image}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: "center",
    alignItems: "center",
    width,
    overflow: "hidden",
    flexGrow:1
  },
  image: {
    width: "100%",
  },
  text: {
    fontFamily: "Dosis",
    fontSize: 32,
    color: Colors.black,
    textAlign: "center",
    marginTop: 20,
  },
});

export default SlideItem;
