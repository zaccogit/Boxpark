import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import { ScreenContainer, Button, Input } from '../../components';
import { Colors } from '../../utils';
import { Fonts, Icons } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext, RegisterContext, RenderContext, EndPointsInterface } from '../../contexts';
import { HttpService } from '../../services';
import { ToastCall, GetHeader } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const PasswordScreen = ({ navigation }: Props) => {
  const { tokenRU, endPoints } = useContext(AuthContext);
  const { language, setLoader } = useContext(RenderContext);
  const { registerReq, setRegisterReq, setNacionality, initialStateRegister } = useContext(RegisterContext);

  const [countLength, setCountLength] = useState<boolean>(false);
  const [countUpperCase, setCountUpperCase] = useState<boolean>(false);
  const [countLowerCase, setCountLowerCase] = useState<boolean>(false);
  const [countNumbers, setCountNumbers] = useState<boolean>(false);
  const [countSymbols, setCountSymbols] = useState<boolean>(false);
  const [equals, setEquals] = useState<boolean>(false);

  const disable = () => {
    const { credential, credentialRepeat } = registerReq;
    return !(credential?.length >= 8) || !(credentialRepeat.length >= 8);
  };

  const onSubmit = async () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      documentId,
      gender,
      positionX,
      positionY,
      deviceId,
      documentTypeId,
      credential,
      credentialRepeat,
      referenceNumber,
      typeCondition
    } = registerReq;
    if (credential !== credentialRepeat) {
      ToastCall('warning', Languages[language].SCREENS.PasswordScreen.ERRORS.message2, language);
      return;
    }
    const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "REGISTER_APP_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "REGISTER_APP_METHOD")?.vale as Method
    const headers = GetHeader(tokenRU, "application/json")
    const req = {
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      documentId: documentId.trim(),
      credential: credential.trim(),
      gender,
      positionX,
      positionY,
      deviceId,
      documentTypeId,
      referCode: referenceNumber.trim(),
      typeCondition
    };
    try {
      const response = await HttpService(method, host, url, req, headers, setLoader);
      if (response?.codigoRespuesta === '08') {
        ToastCall('warning', Languages[language].SCREENS.PasswordScreen.ERRORS.message3, language);
        return;
      }

      if (response?.codigoRespuesta === '10') {
        ToastCall('warning', Languages[language].SCREENS.PasswordScreen.ERRORS.message4, language);
        return;
      }

      if (response?.codigoRespuesta === '00') {
        setRegisterReq(initialStateRegister);
        setNacionality(0);
        navigation.push('RegisterSuccess');
      } else {
        ToastCall('error', response?.mensajeRespuesta, language);
      }
    } catch (err) {
      console.log(JSON.stringify(err))
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const validatePassword = useCallback(
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
        setCountLowerCase(false);
        setCountUpperCase(false);
        setCountNumbers(false);
        setCountSymbols(false);
        setCountLength(false);
        setEquals(false);
      }
    },
    [registerReq.credential],
  );

  const change = (value: string, key: string) => {
    key === 'credential' && validatePassword(value);

    setRegisterReq({
      ...registerReq,
      [key]: value,
    });
  };
  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });
  }, [navigation]);
  useEffect(() => {
    const { credential, credentialRepeat } = registerReq;
    setEquals(credential.length && credential.length ? credential === credentialRepeat : false);
  }, [registerReq.credential, registerReq.credentialRepeat]);
  useEffect(() => {
    if(!registerReq.typeCondition.length) navigation.push("Nacionality")
  },[registerReq.typeCondition])
  return (
    <ScreenContainer>
      <Text style={styles.title}>{Languages[language].SCREENS.PasswordScreen.text1}</Text>
      <View style={styles.contentContainer}>
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
            <Text style={[styles.subTitle, { color: Colors.green, fontSize: 20 }]}> # ? ! $ % & * - . ,</Text>
          </Text>
          <Text style={[styles.subTitle]}>
            {' '}
            {!equals ? '●' : <Image source={Icons.Check} style={styles.icon} />}{' '}
            {Languages[language].SCREENS.PasswordScreen.text8}
          </Text>
        </View>
        <View>
          <Input
            placeholder={Languages[language].SCREENS.PasswordScreen.placeholder1}
            
            secureTextEntry={true}
            onChangeText={(e: string) => {
              change(e, 'credential');
            }}
            value={registerReq.credential}
            maxLength={12}
            placeholderColor={Colors.transparent}
          />
          <Input
            placeholder={Languages[language].SCREENS.PasswordScreen.placeholder2}
            secureTextEntry={true}
            onChangeText={(e: string) => {
              change(e, 'credentialRepeat');
            }}
            value={registerReq.credentialRepeat}
            maxLength={12}
            placeholderColor={Colors.transparent}
          />
        </View>
        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
          <Button
            text={Languages[language].SCREENS.PasswordScreen.textSubmit}
            disabled={disable()}
            onPress={() => {
              onSubmit();
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: Colors.blackBackground,
    fontFamily: "DosisExtraBold",
    fontSize: 28,
    marginVertical: 15,
  },
  subTitle: {
    textAlign: 'left',
    color: Colors.blackBackground,
    fontFamily: "DosisBold",
    fontSize: 18,
    width: '100%',
    marginVertical: 5,
  },
  paragraph: {
    fontFamily: "DosisBold",
    fontSize: 24,
    paddingHorizontal: width * 0.1,
  },
  contentContainer: {
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    justifyContent: 'space-around',
    flex: 1
  },
  cancelButton: {
    backgroundColor: Colors.transparent,
    elevation: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.blackBackground,
  },
  select: {
    color: Colors.blackBackground,
    borderBottomColor: Colors.blackBackground,
    borderStyle: 'solid',
    borderBottomWidth: 2,
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: Colors.green,
  },
});

export default PasswordScreen;
