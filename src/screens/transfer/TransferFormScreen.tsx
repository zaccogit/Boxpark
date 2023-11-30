import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Button, Header, Input, InputDisabled } from '../../components';
import { RenderContext, TransactionsContext } from '../../contexts';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;

const TransferFormScreen = ({ navigation, route }: Props) => {
  const { transferRequest, setTransferRequest } = useContext(TransactionsContext);
  const { language } = useContext(RenderContext);

  const change = useCallback(
    (value: string | number, key: string) => {
      setTransferRequest({
        ...transferRequest,
        [key]: value,
      });
    },
    [transferRequest],
  );

  const disabled = useCallback(() => {
    const { amount, concept, userDestinationName, accountDestinationName, accountDestinationNumber, accountPaymentBalance } = transferRequest;
    return !(
      amount.length &&
      concept.length &&
      userDestinationName.length &&
      accountDestinationName.length &&
      accountDestinationNumber.length &&
      accountPaymentBalance >= Number(amount.replace(",",".")) &&
      Number(amount .replace(",",".")) >= 0
    );
  }, [transferRequest]);

  useEffect(() => {
    setTransferRequest({
      ...transferRequest,
      amount: '',
      concept: '',
    });
  }, []);


  return (
    <>
      <Header
        route={route}
        navigation={navigation}
        title={Languages[language].SCREENS.TransferFormScreen.Header}
        showBackButtom
      />
      <ScreenContainer disabledPaddingTop>
        <View style={[styles.container, { flexGrow: 1, justifyContent: 'space-between', paddingTop: 20 }]}>
          <View style={[styles.containerWidth]}>
            <Text style={[styles.text, styles.title]}>{Languages[language].SCREENS.TransferFormScreen.text1}</Text>
            <Text style={styles.text}>{Languages[language].SCREENS.TransferFormScreen.text2}</Text>
            <InputDisabled value={transferRequest?.userDestinationName} />
            <Text style={styles.text}>{Languages[language].SCREENS.TransferFormScreen.text3}</Text>
            <InputDisabled value={transferRequest?.userDestinationLastName} />
            <Text style={styles.text}>{Languages[language].SCREENS.TransferFormScreen.text4}</Text>
            <InputDisabled
              value={`${transferRequest?.accountPaymentBalance} ${transferRequest?.displaySymbol} - ${transferRequest?.accountDestinationName}`}
            />
            <Text style={styles.text}>{Languages[language].SCREENS.TransferFormScreen.text5}</Text>
            <InputDisabled value={transferRequest?.accountDestinationNumber} />
            <Text style={[styles.text, { fontSize: 14, fontFamily: "DosisLight" }]}>
              {Languages[language].SCREENS.TransferFormScreen.text6}
            </Text>
            <Input
              maxLength={10}
              placeholder={Languages[language].SCREENS.TransferFormScreen.placeholder1}
              displaySymbol={transferRequest?.displaySymbol}
              value={transferRequest?.amount}
              onChangeText={(e: string) => {
                change(e.replace(/[^0-9,]/g, ''), 'amount')
              }}
              keyboardType="numeric"
            />
            <Text style={[
              styles.label, {
                color: (transferRequest.accountPaymentBalance <= Number(transferRequest.amount)) ?
                  Colors.danger :
                  Colors.transparent
              }]}>
              {Languages[language].GENERAL.ERRORS.NotEnoughAmount}
            </Text>
            <Text style={[styles.text, { fontSize: 14, fontFamily: "DosisLight" }]}>
              {Languages[language].SCREENS.TransferFormScreen.text7}
            </Text>
            <Input
              multiline
              numberOfLines={2}
              maxLength={36}
              placeholder={Languages[language].SCREENS.TransferFormScreen.placeholder2}
              value={transferRequest?.concept}
              onChangeText={(e: string) => {
                change(e, 'concept');
              }}
            />
          </View>
          <Button
            disabled={disabled()}
            text={Languages[language].GENERAL.BUTTONS.textSubmit}
            onPress={() => navigation.push('PreTransfer')}
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
  label: {
    fontWeight: 'bold',
    fontSize: 11,
    marginBottom: 5,
    color: Colors.blackBackground,
  },
});

export default TransferFormScreen;
