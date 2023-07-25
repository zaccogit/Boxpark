import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Button, Header, Modal, InputDisabled } from '../../components';
import { Colors } from '../../utils';
import { RenderContext, TransactionsContext } from '../../contexts';
import { Fonts, SVG } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { WithdrawalResponse } from '../../interfaces/BankAccountWithdrawal';
import { ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;

const WithdrawalSuccess = ({ navigation, route }: Props) => {
  const { language } = useContext(RenderContext);
  const [modal, setModal] = useState<boolean>(false);
  const { setWithdrawalRequest } = useContext(TransactionsContext);
  const [response, setResponse] = useState<WithdrawalResponse>({
    amount: '',
    beginningDate: new Date(),
    codigoRespuesta: '',
    concept: '',
    coreProductId: '',
    mensajeRespuesta: '',
    transactionState: '',
  });

  useEffect(() => {
    let data = route.params?.response;
    var hola = data.concept.split('');
    for (let i = 0; i < 12 - hola.length; i++) {
      hola.unshift('0');
    }
    hola.join('');

    data.concept = hola;

    setResponse(data);
  }, []);

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      ToastCall('warning', Languages[language].GENERAL.ERRORS.NoBack, language);
    });
  }, [navigation]);

  return (
    <>
      <Header title={'Retiro de Cuentas'} navigation={navigation} route={route} />
      <ScreenContainer disabledPaddingTop>
        <View style={[styles.container, { flexGrow: 1, justifyContent: 'space-between', paddingTop: 20 }]}>
          <Text style={[styles.text, styles.title]}>{Languages[language].SCREENS.ReceiptQrPaymentScreen.title}</Text>
          <SVG.CheckAnimateSVG />
          <View style={[styles.containerWidth, { alignItems: 'center' }]}>
            <Text style={styles.text}>{'Su retiro ha sido efectuado con éxito'}</Text>
            <View style={{ width: '50%' }}>
              <Button
                text={'Ver detalle'}
                styleButton={styles.buttonRenderWhite}
                styleText={{ fontSize: 18 }}
                white
                onPress={() => {
                  setModal(true);
                }}
              />
            </View>
          </View>
          <Button
            text={Languages[language].GENERAL.BUTTONS.textSubmit}
            onPress={() => {
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
              navigation.push('Dashboard');
            }}
          />
        </View>
        <Modal
          active={modal}
          onClose={() => {
            setModal(false);
          }}
          onSubmit={() => {
            setModal(false);
          }}>
          <View style={styles.containerWidth}>
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptQrPaymentScreen.text2}
            </Text>
            <InputDisabled value={response.coreProductId} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptQrPaymentScreen.text3}
            </Text>
            <InputDisabled value={response.amount} />
            <Text style={[styles.text, styles.textReference]}>{'Codigo'}</Text>
            <InputDisabled value={response.concept} />
          </View>
        </Modal>
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
    height: 30,
    backgroundColor: Colors.gray,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'solid',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 8,
    width: '100%',
  },
  text: {
    color: Colors.black,
    fontFamily: Fonts.Dosis,
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  textReference: {
    fontSize: 14,
    fontFamily: Fonts.Dosis,
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
  buttonRenderWhite: {
    borderColor: Colors.transparent,
    shadowColor: Colors.transparent,
  },
});

export default WithdrawalSuccess;
