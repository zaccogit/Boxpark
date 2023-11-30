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
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';

interface Props extends StackScreenProps<any, any> {}

const CamaraPermisos = ({ navigation }: Props) => {
  const { language, setLanguage, setLoader } = useContext(RenderContext);

  const permisosCheck = async () => {

    const { status } = await BarCodeScanner.requestPermissionsAsync();

    if (status !== 'granted') {
      ToastCall('error', 'Permission to access location was denied', language);
      return;
    }

    await MediaLibrary.requestPermissionsAsync();

    await Camera.requestCameraPermissionsAsync();

    navigation.replace('Login');

  };

  return (
    <ScreenContainer>
      <View className="flex-1 pt-5 px-5 gap-y-3">
        <Text style={{ fontFamily: 'DosisBold', fontSize: 20 }}>
          Activar los servicios de la camara nos permite ofrecer funciones como:
        </Text>
        <View className=" w-full justify-center items-center h-1/3 ">
          <Image style={{ height: '75%', width: '55%' }} source={SVG.Group12714} />
        </View>
        <View className=" flex-row  justify-center items-center gap-x-3 ">
          <View className=" bg-slate-800 p-4 rounded-full">
            <AntDesign name="lock1" size={24} color="white" />
          </View>
          <View className="w-3/4">
            <Text style={{ fontFamily: 'DosisBold', fontSize: 16 }}>Verificación de Transacciones</Text>
            <Text style={{ fontFamily: 'Dosis', fontSize: 11 }}>
              La cámara se utiliza para verificar y confirmar transacciones de pago en tiempo real. Los usuarios pueden
              capturar imágenes de recibos o códigos visuales proporcionados por el comercio, lo que ayuda a garantizar
              la transparencia en las transacciones. Esta funcionalidad adicional refuerza la confianza del usuario al
              proporcionar pruebas visuales de cada transacción realizada.
            </Text>
          </View>
        </View>
        <View className=" flex-row  justify-center items-center gap-x-3 ">
          <View className=" bg-slate-800 p-4 rounded-full">
            <Ionicons name="ios-shield-checkmark-sharp" size={24} color="white" />
          </View>
          <View className="w-3/4">
            <Text style={{ fontFamily: 'DosisBold', fontSize: 16 }}>Proceso de Pago Seguro</Text>
            <Text style={{ fontFamily: 'Dosis', fontSize: 11 }}>
              La aplicación utiliza la cámara para facilitar el proceso de pago seguro en comercios. Al permitir a los
              usuarios escanear códigos QR únicos asociados a los comercios, garantizamos transacciones seguras y sin
              contacto. Este método de pago eficiente mejora la comodidad del usuario y reduce los riesgos asociados con
              la manipulación de efectivo.
            </Text>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 20,
            width,
            paddingHorizontal: width * 0.05,
            justifyContent: 'center',
            alignItems: 'center'
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

export default CamaraPermisos;
