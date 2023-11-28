import React, { useState, useContext } from "react";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import { Colors } from "../../utils";
import { Icons } from "../../../assets";
import { SesionContext } from "../../contexts";
import { Props } from "./InputInterfaces";
import { styles } from "./InputResources";
import { Image } from "expo-image";
import { Ionicons } from '@expo/vector-icons';

const Input = (props: Props) => {
  const { sesion, restartTimerSesion } = useContext(SesionContext);
  const [security, setSecurity] = useState(true);
  const stylesComp = props?.styleIcons
    ? [styles.icon, props.styleIcons]
    : [styles.icon];
  return (
    <View style={[styles.container, props?.styleContainer]}>
      <TextInput
        style={[
          styles.input,
          styles?.center,
          {
            paddingRight:
              props?.secureTextEntry || props?.displaySymbol ? 46 : 8,
            height: props?.multiline ? 80 : 40,
            textAlignVertical: props?.multiline ? "top" : "center",
          },
          props?.styleInput,
        ]}
        {...props}
        onChangeText={(e: string) => {
          sesion && restartTimerSesion();
          props?.onChangeText && props?.onChangeText(e);
        }}
        placeholder={props?.placeholder || "Example"}
        placeholderTextColor={props?.placeholderColor || "rgba(0,0,0,.4)"}
        secureTextEntry={props?.secureTextEntry && security}
      />
      {props?.secureTextEntry && (
        <TouchableOpacity
          style={styles.containerIcon}
          onPress={() => setSecurity(!security)}
        >
          {/* <Image
            source={security ? Icons.EyeClose : Icons.EyeOpen}
            style={stylesComp}
            contentFit="cover"
          /> */}
          {
            security ?<Ionicons name="eye-off" size={24} color="gray" /> : <Ionicons name="eye" size={24} color="gray" />
          }
        </TouchableOpacity>
      )}
      {props?.displaySymbol && (
        <View
          style={[
            styles.containerIcon,
            styles.center,
            styles.icon,
            { alignItems: "flex-end" },
          ]}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Dosis",
              color: Colors.black,
            }}
          >
            {props?.displaySymbol}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Input;
