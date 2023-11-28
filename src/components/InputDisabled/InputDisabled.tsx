import React from "react";
import { Text, View, Dimensions, TextStyle } from "react-native";
import { Fonts } from "../../../assets";
import { styles } from "./InputDisabledResources";

const width: number = Dimensions.get("window").width;

interface Props {
  value?: string | null;
  textStyle?: TextStyle | TextStyle[];
  displaySymbol?: string;
}

const InputDisabled = ({ value, textStyle, displaySymbol }: Props) => {
  return (
    <View style={[styles.containerText, styles.containerRow]}>
      <Text style={[styles.text, { fontSize: 16 }, textStyle]}>{value}</Text>
      {displaySymbol && (
        <View
          style={[
            styles.containerIcon,
            styles.center,
            styles.icon,
            { alignItems: "flex-end" },
          ]}
        >
          <Text style={{ fontSize: 18, fontFamily: "Dosis" }}>
            {displaySymbol}
          </Text>
        </View>
      )}
    </View>
  );
};

export default InputDisabled;
