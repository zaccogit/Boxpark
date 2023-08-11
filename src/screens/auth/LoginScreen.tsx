import { useState, useContext, useEffect, useCallback } from "react";
import { ScreenContainer, Input, Button } from "../../components";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../../utils";
import { SVG } from "../../../assets";
import { HttpService } from "../../services";
import { RenderContext, AuthContext, SesionContext, EndPointsInterface, AccountsInterface, SesionInterface, AccountsContext } from "../../contexts";
import Languages from "../../utils/Languages.json";
import { Platform } from "react-native";
import { getIosIdForVendorAsync, androidId } from "expo-application";
import { StackScreenProps } from "@react-navigation/stack";
import { ToastCall, GetHeader } from "../../utils/GeneralMethods";
import { Image } from "expo-image";

interface Props extends StackScreenProps<any, any> {}

interface Phone {
  code: string;
  phoneNumer: string;
}

export type Method = "get" | "post" | "put" | "delete";


/* interface LoginOperadorRequest {
  alias: string;
  deviceId: string;
  passwordPos: string;
  userPos: string;
}

const initialState: LoginOperadorRequest = {
  alias: "",
  deviceId: "",
  passwordPos: "",
  userPos: "",
};
 */
interface User extends SesionInterface {
  products: SavingsAccounts | null;
}

interface SavingsAccounts {
  savingsAccounts: AccountsInterface[];
}

interface Response {
  codigoRespuesta: string;
  mensajeRespuesta: string;
  usuario: User | null;
}

interface Request {
  mail: string;
  phoneNumer: string;
  credencial: string;
  originAplication: string;
  deviceId: string;
}

const initialState: Request = {
  mail: '',
  phoneNumer: '',
  credencial: '',
  originAplication: 'APP',
  deviceId: '',
};

const initialStatePhone: Phone = {
  code: '',
  phoneNumer: '',
};

const requireSesion: string[] = ['00', '12', '35', '36', '37', '38', '39', '40', '41'];
const width: number = Dimensions.get("window").width;

