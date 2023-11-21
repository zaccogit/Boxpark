import React, { useContext, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet, Platform } from 'react-native';
import { ScreenContainer, Header, InputDisabled, Button } from '../../components';
import { AuthContext, RenderContext, SesionContext, TransactionsContext, AccountsContext, EndPointsInterface } from '../../contexts';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { WithdrawalFormRequest } from '../../interfaces/BankAccountWithdrawal';
import { CloseSesion, DestroySesion, RefreshAccounts, GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const WithdrawalValidationScreen = ({ navigation, route }: Props) => {
  const { withdrawalRequest } = useContext(TransactionsContext);
  const { tokenRU, setTokenTransaction, tokenGateway, setChannelTypeId, endPoints } = useContext(AuthContext);
  const { sesion, setSesion, stopTimerSesion } = useContext(SesionContext);
  const { setLoader, language } = useContext(RenderContext);
  const { setAccounts } = useContext(AccountsContext);
  const refreshAccounts = useCallback(async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "REFRESH_ACCOUNTS_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "REFRESH_ACCOUNTS_METHOD")?.vale as Method
      await RefreshAccounts(method, host, url, sesion?.id ?? 0, setAccounts, tokenRU ?? '');
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.ErrorUpdatingAccounts, language);
      destroySesion();
    }
  }, [sesion, tokenRU, language, endPoints]);
  const destroySesion = useCallback((): void => {
    const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CLOSE_SESION_URL")?.vale as string
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CLOSE_SESION_METHOD")?.vale as Method
    stopTimerSesion();
    CloseSesion(host, url, method, tokenRU ?? '', sesion, language);
    DestroySesion(setSesion, setAccounts, setTokenTransaction);
    setChannelTypeId(0);
    navigation.push('Login');
  }, [tokenRU, sesion, language, endPoints]);
  const onSubmit = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale.trim() as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "WITHDRAWAL_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "WITHDRAWAL_METHOD")?.vale as Method
      const headers = GetHeader(tokenGateway, 'application/json');
      const req: WithdrawalFormRequest = {
        coreProductId: withdrawalRequest.accountPaymentNumber,
        accountBankId: withdrawalRequest.accountBankId,
        customerId: withdrawalRequest.userCoreId?.toString() as string,
        concept: withdrawalRequest.concept,
        amount: withdrawalRequest.amount,
        userId: sesion?.id.toString() as string,
        token: sesion?.token as string,
        simbol: withdrawalRequest.displaySymbol,
        phoneNumber: withdrawalRequest.phoneNumber,
        identificationNumber: withdrawalRequest.documentId,
        transactionSourceId: Platform.OS === "ios" ? "2" : "1"
      };
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      if (response?.codigoRespuesta === '00') {
        navigation.replace('WithdrawalSuccess', { response });
        refreshAccounts();
      } else if (response?.codigoRespuesta === '44') {
        ToastCall('error', Languages[language].GENERAL.ERRORS.TokenInvalid, language);
      } else if (response?.codigoRespuesta === '47') {
        ToastCall('error', Languages[language].SCREENS.PreQRPaymentScreen.ERRORS.message1, language);
      } else if (response?.codigoRespuesta === '53') {
        ToastCall('error', 'Transaccion rechazada', language);
      } else if (response?.codigoRespuesta === '60') {
        ToastCall('error', response?.mensajeRespuesta, language);
      } else if (response?.codigoRespuesta === '06') {
        destroySesion();
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
      navigation.replace('Dashboard');
    }
  };

  return (
    <>
      <Header title={'Valida los Datos'} showBackButtom navigation={navigation} route={route} />
      <ScreenContainer disabledPaddingTop>
        <View style={[styles.container]}>
          <View />
          <View style={styles.containerWidth}>
            <Text style={styles.text}>{'Cuenta'}</Text>
            <InputDisabled
              value={`${withdrawalRequest.accountPaymentBalance} (${withdrawalRequest.displaySymbol}) - ${withdrawalRequest.accountPaymentName} `}
            />
            <Text style={styles.text}>{'Alias'}</Text>
            <InputDisabled value={withdrawalRequest.alias} />
            <Text style={styles.text}>{'Telefono'}</Text>
            <InputDisabled value={withdrawalRequest.phoneNumber} />
            <Text style={styles.text}>{'Cedula'}</Text>
            <InputDisabled value={withdrawalRequest.documentId} />
            <Text style={[styles.text, { fontSize: 14, fontFamily: "DosisLight" }]}>
              {Languages[language].SCREENS.QrPaymentFormScreen.text6}
            </Text>
            <InputDisabled value={withdrawalRequest.amount} displaySymbol={withdrawalRequest.displaySymbol} />
            <Text style={[styles.text, { fontSize: 14, fontFamily: "DosisLight" }]}>
              {Languages[language].SCREENS.QrPaymentFormScreen.text7}
            </Text>
            <InputDisabled value={withdrawalRequest.concept} />
          </View>
          <View style={[styles.containerButton]}>
            <Button
              text={Languages[language].GENERAL.BUTTONS.textSubmit}
              onPress={() => {
                onSubmit();
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
    width,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  containerText: {
    height: 40,
    backgroundColor: Colors.gray,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'solid',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
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

export default WithdrawalValidationScreen;
