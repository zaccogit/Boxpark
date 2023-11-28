import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { SesionContext } from "../../contexts";
import { StackScreenProps } from "@react-navigation/stack";
import { styles, elements } from "./NavbarResources";
import { Elements } from "./NavbarInterfaces";
import { Image } from "expo-image";

interface Props extends StackScreenProps<any, any> {}

const Navbar = ({ navigation: { push }, route: { name } }: Props) => {
  const { sesion, restartTimerSesion } = useContext(SesionContext);
  if (!sesion) return null;
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        {elements.map((item: Elements, index: number) => (
          <TouchableOpacity
            key={index}
            style={styles.icon}
            disabled={name === item?.route}
            onPress={() => {
              name !== item?.route && push(item?.route);
              sesion && restartTimerSesion();
            }}
          >
            <Image
              source={item?.icon}
              style={[
                styles.icon,
                name === item?.route ? styles.iconSelected : {},
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Navbar;