const LoginScreen = ({ navigation }: Props) => {
  const { language, setLoader } = useContext(RenderContext);
  const { tokenRU, endPoints } = useContext(AuthContext);
  const { setSesion, startTimerSesion, sesion } = useContext(SesionContext);
  const { setAccounts } = useContext(AccountsContext);
  const [email, setEmail] = useState<boolean>(true);
  const [phone, setPhone] = useState<Phone>(initialStatePhone);
  const [isCorreo, setIsCorreo] = useState<boolean>(true);
  const [credentials, setCredentials] =
    useState<Request>(initialState);
  const change = useCallback(
    (value: string, key: string) => {
      setCredentials({
        ...credentials,
        [key]: value,
      });
    },
    [credentials]
  );

  const changeDevideId = useCallback(() => {
    if (Platform.OS === "ios") {
      getIosIdForVendorAsync()
        .then((deviceId) => {
          if (deviceId) {
            setCredentials({
              ...credentials,
              deviceId,
            });
          }
        })
        .catch(() => {
          ToastCall(
            "error",
            Languages[language].GENERAL.ERRORS.DeviceIdError,
            language
          );
        });
    } else if (Platform.OS === "android") {
      androidId;
      if (androidId)
        setCredentials({
          ...credentials,
          deviceId: androidId,
        });
    }
  }, [credentials, language]);

  const disabled = useCallback(() => {
    const { mail, credencial } = credentials;
    const { phoneNumer, code } = phone;
    return (!mail.length && (!(phoneNumer.length >= 8) || !code.length)) || !(credencial.length >= 8);
  }, [credentials]);

  const Login = useCallback(async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "LOGIN_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "LOGIN_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, "application/json")
      const type: number = credentials?.mail?.length === 0 ? 1 : 2
      let req = credentials;
      console.log(req, 'req');
      const response: any = await HttpService(
        method,
        host,
        url,
        req,
        headers,
        setLoader
      );
      console.log(response);
      if (!response) {

        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.RequestError,
          language
        );
        return;
      }

      if (response?.codigoRespuesta === '70') {
        navigation.push('TrustedDevice', { type, req });
        return;
      }

      changeGlobals(response);
    } catch (err) {
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.RequestError,
        language
      );
    }
    return;
  }, [credentials, language]);
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
  const changeGlobals = useCallback(
    (response: Response) => {
      console.log(response)
      if (requireSesion.includes(response?.codigoRespuesta)) {
        if (response?.usuario) {
          const { usuario } = response;
          const sesion: SesionInterface = constructionSesion(usuario);
          setSesion(sesion);
          console.log(response.codigoRespuesta,'usuario 123')
          if (response?.codigoRespuesta === '00') {
            if (usuario?.status !== 'ACTIVE') {
              ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message3, language);
              setSesion(null)
              console.log('codigoRespuesta')
              return;
            }

             if (!usuario?.products) {
              ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message1, language);
              setSesion(null)
              console.log('products')
              return;
            }
            const { savingsAccounts } = usuario?.products;
            if (!savingsAccounts.length) {
              ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message11,
                language);
              console.log('savingsAccounts')
              setSesion(null)
              return;
            }
            setAccounts(savingsAccounts); 
            startTimerSesion();
            navigation.push('Dashboard');
          } else if (response?.codigoRespuesta === '12') {
            console.log('aqui123456')
            navigation.push('RegisterSecurityQuestions');
          } else if (response?.codigoRespuesta === '35') {
            navigation.push('Onboarding');
          } else if (response?.codigoRespuesta === '36') {
            navigation.push('PersonalInfo');
          } else if (response?.codigoRespuesta === '37') {
            navigation.push('CollectionsTypes', { redirect: 'DNI' });
          } else if (response?.codigoRespuesta === '38') {
            navigation.push('CollectionsTypes', { redirect: 'DNI' });
          } else if (response?.codigoRespuesta === '39') {
            navigation.push('CollectionsTypes', { redirect: 'DNII' });
          } else if (response?.codigoRespuesta === '40') {
            navigation.push('Onboarding');
          } else if (response?.codigoRespuesta === '41') {
            navigation.push('CollectionsTypes', { redirect: 'Selfie' });
          }
          setCredentials(initialState);
        } else {
          ToastCall('warning', 'Información del usuario no encontrada', language);
        }
      } else if (response?.codigoRespuesta === '05') {
        ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message4, language);
      } else if (response?.codigoRespuesta === '06') {
        ToastCall('error', Languages[language].SCREENS.LoginScreen.ERRORS.message5, language);
      } else if (response?.codigoRespuesta === '32') {
        ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message6, language);
      } else if (response?.codigoRespuesta === '33') {
        ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message7, language);
      } else if (response?.codigoRespuesta === '34') {
        ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message8, language);
      } else if (response?.codigoRespuesta === '96') {
        ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message9, language);
      } else if (response?.codigoRespuesta === '97') {
        ToastCall('warning', Languages[language].SCREENS.LoginScreen.ERRORS.message10, language);
      } else {
        ToastCall('warning', response.mensajeRespuesta, language);
      }
    },
    [language],
  );
  const isCorreoHandler = useCallback((text: string) => {
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    setIsCorreo(regex.test(text));
  }, []);
  const changePhone = useCallback(
    (value: string, key: string) => {
      setPhone({
        ...phone,
        [key]: value,
      });
    },
    [phone],
  );

  useEffect(() => {
    if (!tokenRU) {
      navigation.push("Init");
    }
  }, []);
  useEffect(() => {
    if (tokenRU) {
      changeDevideId();
    }
  }, []);
  useEffect(() => {
    if (sesion) {
      console.log(sesion);
      navigation.navigate("Dashboard");
    }
  }, [sesion]);

  /* useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      ToastCall("warning", Languages[language].GENERAL.ERRORS.NoBack, language);
    });
  }, [navigation]); */
  return (
    <ScreenContainer>
      <View style={styles.container} className=" justify-between h-full ">
        <Image source={SVG.ZaccoLogoDV2} style={{ width: 200, height: 125 }} />
        <Text style={[styles.text, styles.title]}>{Languages[language].SCREENS.LoginScreen.title}</Text>
        <View style={[styles.containerRow, styles.containerWidth, styles.containerButtons]} className="">
          <Button
            text={Languages[language].SCREENS.LoginScreen.titleEmail}
            styleButton={[styles.buttonRender, !email ? styles.buttonRenderWhite : {}]}
            white={!email}
            onPress={() => {
              setEmail(true);
              setCredentials({
                ...credentials,
                phoneNumer: '',
              });
              setPhone(initialStatePhone);
            }}
          />
          <Button
            text={Languages[language].SCREENS.LoginScreen.titlePhone}
            styleButton={[styles.buttonRender, email ? styles.buttonRenderWhite : {}]}
            white={email}
            onPress={() => {
              setEmail(false);
              setCredentials({
                ...credentials,
                mail: '',
              });
            }}
          />
        </View>
        {email && (
          <View style={[styles.containerWidth]}>
            <Text style={styles.text}>{Languages[language].SCREENS.LoginScreen.titleEmail}</Text>
            <Input
              placeholder={Languages[language].SCREENS.LoginScreen.placeholderEmail}
              value={credentials.mail}
              onChangeText={(e: string) => {
                change(e, 'mail')
                isCorreoHandler(e)
              }}
              maxLength={50}
              keyboardType="email-address"
            />
            {!isCorreo && <Text style={{ ...styles.text, color: 'red' }}>No es un Email</Text>}
          </View>
        )}
        {!email && (
          <View style={[styles.containerWidth]}>
            <Text style={styles.text}>{Languages[language].SCREENS.LoginScreen.titlePhone} </Text>
            <View style={[styles.containerRow, styles.containerWidth, { justifyContent: 'space-between' }]}>
              <View style={[styles.containerRow, { width: '25%' }]}>
                <Input
                  placeholder={'58'}
                  maxLength={3}
                  keyboardType="phone-pad"
                  value={phone.code}
                  onChangeText={(e: string) => {
                    changePhone(e.replace(/[^0-9]/, ''), 'code');
                  }}
                />
              </View>
              <View style={[styles.containerRow, { width: '65%' }]}>
                <Input
                  placeholder={'1234567890'}
                  maxLength={11}
                  keyboardType="phone-pad"
                  value={phone.phoneNumer}
                  onChangeText={(e: string) => {
                    changePhone(e.replace(/[^0-9]/, ''), 'phoneNumer');
                  }}
                />
              </View>
            </View>
          </View>
        )}
        <View style={[styles.containerWidth]}>
          <Text style={styles.text}>{Languages[language].SCREENS.LoginScreen.titlePassword} </Text>
          <Input
            placeholder={'********'}
            secureTextEntry={true}
            value={credentials.credencial}
            onChangeText={(e: string) => change(e.trim(), 'credencial')}
            maxLength={12}
          />
        </View>
        <Button
          text={'Iniciar sesión'}
          onPress={() => {
            Login();
          }}
          disabled={disabled()}
          className=" mt-3"
        />
        <View
          style={[
            styles.containerWidth,
            styles.containerRow,
            { marginVertical: 20, justifyContent: 'space-around', alignItems: 'center' },
          ]}>
          <View style={[styles.line, styles.colorFormat]} />
          <View style={[styles.circle, styles.colorFormat]} />
          <View style={[styles.line, styles.colorFormat]} />
        </View>
        <View style={[styles.containerRow, styles.containerWidth, { justifyContent: 'space-between' }]}>
          <Button
            text={Languages[language].SCREENS.LoginScreen.resetPassword}
            styleButton={[styles.buttonRender, styles.buttonRenderWhite]}
            white={true}
            onPress={() => {
              navigation.push('ResetPassword');
            }}
          />
          <Button
            text={Languages[language].SCREENS.LoginScreen.register}
            styleButton={[styles.buttonRender, styles.buttonRenderWhite]}
            white={true}
            onPress={() => {
              navigation.push('Nacionality');
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  containerRow: {
    flexDirection: "row",
  },
  containerWidth: {
    width: "100%",
  },
  buttonRender: {
    width: "auto",
    paddingHorizontal: 20,
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
  },
  line: {
    width: "40%",
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
    borderStyle: "solid",
    borderColor: "#898989",
  },
  containerButtons: {
    justifyContent: "center",
  },
});

export default LoginScreen;
