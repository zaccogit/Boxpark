import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Input, Header, InputDisabled, Select, Button } from '../../components';
import { RenderContext, AccountsContext, TransactionsContext, AccountsInterface } from '../../contexts';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { Accounts } from '../../contexts/accounts/AccountsInterface';

interface ItemSelect {
  label: string;
  value: number;
}

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;

const WithdrawalFormScreen = ({ navigation, route }: Props) => {
  const { accounts } = useContext(AccountsContext);
  const { withdrawalRequest, setWithdrawalRequest } = useContext(TransactionsContext);
  const { language } = useContext(RenderContext);
  const [accountsPayment, setAccountsPayment] = useState<ItemSelect[]>([]);

  const getAccountsPayment = () => {
    let allAccounts: ItemSelect[] = accounts
      .filter(accounts => accounts.currency?.displaySymbol === 'Bs')
      .map((account: Accounts): ItemSelect => {
        const label = `${account.accountBalance} (${account.currency?.displaySymbol}) - ${account.productName} `;
        return {
          label,
          value: account.id,
        };
      });

    setWithdrawalRequest({
      ...withdrawalRequest,
      accountPaymentId: accounts[0]?.id,
      accountPaymentBalance: accounts[0]?.accountBalance,
      accountPaymentNumber: accounts[0]?.accountNo,
      amount: "",
      concept: ""
    });

    setAccountsPayment(allAccounts);
  };
  const change = (value: string | number, key: string| number) => {
    setWithdrawalRequest({
      ...withdrawalRequest,
      [key]: value,
    });
  };
  const getAccountInfo = useCallback(() => {
    const accountSelected = accounts.find(
      (account: AccountsInterface) => account.id === withdrawalRequest.accountPaymentId,
    ) as AccountsInterface;
    if (accountSelected) {
      setWithdrawalRequest({
        ...withdrawalRequest,
        accountPaymentBalance: accountSelected?.accountBalance,
        accountPaymentNumber: accountSelected?.accountNo,
        accountPaymentName: accountSelected?.productName,
        displaySymbol: accountSelected?.currency?.displaySymbol ?? '',
      });
    }
  }, [withdrawalRequest.accountPaymentId]);


  const disabled = useCallback(() => {
    const { amount, concept, accountPaymentNumber, accountPaymentName,accountPaymentBalance } = withdrawalRequest;
    return !(
      amount.length &&
      concept.length &&
      accountPaymentName.length &&
      accountPaymentNumber.length &&
      Number(amount) <= accountPaymentBalance &&
      Number(amount) >= 0
    );
  }, [withdrawalRequest]);

  useEffect(() => {
    getAccountsPayment();
  }, []);

  useEffect(() => {
    getAccountInfo();
  }, [withdrawalRequest.accountPaymentId]);

  return (
    <>
      <Header title={'Datos de Retiro'} showBackButtom navigation={navigation} route={route} />
      <ScreenContainer>
        <View style={[styles.containerWidth]}>
          <View style={{ width: "100%" }}>
            <Text style={styles.text}>{'Cuenta'}</Text>
            <Select
              items={accountsPayment}
              setState={change}
              name={'accountPaymentId'}
              value={withdrawalRequest.accountPaymentId}
            />
            <Text style={styles.text}>{'Alias'}</Text>
            <InputDisabled value={withdrawalRequest.alias} />
            <Text style={styles.text}>{'Teléfono'}</Text>
            <InputDisabled value={withdrawalRequest.phoneNumber} />
            <Text style={styles.text}>{'Cédula'}</Text>
            <InputDisabled value={withdrawalRequest.documentId} />
            <Text style={[styles.text, { fontSize: 14, fontFamily: "DosisLight" }]}>
              {Languages[language].SCREENS.QrPaymentFormScreen.text6}
            </Text>
            <Input
              maxLength={10}
              placeholder={Languages[language].SCREENS.QrPaymentFormScreen.placeholder1}
              displaySymbol={withdrawalRequest.displaySymbol}
              value={withdrawalRequest.amount}
              keyboardType={'numeric'}
              onChangeText={(e: string) => {
                change(e.replace(/[^0-9.]/g, '').trim(), 'amount');
              }}
            />
            <Text style={[
              styles.label, {
                color: (withdrawalRequest.accountPaymentBalance <= Number(withdrawalRequest.amount)) ?
                  Colors.danger :
                  Colors.transparent
              }]}>
              {Languages[language].GENERAL.ERRORS.NotEnoughAmount}
            </Text>
            <Text style={[styles.text, { fontSize: 14, fontFamily: "DosisLight" }]}>
              {Languages[language].SCREENS.QrPaymentFormScreen.text7}
            </Text>
            <Input
              multiline
              numberOfLines={2}
              maxLength={36}
              keyboardType={'default'}
              placeholder={Languages[language].SCREENS.QrPaymentFormScreen.placeholder2}
              value={withdrawalRequest.concept}
              onChangeText={(e: string) => {
                change(e, 'concept');
              }}
            />
          </View>
          <View style={[styles.containerButton]}>
            <Button
              disabled={disabled()}
              text={Languages[language].GENERAL.BUTTONS.textSubmit}
              onPress={() => {
                navigation.push('WithdrawalValidationScreen');
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
    height: '100%',
    paddingHorizontal: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  containerButton: {
    width,
    paddingHorizontal: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 5,
    color: Colors.blackBackground,
  },
});

export default WithdrawalFormScreen;
