import React, { useState, useContext } from "react";
import { TouchableOpacity, View, Dimensions, Text } from "react-native";
import { SesionContext } from "../../contexts";
import { Icons, Logos } from "../../../assets";
import { styles } from "./DebitCardResources";
import { Props } from "./DebitCardInterfaces";
import { Image } from "expo-image";

const DebitCard = ({ name, balance, displaySymbol, language }: Props) => {
  const [security, setSecurity] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.circle} />
      <View style={styles.triangle} />
      <View style={styles.square} />
      <View style={styles.containerItems}>
        <Text style={[styles.textTop, { fontSize: 18 }]}>
          {!security ? name : "----"}
        </Text>
        <View style={{ alignItems: "flex-end", position: "relative" }}>
          <Image source={Logos.LogoWhiteGreen} style={styles.logo} />
          <View style={styles.containerIcon}>
            <Text style={[styles.textTop, { fontSize: 14, marginRight: 30 }]}>
              {language ? (language === "EN" ? "Balance" : "Saldo") : "Saldo"}
            </Text>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                setSecurity(!security);
              }}
            >
              <Image
                source={security ? Icons.EyeClose : Icons.EyeOpen}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Text
          style={[styles.textTop, { fontSize: 28, fontFamily: "DosisLight" }]}
        >
          {displaySymbol ? displaySymbol : "Bs."} {!security ? balance : "----"}
        </Text>
      </View>
    </View>
  );
};

export default DebitCard;
