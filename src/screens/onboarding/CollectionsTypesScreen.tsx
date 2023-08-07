import React, { useContext, useState, useEffect } from 'react';
import { ScreenContainer, Button, Select } from '../../components';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import { AuthContext, RenderContext, EndPointsInterface } from '../../contexts';
import { HttpService } from '../../services';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

interface ItemsSelect {
  label: string;
  value: number;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;

const CollectionsTypesScreen = ({ navigation, route: { params } }: Props) => {
  const { tokenCompliance, endPoints } = useContext(AuthContext);
  const { setLoader, language } = useContext(RenderContext);
  const [countries, setCountries] = useState<ItemsSelect[]>([]);
  const [documentTypes, setDocumentTypes] = useState<ItemsSelect[]>([]);
  const [collectionTypes, setCollectionTypes] = useState<[]>([]);
  const [compliance, setCompliance] = useState({
    documentTypeId: 0,
    countryId: 0,
  });
  const changeSelect = (value: number | string, key: string| number) => {
    setCompliance({
      ...compliance,
      [key]: value,
    });
  };
  const getCountries = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COMPLIANCE_BASE_API")?.vale as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COUNTRIES_COMPLIANCE_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COUNTRIES_COMPLIANCE_METHOD")?.vale as Method
      const headers = GetHeader(tokenCompliance, 'application/json');
      const response: any = await HttpService(method, host, url, null, headers, setLoader);
      if (response) {
        let allCountries: ItemsSelect[] = [];
        for (let i = 0; i < response?.length; i++) {
          allCountries.push({
            label: response[i]?.name,
            value: response[i]?.id,
          });
        }
        setCompliance({
          ...compliance,
          countryId: allCountries[0]?.value,
        });
        setCountries(allCountries);
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const getdocumentTypes = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COMPLIANCE_BASE_API")?.vale as string
      const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "DOCUMENT_TYPES_COMPLIANCE_URL")?.vale as string}${compliance?.countryId}`
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "DOCUMENT_TYPES_COMPLIANCE_METHOD")?.vale as Method
      const headers = GetHeader(tokenCompliance, 'application/json');
      const response: any = await HttpService(method, host, url, null, headers, setLoader);
      if (response) {
        let allDocuments: ItemsSelect[] = response.map((data: any) => ({
          label: data?.description,
          value: data?.id,
        }));

        setCompliance({
          ...compliance,
          documentTypeId: allDocuments[0]?.value,
        });
        setDocumentTypes(allDocuments);
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const getCollectionsTypes = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COMPLIANCE_BASE_API")?.vale as string
      const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COLLECTION_TYPES_URL")?.vale as string}${2}/${compliance?.countryId}/${compliance?.documentTypeId}`
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COLLECTION_TYPES_METHOD")?.vale as Method
      const headers = GetHeader(tokenCompliance, 'application/json');
      const response: any = await HttpService(method, host, url, null, headers, setLoader);
      if (response) {
        setCollectionTypes(response);
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  useEffect(() => {
    getCountries();
  }, []);
  useEffect(() => {
    if (compliance?.countryId) {
      getdocumentTypes();
    }
  }, [compliance?.countryId]);
  useEffect(() => {
    if (compliance?.documentTypeId) {
      getCollectionsTypes();
    }
  }, [compliance?.documentTypeId, compliance?.countryId]);
  return (
    <ScreenContainer onRefresh={getCountries}>
      <View style={styles.containerForm}>
        <Text style={styles.textTitle}>{Languages[language].SCREENS.CollectionsTypesScreen.title}</Text>
        <View style={{ width: '100%' }}>
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.CollectionsTypesScreen.text1}</Text>
          <Select
            styleText={{ paddingHorizontal: 20 }}
            items={countries}
            value={compliance?.countryId}
            setState={changeSelect}
            name={'countryId'}
          />
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.CollectionsTypesScreen.text2}</Text>
          <Select
            styleText={{ paddingHorizontal: 20 }}
            items={documentTypes}
            value={compliance?.documentTypeId}
            setState={changeSelect}
            name={'documentTypeId'}
          />
        </View>
        <View style={{ width: width * 0.5, alignItems: 'center' }}>
          <Button
            disabled={!collectionTypes?.length}
            onPress={() => navigation.replace(params?.redirect, { collectionTypes })}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  containerForm: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    minHeight: '100%',
  },
  textTitle: {
    color: Colors.blackBackground,
    fontSize: 32,
    fontFamily: "DosisMedium",
    marginHorizontal: 25,
    marginVertical: 20,
    width: "100%",
    textAlign: "center"
  },
  textSubTitle: {
    color: Colors.blackBackground,
    fontSize: 18,
    fontFamily: "DosisBold",
    width: '100%',
    textAlign: 'left',
  },
  buttonQR: {
    padding: 15,
    borderStyle: 'solid',
    borderWidth: 10,
    borderColor: Colors.blackBackground,
    borderRadius: 20,
    position: 'relative',
  },
  iconQr: {
    width: 180,
    height: 180,
  },
});
export default CollectionsTypesScreen;
