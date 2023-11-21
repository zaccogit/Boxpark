import { View, Text, StyleSheet, Dimensions, Share, Image } from 'react-native';
import React, { useContext } from 'react';
import { Button, Header, ScreenContainer } from '../../components';
import { StackScreenProps } from '@react-navigation/stack';
import { Fonts, Logos } from '../../../assets';
import { Colors } from '../../utils';
import { SesionContext } from '../../contexts';

interface Props extends StackScreenProps<any, any> { }
const width: number = Dimensions.get('window').width;

export default function ReferedScreen({ navigation, route }: Props) {
  const { sesion } = useContext(SesionContext);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Hola desde BoxParkApp! \n\n
        ${sesion?.firstName?.split(' ')[0]} ${sesion?.lastName?.split(' ')[0]}
        te ha invitado a utilizar BoxParkApp, con nuestra app podrás pagar en comercios  con codigo qr\n\n
        Instala nuestra aplicación, crea tu cuenta y ambos recibirán un bono de $5 para ser utilizados en cualquiera de nuestras tiendas.\n\n
        Descarga la app.\n\n
        Ingresa el codigo siguiente codigo al registrarte\n\n                     
        *${sesion?.code}*\n\n
        \n\n
        Copyright © 2023 BoxParkApp`,
      });
    } catch (err) { }
  };
  return (
    <>
      <Header title="Premios y Referidos" showBackButtom navigation={navigation} route={route} />
      <ScreenContainer>
        <View style={styles.container}>
          <View style={styles.containerCar}>
            <View style={styles.circle} />
            <View style={styles.triangle} />
            <View style={styles.square} />
            <View style={styles.containerItems}>
              <Image source={Logos.LogoWhiteGreen} style={styles.logo} />
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: Colors.gray,
              borderRadius: 8,
              width: width * 0.5,
              paddingVertical: 10,
            }}>
            <Text style={styles.text}>Tu código de referidos</Text>
            <Text style={[styles.text, { fontSize: 22, color: Colors.danger }]}>{sesion?.code}</Text>
          </View>
          <Text style={[styles.text2, { width: width * 0.7 }]}>
            Comparte tu código de referidos con amigos y gana dinero para usar con tus tarjetas de regalo
          </Text>
          {/*  <View style={{alignItems:"center",}}>
          <Text style={styles.text}>Personas Referidas</Text>
          <View>
            <Text style={[styles.text,{backgroundColor:Colors.gray, paddingVertical:5,paddingHorizontal:10, borderRadius:16}]}> 1</Text>
          </View>
        </View> */}
          <View style={{ width: width * 0.7, justifyContent: 'center' }}>
            <Button
              styleButton={{ borderRadius: 24 }}
              styleText={{ fontSize: 16 }}
              text="Compartir código de referidos"
              onPress={() => onShare()}
            />
          </View>
        </View>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  text: {
    fontFamily:"DosisBold",
    color: Colors.blackBackground,
    fontSize: 18,
  },
  text2: {
    fontFamily:"DosisMedium",
    color: Colors.blackBackground,
    fontSize: 16,
    textAlign: 'center',
  },
  containerCar: {
    width: width * 0.8,
    height: width * 0.5,
    position: 'relative',
    marginBottom: 10,
    backgroundColor: Colors.blackBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  circle: {
    width: width * 0.5,
    height: width * 0.5,
    position: 'absolute',
    backgroundColor: 'rgba(249, 249, 251, .2)',
    borderRadius: width,
    zIndex: 10,
    top: '-25%',
    left: '50%',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: Colors.transparent,
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: width * 0.4,
    borderBottomWidth: width * 0.8,
    borderLeftWidth: width * 0.4,
    borderTopColor: Colors.transparent,
    borderRightColor: Colors.transparent,
    borderBottomColor: 'rgba(249, 249, 251, .2)',
    borderLeftColor: Colors.transparent,
    position: 'absolute',
    zIndex: 10,
    top: '40%',
    left: '30%',
  },
  square: {
    width: width * 0.3,
    height: width * 0.3,
    position: 'absolute',
    backgroundColor: 'rgba(249, 249, 251, .2)',
    zIndex: 10,
    top: '-35%',
    left: '35%',
  },
  containerItems: {
    width: '100%',
    height: '100%',
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 5,
    justifyContent: 'center',
  },
  logo: {
    height: width * 0.25,
    width: width * 0.5,
  },
});
