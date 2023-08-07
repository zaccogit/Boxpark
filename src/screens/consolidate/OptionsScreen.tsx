import React, {useCallback, useContext, useMemo} from 'react';
import {Text, View, StyleSheet, Dimensions, ImageSourcePropType} from 'react-native';
import {ScreenContainer, Navbar, Button, HeaderDashboard, CardLayout} from '../../components';
import {Colors} from '../../utils';
import {Fonts, Icons} from '../../../assets';
import {AuthContext, SesionContext, AccountsContext, RenderContext, EndPointsInterface} from '../../contexts';
import Languages from '../../utils/Languages.json';
import {CloseSesion, DestroySesion} from '../../utils/GeneralMethods';
import {StackScreenProps} from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any> {}

interface Option {
  name: string;
  icon: ImageSourcePropType;
  action: () => void;
}

type Method = "get" | "post" | "put" | "delete"

const OptionsScreen = ({navigation, route}: Props) => {
  const {language} = useContext(RenderContext);
  const {setTokenTransaction, tokenRU, setChannelTypeId, endPoints} = useContext(AuthContext);
  const {sesion, setSesion, stopTimerSesion} = useContext(SesionContext);
  const {setAccounts} = useContext(AccountsContext);
  /* const closeSesion = useCallback((): void => {
    CloseSesion(tokenRU ?? '', sesion, language);
    DestroySesion(setSesion, setAccounts, setTokenTransaction);
    setChannelTypeId(0);
    navigation.replace('Login');
  }, []); */
  const closeSesion = useCallback((): void => {
    const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CLOSE_SESION_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CLOSE_SESION_METHOD")?.vale as Method
    stopTimerSesion();
   /* 
    */
    DestroySesion(setSesion, setAccounts, setTokenTransaction);
    setChannelTypeId(0);
    navigation.navigate('Login');
  }, [tokenRU, sesion, language, endPoints]);

  const options: Option[] = useMemo(
    () => [
      {
        name: 'Gestión de perfil',
        icon: Icons.user,
        action: () => {
          navigation.push('Profile');
        },
      },
      /* {
            name: "Mi Qr",
            icon: Icons.marcoScanRifQR,
            action: ()=>{navigation.push("Profile")}
        },
        {
            name: "Preferencias de idioma",
            icon: Icons.Gear,
            action: ()=>{navigation.push("Profile")}
        }, */
    ],
    [],
  );

  return (
    <>
      <ScreenContainer disabledPaddingBottom>
        {/* <HeaderDashboard navigation={navigation} route={route} /> */}
        <View style={[{ paddingHorizontal: width * 0.05 }]}>
          <Text style={[styles.text, styles.title]}>Perfil</Text>
          <Text style={[styles.buttonRenderWhite]}>Seleccione un metodo de configurar.</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'space-between'}}>
          <View style={[styles.containerWidth, {paddingHorizontal: 10}]}>
            {options?.map((option, index) => (
              <CardLayout photo={option.icon} key={index} onPress={option.action}>
                <View style={[{flexGrow: 1, justifyContent: 'center'}]}>
                  <Text style={[styles.text]}>{option.name}</Text>
                </View>
              </CardLayout>
            ))}
          </View>
          <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{width: width * 0.4, alignItems: 'center'}}>
              <Button
                text="Cerrar sesión"
                white
                onPress={() => {
                  closeSesion();
                }}
              />
            </View>
          </View>
        </View>
      </ScreenContainer>

    </>
  );
};

const width: number = Dimensions.get('window').width;

const styles = StyleSheet.create({
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
    fontFamily: "Dosis",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
  },
  containerRow: {
    flexDirection: 'row',
  },
  containerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerWidth: {
    width: '100%',
  },
  buttonRender: {
    width: 'auto',
    paddingHorizontal: 20,
  },
  containerTransactions: {
    width: width * 0.9,
    padding: 15,
    marginHorizontal: width * 0.05,
    borderRadius: 20,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  transaction: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    borderColor: 'rgba(66, 66, 66, .5)',
    borderStyle: 'solid',
  },
  imageProfile: {
    width: 50,
    height: 50,
    borderRadius: 35,
  },
  profile: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  icon: {
    width: 25,
    height: 25,
    borderRadius: 15,
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
    width: 'auto',
    fontFamily: "Dosis",
  },
});

export default OptionsScreen;
