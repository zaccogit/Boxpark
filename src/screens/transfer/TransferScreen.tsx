import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Select, Input, Header, Button } from '../../components';
import {
  AccountsContext,
  AccountsInterface,
  AuthContext,
  RenderContext,
  TransactionsContext,
  SesionContext,
  EndPointsInterface
} from '../../contexts';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

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
  name: string;
  lastName: string;
  userCoreId: string;
  userId: string;
  products: SavingsAccounts;
}

interface Credential {
  code: string;
  phoneNumer: string;
  email: string;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const initialStateCredendial: Credential = {
  code: '',
  phoneNumer: '',
  email: '',
};

const TransferScreen = ({ navigation, route }: Props) => {
  const { tokenGateway, endPoints } = useContext(AuthContext);
  const { sesion } = useContext(SesionContext);
  const { accounts } = useContext(AccountsContext);
  const { transferRequest, setTransferRequest } = useContext(TransactionsContext);
  const { setLoader, language } = useContext(RenderContext);
  const [isEmail, setIsEmail] = useState<boolean>(true);
  const [isCorreo, setIsCorreo] = useState<boolean>(true);
  const [credential, setCredentials] = useState<Credential>(initialStateCredendial);
  const [accountsPayment, setAccountsPayment] = useState<ItemSelect[]>([]);
  const changeCredencial = useCallback(
    (value: string | number, key: string) => {
      setCredentials({
        ...credential,
        [key]: value,
      });
    },
    [credential],
  );
  const isCorreoHandler = useCallback((text: string) => {
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    setIsCorreo(regex.test(text));
  }, []);
  const change = useCallback(
    (value: string | number, key: string | number) => {
      setTransferRequest({
        ...transferRequest,
        [key]: value,
      });
    },
    [transferRequest],
  );
  const disabled = useCallback(() => {
    const { code, phoneNumer, email } = credential;
    if (isEmail) {
      return !email.length;
    } else {
      return !code.length || !phoneNumer.length;
    }
  }, [credential]);
  const getAccountsPayment = useCallback(() => {
    let allAccounts: ItemSelect[] = [];
    for (let i = 0; i < accounts?.length; i++) {
      allAccounts.push({
        label: accounts[i]?.productName,
        value: accounts[i]?.id,
      });
    }
    setTransferRequest({
      ...transferRequest,
      accountPaymentId: accounts[0]?.id,
      accountPaymentBalance: accounts[0]?.accountBalance,
      accountPaymentNumber: accounts[0]?.accountNo,
    });
    setAccountsPayment(allAccounts);
  }, []);
  const getAccountInfo = useCallback(() => {
    const accountSelected: AccountsInterface = accounts?.find(
      (account: AccountsInterface) => account?.id === transferRequest?.accountPaymentId,
    ) as AccountsInterface;

    if (accountSelected) {
      setTransferRequest({
        ...transferRequest,
        accountPaymentBalance: accountSelected?.accountBalance,
        accountPaymentNumber: accountSelected?.accountNo,
        accountPaymentName: accountSelected?.productName,
        displaySymbol: accountSelected?.currency?.displaySymbol ?? '',
      });
    }
  }, [transferRequest.accountPaymentId]);
  const getInfoReceptor = useCallback(async () => {
    const { code, phoneNumer, email } = credential;
    if (email.toLowerCase().trim() === sesion?.email?.toLowerCase().trim() || `${code}${phoneNumer}`.trim() === sesion?.phone?.trim()) {
      ToastCall('error', '¡No puedes hacer transferencias a tu mismo usuario!', language);
      return;
    }
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale.trim() as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CUSTOMER_INFO_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CUSTOMER_INFO_METHOD")?.vale as Method
      const headers = GetHeader(tokenGateway, 'application/json');
      const req = {
        mail: email,
        phoneNumer: `${code}${phoneNumer}`,
      };
      const response: Response = await HttpService(method, host, url, req, headers, setLoader);
      if (response?.codigoRespuesta !== '00') {
        ToastCall('error', Languages[language].SCREENS.TransferScreen.message3, language);
        return;
      }
      const {
        products: { savingsAccounts },
      } = response;
      if (!savingsAccounts?.length) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
        return;
      }
      const productId: number = accounts.find(item => item.id === transferRequest.accountPaymentId)?.productId as number;
      const accountsReceptor: AccountsInterface[] = savingsAccounts?.filter(
        (account: AccountsInterface) => account?.productId === productId,
      );
      if (!accountsReceptor?.length) {
        ToastCall(
          'error',
          `${Languages[language].SCREENS.TransferScreen.message1} ${transferRequest.accountPaymentName}. ${Languages[language].SCREENS.TransferScreen.message2}`,
          language,
        );
        return;
      }
      setTransferRequest({
        ...transferRequest,
        userDestinationName: response?.name,
        userDestinationLastName: response?.lastName,
        userDestinationId: response?.userId,
        userCoreId: response?.userCoreId,
        accountDestinationId: accountsReceptor[0]?.id ?? 0,
        accountDestinationNumber: accountsReceptor[0]?.accountNo ?? '',
        accountDestinationName: accountsReceptor[0]?.productName ?? '',
      });
      navigation.push('TransferForm');
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  }, [credential, transferRequest, language]);
  useEffect(() => {
    getAccountsPayment();
  }, []);
  useEffect(() => {
    getAccountInfo();
  }, [transferRequest.accountPaymentId]);
  return (
    <>
      <Header
        route={route}
        navigation={navigation}
        title={Languages['ES'].SCREENS.TransferScreen.Header}
        showBackButtom
      />
      <ScreenContainer disabledPaddingTop>
        <View style={[styles.container, { flexGrow: 1, justifyContent: 'space-between', paddingTop: 20 }]}>
          <View style={[styles.containerWidth]}>
            <Text style={[styles.text, styles.title, { textAlign: 'center' }]}>
              {Languages['ES'].SCREENS.TransferScreen.Header}
            </Text>
            <Text style={styles.text}>{Languages['ES'].SCREENS.TransferScreen.text1}</Text>
            <Select
              styleText={{ paddingHorizontal: 20 }}
              items={accountsPayment}
              value={transferRequest?.accountPaymentId}
              setState={change}
              name={'accountPaymentId'}
            />
            <Text style={[styles.text, { textAlign: 'right', fontSize: 14 }]}>
              {transferRequest?.displaySymbol} {transferRequest?.accountPaymentBalance}
            </Text>
            <View style={[styles.containerRow, styles.containerWidth, { justifyContent: 'flex-start', marginTop: 20 }]}>
              <Button
                text={Languages[language].SCREENS.LoginScreen.titleEmail}
                styleButton={[styles.buttonRender, { marginRight: 15 }, !isEmail ? styles.buttonRenderWhite : {}]}
                white={!isEmail}
                onPress={() => {
                  setIsEmail(true);
                  setCredentials({
                    ...credential,
                    phoneNumer: '',
                    code: '',
                  });
                }}
              />
              <Button
                text={Languages[language].SCREENS.LoginScreen.titlePhone}
                styleButton={[styles.buttonRender, isEmail ? styles.buttonRenderWhite : {}]}
                white={isEmail}
                onPress={() => {
                  setIsEmail(false);
                  setCredentials({
                    ...credential,
                    email: '',
                  });
                }}
              />
            </View>
            {isEmail && (
              <View style={[styles.containerWidth]}>
                <Text style={styles.text}>{Languages[language].SCREENS.LoginScreen.titleEmail}</Text>
                <Input
                  placeholder={Languages[language].SCREENS.LoginScreen.placeholderEmail}
                  value={credential.email}
                  onChangeText={(e: string) => {
                    changeCredencial(e, 'email')
                    isCorreoHandler(e)
                  }}
                  maxLength={50}
                  keyboardType="email-address"
                />
                {!isCorreo && <Text style={{ ...styles.text, color: 'red' }}>No es un Email</Text>}
              </View>
            )}
            {!isEmail && (
              <View style={[styles.containerWidth, { marginTop: 20 }]}>
                <Text style={styles.text}>{Languages[language].SCREENS.LoginScreen.titlePhone} </Text>
                <View style={[styles.containerRow, styles.containerWidth, { justifyContent: 'space-between' }]}>
                  <View style={[styles.containerRow, { width: '25%' }]}>
                    <Input
                      placeholder={'58'}
                      maxLength={3}
                      keyboardType="phone-pad"
                      value={credential.code}
                      onChangeText={(e: string) => {
                        changeCredencial(e.replace(/[^0-9]/, ''), 'code');
                      }}
                    />
                  </View>
                  <View style={[styles.containerRow, { width: '65%' }]}>
                    <Input
                      placeholder={'1234567890'}
                      maxLength={11}
                      keyboardType="phone-pad"
                      value={credential.phoneNumer}
                      onChangeText={(e: string) => {
                        changeCredencial(e.replace(/[^0-9]/, ''), 'phoneNumer');
                      }}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <View style={[styles.containerButton]}>
            <Button
              disabled={disabled()}
              text={Languages[language].GENERAL.BUTTONS.textSubmit}
              onPress={() => {
                getInfoReceptor();
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
  buttonRender: {
    width: 'auto',
    paddingHorizontal: 20,
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
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

export default TransferScreen;
