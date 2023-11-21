import React, { useState, useContext, useCallback, useEffect, useLayoutEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { ScreenContainer, Button, Input, Modal } from '../../components';
import { Colors } from '../../utils';
import { Fonts, Logos } from '../../../assets';
import { HttpService } from '../../services';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {
  AuthContext,
  RenderContext,
  SesionContext,
  SesionInterface,
  AccountsContext,
  AccountsInterface,
  EndPointsInterface
} from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

interface RequestLogin {
  mail: string;
  phoneNumer: string;
  credencial: string;
  originAplication: string;
  deviceId: string;
}

interface SendToken {
  userId: number | null | undefined;
  email: string | null | undefined;
  phoneNumber: string | null | undefined;
  channelTypeId: number;
  tokenTypeId: number;
}

interface OnSubmit {
  originAplication: string;
  deviceId: string;
  userId: number | null | undefined;
  tokenNumber: string;
  channelTypeId: number;
}

interface User extends SesionInterface {
  products: SavingsAccounts;
}

interface SavingsAccounts {
  savingsAccounts: AccountsInterface[];
}

interface Response {
  codigoRespuesta: string;
  mensajeRespuesta: string;
  usuario: User | null;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const formatNumber = (number: number) => `0${number}`.slice(-2);

const getRemaining = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

const requireSesion: string[] = ['00', '12', '35', '36', '37', '38', '39', '40', '41'];

const TrustedDeviceScreen = ({ navigation, route }: Props) => {
  const { language, setLoader } = useContext(RenderContext)
  const { tokenRU, endPoints, deviceId } = useContext(AuthContext)
  const { setSesion, startTimerSesion, sesion } = useContext(SesionContext)
  const { setAccounts } = useContext(AccountsContext)
  var intervalTimer: any = null
  var intervalTimer2: any = null
  const [timer1, setTimer1] = useState<number>(150);
  const [timer2, setTimer2] = useState<number>(20);
  const [activeTimer1, setActiveTimer1] = useState<boolean>(false)
  const [activeTimer2, setActiveTimer2] = useState<boolean>(false)
  const [sms, setSms] = useState<boolean>(false)
  const [email, setEmail] = useState<boolean>(false)
  const [modal, setModal] = useState<boolean>(false)
  const [tokenAuth, setTokenAuth] = useState<string>("")
  const [sesionAux, setSesionAux] = useState<SesionInterface | null>(null)
  const { mins, secs } = getRemaining(timer1);

  const validateUser = async () => {
    const type = route?.params?.type
    const user: RequestLogin = route?.params?.req
    try {
      const host: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API"
      )?.vale.trim() as string;
      let url: string
      let method: Method
      if (type === 1) {
        url = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_PHONE_URL")?.vale as string}${user?.phoneNumer}`
        method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_PHONE_METHOD")?.vale as Method
      } else {
        url = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_EMAIL_URL")?.vale as string}${user?.mail.trim().toLowerCase()}`
        method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_EMAIL_METHOD")?.vale as Method
      }
      const headers: any = GetHeader(tokenRU, "application/json")
      const response: Response = await HttpService(method, host, url, null, headers, setLoader)
      if (response) {
        setSesionAux(response.usuario)
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language)
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language)
    }
  }
  const sendToken = async () => {
    try {
      console.log("pase por aqui")
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string;
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_METHOD")?.vale as Method
      const req: SendToken = {
        userId: sesionAux?.id,
        email: '',
        phoneNumber: '',
        channelTypeId: sms ? 1 : 2,
        tokenTypeId: 1,
      };
      const headers = GetHeader(tokenRU, 'application/json');
      console.log(req)
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      console.log(response)
      if (response?.status === 'ENTREGADO') {
        !modal&&setModal(true);
        setTokenAuth("")
        restartTimers(true)
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.ErrorSendToken, language);
      }
    } catch (err) {
      console.log(err,"Aqui4")
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const restartTimers = (status: boolean) => {
    setTimer1(150);
    setTimer2(20);
    setActiveTimer1(status);
    setActiveTimer2(status);
  }
  const validateToken = async () => {
    setModal(false);
    const host: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API"
      )?.vale.trim() as string;
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_TOKEN_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_TOKEN_METHOD")?.vale as Method
    const req = {
      userId: sesionAux?.id,
      email: '',
      phoneNumber: '',
      token: tokenAuth,
      channelTypeId: sms ? 1 : 2,
    };
    const headers = GetHeader(tokenRU, 'application/json');
    try {
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      console.log(response,"validateToken")
      if (response?.codigoRespuesta === '00') {
        onSubmit();
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.ErrorValidateToken, language);
      }
    } catch (err) {
      console.log(err,"Aqui4")
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
    restartTimers(false)
    setTokenAuth("")
  };
  const onSubmit = async () => {
    setModal(false);
    const host: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API"
      )?.vale.trim() as string;
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "TRUSTED_DEVICE_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "TRUSTED_DEVICE_METHOD")?.vale as Method
    const req: OnSubmit = {
      originAplication: 'APP',
      deviceId  ,
      userId: sesionAux?.id,
      tokenNumber: tokenAuth,
      channelTypeId: sms ? 1 : 2,
    };
    console.log(req)
    const headers = GetHeader(tokenRU, 'application/json');
    try {
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      console.log(response,"onSubmit")
      if (response?.codigoRespuesta === '00') {
        login();
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
      }
    } catch (err) {
      console.log(err,"Aqui4")
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };

  const login = async () => {
    try {
      const host: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API"
      )?.vale.trim() as string;
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "LOGIN_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "LOGIN_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, "application/json")
      let req: RequestLogin = route?.params?.req
      req.deviceId = deviceId 
      const response: Response = await HttpService(method, host, url, req, headers, setLoader)
      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language)
        return
      }

      if (response?.codigoRespuesta === "70") {
        ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language)
        return
      }

      changeGlobals(response)
      setSesionAux(null)

    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language)
    }
    return;
  }


  const constructionSesion = useCallback((user: User): SesionInterface => {
    const sesion: SesionInterface = {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      birthDate: user?.birthDate,
      phone: user?.phone,
      gender: user?.gender,
      status: user?.status,
      addressId: user?.addressId,
      documentId: user?.documentId,
      compliance: user?.compliance,
      userCoreId: user?.userCoreId,
      profileImage: {
        id: user?.profileImage?.id,
        name: user?.profileImage?.name,
        url: user?.profileImage?.url,
      },
      perfils: user?.perfils,
      civil_status: user?.civil_status,
      birthplace: user?.birthplace,
      documentType: user?.documentType,
      token: user?.token,
      code: user?.code,
      typeCondition: user?.typeCondition
    };
    return sesion;
  }, []);



  const changeGlobals = useCallback((response: Response) => {
    if (requireSesion.includes(response?.codigoRespuesta)) {
      if (response?.usuario) {
        const { usuario } = response
        const sesion: SesionInterface = constructionSesion(usuario)
        setSesion(sesion)
        if (response?.codigoRespuesta === "00") {
          if (usuario?.status !== "ACTIVE") {
            ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message3, language)
            setSesion(null)
            return
          }
          const { savingsAccounts } = usuario?.products
          setAccounts(savingsAccounts)
          startTimerSesion()
          navigation.push("Dashboard")
        } else if (response?.codigoRespuesta === "12") {
          navigation.push("RegisterSecurityQuestions")
        } else if (response?.codigoRespuesta === "35") {
          navigation.push("Onboarding")
        } else if (response?.codigoRespuesta === "36") {
          navigation.push("PersonalInfo")
        } else if (response?.codigoRespuesta === "37") {
          navigation.push("CollectionsTypes", { redirect: "DNI" })
        } else if (response?.codigoRespuesta === "38") {
          navigation.push("CollectionsTypes", { redirect: "DNI" })
        } else if (response?.codigoRespuesta === "39") {
          navigation.push("CollectionsTypes", { redirect: "DNII" })
        } else if (response?.codigoRespuesta === "40") {
          navigation.push("Onboarding")
        } else if (response?.codigoRespuesta === "41") {
          navigation.push("CollectionsTypes", { redirect: "Selfie" })
        }
      } else {
        ToastCall('error', "Información del usuario no encontrada", language)
      }
    } else if (response?.codigoRespuesta === "05") {
      ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message4, language)
    } else if (response?.codigoRespuesta === "06") {
      ToastCall('error', Languages[language].SCREENS.LoginScreen.ERRORS.message5, language)
    } else if (response?.codigoRespuesta === "32") {
      ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message6, language)
    } else if (response?.codigoRespuesta === "33") {
      ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message7, language)
    } else if (response?.codigoRespuesta === "34") {
      ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message8, language)
    } else if (response?.codigoRespuesta === "96") {
      ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message9, language)
    } else if (response?.codigoRespuesta === "97") {
      ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message10, language)
    } else {
      ToastCall('warning', response.mensajeRespuesta, language)
    }
  }, [language,sesion])
  const disabled = () => {
    return !sms && !email;
  };

  useEffect(() => {
    validateUser();
  }, []);
  useLayoutEffect(() => {
    let intervalTimer: any;

    if (activeTimer1 && timer1 > 0) {
      intervalTimer = setInterval(() => {
        setTimer1((remainingSecs) => remainingSecs - 1);
      }, 1000);
    } else if (!activeTimer1 || timer1 === 0) {
      clearInterval(intervalTimer);
    }
    return () => clearInterval(intervalTimer);
  }, [activeTimer1, timer1]);

  useLayoutEffect(() => {
    let intervalTimer2: any;
    if (activeTimer2 && timer2 > 0) {
      intervalTimer2 = setInterval(() => {
        setTimer2((remainingSecs) => remainingSecs - 1);
      }, 1000);
    } else if (!activeTimer2 || timer2 === 0) {
      clearInterval(intervalTimer2);
    }
    return () => clearInterval(intervalTimer2);
  }, [activeTimer2, timer2]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Image source={Logos.LogoBlack} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.text, styles.title]}>{Languages[language].SCREENS.TrustedDeviceScreen.title}</Text>
        <View style={[styles.containerWidth, { flexGrow: 1, justifyContent: 'space-between' }]}>
          <Text style={[styles.text, { marginBottom: 20 }]}>{Languages[language].SCREENS.TrustedDeviceScreen.text1}</Text>
          <Text style={[styles.text, { marginBottom: 20 }]}>{Languages[language].SCREENS.TrustedDeviceScreen.text2}</Text>
          <View>
            <Text style={[styles.text, { marginBottom: 30 }]}>
              {Languages[language].SCREENS.TrustedDeviceScreen.text3}
            </Text>
            <View style={[styles.containerRow, styles.containerWidth, { justifyContent: 'space-evenly' }]}>
              <BouncyCheckbox
                size={20}
                fillColor={Colors.blackBackground}
                unfillColor="#FFFFFF"
                textComponent={<Text style={[styles.text, { marginHorizontal: 5 }]}>SMS</Text>}
                iconStyle={{ borderColor: Colors.black }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{ fontFamily: "DosisBold" }}
                style={{ marginVertical: 5 }}
                onPress={() => {
                  setSms(true);
                  setEmail(false);
                }}
                isChecked={sms}
                disableBuiltInState={true}
              />
              <BouncyCheckbox
                size={20}
                fillColor={Colors.blackBackground}
                unfillColor="#FFFFFF"
                textComponent={<Text style={[styles.text, { marginHorizontal: 5 }]}>EMAIL</Text>}
                iconStyle={{ borderColor: Colors.black }}
                innerIconStyle={{ borderWidth: 2 }}
                textStyle={{ fontFamily: "DosisBold" }}
                style={{ marginVertical: 5 }}
                onPress={() => {
                  setEmail(true);
                  setSms(false);
                }}
                isChecked={email}
                disableBuiltInState={true}
              />
            </View>
          </View>
          <View style={[styles.containerRow, { justifyContent: 'space-between' }]}>
            <View style={{ width: '45%', alignItems: 'center' }}>
              <Button
                text={Languages[language].GENERAL.BUTTONS.textBack}
                onPress={() => {
                  navigation.replace('Login');
                  setSesionAux(null);
                }}
                white
              />
            </View>
            <View style={{ width: '45%', alignItems: 'center' }}>
              <Button
                text={Languages[language].GENERAL.BUTTONS.textSubmit}
                styleText={{ fontFamily: "DosisBold" }}
                disabled={disabled()}
                onPress={() => {
                  sendToken();
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <Modal
        active={modal}
        onClose={() => {
          setModal(false);
        }}
        onSubmit={validateToken}>
        <Text style={[styles.text]}>
          {Languages[language].SCREENS.TrustedDeviceScreen.text4} {sms ? 'SMS' : 'EMAIL'}
        </Text>
        <Input
          placeholder={Languages[language].SCREENS.TrustedDeviceScreen.placeholder1}
          maxLength={6}
          value={tokenAuth}
          onChangeText={(e: string) => {
            setTokenAuth(e.replace(/[^0-9]/g, '').trim());
          }}
          keyboardType="numeric"
          styleContainer={{ marginTop: 30 }}
        />
        <View style={styles.containerWidth}>
          <Text style={[styles.text, { color: timer1 > 10 ? Colors.green : Colors.danger, textAlign: 'left' }]}>
            {mins}:{secs}
          </Text>
        </View>
        <TouchableOpacity
          disabled={timer2 ? true : false}
          onPress={() => {
            sendToken();
          }}>
          <Text style={[styles.text, { color: timer2 > 0 ? Colors.danger : Colors.green }]}>
            {Languages[language].GENERAL.BUTTONS.textResend} {sms ? 'SMS' : 'Email'}{' '}
            {timer2 > 0 ? `${formatNumber(timer2)}s` : null}
          </Text>
        </TouchableOpacity>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: "Dosis",
    fontSize: 20,
    textAlign: 'center',
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
});

export default TrustedDeviceScreen;
