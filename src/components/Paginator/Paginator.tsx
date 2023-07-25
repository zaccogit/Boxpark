import React from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { Colors } from "../../utils";

interface Props {
  items?: any[];
  currentIndex: number;
}

const Paginator = ({ items, currentIndex }: Props) => {
  return (
    <View style={styles.view}>
      {items?.map((item: any, index: number) => (
        <Animated.View
          style={[styles.dot, { opacity: currentIndex === index ? 1 : 0.3 }]}
          key={index.toString()}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: Colors.black,
  },
});

export default Paginator;
