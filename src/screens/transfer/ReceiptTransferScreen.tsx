import React, { useEffect, useContext, useCallback, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Button, Header, Modal, InputDisabled } from '../../components';
import { Colors } from '../../utils';
import { RenderContext, TransactionsContext, TransferInterface } from '../../contexts';
import { Fonts, SVG } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

const width: number = Dimensions.get('window').width;

const initialState: TransferInterface = {
  displaySymbol: '',
  accountPaymentId: 0,
  accountPaymentBalance: 0,
  accountPaymentNumber: '',
  accountPaymentName: '',
  userCoreId: '',
  userDestinationId: '',
  userDestinationName: '',
  userDestinationLastName: '',
  accountDestinationId: 0,
  accountDestinationName: '',
  accountDestinationNumber: '',
  amount: '',
  concept: '',
  resourceId: '',
};

const ReceiptTransferScreen = ({ navigation, route }: Props) => {
  const { language } = useContext(RenderContext);
  const { transferRequest, setTransferRequest } = useContext(TransactionsContext);
  const [modal, setModal] = useState<boolean>(false);

  const completeReference = useCallback(() => {
    const { resourceId } = transferRequest;
    let newReference: string = '';
    for (let i = 0; i < 8 - resourceId?.length; i++) {
      newReference = `${newReference}0`;
    }
    setTransferRequest({
      ...transferRequest,
      resourceId: `${newReference}${resourceId}`,
    });
  }, [transferRequest]);

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
      <Header route={route} navigation={navigation} title={Languages['ES'].SCREENS.TransferScreen.Header} />
      <ScreenContainer disabledPaddingTop>
        <View style={[styles.container, { flexGrow: 1, justifyContent: 'space-between', paddingTop: 20 }]}>
          <Text style={[styles.text, styles.title]}>{Languages[language].SCREENS.ReceiptTransferScreen.title}</Text>
          <SVG.CheckAnimateSVG />
          <View style={[styles.containerWidth, { alignItems: 'center' }]}>
            <Text style={styles.text}>{Languages[language].SCREENS.ReceiptTransferScreen.text1}</Text>
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
              setTransferRequest(initialState);
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
              {Languages[language].SCREENS.ReceiptTransferScreen.text2}
            </Text>
            <InputDisabled value={transferRequest?.accountPaymentNumber} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptTransferScreen.text3}
            </Text>
            <InputDisabled value={transferRequest?.amount} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptTransferScreen.text4}
            </Text>
            <InputDisabled value={transferRequest?.userDestinationName} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptTransferScreen.text5}
            </Text>
            <InputDisabled value={transferRequest?.userDestinationLastName} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptTransferScreen.text6}
            </Text>
            <InputDisabled value={transferRequest?.accountDestinationNumber} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptTransferScreen.text7}
            </Text>
            <InputDisabled value={transferRequest?.concept} />
            <Text style={[styles.text, styles.textReference]}>
              {Languages[language].SCREENS.ReceiptTransferScreen.text8}
            </Text>
            <InputDisabled value={transferRequest?.resourceId} />
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

export default ReceiptTransferScreen;
