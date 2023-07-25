import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet, Image } from 'react-native';
import { ScreenContainer, Select, Button, Input } from '../../components';
import { Colors } from '../../utils';
import { Fonts, Images } from '../../../assets';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { HttpService } from '../../services';
import { AuthContext, RegisterContext, RenderContext, EndPointsInterface } from '../../contexts';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

interface SelectItems {
  value: number;
  label: string;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const DocumentScreen = ({ navigation, route }: Props) => {
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, endPoints } = useContext(AuthContext);
  const { registerReq, setRegisterReq, nacionality } = useContext(RegisterContext);
  const [documents, setDocuments] = useState<SelectItems[]>([]);
  const change = (value: string | number, key: string) => {
    setRegisterReq({
      ...registerReq,
      [key]: value,
    });
  };

  const disable = () => {
    const { documentId } = registerReq;
    return !documentId?.length;
  };
  const queryDocumentType = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
      const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "DOCUMENT_TYPE_URL")?.vale as string}${nacionality}/NATURAL`
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "DOCUMENT_TYPE_METHOD")?.vale as Method
      const headers: any = GetHeader(tokenRU, 'application/json');
      const response = await HttpService(method, host, url, {}, headers, setLoader);

      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }

      let types = response.map((data: any) => ({ label: data?.name, value: data?.id }));

      setDocuments(types);

      response[0] && change(response[0]?.id, 'documentTypeId');
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const validateDocument = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
      const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_DOCUMENT_URL")?.vale}${registerReq?.documentId}`
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_DOCUMENT_METHOD")?.vale as Method
      const headers: any = GetHeader(tokenRU, 'application/json');
      const response = await HttpService(method, host, url, {}, headers, setLoader);

      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }

      if (response?.codigoRespuesta !== '97') {
        ToastCall('warning', Languages[language].SCREENS.DocumentScreen.ERRORS.message3, language);
        return;
      }

      navigation.push('Identity');
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };

  useEffect(() => {
    queryDocumentType();
  }, []);
  useEffect(() => {
    if(!registerReq.typeCondition.length) navigation.push("Nacionality")
  },[registerReq.typeCondition])
  return (
    <ScreenContainer onRefresh={queryDocumentType}>
      <View style={styles.contentContainer}>
        <Text style={[styles.title]}>{route?.params?.message}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: width * 0.1,
          }}>
          <View style={{ width: '45%' }}>
            <Select
              items={documents}
              setState={change}
              name={'documentTypeId'}
              lengthText={12}
              styleText={{ paddingHorizontal: 0 }}
              value={registerReq.documentTypeId}
            />
          </View>
          <View style={{ width: '50%' }}>
            <Input
              placeholder={'12110977'}
              onChangeText={(e: string) => change(e.replace(/[^0-9a-zA-Z]/g, ''), 'documentId')}
              value={registerReq.documentId}
              keyboardType="numeric"
              maxLength={20}
            />
          </View>
        </View>
        <Image source={Images.documentImage} style={styles.image} />
        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              text={Languages[language].GENERAL.BUTTONS.textBack}
              white={true}
              onPress={() => {
                navigation.goBack();
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
              text={Languages[language].GENERAL.BUTTONS.textSubmit}
              onPress={() => {
                validateDocument();
              }}
              disabled={disable()}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: Colors.blackBackground,
    fontFamily: Fonts.Dosis,
    fontSize: 28,
    marginVertical: 15,
  },
  paragraph: {
    fontFamily: Fonts.DosisBold,
    fontSize: 24,
    paddingHorizontal: width * 0.1,
  },
  contentContainer: {
    width: width * 0.9,
    height: height * 0.9,
    marginHorizontal: width * 0.05,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  image: {
    width: 250,
    height: 200,
    marginHorizontal: width * 0.13,
  },
});

export default DocumentScreen;
