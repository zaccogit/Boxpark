import React, { useState, useContext, useCallback, useEffect } from 'react';
import { ScreenContainer, Input, Button } from '../../components';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import { AuthContext, RecoverPasswordContext, RenderContext, EndPointsInterface, SesionInterface } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { HttpService } from '../../services';
import { GetHeader } from '../../utils/GeneralMethods';
import { ToastCall } from '../../utils/GeneralMethods';
interface Props extends StackScreenProps<any, any> { }

interface Response {
  codigoRespuesta: string,
  mensajeRespuesta: string,
  usuario: SesionInterface
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;



const ResetPasswordScreen = ({ navigation }: Props) => {
  const { recoverPassword, setRecoverPassword, RecoverPasswordInitialState } = useContext(RecoverPasswordContext);
  const { setLoader, language } = useContext(RenderContext);
  const [email, setEmail] = useState<boolean>(true);
  const { tokenRU, endPoints } = useContext(AuthContext);
  const [isCorreo, setIsCorreo] = useState<boolean>(true);
  const change = useCallback((value: string, key: string) => {
    setRecoverPassword({
      ...recoverPassword,
      [key]: value,
    });
  },[recoverPassword]);
  const isCorreoHandler = useCallback((text: string) => {
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    setIsCorreo(regex.test(text));
  }, []);
  const onSubmit = async () => {
    try {
      let url: string = '';
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string

      let method: Method
      if (!email) {
        url = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_PHONE_URL")?.vale as string}${recoverPassword.phoneCode.trim()}${recoverPassword.phoneNumber.trim()}`
        method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_PHONE_METHOD")?.vale as Method
      } else {
        url = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_EMAIL_URL")?.vale as string}${recoverPassword.email.trim().toLowerCase()}`
        method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_EMAIL_METHOD")?.vale as Method
      }
      const headers = GetHeader(tokenRU, 'application/json');
      const response: Response = await HttpService(method, host, url, {}, headers, setLoader);
      if (!response) {
        ToastCall('error', Languages[language].SCREENS.ResetPasswordScreen.ERRORS.message3, language);
        return;
      }
      const {usuario} = response
      url = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_URL")?.vale as string
      method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_METHOD")?.vale as Method
      let req = {
        userId: '',
        email: '',
        phoneNumber: '',
        channelTypeId: 0,
        tokenTypeId: 3,
      };
      if (!email) {
        req.phoneNumber = usuario?.phone as string;
        req.channelTypeId = 1;
      } else {
        req.email = usuario?.email as string;
        req.channelTypeId = 2;
      }
      const responseMessage = await HttpService(method, host, url, req, headers, setLoader);
      if (!responseMessage) {
        ToastCall('error', Languages[language].SCREENS.ResetPasswordScreen.ERRORS.message3, language);
        return;
      }

      navigation.push('VerifyToken', { sesion: usuario, reReq: req, type: req.channelTypeId  });
    } catch (err: any) {
      if (err) {
        if (err?.status === 404) {
          ToastCall('error', Languages[language].SCREENS.ResetPasswordScreen.ERRORS.message3, language);
        } else if (err?.status === 500) {
          ToastCall('error', Languages[language].SCREENS.ResetPasswordScreen.ERRORS.message2, language);
        }
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.ConnectionError, language);
      }
    }
  };
  useEffect(() => {
    setRecoverPassword(RecoverPasswordInitialState)
  },[])
  return (
    <ScreenContainer>
      <View style={styles.imageContainer}>
        <SVG.ZaccoLogoDSVG width={300} height={150} />
      </View>
      <View style={styles.containerForm}>
        <View style={[styles.containerRow, styles.containerWidth]}>
          <Button
            text={'Correo electrónico'}
            styleButton={[styles.buttonRender, { marginRight: 15 }, !email ? styles.buttonRenderWhite : {}]}
            white={!email}
            onPress={() => {
              setEmail(true);
              setRecoverPassword({
                ...recoverPassword,
                phoneNumber: '',
                phoneCode: '',
              });
            }}
          />
          <Button
            text={'Número de teléfono'}
            styleButton={[styles.buttonRender, email ? styles.buttonRenderWhite : {}]}
            white={email}
            onPress={() => {
              setEmail(false);
              setRecoverPassword({
                ...recoverPassword,
                email: '',
              });
            }}
          />
        </View>
        {email && (
          <View style={[styles.containerWidth, { marginTop: 20 }]}>
            <Text style={styles.text}>{Languages[language].SCREENS.LoginScreen.titleEmail}</Text>
            <Input
              placeholder={'******@ejemplo.com'}
              value={recoverPassword.email}
              onChangeText={(e: string) => {
                change(e, 'email');
                isCorreoHandler(e)
              }}
              maxLength={50}
            />
            {!isCorreo && <Text style={{ ...styles.text, color: 'red' }}>No es un Email</Text>}
          </View>
        )}
        {!email && (
          <View style={[styles.containerWidth, { marginTop: 20 }]}>
            <Text style={styles.text}>{Languages[language].SCREENS.LoginScreen.titlePhone}</Text>
            <View style={[styles.containerRow, styles.containerWidth, { justifyContent: 'space-between' }]}>
              <View style={[styles.containerRow, { width: '25%' }]}>
                <Input
                  placeholder={'58'}
                  maxLength={3}
                  keyboardType="phone-pad"
                  value={recoverPassword.phoneCode}
                  onChangeText={(e: string) => {
                    change(e.replace(/[^0-9]/, ''), 'phoneCode');
                  }}
                />
              </View>
              <View style={[styles.containerRow, { width: '65%' }]}>
                <Input
                  placeholder={'1234567890'}
                  maxLength={11}
                  keyboardType="phone-pad"
                  value={recoverPassword.phoneNumber}
                  onChangeText={(e: string) => {
                    change(e.replace(/[^0-9]/, ''), 'phoneNumber');
                  }}
                />
              </View>
            </View>
          </View>
        )}
        <SVG.ResetPasswordSVG />
        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              text={Languages[language].SCREENS.ResetPasswordScreen.textBack}
              onPress={() => {
                navigation.goBack();
              }}
              white
            />
          </View>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              text={Languages[language].SCREENS.VerifyContactsScreen.textSubmit3}
              onPress={() => {
                onSubmit();
              }}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    width: width * 0.9,
    height: height * 0.4,
    borderRadius: 30,
    marginHorizontal: width * 0.05,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTitle: {
    color: Colors.blackBackground,
    fontSize: 20,
    fontFamily: Fonts.DosisBold,
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    width,
  },
  logo: {
    width: 200,
    height: 115,
  },
  text: {
    color: Colors.black,
    fontFamily: Fonts.Dosis,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  containerRow: {
    flexDirection: 'row',
  },
  containerWidth: {
    width: '100%',
  },
  buttonRender: {
    width: 'auto',
    paddingHorizontal: 20,
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
  },
  line: {
    width: '40%',
    height: 0,
    borderBottomWidth: 1,
  },
  circle: {
    width: 8,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
  },
  colorFormat: {
    borderStyle: 'solid',
    borderColor: '#898989',
  },
});

export default ResetPasswordScreen;
