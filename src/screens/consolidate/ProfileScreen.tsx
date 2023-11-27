import React, { useContext, useEffect, useState, useCallback } from 'react';
import { StyleSheet, Dimensions, View, Text, Image, TouchableOpacity } from 'react-native';
import { Button, Header, ScreenContainer, Input, Select, AuthToken } from '../../components';
import { RenderContext, AuthContext, SesionContext, SesionInterface, EndPointsInterface } from '../../contexts';
import { HttpService } from '../../services';
import { Colors } from '../../utils';
import { Fonts, Images } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import { StackScreenProps } from '@react-navigation/stack';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';
import * as ImagePicker from 'expo-image-picker';

interface Props extends StackScreenProps<any, any> {}

interface File {
  uri: string | undefined;
  type: any;
  name: string | null | undefined;
}
interface SelectItems {
  label: string;
  value: number;
}

interface Credentials {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  expirationDays: number;
}

interface PhotoResponse {
  codigoRespuesta: string;
  mensajeRespuesta: string;
  id: string;
  name: string;
  url: string;
}

interface CredentialsResponse {
  codigoRespuesta: string;
  mensajeRespuesta: string;
}

type Method = 'get' | 'post' | 'put' | 'delete';

const width: number = Dimensions.get('window').width;

const days: SelectItems[] = [
  { label: '60 dias', value: 60 },
  { label: '120 dias', value: 120 },
  { label: '180 dias', value: 180 }
];
const upperCase: string[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'Ñ',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];
const lowerCase: string[] = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'ñ',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];
const numbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const symbols: string[] = ['#', '?', '!', '$', '%', '&', '*', '-', '.', ','];

const initialState: Credentials = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  expirationDays: 60
};

