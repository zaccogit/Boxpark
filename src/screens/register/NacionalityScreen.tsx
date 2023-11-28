import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ScreenContainer, Select, Button } from '../../components';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import { StackScreenProps } from '@react-navigation/stack';
import Languages from '../../utils/Languages.json';
import { AuthContext, RegisterContext, RenderContext, EndPointsInterface } from '../../contexts';
import { HttpService } from '../../services';
import { ToastCall, GetHeader } from '../../utils/GeneralMethods';
import * as Location from 'expo-location';

interface Props extends StackScreenProps<any, any> { }
interface SelectItems {
  value: number;
  label: string;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const NacionalityScreen = ({ navigation }: Props) => {
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, endPoints, DataCoordenadas } = useContext(AuthContext);
  const { registerReq, setRegisterReq, nacionality, setNacionality } = useContext(RegisterContext);
  const [countries, setCountries] = useState<SelectItems[]>([]);
  const [venezuelaId, setVenezuelaId] = useState<number>(0);

  const changeNacionality = (value: string | number, key: string | number) => {
    setNacionality(value);
  };
  const location = useCallback(
    async (nacionality: number) => {

      setRegisterReq({
        ...registerReq,
        positionY: DataCoordenadas?.coords?.latitude?.toString(),
        positionX: DataCoordenadas?.coords?.longitude?.toString(),
      });

      setNacionality(nacionality);
    },
    [],
  );

  const query = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COUNTRIES_RU_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COUNTRIES_RU_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, "application/json")
      const req = {};
      const response = await HttpService(method, host, url, req, headers, setLoader);
      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
        return;
      }
      let allCountries: SelectItems[] = [];
      for (let i = 0; i < response.length; i++) {
        allCountries.push({
          label: response[i].name,
          value: response[i].id,
        });
        if (response[i].name === 'VENEZUELA') {
          setVenezuelaId(response[i].id);
        }
      }
      setCountries(allCountries);
      location(allCountries[0]?.value);
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const redirect = () => {
    navigation.push('Document', {
      message: 'Ingrese su documento de identidad',
    });
    setRegisterReq({
      ...registerReq,
      typeCondition: nacionality === venezuelaId ? 'V' : 'E'
    })
  }
  useEffect(() => {
    query();
  }, []);
  return (
    <ScreenContainer onRefresh={query}>
      <View style={styles.contentContainer}>
        <Text style={[styles.title]}> {Languages[language].SCREENS.NationalityScreen.title} </Text>
        <View style={{ marginHorizontal: width * 0.1, marginVertical: width * 0.1 }}>
          <Select items={countries} setState={changeNacionality} name={'nacionality'} value={nacionality} />
        </View>
        <View style={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
          <SVG.MapNationalitySVG />
        </View>
        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              text={Languages[language].SCREENS.NationalityScreen.textBack}
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
              onPress={() => {
                redirect()
              }}
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
    fontFamily: "Dosis",
    fontSize: 28,
    marginVertical: 15,
    color: Colors.blackBackground,
  },
  contentContainer: {
    width: width * 0.9,
    marginHorizontal: width * 0.05,
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  select: {
    marginTop: width * 0.2,
    borderColor: Colors.black,
  },
  image: {
    marginTop: width * 0.2,
    padding: 0,
    margin: 'auto',
  },
});

export default NacionalityScreen;
