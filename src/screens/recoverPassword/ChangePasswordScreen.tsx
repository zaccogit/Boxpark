import React, { useState, useContext, useEffect, useCallback } from 'react';
import { ScreenContainer, Button, Input } from '../../components';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts, Icons, SVG } from '../../../assets';
import { HttpService } from '../../services';
import { AuthContext, RenderContext, EndPointsInterface } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { ToastCall, GetHeader } from '../../utils/GeneralMethods';

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

interface Props extends StackScreenProps<any, any> { }

type Method = "get" | "post" | "put" | "delete"

const ChangePasswordScreen = ({ navigation, route: { params } }: Props) => {
  const { tokenRU, endPoints } = useContext(AuthContext);
  const { setLoader, language } = useContext(RenderContext);
  const [credentials, setCredentials] = useState({
    password: '',
    confirmPassword: '',
  });
  const [countLength, setCountLength] = useState<boolean>(false);
  const [countUpperCase, setCountUpperCase] = useState<boolean>(false);
  const [countLowerCase, setCountLowerCase] = useState<boolean>(false);
  const [countNumbers, setCountNumbers] = useState<boolean>(false);
  const [countSymbols, setCountSymbols] = useState<boolean>(false);

  const disable = () => {
    return !countLength && !countUpperCase && !countLowerCase && !countNumbers && !countSymbols;
  };
  const change = (value: string, key: string): void => {
    setCredentials({
      ...credentials,
      [key]: value,
    });
  };
  const onSubmit = async () => {
    try {
      let url: string = ""
      let method: Method  | null = null
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
      const headers = GetHeader(tokenRU, "application/json")
      let req: any = {
        email: params?.reReq?.channelTypeId === 2 ? params?.sesion?.email : null,
        phoneNumber: params?.reReq?.channelTypeId === 1 ? params?.sesion?.phone : null,
        token: params?.tokenUser,
        channelTypeId: params?.reReq?.channelTypeId,
        newPassword: credentials?.password,
      };
      if(params?.sqFail){
        url = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "RECOVER_PASSWORD_SIMPLE_URL")?.vale as string
        method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "RECOVER_PASSWORD_SIMPLE_METHOD")?.vale as Method
        req.idetificationNumber = `${params?.sesion?.documentId}`
      }else{
        url = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "RECOVER_PASSWORD_URL")?.vale as string
        method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "RECOVER_PASSWORD_METHOD")?.vale as Method
        req.respuestasUsuario = [
          {
            answer_question: params?.answers?.answer1?.toLowerCase(),
            question: params?.secQuestion[0]?.id,
          },
          {
            answer_question: params?.answers?.answer2?.toLowerCase(),
            question: params?.secQuestion[1]?.id,
          },
        ]
      }
      const response = await HttpService(method as Method, host, url, req, headers, setLoader);
      if (response?.codigoRespuesta === '00') {
        navigation.push('ResetPassSuccess');
      } else if (response?.codigoRespuesta === '44') {
        ToastCall('warning', Languages[language].SCREENS.ChangePasswordScreen.ERRORS.message1, language);
      } else if (response?.codigoRespuesta === '97') {
        ToastCall('warning', Languages[language].SCREENS.ChangePasswordScreen.ERRORS.message2, language);
      } else {
        ToastCall('warning', response?.mensajeRespuesta, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const validatePassword2 = useCallback(
    (e: any) => {
      let password = e;

      const val1 = /(?=.*[a-z])/g; //Minuscula
      const val2 = /(?=.*[A-Z])/g; //Mayuscula
      const val3 = /(?=.*\d)/g; //Digito
      const val4 = /(?=.*\W)/g; //Caracter Especial

      if (val1.test(password)) {
        setCountLowerCase(true);
      } else {
        countLowerCase && setCountLowerCase(false);
      }

      if (val2.test(password)) {
        setCountUpperCase(true);
      } else {
        countUpperCase && setCountUpperCase(false);
      }

      if (val3.test(password)) {
        setCountNumbers(true);
      } else {
        countNumbers && setCountNumbers(false);
      }

      if (val4.test(password)) {
        setCountSymbols(true);
      } else {
        countSymbols && setCountSymbols(false);
      }
      if (password.length >= 8) {
        setCountLength(true);
      } else {
        countLength && setCountLength(false);
      }
      if (password.length === 0) {
        setCountLowerCase(false),
          setCountUpperCase(false),
          setCountNumbers(false),
          setCountSymbols(false),
          setCountLength(false);
      }
    },
    [credentials.password],
  );
  const validatePassword = () => {
    if (credentials.password !== credentials.confirmPassword) {
      ToastCall('warning', Languages[language].SCREENS.ChangePasswordScreen.ERRORS.message4, language);
      return;
    }

    onSubmit();
  };
  useEffect(() => {
    if (
      !params?.sesion ||
      !params?.tokenUser ||
      !params?.reReq ||
      !tokenRU
    ) {
      navigation.push('ResetPassword');
    }
  }, []);
  return (
    <ScreenContainer>
      <View style={styles.imageContainer}>
        <SVG.ZaccoLogoDSVG width={300} height={150} />
      </View>
      <View style={styles.containerForm}>
        <View style={{ width: '100%' }}>
          <Text style={[styles.subTitle, { fontSize: 20 }]}>{Languages[language].SCREENS.PasswordScreen.text2}</Text>
          <Text style={[styles.subTitle]}>
            {' '}
            {!countLength ? '●' : <Image source={Icons.Check} style={styles.icon} />}{' '}
            {Languages[language].SCREENS.PasswordScreen.text3}
          </Text>
          <Text style={[styles.subTitle]}>
            {' '}
            {!countUpperCase ? '●' : <Image source={Icons.Check} style={styles.icon} />}{' '}
            {Languages[language].SCREENS.PasswordScreen.text4}
          </Text>
          <Text style={[styles.subTitle]}>
            {' '}
            {!countLowerCase ? '●' : <Image source={Icons.Check} style={styles.icon} />}{' '}
            {Languages[language].SCREENS.PasswordScreen.text5}
          </Text>
          <Text style={[styles.subTitle]}>
            {' '}
            {!countNumbers ? '●' : <Image source={Icons.Check} style={styles.icon} />}{' '}
            {Languages[language].SCREENS.PasswordScreen.text6}
          </Text>
          <Text style={[styles.subTitle]}>
            {' '}
            {!countSymbols ? '●' : <Image source={Icons.Check} style={styles.icon} />}{' '}
            {Languages[language].SCREENS.PasswordScreen.text7}{' '}
            <Text style={[styles.subTitle, { color: Colors.green, fontSize: 14 }]}> # ? ! $ % & * - . ,</Text>
          </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Input
            placeholder={Languages[language].SCREENS.ChangePasswordScreen.placeholder1}
            secureTextEntry={true}
            placeholderColor={Colors.gray}
            maxLength={12}
            onChangeText={(e: string) => {
              change(e.trim(), 'password'), validatePassword2(e);
            }}
            value={credentials.password}
          />
          <Input
            placeholder={Languages[language].SCREENS.ChangePasswordScreen.placeholder2}
            secureTextEntry={true}
            placeholderColor={Colors.gray}
            maxLength={12}
            onChangeText={(e: string) => change(e.trim(), 'confirmPassword')}
            value={credentials.confirmPassword}
          />
        </View>
        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              text={'Cancelar'}
              onPress={() => {
                navigation.push('Login');
              }}
              white
            />
          </View>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              disabled={disable()}
              onPress={() => {
                validatePassword();
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
    height: height * 0.2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    width: width * 0.9,
    height: height * 0.7,
    paddingVertical: 30,
    marginHorizontal: width * 0.05,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: Colors.green,
  },
  subTitle: {
    textAlign: 'left',
    color: Colors.blackBackground,
    fontFamily: "DosisBold",
    fontSize: 18,
    width: '100%',
    marginVertical: 5,
  },
});

export default ChangePasswordScreen;