const ProfileScreen = ({ navigation, route }: Props) => {
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, tokenTransaction, tokenCompliance, channelTypeId, setTokenTransaction, endPoints } =
    useContext(AuthContext);
  const { sesion, setSesion } = useContext(SesionContext);
  const [modal, setModal] = useState<boolean>(false);
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerResult | undefined>();
  const [credentials, setCredentials] = useState<Credentials>(initialState);
  const change = (value: string | number, key: string | number) => {
    setCredentials({
      ...credentials,
      [key]: value
    });
  };
  const changePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.1,
      aspect: [3, 4]
    });
    if (!result.canceled) {
      if (!result) return;
      if (!result?.assets) return;
      if ((result?.assets[0]?.fileSize as number) > 230000) {
        ToastCall('warning', 'La imagen que elegiste es demasiado pesada', language);
        return;
      }

      setPhoto(result);
    }
  };
  const getPhoto = (file: ImagePicker.ImagePickerResult | undefined): File | null => {
    
    if (!file) return null;
    if (!file?.assets) return null;

    const name = file?.assets[0]?.uri.split("/")

    const data: File = {
      uri: file?.assets[0]?.uri,
      type: file?.assets[0]?.type + "/jpeg",
      name: file?.assets[0]?.uri.split("/")[name.length -1 ]
    };
    console.log(data);
    return data
  };
  const validatePassword = (tokenAuth: string) => {
    if (credentials?.newPassword === credentials?.confirmPassword) {
      let countUpperCase = 0;
      let countLowerCase = 0;
      let countNumbers = 0;
      let countSymbols = 0;
      for (let i = 0; i < credentials?.newPassword?.length; i++) {
        const character = credentials?.newPassword?.charAt(i);
        if (upperCase.includes(character)) {
          countUpperCase++;
        } else if (lowerCase.includes(character)) {
          countLowerCase++;
        } else if (numbers.includes(character)) {
          countNumbers++;
        } else if (symbols.includes(character)) {
          countSymbols++;
        }
      }
      if (
        countUpperCase >= 1 &&
        countLowerCase >= 1 &&
        countNumbers >= 1 &&
        countSymbols >= 1 &&
        credentials?.newPassword?.length
      ) {
        onSubmit(tokenAuth);
      } else {
        ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message1, language);
      }
    } else {
      ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message2, language);
    }
  };
  const onSubmit = async (tokenAuth: string) => {
    try {
      const host: string = endPoints
        ?.find((endPoint: EndPointsInterface) => endPoint.name === 'APP_BASE_API')
        ?.vale.trim() as string;
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === 'CHANGE_PASSWORD_URL')
        ?.vale as string;
      const method: Method = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === 'CHANGE_PASSWORD_METHOD'
      )?.vale as Method;
      const req = {
        userId: sesion?.id,
        oldPassword: credentials?.oldPassword,
        newPassword: credentials?.newPassword,
        smsToken: tokenTransaction || tokenAuth,
        sessionToken: sesion?.token,
        expirationDays: credentials?.expirationDays,
        channelTypeId
      };
      const headers = GetHeader(tokenRU, 'application/json');
      const response: CredentialsResponse = await HttpService(method, host, url, req, headers, setLoader);
      if (response?.codigoRespuesta === '00') {
        ToastCall('success', Languages[language].SCREENS.ProfileScreen.messageSuccess, language);
        setCredentials(initialState);
        !tokenTransaction && setTokenTransaction(tokenAuth);
      } else if (response?.codigoRespuesta === '05') {
        ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message10, language);
      } else if (response?.codigoRespuesta === '06') {
        ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message4, language);
      } else if (response?.codigoRespuesta === '23') {
        ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message3, language);
      } else if (response?.codigoRespuesta === '43') {
        ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message5, language);
      } else if (response?.codigoRespuesta === '48') {
        ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message6, language);
      } else if (response?.codigoRespuesta === '69') {
        ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message7, language);
      } else if (response?.codigoRespuesta === '68') {
        ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message8, language);
      } else if (response?.codigoRespuesta === '19') {
        ToastCall('warning', Languages[language].SCREENS.ProfileScreen.ERRORS.message9, language);
      } else if (response?.codigoRespuesta === '44') {
        ToastCall('warning', Languages[language].GENERAL.ERRORS.TokenInvalid, language);
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.TokenInvalid, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const onSubmitPhoto = async () => {
    try {
      const host: string = endPoints
        ?.find((endPoint: EndPointsInterface) => endPoint.name === 'COMPLIANCE_BASE_API')
        ?.vale.trim() as string;
      const url: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === 'CHANGE_PROFILE_IMAGE_URL'
      )?.vale as string;
      const method: Method = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === 'CHANGE_PROFILE_IMAGE_METHOD'
      )?.vale as Method;
      const headers = GetHeader(tokenCompliance, 'multipart/form-data');
      const partPhoto: any = getPhoto(photo);
      const req: FormData = new FormData();
      req.append("userId", `${sesion?.id}`)
      req.append("file", partPhoto)
      const response: PhotoResponse = await HttpService(method, host, url, req, headers, setLoader);
      console.log(response);

      if (response?.codigoRespuesta === '00') {
        let newSesion: SesionInterface | null = sesion;
        if (newSesion) {
          newSesion.profileImage = {
            id: parseInt(response?.id),
            name: response?.name,
            url: response?.url
          };
          setSesion(newSesion);
          setPhoto(undefined);

          ToastCall('success', "Imagen cambiada correctamente", language);
        } else {
          ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        }
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };

  useEffect(() => {
    if (photo) {
      onSubmitPhoto();
    }
  }, [photo]);
  return (
    <>
      <Header
        showBackButtom
        title={Languages[language].SCREENS.ProfileScreen.title}
        navigation={navigation}
        route={route}
      />
      <ScreenContainer disabledPaddingTop>
        <View style={[styles.container, { flexGrow: 1, paddingTop: 20 }]}>
          <View style={[styles.containerWidth, styles.containerCenter]}>
            <TouchableOpacity
              style={[styles.profile, styles.shadow]}
              onPress={() => {
                changePhoto();
              }}
            >
              <Image
                source={sesion?.profileImage?.url ? { uri: sesion?.profileImage?.url } : Images.Profile}
                style={styles.profile}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.text, styles.title, { marginVertical: 20 }]}>
            {Languages[language].SCREENS.ProfileScreen.text1}
          </Text>
          <View style={[styles.containerTransactions, styles.shadow]}>
            <View style={[styles.containerRow, styles.containerWidth, { justifyContent: 'space-between' }]}>
              <Text style={[styles.text]}>{Languages[language].SCREENS.ProfileScreen.text2}</Text>
              <Text style={[styles.text]}>{sesion?.firstName}</Text>
            </View>
            <View style={[styles.containerRow, styles.containerWidth, { justifyContent: 'space-between' }]}>
              <Text style={[styles.text]}>{Languages[language].SCREENS.ProfileScreen.text3}</Text>
              <Text style={[styles.text]}>{sesion?.lastName}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.text}>{Languages[language].SCREENS.ProfileScreen.text4}</Text>
            <Input
              placeholder={Languages[language].SCREENS.ProfileScreen.placeholder1}
              placeholderColor={Colors.gray}
              styleContainer={{ borderBottomColor: Colors.white }}
              secureTextEntry={true}
              value={credentials?.oldPassword}
              maxLength={12}
              onChangeText={(e: string) => {
                change(e.trim(), 'oldPassword');
              }}
            />
            <Text style={styles.text}>{Languages[language].SCREENS.ProfileScreen.text5}</Text>
            <Input
              placeholder={Languages[language].SCREENS.ProfileScreen.placeholder1}
              placeholderColor={Colors.gray}
              styleContainer={{ borderBottomColor: Colors.white }}
              secureTextEntry={true}
              value={credentials?.newPassword}
              maxLength={12}
              onChangeText={(e: string) => {
                change(e.trim(), 'newPassword');
              }}
            />
            <Text style={styles.text}>{Languages[language].SCREENS.ProfileScreen.text6}</Text>
            <Input
              placeholder={Languages[language].SCREENS.ProfileScreen.placeholder1}
              placeholderColor={Colors.gray}
              styleContainer={{ borderBottomColor: Colors.white }}
              secureTextEntry={true}
              value={credentials?.confirmPassword}
              maxLength={12}
              onChangeText={(e: string) => {
                change(e.trim(), 'confirmPassword');
              }}
            />
            <Text style={styles.text}>{Languages[language].SCREENS.ProfileScreen.text7}</Text>
            <Select items={days} value={credentials?.expirationDays} setState={change} name={'expirationDays'} />
          </View>
          <AuthToken isActive={modal} setIsActive={setModal} onSubmit={onSubmit} />
          <View style={{ width: '45%', marginTop: 20 }}>
            <Button
              text={Languages[language].GENERAL.BUTTONS.textSubmit}
              disabled={!tokenTransaction && !channelTypeId}
              onPress={() => {
                tokenTransaction ? validatePassword('') : setModal(true);
              }}
            />
          </View>
        </View>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    width
  },
  logo: {
    width: 200,
    height: 115
  },
  text: {
    color: Colors.black,
    fontFamily: 'Dosis',
    fontSize: 18
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  containerRow: {
    flexDirection: 'row'
  },
  containerCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerWidth: {
    width: '100%'
  },
  buttonRender: {
    width: 'auto',
    paddingHorizontal: 20
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
    width: 'auto'
  },
  containerTransactions: {
    width: width * 0.9,
    padding: 15,
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginBottom: 20
  },
  profile: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7
  }
});
export default ProfileScreen;
