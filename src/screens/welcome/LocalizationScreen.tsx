import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { Button, ScreenContainer } from '../../components';
import { Image } from 'expo-image';
import { SVG } from '../../../assets';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { width } from '../../utils';
import { StackScreenProps } from '@react-navigation/stack';
import * as Location from 'expo-location';
import { ToastCall } from '../../utils/GeneralMethods';
import { RenderContext } from '../../contexts';

interface Props extends StackScreenProps<any, any> {}

const LocalizationScreen = ({ navigation }: Props) => {
  const { language, setLanguage, setLoader } = useContext(RenderContext);

  const permisosCheck = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      ToastCall('error', 'Permission to access location was denied', language);
      return;
    }

    setLoader(true)
    setTimeout(() => {
        navigation.replace('Login');
    }, 1500);
  };

  return (
    <ScreenContainer>
      <View className="flex-1 pt-5 px-5 gap-y-3">
        <Text style={{ fontFamily: 'DosisBold', fontSize: 20 }}>
          Activar los servicios de ubicacion nos permite ofrecer funciones como:
        </Text>
        <View className=" w-full justify-center items-center h-1/3 ">
          <Image style={{ height: '75%', width: '53%' }} source={SVG.Group127132} />
        </View>
        <View className=" flex-row  justify-center items-center gap-x-3 ">
          <View className=" bg-slate-800 p-4 rounded-full">
            <AntDesign name="lock1" size={24} color="white" />
          </View>
          <View className="w-3/4">
            <Text style={{ fontFamily: 'DosisBold', fontSize: 16 }}>Transacciones seguras</Text>
            <Text style={{ fontFamily: 'Dosis', fontSize: 11 }}>
              La ubicación garantiza que las transacciones provengan de lugares autorizados, reduciendo el riesgo de
              fraude
            </Text>
          </View>
        </View>
        <View className=" flex-row  justify-center items-center gap-x-3 ">
          <View className=" bg-slate-800 p-4 rounded-full">
            <Ionicons name="ios-shield-checkmark-sharp" size={24} color="white" />
          </View>
          <View className="w-3/4">
            <Text style={{ fontFamily: 'DosisBold', fontSize: 16 }}>Protección contra Suplantaciones</Text>
            <Text style={{ fontFamily: 'Dosis', fontSize: 11 }}>
              Evitamos el uso no autorizado al identificar ubicaciones inusuales, protegiendo tu cuenta contra
              suplantaciones.
            </Text>
          </View>
        </View>
        <View className=" flex-row  justify-center items-center gap-x-3 ">
          <View className=" bg-slate-800 p-4 rounded-full">
            <Ionicons name="location" size={24} color="white" />
          </View>
          <View className="w-3/4">
            <Text style={{ fontFamily: 'DosisBold', fontSize: 16 }}>Seguridad para la Comunidad:</Text>
            <Text style={{ fontFamily: 'Dosis', fontSize: 11 }}>
              Contribuyes a un entorno seguro para todos, fortaleciendo la protección global y asegurando una
              experiencia sin preocupaciones.
            </Text>
          </View>
        </View>

        <View
          style={{
            position:"absolute",
            bottom:20,
            width,
            paddingHorizontal: width * 0.05,
            justifyContent: 'center',
          }}
        >
          <View style={{ width: '90%', alignItems: 'center' }}>
            <Button text={'Continuar'} onPress={permisosCheck} />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default LocalizationScreen;
