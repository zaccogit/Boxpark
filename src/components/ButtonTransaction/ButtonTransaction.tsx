import React, { useContext } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Icons } from "../../../assets";
import { SesionContext } from "../../contexts";
import { styles } from "./ButtonTransactionResource";
import { Props } from "./ButtonTransactionInterfaces";
import { Image } from "expo-image";

const ButtonTransaction = (props: Props) => {
  const { sesion, restartTimerSesion } = useContext(SesionContext);
  const stylesComp = props?.styleIcon
    ? [styles.icon, props.styleIcon]
    : [styles.icon];
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, props?.styleButton]}
        onPress={() => {
          sesion && restartTimerSesion();
          props?.onPress && props?.onPress();
        }}
        {...props}
      >
        <Image source={props?.icon} style={stylesComp} />
      </TouchableOpacity>
      {props?.name ? <Text style={styles.text}>{props?.name}</Text> : null}
    </View>
  );
};

export default ButtonTransaction;
