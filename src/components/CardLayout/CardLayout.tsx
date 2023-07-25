import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { Colors } from "../../utils";
import { Icons, Images } from "../../../assets";
import { SesionContext } from "../../contexts";
import { Props } from "./CardLayoutInterfaces";
import { styles } from "./CardLayoutResources";
import { Image } from "expo-image";

const CardLayout = (props: Props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        props?.onPress && props?.onPress();
      }}
    >
      <View
        style={[
          styles.containerPhoto,
          {
            backgroundColor: props?.ImageCircle
              ? Colors.blackBackground
              : Colors.white,
            borderRadius: props?.ImageCircle ? 25 : 0,
          },
        ]}
      >
        {!props.photo && !props.svgComponent && (
          <Image
            source={props?.photo ? props?.photo : Images.Profile}
            style={{
              width: props?.ImageCircle ? 40 : 50,
              height: props?.ImageCircle ? 40 : 50,
            }}
          />
        )}
        {props.photo && (
          <Image
            source={props?.photo ? props?.photo : Images.Profile}
            style={{
              width: props?.ImageCircle ? 40 : 50,
              height: props?.ImageCircle ? 40 : 50,
            }}
          />
        )}
        {props.svgComponent && props.svgComponent}
      </View>
      <View style={styles.bar} />
      <View style={{ width: "100%" }}>
        {props?.children ? props?.children : null}
      </View>
      <View style={styles.containerIcon}>
        <Image source={Icons?.ArrowRight} style={styles.icon} />
      </View>
    </TouchableOpacity>
  );
};

export default CardLayout;
