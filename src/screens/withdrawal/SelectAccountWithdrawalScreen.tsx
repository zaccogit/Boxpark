import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Header, CardLayout } from '../../components';
import { AuthContext, RenderContext, SesionContext, TransactionsContext, EndPointsInterface } from '../../contexts';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { BankAccounWithdrawal } from '../../interfaces/BankAccountWithdrawal';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const SelectAccountWithdrawalScreen = ({ navigation, route }: Props) => {
  const { tokenTransaction, endPoints } = useContext(AuthContext);
  const { sesion } = useContext(SesionContext);
  const { withdrawalRequest, setWithdrawalRequest } = useContext(TransactionsContext);
  const { setLoader, language } = useContext(RenderContext);
  const [BankWithdrawal, setBankWithdrawal] = useState<BankAccounWithdrawal[]>([]);

  const getBanks = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API")?.vale.trim() as string
      const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GET_ACCOUNTS_NUMBER_URL")?.vale as string}?userSourceId.equals=${sesion?.userCoreId}&accountTypeId.equals=P2P&size=100`
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GET_ACCOUNTS_NUMBER_METHOD")?.vale as Method
      const headers = GetHeader(tokenTransaction, 'application/json');
      const response: BankAccounWithdrawal[] = await HttpService(method, host, url, {}, headers, setLoader);
      setWithdrawalRequest({
        ...withdrawalRequest,
        userCoreId: sesion?.userCoreId,
        documentId: sesion?.documentId as string,
      });

      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
        return;
      }
      setBankWithdrawal(response);
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };

  const selectBankAccount = (bankWithdrawal: BankAccounWithdrawal) => {
    const data = bankWithdrawal.accountNumber.split('-');
    const alias = data[2];
    const documentId = data[1];
    const phoneNumber = data[0].split('').splice(2).join('');

    setWithdrawalRequest({
      ...withdrawalRequest,
      alias,
      documentId,
      phoneNumber,
      accountBankId: bankWithdrawal.id,
    });

    navigation.push('WithdrawalForm', { bankWithdrawal });
  };

  useEffect(() => {
    getBanks();
    setWithdrawalRequest({
      accountPaymentBalance: 0,
      accountPaymentNumber: '',
      accountPaymentName: '',
      accountPaymentId: 0,
      accountBankId: '',
      userCoreId: 0,
      documentId: '',
      alias: '',
      concept: '',
      amount: '',
      displaySymbol: '',
      phoneNumber: '',
    });
  }, []);

  return (
    <>
      <Header title={'Elegir Cuenta Retiro'} showBackButtom navigation={navigation} route={route} />
      <ScreenContainer disabledPaddingTop onRefresh={getBanks}>
        <View style={[styles.containerTransactions, styles.containerCenter]}>
          {BankWithdrawal?.map((bankWithdrawal: BankAccounWithdrawal, index: number) => {
            const data = bankWithdrawal.accountNumber.split('-');
            const alias = data[2];
            const phoneNumber = data[0].split('').splice(2).join('');

            return (
              <CardLayout
                photo={{ uri: bankWithdrawal.bank.imgsrc?.trim() }}
                key={bankWithdrawal.id}
                onPress={() => selectBankAccount(bankWithdrawal)}>
                <Text style={[styles.text]}>{alias}</Text>
                <Text style={styles.buttonRenderWhite}>{phoneNumber}</Text>
              </CardLayout>
            );
          })}
          <CardLayout
            photo={''}
            svgComponent={<SVG.PlusIconCircle />}
            key={123}
            onPress={() => navigation.push('SelectBank')}>
            <Text style={[styles.text]}>Crear Nueva Cuenta Retiro</Text>
            <Text style={styles.buttonRenderWhite}>Crear nueva cuenta para retiros</Text>
          </CardLayout>
        </View>
      </ScreenContainer>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: "DosisMedium",
  },
  containerTransactions: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
  },
  containerCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: width * 0.05,
    position: 'relative',
    minHeight: width * 0.7,
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
    fontFamily: "DosisBold",
    textAlign: 'center',
  },
  logo: {
    height: width * 0.3,
    width: width * 0.6,
    marginHorizontal: width * 0.2,
  },
  textTitle: {
    fontSize: 26,
    fontFamily: "DosisBold",
    color: Colors.blackBackground,
    textAlign: 'center',
    marginVertical: 10,
  },
  textSubTitle: {
    fontSize: 20,
    fontFamily: "DosisBold",
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
    fontFamily: "DosisBold",
    fontSize: 18,
  },
  textReSend: {
    color: Colors.green,
    fontFamily: "DosisBold",
    fontSize: 20,
  },
  containerCheck: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  text: {
    color: Colors.black,
    fontFamily: "Dosis",
    fontSize: 20,
    textAlign: 'left',
  },
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
    width: 'auto',
    fontFamily: "Dosis",
  },
});

export default SelectAccountWithdrawalScreen;
