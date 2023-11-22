import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenContainer, Button, Input } from '../../components';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { HttpService } from '../../services';
import { AuthContext, RegisterContext, RenderContext, EndPointsInterface } from '../../contexts';
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

const VerifyContactsScreen = ({ navigation }: Props) => {
  const { registerReq, setRegisterReq } = useContext(RegisterContext);
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, endPoints } = useContext(AuthContext);
  var intervalTimer: any = null;
  var intervalTimer2: any = null;
  var intervalTimer3: any = null;
  var intervalTimer4: any = null;
  const [timer1, setTimer1] = useState<number>(150);
  const [timer2, setTimer2] = useState<number>(20);
  const [timer3, setTimer3] = useState<number>(150);
  const [timer4, setTimer4] = useState<number>(20);
  const [activeTimer1, setActiveTimer1] = useState<boolean>(true);
  const [activeTimer2, setActiveTimer2] = useState<boolean>(true);
  const [activeTimer3, setActiveTimer3] = useState<boolean>(true);
  const [activeTimer4, setActiveTimer4] = useState<boolean>(true);
  const [state, setState] = useState({
    sms: '',
    email: '',
  });
  const { mins: mins1, secs: secs1 } = getRemaining(timer1);
  const { mins: mins3, secs: secs3 } = getRemaining(timer3);
  const disable = () => {
    const { email, sms } = state;
    return !(email.length >= 6) || !(sms.length >= 6);
  };
  const change = (value: string, key: string) => {
    setState({
      ...state,
      [key]: value,
    });
  };
  const reSubmit = async (type: number, contact: string) => {
    const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_METHOD")?.vale as Method
    const req = {
      userId: null,
      email: type === 2 ? contact : '',
      phoneNumber: type === 1 ? contact : '',
      channelTypeId: type,
      tokenTypeId: 1,
    };
    const headers = GetHeader(tokenRU, 'application/json');
    try {
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }

      if (type === 1) {
        setActiveTimer1(true);
        setActiveTimer2(true);
        setTimer1(150);
        setTimer2(20);
      }

      if (type === 2) {
        setActiveTimer3(true);
        setActiveTimer4(true);
        setTimer3(150);
        setTimer4(20);
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const getReq = useCallback((type: number, contact: string, token: string) => {
    return {
      userId: null,
      email: type === 2 ? contact : '',
      phoneNumber: type === 1 ? contact : '',
      channelTypeId: type,
      token: token,
    };
  }, []);
  const onSubmit = async () => {
    let req;
    try {
      const { sms, email } = state;
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_TOKEN_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_TOKEN_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, 'application/json');

      req = getReq(1, registerReq.phone, sms);
      const responseSms: any = await HttpService(method, host, url, req, headers, setLoader);
      //VALIDAR SMS
      if (!responseSms) {
        ToastCall('warning', Languages[language].SCREENS.VerifyContactsScreen.ERROR.message4, language);
        return;
      }
      if (responseSms?.codigoRespuesta !== '00') {
        ToastCall('warning', Languages[language].SCREENS.VerifyContactsScreen.ERROR.message3, language);
        return;
      }

      req = getReq(2, registerReq.email, email);
      const responseEmail: any = await HttpService(method, host, url, req, headers, setLoader);
      //VALIDAR EMAIL
      if (!responseEmail) {
        ToastCall('warning', Languages[language].SCREENS.VerifyContactsScreen.ERROR.message5, language);
        return;
      }

      if (responseEmail?.codigoRespuesta !== '00') {
        ToastCall('warning', Languages[language].GENERAL.ERRORS.GeneralError, language);
        return;
      }

      clearInterval(intervalTimer);
      clearInterval(intervalTimer2);
      clearInterval(intervalTimer3);
      clearInterval(intervalTimer4);
      navigation.push('Selfie2Screen');
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  useEffect(() => {
    if (activeTimer1 && timer1 > 0) {
      intervalTimer = setInterval(() => {
        setTimer1(remainingSecs => remainingSecs - 1);
      }, 1000);
    } else if (!activeTimer1 || timer1 === 0) {
      clearInterval(intervalTimer);
    }
    return () => clearInterval(intervalTimer);
  }, [activeTimer1, timer1]);

  useEffect(() => {
    if (activeTimer2 && timer2 > 0) {
      intervalTimer2 = setInterval(() => {
        setTimer2(remainingSecs => remainingSecs - 1);
      }, 1000);
    } else if (!activeTimer2 || timer2 === 0) {
      clearInterval(intervalTimer2);
    }
    return () => clearInterval(intervalTimer2);
  }, [activeTimer2, timer2]);

  useEffect(() => {
    if (activeTimer3 && timer3 > 0) {
      intervalTimer3 = setInterval(() => {
        setTimer3(remainingSecs => remainingSecs - 1);
      }, 1000);
    } else if (!activeTimer3 || timer3 === 0) {
      clearInterval(intervalTimer3);
    }
    return () => clearInterval(intervalTimer3);
  }, [activeTimer3, timer3]);

  useEffect(() => {
    if (activeTimer4 && timer4 > 0) {
      intervalTimer4 = setInterval(() => {
        setTimer4(remainingSecs => remainingSecs - 1);
      }, 1000);
    } else if (!activeTimer4 || timer4 === 0) {
      clearInterval(intervalTimer4);
    }
    return () => clearInterval(intervalTimer4);
  }, [activeTimer4, timer4]);
  return (
    <ScreenContainer>
      <Text style={styles.title}>{Languages[language].SCREENS.VerifyContactsScreen.title}</Text>
      <View style={styles.contentContainer}>
        <View style={styles.slideshow}>
          <View />
          <View>
            <Text style={[styles.subTitle, { marginBottom: 10 }]}>
              {Languages[language].SCREENS.VerifyContactsScreen.text1}
            </Text>
            <Input
              placeholder={Languages[language].SCREENS.VerifyContactsScreen.placeholder1}
              onChangeText={(e: string) => change(e.replace(/[^0-9]/g, ''), 'sms')}
              value={state.sms}
              keyboardType="numeric"
              maxLength={6}
            />
            <Text style={[styles.textOptions, { color: timer1 > 10 ? Colors.green : Colors.danger }]}>
              {mins1}:{secs1}
            </Text>
            <TouchableOpacity
              style={{ marginVertical: 10 }}
              disabled={timer2 ? true : false}
              onPress={() => {
                reSubmit(1, registerReq.phone);
              }}>
              <Text style={[styles.textOptions, { color: timer2 > 0 ? Colors.danger : Colors.green }]}>
                {Languages[language].SCREENS.VerifyContactsScreen.textSubmit}{' '}
                {timer2 > 0 ? `${formatNumber(timer2)}s` : null}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[styles.subTitle, { marginBottom: 10 }]}>
              {Languages[language].SCREENS.VerifyContactsScreen.text2}
            </Text>
            <Input
              placeholder={Languages[language].SCREENS.VerifyContactsScreen.placeholder2}
              onChangeText={(e: string) => change(e.replace(/[^0-9]/g, ''), 'email')}
              value={state.email}
              keyboardType="numeric"
              maxLength={6}
            />
            <Text style={[styles.textOptions, { color: timer3 > 10 ? Colors.green : Colors.danger }]}>
              {mins3}:{secs3}
            </Text>
            <TouchableOpacity
              style={{ marginVertical: 10 }}
              disabled={timer4 ? true : false}
              onPress={() => {
                reSubmit(2, registerReq.email);
              }}>
              <Text style={[styles.textOptions, { color: timer4 > 0 ? Colors.danger : Colors.green }]}>
                {Languages[language].SCREENS.VerifyContactsScreen.textSubmit2}{' '}
                {timer4 > 0 ? `${formatNumber(timer4)}s` : null}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ width: width * 0.3, alignItems: 'center' }}>
              <Button
                text={Languages[language].GENERAL.BUTTONS.textBack}
                onPress={() => {
                  navigation.goBack();
                  setRegisterReq({
                    ...registerReq,
                    credential: '',
                    credentialRepeat: '',
                  });
                }}
                white
              />
            </View>
            <View style={{ width: width * 0.3, alignItems: 'center' }}>
              <Button
                disabled={disable()}
                onPress={() => {
                  onSubmit();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: Colors.blackBackground,
    fontFamily: "Dosis",
    fontSize: 28,
    marginVertical: 15,
  },
  subTitle: {
    color: Colors.blackBackground,
    fontFamily: "DosisMedium",
    fontSize: 18,
    marginTop: 5,
  },
  contentContainer: {
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    justifyContent: 'space-between',
    minHeight: height * 0.6,
    flexGrow: 1,
  },
  slideshow: {
    width: width * 0.9,
    height: height * 0.7,
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },
  textOptions: {
    color: Colors.green,
    fontFamily: "DosisMedium",
    fontSize: 18,
  },
});
export default VerifyContactsScreen;
