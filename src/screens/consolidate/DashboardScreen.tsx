import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import {
  ScreenContainer,
  Navbar,
  ButtonTransaction,
  HeaderDashboard,
  LastTransactions,
  LastransactionsInterface,
  PromotionsList,
  AccountsList
} from '../../components';
import { Icons } from '../../../assets';
import { Colors } from '../../utils';
import { RenderContext, SesionContext, AccountsContext, AuthContext, EndPointsInterface } from '../../contexts';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { CloseSesion, DestroySesion, RefreshAccounts, GetHeader, ToastCall } from '../../utils/GeneralMethods';
import { StackScreenProps } from '@react-navigation/stack';
import { FAB } from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props extends StackScreenProps<any, any> {}

interface LastTransactionReq {
  userSourceId: string | null;
  destinationId: string | null;
  size: number;
}

interface Promotions {
  id: number;
  name: string;
  description: string;
  position: string;
  imagen: string;
  imagenContentType: string;
}

type Method = 'get' | 'post' | 'put' | 'delete';

const DashboardScreen = ({ navigation, route }: Props) => {
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, tokenPromotions, setTokenTransaction, setChannelTypeId, endPoints } = useContext(AuthContext);
  const { sesion, setSesion, stopTimerSesion } = useContext(SesionContext);
  const { setAccounts } = useContext(AccountsContext);
  const [lastTransactions, setLastTransactions] = useState<LastransactionsInterface[]>([]);
  const [allPromotions, setAllPromotions] = useState<Promotions[]>([]);
  const [loaderTransactions, setLoaderTransaction] = useState<boolean>(false);
  const [messageTransaction, setMessageTransaction] = useState<string>('No tienes Transacciones');

  const refreshAccounts = useCallback(async () => {
    try {
      const host: string = endPoints
        ?.find((endPoint: EndPointsInterface) => endPoint.name === 'APP_BASE_API')
        ?.vale.trim() as string;
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === 'REFRESH_ACCOUNTS_URL')
        ?.vale as string;
      const method: Method = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === 'REFRESH_ACCOUNTS_METHOD'
      )?.vale as Method;
      await RefreshAccounts(method, host, url, sesion?.id ?? 0, setAccounts, tokenRU ?? '', setLoader);
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.ErrorUpdatingAccounts, language);
      destroySesion();
    }
  }, [sesion, tokenRU, language, endPoints]);

  const destroySesion = useCallback((): void => {
    const host: string = endPoints
      ?.find((endPoint: EndPointsInterface) => endPoint.name === 'APP_BASE_API')
      ?.vale.trim() as string;
    const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === 'CLOSE_SESION_URL')
      ?.vale as string;
    const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === 'CLOSE_SESION_METHOD')
      ?.vale as Method;
    stopTimerSesion();
    CloseSesion(host, url, method, tokenRU ?? '', sesion, language);
    DestroySesion(setSesion, setAccounts, setTokenTransaction);
    setChannelTypeId(0);
    navigation.push('Login');
  }, [tokenRU, sesion, language, endPoints]);

  const getLastTransactions = useCallback(async () => {
    try {
      const host: string = endPoints
        ?.find((endPoint: EndPointsInterface) => endPoint.name === 'APP_BASE_API')
        ?.vale.trim() as string;
      const url: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === 'ALL_LAST_TRANSACTIONS_URL'
      )?.vale as string;
      const method: Method = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === 'ALL_LAST_TRANSACTIONS_METHOD'
      )?.vale as Method;
      const headers: any = GetHeader(tokenRU, 'application/json');
      let req: LastTransactionReq = {
        userSourceId: `${sesion?.id}`,
        destinationId: null,
        size: 10
      };
      const response: LastransactionsInterface[] = await HttpService(
        method,
        host,
        url,
        req,
        headers,
        setLoaderTransaction
      );
      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
        setMessageTransaction('Error al consultar las ultimas \ntransacciones');
        return;
      }
      req = {
        userSourceId: null,
        destinationId: `${sesion?.id}`,
        size: 10
      };
      const response2: LastransactionsInterface[] = await HttpService(
        method,
        host,
        url,
        req,
        headers,
        setLoaderTransaction
      );
      if (!response2) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
        setMessageTransaction('Error al consultar las ultimas \ntransacciones');
        return;
      }
      const ordenar = [...response, ...response2].sort((a, b) => b.id - a.id);
      const uniqueIds: any[] = [];

      const unique = ordenar.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.id);

        if (!isDuplicate) {
          uniqueIds.push(element.id);

          return true;
        }

        return false;
      });
      setLastTransactions(unique);
      setMessageTransaction('No tienes transacciones');
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  }, [sesion?.userCoreId, language, tokenRU]);

  const getPromotions = useCallback(async () => {
    try {
      const host: string = endPoints
        ?.find((endPoint: EndPointsInterface) => endPoint.name === 'PROMOTIONS_BASE_API')
        ?.vale.trim() as string;
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === 'BANNERS_URL')
        ?.vale as string;
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === 'BANNERS_METHOD')
        ?.vale as Method;
      const headers: any = GetHeader(tokenPromotions, 'application/json');
      const response: Promotions[] = await HttpService(method, host, url, {}, headers, setLoader);
      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.ConnectionError, language);
        return;
      }
      setAllPromotions(response);
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  }, [sesion?.userCoreId, language, tokenPromotions]);

  const refresh = useCallback(() => {
    if (sesion) {
      refreshAccounts();
      getLastTransactions();
      getPromotions();
    }
  }, [sesion?.id, sesion?.userCoreId, sesion?.phone]);

  useEffect(() => {
    refreshAccounts();
  }, []);

  useEffect(() => {
    getLastTransactions();
  }, []);

  useEffect(() => {
    getPromotions();
  }, []);
  /* useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      ToastCall('warning', Languages[language].GENERAL.ERRORS.NoBack, language);
    });
  }, [navigation]); */

  return (
    <>
      <ScreenContainer onRefresh={refresh} disabledPaddingBottom>
        <HeaderDashboard navigation={navigation} route={route} />
        <AccountsList />
        <PromotionsList allPromotions={allPromotions} />
        {/* <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', paddingVertical:10 }}>
          <ButtonTransaction
            icon={Icons.ArrowTop}
            name={'Recarga'}
            onPress={() => {
              navigation.push('RechargeMobilePayment');
            }}
            styleButton={{
              borderColor: Colors.white,
              borderWidth: 1
            }}
            styleIcon={{
              tintColor: Colors.white
            }}
          />
          <ButtonTransaction
            icon={Icons.ArrowBot}
            name={'Retiro'}
            onPress={() => {
              navigation.push('SelectAccountWithdrawal');
            }}
            styleButton={{
              borderColor: Colors.white,
              borderWidth: 1
            }}
          />
        </View> */}
        <LastTransactions
          lastTransactions={lastTransactions}
          loaderTransactions={loaderTransactions}
          messageTransaction={messageTransaction}
        />
      </ScreenContainer>
      <FAB
        visible
        onPress={() => navigation.push('Transfer')}
        placement="right"
        icon={<Icon name="send" size={24} color="white" />}
        color="black"
      />
    </>
  );
};

export default DashboardScreen;
