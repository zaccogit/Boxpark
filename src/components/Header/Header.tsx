import React, { useContext } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { SesionContext } from "../../contexts";
import { Icons } from "../../../assets";
import SesionContainer from "../SesionContainer/SesionContainer";
import { styles } from "./HeaderResources";
import { Props } from "./HeaderInterfaces";
import { Image } from "expo-image";

const Header = ({
  showBackButtom,
  showPlusButtom,
  navigation: { goBack, push },
  title,
  action,
}: Props) => {
  return (
    <View style={styles.header}>
      <View style={styles.containerButton}>
        {showBackButtom ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              goBack();
            }}
          >
            <Image source={Icons.ArrowLeft} style={styles.icon} />
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.containerButton}>
        {showPlusButtom ? (
          <TouchableOpacity style={styles.button} onPress={action}>
            <Image source={Icons.Plus} style={styles.icon} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default Header;
