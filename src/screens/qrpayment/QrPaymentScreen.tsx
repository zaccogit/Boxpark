import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Select, QRScanner, Header } from '../../components';
import { AccountsContext, AccountsInterface, AuthContext, RenderContext, TransactionsContext, EndPointsInterface } from '../../contexts';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';
import { useIsFocused } from '@react-navigation/native';

interface Props extends StackScreenProps<any, any> { }

interface ItemSelect {
  label: string;
  value: number;
}

interface SavingsAccounts {
  savingsAccounts: AccountsInterface[];
}

interface Response {
  codigoRespuesta: string;
  mensajeRespuesta: string;
  products: SavingsAccounts;
  name: string;
  lastName: string;
  userCoreId: string;
  userId: string;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const QRPaymentScreen = ({ navigation, route }: Props) => {
  const { tokenGateway, endPoints } = useContext(AuthContext);
  const { accounts } = useContext(AccountsContext);
  const { qrPaymentRequest, setQrPaymentRequest } = useContext(TransactionsContext);
  const { setLoader, language, loader } = useContext(RenderContext);
  const [qr, setQr] = useState<boolean>(true);
  const isFocus = useIsFocused()
  const [accountsPayment, setAccountsPayment] = useState<ItemSelect[]>([]);
  const change = (value: string | number, key: string) => {
    setQrPaymentRequest({
      ...qrPaymentRequest,
      [key]: value,
    });
  };
  const getAccountsPayment = useCallback(() => {
    let allAccounts: ItemSelect[] = [];
    for (let i = 0; i < accounts?.length; i++) {
      allAccounts.push({
        label: accounts[i]?.productName,
        value: accounts[i]?.id,
      });
    }
    setQrPaymentRequest({
      ...qrPaymentRequest,
      accountPaymentId: accounts[0]?.id,
      accountPaymentBalance: accounts[0]?.accountBalance,
      accountPaymentNumber: accounts[0]?.accountNo,
    });
    setAccountsPayment(allAccounts);
  }, [qrPaymentRequest]);
  const getAccountInfo = useCallback(() => {
    const accountSelected: AccountsInterface = accounts?.find(
      (account: AccountsInterface) => account?.id === qrPaymentRequest?.accountPaymentId,
    ) as AccountsInterface;
    if (accountSelected) {
      setQrPaymentRequest({
        ...qrPaymentRequest,
        accountPaymentBalance: accountSelected?.accountBalance,
        accountPaymentNumber: accountSelected?.accountNo,
        accountPaymentName: accountSelected?.productName,
        displaySymbol: accountSelected?.currency?.displaySymbol ?? '',
      });
    }
  }, [qrPaymentRequest, accounts]);
  const getInfoBusiness = useCallback(async (cryptogram:string | undefined) => {
    if(!loader){
      try {
        const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale.trim() as string
        const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "BUSINESS_INFO_URL")?.vale as string
        const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "BUSINESS_INFO_METHOD")?.vale as Method
        const headers = GetHeader(tokenGateway, 'application/json');
        console.log(cryptogram)
        const req = {
          criptograma: cryptogram,
        };
        const response: Response = await HttpService(method, host, url, req, headers, setLoader);
        if (response?.codigoRespuesta !== '00') {
          ToastCall('warning', Languages[language].SCREENS.QrPaymentScreen.message3, language);
          return;
        }
        const {
          products: { savingsAccounts },
        } = response;
        if (!savingsAccounts?.length) {
          ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
          return;
        }
        const productId: number = accounts.find(item => item.id === qrPaymentRequest.accountPaymentId)?.productId as number;
        const accountsBusiness: AccountsInterface[] = savingsAccounts?.filter(
          (account: AccountsInterface) => account?.productId === productId,
        );
        if (!accountsBusiness?.length) {
          ToastCall(
            'warning',
            `${Languages[language].SCREENS.QrPaymentScreen.message1} ${qrPaymentRequest.accountPaymentName}. ${Languages[language].SCREENS.QrPaymentScreen.message2}`,
            language,
          );
          return;
        }
        setQrPaymentRequest({
          ...qrPaymentRequest,
          businessDestinationId: response?.userId,
          businessName: response?.name,
          sucursalName: response?.lastName,
          userCoreId: response?.userCoreId,
          accountBusinessId: accountsBusiness[0]?.id ?? 0,
          accountBusinessNumber: accountsBusiness[0]?.accountNo ?? '',
          accountBusinessName: accountsBusiness[0]?.productName ?? '',
        });
        navigation.push('QrPaymentForm');
      } catch (err) {
        console.log(JSON.stringify(err))
        ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
      }finally{
        setQr(true);
      }
    }
  }, [qrPaymentRequest, language,loader]);
  useEffect(() => {
    getAccountsPayment();
    
  }, []);
  useEffect(() => {
    if(isFocus){
      setLoader(true)
      setTimeout(() => {
        setQr(false);
        setLoader(false)
      }, 1000);
    }else{
      setQr(true);
    }
  }, [isFocus])
  
  useEffect(() => {
    getAccountInfo();
  }, [qrPaymentRequest.accountPaymentId]);

  return (
    <>
      <Header
        navigation={navigation}
        route={route}
        title={Languages['ES'].SCREENS.QrPaymentScreen.Header}
      />
      <ScreenContainer disabledPaddingTop>
        <View style={[styles.container, { flexGrow: 1, justifyContent: 'space-between', paddingTop: 20 }]}>
          <View style={[styles.containerWidth]}>
            <Text style={styles.text}>{Languages['ES'].SCREENS.QrPaymentScreen.text1}</Text>
            <Select
              styleText={{ paddingHorizontal: 20 }}
              items={accountsPayment}
              value={qrPaymentRequest?.accountPaymentId}
              setState={change}
              name={'accountPaymentId'}
            />
            <Text style={[styles.text, { textAlign: 'right', fontSize: 14 }]}>
              {qrPaymentRequest?.displaySymbol} {qrPaymentRequest?.accountPaymentBalance}
            </Text>
          </View>
          <View style={[styles.containerWidth, { alignItems: 'center' }]}>
            <QRScanner active={qr} setActive={setQr} setState={getInfoBusiness} />
            <Text style={[styles.text]}>{Languages['ES'].SCREENS.QrPaymentScreen.text2}</Text>
          </View>

          <View style={[styles.containerButton]}></View>
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
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  containerButton: {
    width,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default QRPaymentScreen;
