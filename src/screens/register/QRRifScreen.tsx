import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { ScreenContainer, Button, QRScanner } from '../../components';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext, RegisterContext, RenderContext, EndPointsInterface } from '../../contexts';
import { HttpService } from '../../services';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const QRRifScreen = ({ navigation }: Props) => {
  const { tokenRU, endPoints } = useContext(AuthContext);
  const { registerReq, setRegisterReq } = useContext(RegisterContext);
  const { setLoader, language } = useContext(RenderContext);
  const [qr, setQr] = useState<boolean>(true);
  const [urlSeniat, setUrlSeniat] = useState<string | undefined>(undefined);

  const onSubmit = useCallback(async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_RIF_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_RIF_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, 'application/json');
      const req = {
        url: urlSeniat,
      };
      const response: any = await HttpService(method, host,url, req, headers, setLoader);
      if (response?.codigoRespuesta === '00') {
        const { usuarioSeniatInfo } = response;
        setRegisterReq({
          ...registerReq,
          documentId: usuarioSeniatInfo?.documentId?.substring(1, usuarioSeniatInfo?.documentId?.length - 1),
          firstName: `${usuarioSeniatInfo?.name?.split(' ')[2] ? usuarioSeniatInfo?.name?.split(' ')[2] : null} ${usuarioSeniatInfo?.name?.split(' ')[3] ? usuarioSeniatInfo?.name?.split(' ')[3] : null
            }`,
          lastName: `${usuarioSeniatInfo?.name?.split(' ')[0] ? usuarioSeniatInfo?.name?.split(' ')[0] : null} ${usuarioSeniatInfo?.name?.split(' ')[1] ? usuarioSeniatInfo?.name?.split(' ')[1] : null
            }`,
        });
        navigation.push('Document', { message: Languages[language].SCREENS.QRRifScreen.SUCCESS.message2 });
      } else if (response?.codigoRespuesta === '26') {
        navigation.push('Document', { message: Languages[language].SCREENS.QRRifScreen.ERRORS.message3 });
      } else {
        ToastCall('error', response?.mensajeRespuesta, language);
        navigation.push('Document', { message: Languages[language].SCREENS.QRRifScreen.SUCCESS.message4 });
      }
    } catch (err) {
      ToastCall('error', Languages[language].SCREENS.QRRifScreen.ERRORS.message2, language);
    }
    return;
  }, [urlSeniat]);

  useEffect(() => {
    if (urlSeniat) {
      onSubmit();
      setQr(false);
    }
  }, [urlSeniat]);
  return (
    <ScreenContainer>
      <View style={styles.containerForm}>
        <Text style={[styles.textTitle]}> {Languages[language].SCREENS.QRRifScreen.title} </Text>
        <View style={[styles.containerWidth, { alignItems: 'center', marginVertical: 20 }]}>
          <QRScanner active={qr} setActive={setQr} setState={setUrlSeniat} />
        </View>

        <SVG.ScanQrSvg />

        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              text={Languages[language].GENERAL.BUTTONS.textBack}
              white={true}
              onPress={() => {
                navigation.goBack();
                setUrlSeniat('');
                setRegisterReq({
                  ...registerReq,
                  credential: '',
                  credentialRepeat: '',
                  documentId: '',
                  email: '',
                  gender: 'M',
                  firstName: '',
                  lastName: '',
                  phone: '',
                  referenceNumber: '',
                });
              }}
            />
          </View>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              text={Languages[language].SCREENS.QRRifScreen.textSubmit}
              onPress={() => {
                navigation.push('Document', {
                  message: Languages[language].SCREENS.QRRifScreen.SUCCESS.message4,
                });
                setQr(false);
              }}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  containerForm: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    flex: 1,
  },
  containerWidth: {
    width: '100%',
  },
  textTitle: {
    fontSize: 28,
    color: Colors.blackBackground,
    fontFamily: "Dosis",
    marginHorizontal: 10,
    textAlign: 'center',
  },
  textSubTitle: {
    color: Colors.white,
    fontSize: 22,
    fontFamily: "DosisBold",
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.transparent,
    marginVertical: 0,
    elevation: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.white,
  },
  confirmButton: {
    marginBottom: 0,
    marginTop: 10,
    shadowColor: Colors.white,
  },
  buttonQR: {
    padding: 15,
    borderRadius: 20,
    position: 'relative',
  },
  iconQr: {
    width: 240,
    height: 240,
  },
});
export default QRRifScreen;
