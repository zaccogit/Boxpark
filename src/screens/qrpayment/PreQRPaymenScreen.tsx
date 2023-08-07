import React, { useState, useContext, useCallback, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Platform } from 'react-native';
import { ScreenContainer, Button, Header, InputDisabled, AuthToken } from '../../components';
import { RenderContext, SesionContext, AuthContext, AccountsContext, TransactionsContext, EndPointsInterface } from '../../contexts';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { CloseSesion, DestroySesion, GetHeader, RefreshAccounts, ToastCall } from '../../utils/GeneralMethods';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any> { }

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const numbers: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const PreQRPaymenScreen = ({ navigation, route }: Props) => {
  const { tokenRU, tokenTransaction, setTokenTransaction, tokenGateway, channelTypeId, setChannelTypeId, endPoints } = useContext(AuthContext);
  const { setLoader, language } = useContext(RenderContext);
  const { sesion, setSesion, stopTimerSesion } = useContext(SesionContext);
  const { qrPaymentRequest, setQrPaymentRequest } = useContext(TransactionsContext);
  const { setAccounts } = useContext(AccountsContext);
  const [modal, setModal] = useState<boolean>(false);

  const validateAmount = useCallback(() => {
    const amount: string = qrPaymentRequest?.amount;
    if (amount?.length) {
      let newAmount: string = '';
      let symbol: number = 0;
      let isDecimal: boolean = false;
      let error: boolean = false;
      for (let i = 0; i < amount?.length; i++) {
        const character: string = amount.charAt(i);
        if (numbers?.includes(character)) {
          newAmount = `${newAmount}${character}`;
          if (symbol === 1) {
            isDecimal = true;
          }
        } else if (character === '.') {
          symbol++;
          newAmount = `${newAmount}${'.'}`;
          if (symbol > 1) {
            error = true;
          }
        } else {
          error = true;
        }
      }
      if (error) {
        ToastCall('warning', Languages[language].SCREENS.PreQRPaymentScreen.ERRORS.message2, language);
        navigation.goBack();
        return;
      } else {
        if (symbol === 1 && !isDecimal) {
          newAmount = `${newAmount}${'00'}`;
          isDecimal = true;
        } else if (symbol === 0) {
          newAmount = `${newAmount}${'.00'}`;
          symbol++;
          isDecimal = true;
        }
        if (symbol === 1 && isDecimal) {
          setQrPaymentRequest({
            ...qrPaymentRequest,
            amount: newAmount,
          });
        } else {
          ToastCall('warning', Languages[language].SCREENS.PreQRPaymentScreen.ERRORS.message2, language);
          navigation.goBack();
          return;
        }
      }
    } else {
      ToastCall('warning', Languages[language].SCREENS.PreQRPaymentScreen.ERRORS.message3, language);
      navigation.goBack();
    }
  }, [qrPaymentRequest]);

  const onSubmit = useCallback(
    async (tokenAuth: string) => {
      try {
        const { accountPaymentId, userCoreId, accountBusinessId, concept, amount, displaySymbol, businessDestinationId } = qrPaymentRequest;
        const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale as string
        const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "QR_PAYMENT_URL")?.vale as string
        const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "QR_PAYMENT_METHOD")?.vale as Method
        const headers = GetHeader(tokenGateway, 'application/json');
        const req = {
          accountSourceId: `${accountPaymentId}`,
          customerSourceId: `${sesion?.userCoreId}`,
          destionationCustomerId: `${userCoreId}`,
          accountDestinationId: `${accountBusinessId}`,
          transacionSourceId: `${Platform?.OS === 'ios' ? 2 : 1}`,
          userDestinationId: businessDestinationId,
          amount,
          description: concept,
          userId: sesion?.id,
          simbol: displaySymbol,
          token: sesion?.token,
          tokenNumber: tokenTransaction || tokenAuth,
          channelTypeId,
        };
        const response: any = await HttpService(method, host, url, req, headers, setLoader);
        if (response?.codigoRespuesta === '00') {
          setQrPaymentRequest({
            ...qrPaymentRequest,
            resourceId: response?.resourceId,
          });
          navigation.replace('QRPaymentSuccess');
          !tokenTransaction && setTokenTransaction(tokenAuth);
          refreshAccounts();
        } else if (response?.codigoRespuesta === '44') {
          ToastCall('error', Languages[language].GENERAL.ERRORS.TokenInvalid, language);
        } else if (response?.codigoRespuesta === '47') {
          ToastCall('warning', Languages[language].SCREENS.PreQRPaymentScreen.ERRORS.message1, language);
        } else if (response?.codigoRespuesta === '53') {
          ToastCall('error', 'Transaccion rechazada', language);
        } else if (response?.codigoRespuesta === '06') {
          destroySesion();
        } else {
          ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        }
      } catch (err) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
        navigation.replace('Dashboard');
      }
    },
    [qrPaymentRequest, sesion, tokenTransaction, language, channelTypeId, channelTypeId],
  );
  const refreshAccounts = useCallback(async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "REFRESH_ACCOUNTS_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "REFRESH_ACCOUNTS_METHOD")?.vale as Method
      await RefreshAccounts(method, host, url, sesion?.id ?? 0, setAccounts, tokenRU ?? '');
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.ErrorUpdatingAccounts, language);
      destroySesion();
    }
  }, [sesion, tokenRU, language, endPoints]);

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

  useEffect(() => {
    validateAmount();
  }, []);

  return (
    <>
      <Header
        route={route}
        navigation={navigation}
        title={Languages['ES'].SCREENS.QrPaymentScreen.Header}
        showBackButtom
      />
      <ScreenContainer disabledPaddingTop>
        <View style={[styles.container, { flexGrow: 1, justifyContent: 'space-between', paddingTop: 20 }]}>
          <View style={[styles.containerWidth]}>
            <Text style={styles.text}>{Languages[language].SCREENS.PreQRPaymentScreen.text1}</Text>
            <InputDisabled value={qrPaymentRequest?.accountPaymentName} />
            <Text style={styles.text}>{Languages[language].SCREENS.PreQRPaymentScreen.text2}</Text>
            <InputDisabled value={qrPaymentRequest?.accountPaymentNumber} />
            <Text style={styles.text}>{Languages[language].SCREENS.PreQRPaymentScreen.text3}</Text>
            <InputDisabled value={qrPaymentRequest?.businessName} />
            {!qrPaymentRequest?.sucursalName?.toLocaleLowerCase()?.includes('null') && (
              <>
                <Text style={styles.text}>{Languages[language].SCREENS.PreQRPaymentScreen.text4}</Text>
                <InputDisabled value={qrPaymentRequest?.sucursalName} />
              </>
            )}
            <Text style={styles.text}>{Languages[language].SCREENS.PreQRPaymentScreen.text5}</Text>
            <InputDisabled value={qrPaymentRequest?.accountBusinessName} />
            <Text style={styles.text}>{Languages[language].SCREENS.PreQRPaymentScreen.text6}</Text>
            <InputDisabled value={qrPaymentRequest?.accountBusinessNumber} />
            <Text style={[styles.text, { fontSize: 14, fontFamily: "DosisLight" }]}>
              {Languages[language].SCREENS.PreQRPaymentScreen.text7}
            </Text>
            <InputDisabled value={qrPaymentRequest?.amount} displaySymbol={qrPaymentRequest?.displaySymbol} />
            <Text style={[styles.text, { fontSize: 14, fontFamily: "DosisLight" }]}>
              {Languages[language].SCREENS.PreQRPaymentScreen.text8}
            </Text>
            <InputDisabled value={qrPaymentRequest?.concept} />
            <AuthToken isActive={modal} setIsActive={setModal} onSubmit={onSubmit} />
          </View>
          <Button
            text={Languages['ES'].GENERAL.BUTTONS.textSubmit}
            disabled={!tokenTransaction && !channelTypeId}
            onPress={() => {
              tokenTransaction ? onSubmit('') : setModal(true);
            }}
          />
        </View>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    width,
  },
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
  containerButton: {
    width,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default PreQRPaymenScreen;
