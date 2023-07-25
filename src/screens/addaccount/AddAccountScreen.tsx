import React, {useState, useContext, useCallback} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {ScreenContainer, Button, Input, Header, InputDisabled} from '../../components';
import {AuthContext, RenderContext, SesionContext, AccountsContext, EndPointsInterface} from '../../contexts';
import {Colors} from '../../utils';
import {Fonts} from '../../../assets';
import {HttpService} from '../../services';
import Languages from '../../utils/Languages.json';
import {StackScreenProps} from '@react-navigation/stack';
import {AuthToken} from '../../components';
import {CloseSesion, DestroySesion, GetHeader, ToastCall} from '../../utils/GeneralMethods';
interface Props extends StackScreenProps<any, any> {}

interface Req {
  identificationNumber: string;
  bankId: number;
  phoneNumber: string;
  userCoreId: number;
  accountTypeId: string;
  alias: string;
}
type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const AddAccountScreen = ({navigation, route}: Props) => {
  const {tokenGateway, setTokenTransaction, tokenTransaction, setChannelTypeId, channelTypeId, tokenRU, endPoints} = useContext(AuthContext);
  const {sesion, stopTimerSesion, setSesion} = useContext(SesionContext);
  const {setLoader, language} = useContext(RenderContext);
  const {setAccounts} = useContext(AccountsContext);
  const [modal, setModal] = useState<boolean>(false);

  const [newAccount, setNewAccount] = useState<Req>({
    identificationNumber: sesion?.documentId as string,
    bankId: route.params?.bank.id,
    phoneNumber: '',
    userCoreId: sesion?.userCoreId as number,
    accountTypeId: 'P2P',
    alias: '',
  });

  const change = (value: string, key: string) => {
    setNewAccount({
      ...newAccount,
      [key]: value,
    });
  };
  const disabled = () => {
    const {alias, phoneNumber} = newAccount;
    if (tokenTransaction) {
      return !(alias?.length >= 4 && phoneNumber?.length >= 10);
    } else {
      return !(alias?.length >= 4) || !(phoneNumber?.length >= 10) || !channelTypeId;
    }
  };

  const destroySesion = useCallback((): void => {
    const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CLOSE_SESION_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CLOSE_SESION_METHOD")?.vale as Method
    stopTimerSesion();
    CloseSesion(host, url, method,tokenRU ?? '', sesion, language);
    DestroySesion(setSesion, setAccounts, setTokenTransaction);
    setChannelTypeId(0);
    navigation.push('Login');
  }, [tokenRU, sesion, language, endPoints]);

  const onSubmit = async (tokenAuth: string) => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "P2P_ADD_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "P2P_ADD_METHOD")?.vale as Method
      const headers = GetHeader(tokenGateway, 'application/json');
      newAccount.phoneNumber = `58${newAccount.phoneNumber}`;
      const req = newAccount;
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      if (response?.codigoRespuesta === '00') {
        navigation.push('AddAccountSuccess');
        !tokenTransaction && setTokenTransaction(tokenAuth);
      } else if (response?.codigoRespuesta === '53') {
        ToastCall('error', 'Transaccion rechazada', language);
      } else if (response?.codigoRespuesta === '06') {
        destroySesion();
      } else if (response?.codigoRespuesta === '52') {
        ToastCall('error', 'Esta cuenta ya se encuentra registrada', language);
      }
    } catch (err) {
      ToastCall('error', JSON.stringify(err), language);
    }
  };

  return (
    <>
      <Header
        title={Languages[language].SCREENS.AddAccountScreen.Header}
        showBackButtom
        navigation={navigation}
        route={route}
      />
      <ScreenContainer>
        <View style={styles.containerForm}>
          <View style={{width: '100%'}}>
            <Text style={styles.textSubTitle}>{Languages[language].SCREENS.AddAccountScreen.text1}</Text>
            <InputDisabled value={route.params?.bank.name} />
            <Text style={styles.textSubTitle}>{Languages[language].SCREENS.AddAccountScreen.text2}</Text>
            <InputDisabled value={sesion?.documentId} />
            <Text style={styles.textSubTitle}>{Languages[language].SCREENS.AddAccountScreen.text3}</Text>
            <Input
              placeholder={Languages[language].SCREENS.AddAccountScreen.placeholder1}
              styleInput={{paddingHorizontal: 20}}
              value={newAccount?.phoneNumber}
              onChangeText={(e: string) => {
                change(e.replace(/[^0-9]/g, '').trim(), 'phoneNumber');
              }}
              maxLength={11}
              keyboardType="numeric"
            />
            <Text style={styles.textSubTitle}>{Languages[language].SCREENS.AddAccountScreen.text4}</Text>
            <Input
              placeholder={Languages[language].SCREENS.AddAccountScreen.placeholder2}
              styleInput={{paddingHorizontal: 20}}
              value={newAccount?.alias}
              onChangeText={(e: string) => {
                change(e, 'alias');
              }}
              maxLength={50}
            />
          </View>
          <AuthToken isActive={modal} setIsActive={setModal} onSubmit={onSubmit} />
          <View style={{width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{width: width * 0.5, alignItems: 'center'}}>
              <Button
                disabled={disabled()}
                onPress={() => {
                  tokenTransaction ? onSubmit('') : setModal(true);
                }}
              />
            </View>
          </View>
        </View>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  containerForm: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: width * 0.05,
    position: 'relative',
    flexGrow: 1,
  },
  cancelButton: {
    backgroundColor: Colors.transparent,
    elevation: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.blackBackground,
    marginVertical: 0,
    marginBottom: 30,
  },
  titles: {
    color: Colors.blackBackground,
    fontSize: 18,
    fontFamily: "DosisMedium",
    textAlign: 'center',
  },
  logo: {
    height: width * 0.3,
    width: width * 0.6,
    marginHorizontal: width * 0.2,
  },
  textTitle: {
    fontSize: 26,
    fontFamily: "DosisMedium",
    color: Colors.blackBackground,
    textAlign: 'center',
    marginVertical: 10,
  },
  textSubTitle: {
    fontSize: 20,
    fontFamily: "DosisMedium",
    color: Colors.blackBackground,
    marginVertical: 15,
  },
  containerButtons: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: Colors.blackBackground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: "DosisMedium",
    fontSize: 18,
  },
  textReSend: {
    color: Colors.green,
    fontFamily: "DosisMedium",
    fontSize: 20,
  },
  containerCheck: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  cancelButtonModal: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.danger,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
  },
  containerWidth: {
    width: '100%',
  },
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 20,
    textAlign: 'center',
  },
});

export default AddAccountScreen;
