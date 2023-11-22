import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import { ScreenContainer, Select, Button, Input } from '../../components';
import { Colors } from '../../utils';
import { Fonts, Images } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext, RegisterContext, RenderContext, EndPointsInterface } from '../../contexts';
import { HttpService } from '../../services';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

interface SelectItems {
  value: number;
  label: string;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const ContactsScreen = ({ navigation }: Props) => {
  const { registerReq, setRegisterReq } = useContext(RegisterContext);
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, endPoints } = useContext(AuthContext);
  const [countries, setCountries] = useState<SelectItems[]>([]);
  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<string | number>('54');
  const [isCorreo, setIsCorreo] = useState<boolean>(true);

  const disable = () => {
    const { email } = registerReq;
    return !(phone.length > 7) || !(email.length > 10);
  };

  const isCorreoHandler = useCallback((text: string) => {
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    setIsCorreo(regex.test(text));
  }, []);

  const change = (value: string, key: string) => {
    setRegisterReq({
      ...registerReq,
      [key]: value,
    });
  };
  const changeCode = (value: string | number, key: string) => {
    setCode(value);
  };
  const query = async () => {
    /* const method = 'get';
    const url = '/services/ruaddress/api/pais'; */
    const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COUNTRIES_RU_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COUNTRIES_RU_METHOD")?.vale as Method
    const headers = GetHeader(tokenRU, 'application/json');
    try {
      const response = await HttpService(method, host, url, {}, headers, setLoader);
      //VALIDACION
      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }
      let allCountries: SelectItems[] = [];
      for (let i = 0; i < response.length; i++) {
        allCountries.push({
          label: `(${response[i].phoneCode}) ${response[i].name}`,
          value: response[i].phoneCode,
        });
      }
      setCountries(allCountries);
      setCode(response[0].phoneCode);
    } catch (err) {
      console.log(JSON.stringify(err));
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const validateContacts = async () => {
    const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
    let method: Method
    let url: string;
    const headers: any = GetHeader(tokenRU, 'application/json');
    let response: any;
    try {
      if (!isCorreo) {
        ToastCall('warning', Languages[language].SCREENS.ContactsScreen.ERRORS.message6, language);
        return;
      }

      //VALIDACION PHONE
      url = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_PHONE_URL")?.vale as string}${registerReq?.phone?.trim()}`
      method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_PHONE_METHOD")?.vale as Method
      response = await HttpService(method, host, url, {}, headers, setLoader);
      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }

      if (response?.codigoRespuesta !== '97') {
        ToastCall('warning', Languages[language].SCREENS.ContactsScreen.ERRORS.message3, language);
        return;
      }

      //VALIDACION EMAIL
      url = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_EMAIL_URL")?.vale as string}${registerReq?.email?.trim()}`
      method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_USER_EMAIL_METHOD")?.vale as Method
      response = await HttpService(method, host, url, {}, headers, setLoader);

      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }

      if (response?.codigoRespuesta !== '97') {
        ToastCall('warning', Languages[language].SCREENS.ContactsScreen.ERRORS.message4, language);
        return;
      }

      onSubmit(1, registerReq.phone);
      onSubmit(2, registerReq.email);
    } catch (err) {
      console.log(JSON.stringify(err));
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const onSubmit = async (type: number, contact: string) => {
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
        ToastCall('error', Languages[language].SCREENS.ContactsScreen.ERRORS.message4, language);
        return;
      }

      type === 2 && navigation.push('VerifyContacts');
    } catch (err) {
      console.log(JSON.stringify(err));
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  useEffect(() => {
    query();
  }, []);

  useEffect(() => {
    setRegisterReq({
      ...registerReq,
      phone: `${code}${phone}`,
    });
  }, [phone, code]);
  return (
    <ScreenContainer onRefresh={query}>
      <Text style={styles.title}>{Languages[language].SCREENS.ContactsScreen.title}</Text>
      <View style={styles.contentContainer}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
            <View style={{ width: 100 }}>
              <Text style={styles.label}>{Languages[language].SCREENS.ContactsScreen.subtitle1}</Text>
              <Select items={countries} setState={changeCode} value={code} name={'code'} lengthText={5} />
            </View>
            <View style={{ width: width * 0.9 - 110, marginLeft: 10 }}>
              <Text style={styles.label}>{Languages[language].SCREENS.ContactsScreen.subtitle2}</Text>
              <Input
                keyboardType="numeric"
                placeholder={Languages[language].SCREENS.ContactsScreen.placeholder1}
                onChangeText={(e: string) => setPhone(e.replace(/[^0-9]/g, ''))}
                value={phone}
              />
            </View>
          </View>

          <View>
            <Text style={styles.label}>{Languages[language].SCREENS.ContactsScreen.subtitle3}</Text>
            <Input
              value={registerReq.email}
              onChangeText={(e: string) => {
                isCorreoHandler(e), change(e, 'email');
              }}
              placeholder={Languages[language].SCREENS.ContactsScreen.placeholder2}
            />
            {!isCorreo && <Text style={{ ...styles.label, color: 'red' }}>No es un Email</Text>}
          </View>
          <View>
            <Text style={styles.label}>{Languages[language].SCREENS.ContactsScreen.subtitle4}</Text>
            <Input
              value={registerReq.referenceNumber}
              onChangeText={(e: string) => {
                change(e.replace(/[^0-9a-zA-Z]/g, "").trim(), 'referenceNumber');
              }}
              placeholder={Languages[language].SCREENS.ContactsScreen.placeholder3}
              maxLength={10}
            />
          </View>
        </View>

        <View style={{ flexGrow: 1, justifyContent: 'center' }}>
          <Image source={Images.phoneNumber} style={styles.image} />
        </View>

        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 }}>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              text={Languages[language].GENERAL.BUTTONS.textBack}
              onPress={() => {
                navigation.goBack();
                setRegisterReq({
                  ...registerReq,
                  credential: '',
                  credentialRepeat: '',
                  email: '',
                  phone: '',
                  referenceNumber: '',
                });
              }}
              white
            />
          </View>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              disabled={disable()}
              onPress={() => {
                validateContacts();
              }}
            />
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
    textAlign: 'center',
    color: Colors.blackBackground,
    fontFamily: "Dosis",
    fontSize: 18,
    marginTop: 5,
  },
  paragraph: {
    fontFamily: "Dosis",
    fontSize: 24,
    paddingHorizontal: width * 0.1,
  },
  contentContainer: {
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  cancelButton: {
    backgroundColor: Colors.transparent,
    elevation: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.blackBackground,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 5,
    color: Colors.blackBackground,
  },
  image: {
    height: 250,
    width: 250,
    marginHorizontal: width * 0.13,
  },
});
export default ContactsScreen;
