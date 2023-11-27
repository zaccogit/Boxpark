import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Button, Header, Input, InputDisabled } from '../../components';
import { RenderContext, TransactionsContext } from '../../contexts';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { initialStateQRPayment } from '../../contexts/transactions/TransactionsState';

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;

const QrPaymentFormScreen = ({ navigation, route }: Props) => {
  const { qrPaymentRequest, setQrPaymentRequest} = useContext(TransactionsContext);
  const { language } = useContext(RenderContext);

  const change = useCallback(
    (value: string | number, key: string) => {
      setQrPaymentRequest({
        ...qrPaymentRequest,
        [key]: value,
      });
    },
    [qrPaymentRequest],
  );

  const disabled = useCallback(() => {
    const { amount, concept, businessName, sucursalName, accountBusinessName, accountBusinessNumber, accountPaymentBalance } = qrPaymentRequest;
    return !(
      amount.length &&
      concept.length &&
      businessName.length &&
      sucursalName.length &&
      accountBusinessName.length &&
      accountBusinessNumber.length &&
      accountPaymentBalance <= Number(amount)  &&
      Number(amount) >= 0
    );
  }, [qrPaymentRequest]);
  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      setQrPaymentRequest(initialStateQRPayment)
    });
  }, [navigation]);
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
            <Text style={[styles.text, styles.title]}>{Languages[language].SCREENS.QrPaymentFormScreen.text1}</Text>
            <Text style={styles.text}>{Languages[language].SCREENS.QrPaymentFormScreen.text2}</Text>
            <InputDisabled value={qrPaymentRequest?.businessName} />
            {!qrPaymentRequest?.sucursalName?.toLocaleLowerCase()?.includes('null') && (
              <>
                <Text style={styles.text}>{Languages[language].SCREENS.QrPaymentFormScreen.text3}</Text>
                <InputDisabled value={qrPaymentRequest?.sucursalName} />
              </>
            )}
            <Text style={styles.text}>{Languages[language].SCREENS.QrPaymentFormScreen.text4}</Text>
            <InputDisabled value={qrPaymentRequest?.accountBusinessName} />
            <Text style={styles.text}>{Languages[language].SCREENS.QrPaymentFormScreen.text5}</Text>
            <InputDisabled value={qrPaymentRequest?.accountBusinessNumber} />
            <Text style={[styles.text, { fontSize: 14, fontFamily: "DosisLight" }]}>
              {Languages[language].SCREENS.QrPaymentFormScreen.text6}
            </Text>
            <Input
              maxLength={10}
              placeholder={Languages[language].SCREENS.QrPaymentFormScreen.placeholder1}
              displaySymbol={qrPaymentRequest?.displaySymbol}
              value={qrPaymentRequest?.amount}
              onChangeText={(e: string) => {
                change(e.replace(/[^0-9.]/g, ''), 'amount')
              }}
              keyboardType="numeric"
            />
            <Text style={[
              styles.label, {
                color: (qrPaymentRequest.accountPaymentBalance <= Number(qrPaymentRequest.amount)) ?
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
              placeholder={Languages[language].SCREENS.QrPaymentFormScreen.placeholder2}
              value={qrPaymentRequest?.concept}
              onChangeText={(e: string) => {
                change(e.replace(/[^a-z.,A-Z ]/g, ''), 'concept');
              }}
            />
          </View>
          <Button
            disabled={disabled()}
            text={Languages['ES'].GENERAL.BUTTONS.textSubmit}
            onPress={() => navigation.push('PreQrPayment')}
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

export default QrPaymentFormScreen;
