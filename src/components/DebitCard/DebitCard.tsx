import React, { useState, useContext } from "react";
import { TouchableOpacity, View, Dimensions, Text } from "react-native";
import { SesionContext } from "../../contexts";
import { Icons, Logos } from "../../../assets";
import { styles } from "./DebitCardResources";
import { Props } from "./DebitCardInterfaces";
import { Image } from "expo-image";
import LogoBoxpark from "../../../assets/svg/LogoBoxpark";
import { width } from "../../utils";
import { AntDesign } from '@expo/vector-icons';

const DebitCard = ({ name, balance, displaySymbol, language }: Props) => {
  const [security, setSecurity] = useState(true);

  return (
    <View style={styles.container}>
      <LogoBoxpark
        width={160}
        height={160}
        opacity={0.3}
        style={{ position: "absolute", top:0, right: 0 }}
      />
      <View style={styles.containerItems}>
        <Text style={[styles.textTop, { fontSize: 18, textTransform:"capitalize" }]}>
          {!security ? name : "----"}
        </Text>
        <View style={{ alignItems: "flex-end", position: "relative" }}>
           <Image
            source={Logos.LogoWhiteGreen}
            style={[styles.logo, { marginRight: width * 0.07 }]}
          />
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
          <AntDesign name="CodeSandbox" size={24} color="white" />{/* {displaySymbol ? displaySymbol : "Bs."} */} {!security ? balance : "----"}
        </Text>
      </View>
    </View>
  );
};

export default DebitCard;
