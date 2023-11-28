import React, { useContext } from "react";
import { TouchableOpacity, Text } from "react-native";
import { Icons } from "../../../assets";
import { styles } from "./ButtonResources";
import { Props } from "./ButtonInterfaces";
import { Image } from "expo-image";
import { useSesion } from "../../contexts/sesion/SesionState";

const Button = (props: Props) => {
  const { sesion, restartTimerSesion } = useSesion();
  const stylesComp = props?.styleIcon
    ? [
        props?.white ? styles.textCancel : {},
        { ...styles.icon, ...props?.styleIcon },
      ]
    : [
        props?.white
          ? { ...styles.icon, ...styles.textCancel }
          : { ...styles.icon },
      ];
  return (
    <TouchableOpacity
      style={[
        styles.button,
        props?.white ? styles.buttonCancel : {},
        !props?.white && props?.disabled ? styles.buttonDisabled : {},
        props?.styleButton,
      ]}
      className={props.className}
      {...props}
      onPress={() => {
        sesion && restartTimerSesion();
        props?.onPress && props?.onPress();
      }}
    >
      {props?.showIcon ? (
        <Image
          source={props?.icon ? props?.icon : Icons.TouchID}
          style={stylesComp}
        />
      ) : null}
      <Text
        style={[
          styles.text,
          props?.white ? styles.textCancel : {},
          props?.styleText,
        ]}
      >
        {props?.text || "Continuar"}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
