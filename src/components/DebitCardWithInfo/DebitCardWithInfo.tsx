import React, { useState, useContext } from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { SesionContext } from '../../contexts';
import { Fonts, Icons, Logos, SVG, Images } from '../../../assets';
import { styles } from "./DebitCardWithInfoResources"
import { Card, Props } from "./DebitCardWithInfoInterfaces"
import { Colors } from '../../utils';


const DebitCardWithInfo = ({ card, secure, action, security }: Props) => {
  const { sesion, restartTimerSesion } = useContext(SesionContext);
  const Container = (Children: JSX.Element): JSX.Element => {
    return (
      <>
        {
          secure ?
            <TouchableOpacity
              style={[
                styles.container,
                /* {
                  backgroundColor: card?.card_type === "CREDIT" ? Colors.gold : Colors.blackBackground
                } */
              ]}
              onPress={() => {
                action && action()
                sesion && restartTimerSesion();
              }}>
              <View style={[styles.card]}>
                {Children}
              </View>
            </TouchableOpacity>
            :
            <View style={styles.container}>
              <View style={[styles.card]}>
                {Children}
              </View>
            </View>
        }
      </>
    )

  }

  return (
    <>
      {Container(
        <>
          {/* <View style={styles.circle} />
          <View style={styles.triangle} />
          <View style={styles.square} /> */}
          <Image source={Images.cardMiBanco} style={{ position: "absolute", width: "100%", height: "100%" }} resizeMode='stretch' />
          {
            secure &&
            <View style={[styles.containerItems, styles.containerIcon]}>
              <View style={[styles.containerItems, styles.containerCenter]}>
                <SVG.Padlock color={Colors.white} />
              </View>
            </View>
          }
          <View style={[styles.containerItems, { justifyContent: "flex-end" }]}>
            {/* <View style={styles.containerMod}>
              <Text style={[styles.textTop, { fontSize: 18, marginRight: 30 }]}>
                boxpark Débito
              </Text> {
                !secure &&
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => {
                    setSecurity && setSecurity(!security);
                    if (sesion) restartTimerSesion();
                  }}>
                  <Image source={security ? Icons.EyeClose : Icons.EyeOpen} style={styles.icon} />
                </TouchableOpacity>
              }</View> */}
            <View>
              {/*<View style={{ alignItems: "flex-end" }}>
                 <Image source={Logos.LogoWhiteGreen} style={styles.logo} /> 
              </View>*/}
              <View style={[styles.containerMod, { alignItems: "flex-end" }]}>
                <View>
                  <Text style={[styles.textTop, { fontSize: 14, fontFamily: "DosisBold" }]}>
                    {security ? card?.holder_name : '****'}
                  </Text>
                  <Text style={[styles.textTop, { fontSize: 14, fontFamily: "DosisBold" }]}>
                    {security ? card?.card_number : '**** **** **** ****'}
                  </Text>
                  <Text style={[styles.textTop, { fontSize: 14, fontFamily: "DosisBold" }]}>
                    {security ? `${card?.expiration_month && card?.expiration_month < 10 && "0"}${card?.expiration_month}/${card?.expiration_year}` : '**/**'}
                  </Text>
                </View>
                {/* {
                  card?.card_type === "DEBIT" && <SVG.Maestro width={50} height={40} color={Colors.white} bgColor={Colors.blackBackground} />
                }
                {
                  card?.card_type === "CREDIT" && card?.card_number?.substring(0, 1) === "4" && <SVG.Visa width={50} height={40} color={Colors.white} bgColor={Colors.blackBackground} />
                }
                {
                  card?.card_type === "CREDIT" && card?.card_number?.substring(0, 1) === "5" && <SVG.Mastercard width={50} height={40} color={Colors.white} bgColor={Colors.blackBackground} />
                } */}
              </View>

            </View>
          </View>
        </>
      )}
    </>
  );
};

export default DebitCardWithInfo;
