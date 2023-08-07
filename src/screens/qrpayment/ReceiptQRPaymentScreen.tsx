import React, { useEffect, useContext, useCallback, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Button, Header, Modal, InputDisabled } from '../../components';
import { Colors } from '../../utils';
import { RenderContext, TransactionsContext, QrPaymentInterface } from '../../contexts';
import { Fonts, SVG } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;

const initialState: QrPaymentInterface = {
  accountPaymentId: 0,
  displaySymbol: '',
  accountPaymentBalance: 0,
  accountPaymentNumber: '',
  accountPaymentName: '',
  businessName: '',
  sucursalName: '',
  userCoreId: '',
  accountBusinessId: 0,
  accountBusinessName: '',
  accountBusinessNumber: '',
  amount: '',
  concept: '',
  resourceId: '',
  businessDestinationId: '',
};

const ReceiptQRPaymentScreen = ({ navigation, route }: Props) => {
  const { language } = useContext(RenderContext);
  const { qrPaymentRequest, setQrPaymentRequest } = useContext(TransactionsContext);
  const [modal, setModal] = useState<boolean>(false);

  const completeReference = useCallback((): void => {
    const { resourceId } = qrPaymentRequest;
    let newReference: string = '';
    for (let i = 0; i < 8 - resourceId?.length; i++) {
      newReference = `${newReference}0`;
    }
    setQrPaymentRequest({
      ...qrPaymentRequest,
      resourceId: `${newReference}${resourceId}`,
    });
  }, [qrPaymentRequest]);

  useEffect(() => {
    completeReference();
  }, []);
  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      e.preventDefault();
      ToastCall('warning', Languages[language].GENERAL.ERRORS.NoBack, language);
    });
  }, [navigation]);
  return (
    <>
      <Header route={route} navigation={navigation} title={Languages['ES'].SCREENS.QrPaymentScreen.Header} />
      <ScreenContainer disabledPaddingTop>
        <View style={[styles.container, { flexGrow: 1, justifyContent: 'space-between', paddingTop: 20 }]}>
          <Text style={[styles.text, styles.title]}>{Languages[language].SCREENS.ReceiptQrPaymentScreen.title}</Text>
          <SVG.CheckAnimateSVG />
          <View style={[styles.containerWidth, { alignItems: 'center' }]}>
            <Text style={styles.text}>{Languages[language].SCREENS.ReceiptQrPaymentScreen.text1}</Text>
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
              setQrPaymentRequest(initialState);
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
            <InputDisabled value={qrPaymentRequest?.accountPaymentNumber} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptQrPaymentScreen.text3}
            </Text>
            <InputDisabled value={qrPaymentRequest?.amount} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptQrPaymentScreen.text4}
            </Text>
            <InputDisabled value={qrPaymentRequest?.businessName} />
            {!qrPaymentRequest?.sucursalName?.toLocaleLowerCase()?.includes('null') && (
              <>
                <Text style={[styles.text, styles.textReference]}>
                  {Languages[language].SCREENS.ReceiptQrPaymentScreen.text5}
                </Text>
                <InputDisabled value={qrPaymentRequest?.sucursalName} />
              </>
            )}
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptQrPaymentScreen.text6}
            </Text>
            <InputDisabled value={qrPaymentRequest?.accountBusinessNumber} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptQrPaymentScreen.text7}
            </Text>
            <InputDisabled value={qrPaymentRequest?.concept} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptQrPaymentScreen.text8}
            </Text>
            <InputDisabled value={qrPaymentRequest?.resourceId} />
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
    fontFamily: "Dosis",
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  textReference: {
    fontSize: 14,
    fontFamily: "Dosis",
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

export default ReceiptQRPaymentScreen;
