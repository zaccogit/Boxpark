import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { ScreenContainer, Button, Input } from '../../components';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import { HttpService } from '../../services';
import { AuthContext, RenderContext, EndPointsInterface } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const formatNumber = (number: number) => `0${number}`.slice(-2);

const getRemaining = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

const VerifyTokenScreen = ({ navigation, route: { params } }: Props) => {
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, endPoints } = useContext(AuthContext);
  var intervalTimer: any = null;
  var intervalTimer2: any = null;
  const [timer1, setTimer1] = useState<number>(150);
  const [timer2, setTimer2] = useState<number>(20);
  const [activeTimer1, setActiveTimer1] = useState<boolean>(true);
  const [activeTimer2, setActiveTimer2] = useState<boolean>(true);
  const [tokenUser, setTokenUser] = useState<string>('');
  const [counter, setCounter] = useState<number>(0);
  const { mins, secs } = getRemaining(timer1);
  const disabled = () => {
    return !(tokenUser.length === 6);
  };
  const onSubmit = async () => {
    const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_TOKEN_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_TOKEN_METHOD")?.vale as Method
    const { userId, email, phoneNumber, channelTypeId } = params?.reReq
    let req = {
      userId,
      email,
      phoneNumber,
      token: tokenUser,
      channelTypeId,
    };
    const headers = GetHeader(tokenRU, 'application/json');
    try {
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      if (!response) {
        ToastCall('error', Languages[language].SCREENS.VerifyTokenScreen.ERRORS.message3, language);
        return;
      }

      if (response?.codigoRespuesta === '00') {
        clearInterval(intervalTimer);
        clearInterval(intervalTimer2);
        navigation.push('SecurityQuestions', {
          sesion: params?.sesion,
          type: params?.type,
          tokenUser,
          reReq: params?.reReq,
        });
        restartTimers(false)
      } else if (response?.codigoRespuesta === '44') {
        if (counter === 2) {
          ToastCall('error', Languages[language].SCREENS.VerifyTokenScreen.ERRORS.message1, language);
          navigation.push('Login');
          setCounter(0);
          restartTimers(false)
          return
        }
        ToastCall('error', Languages[language].SCREENS.VerifyTokenScreen.ERRORS.message2, language);
        setCounter(remainingCounter => remainingCounter + 1);
        restartTimers(true)
      } else if (response?.codigoRespuesta === '23') {
        setCounter(0);
        restartTimers(false)
        ToastCall('error', Languages[language].SCREENS.VerifyTokenScreen.ERRORS.message3, language);
        navigation.push('ResetPassword');
      } else if (response?.codigoRespuesta === '19') {
        setCounter(0);
        ToastCall('error', Languages[language].SCREENS.VerifyTokenScreen.ERRORS.message4, language);
        reSubmit();
      }
    } catch (err) {
      ToastCall('error', Languages[language].SCREENS.VerifyTokenScreen.ERRORS.message6, language);
      restartTimers(false)
    }
  };
  const reSubmit = async () => {
    const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_METHOD")?.vale as Method
    const req = params?.reReq;
    const headers = GetHeader(tokenRU, 'application/json');
    try {
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      if (response) {
        restartTimers(true)
      } else {
        ToastCall('error', Languages[language].SCREENS.VerifyTokenScreen.ERRORS.message5, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].SCREENS.VerifyTokenScreen.ERRORS.message7, language);
    }
  };
  const restartTimers = (status: boolean) => {
    setTimer1(150);
    setTimer2(20);
    setActiveTimer1(status);
    setActiveTimer2(status);
    setTokenUser("")
  }
  useEffect(() => {
    if (!params?.type || !params?.sesion || !params?.reReq) {
      navigation.push('ResetPassword');
    }
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
      <View style={styles.imageContainer}>
        <SVG.ZaccoLogoDSVG width={300} height={150} />
      </View>
      <View style={styles.containerForm}>
        <Text style={[styles.text, { fontSize: 22, marginBottom: 20 }]}>
          {Languages[language].SCREENS.VerifyTokenScreen.title}
        </Text>
        <Text style={[styles.text, { fontSize: 20 }]}>
          {
            Languages[language].SCREENS.VerifyTokenScreen[
            params?.type === 1 ? 'textValidationSMS' : 'textValidationEMAIL'
            ]
          }
        </Text>
        <View style={{ width: '50%', marginTop: 10 }}>
          <Input
            placeholder={Languages[language].SCREENS.VerifyTokenScreen.placeholder}
            onChangeText={(e: string) => setTokenUser(e.replace(/[^0-9]/, '').trim())}
            value={tokenUser}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
        <Text style={[styles.textOptions, { color: timer1 > 10 ? Colors.blackBackground : Colors.danger }]}>
          {mins}:{secs}
        </Text>
        <View style={{ width: width * 0.5, alignItems: 'center' }}>
          <Button
            text={
              Languages[language].SCREENS.VerifyTokenScreen[params?.type === 1 ? 'textReSendSMS' : 'textReSendEMAIL'] +
              ' ' +
              (timer2 > 0 ? `${formatNumber(timer2)}s` : '')
            }
            white
            disabled={timer2 > 0}
            styleButton={[styles.buttonRenderWhite]}
            styleText={[{ fontSize: 20, color: timer2 ? Colors.danger : Colors.green }]}
            onPress={() => { reSubmit() }}
          />
        </View>
        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              text={Languages[language].GENERAL.BUTTONS.textBack}
              onPress={() => {
                navigation.goBack();
              }}
              white
            />
          </View>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              disabled={disabled()}
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    width: width * 0.9,
    paddingVertical: 30,
    borderRadius: 30,
    marginHorizontal: width * 0.05,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.blackBackground,
    fontFamily: "DosisBold",
    textAlign: 'center',
  },
  textOptions: {
    color: Colors.blackBackground,
    fontFamily: "DosisBold",
    fontSize: 20,
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
  },
});

export default VerifyTokenScreen;
