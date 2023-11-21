import React, { useState, useEffect, useContext } from 'react';
import { ScreenContainer, Input, Button, Select } from '../../components';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import { HttpService } from '../../services';
import { AuthContext, RenderContext, SesionContext, EndPointsInterface } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { Sesion } from '../../contexts/sesion/SesionInterface';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

const width: number = Dimensions.get('window').width;

interface Props extends StackScreenProps<any, any> { }
interface Selects {
  label: string;
  value: number;
  latitude: number | null | undefined;
  longitude: number | null | undefined;
}

interface AddressReq {
  id: number | null;
  streetAddress: string;
  postalCode: string;
  city: City;
}

interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

type Method = "get" | "post" | "put" | "delete"

const AddressScreen = ({ navigation }: Props) => {
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, endPoints } = useContext(AuthContext);
  const { sesion, setSesion } = useContext(SesionContext);
  const [countries, setCountries] = useState<Selects[]>([]);
  const [states, setStates] = useState<Selects[]>([]);
  const [cities, setCities] = useState<Selects[]>([]);
  const [direcction, setDirecction] = useState({
    country: 0,
    state: 0,
    city: 0,
    latitude: 0,
    longitude: 0,
    name: '',
    streetAddress: '',
    postalCode: '',
  });
  const getCountries = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COUNTRIES_RU_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "COUNTRIES_RU_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, 'application/json');
      const response: any = await HttpService(method, host, url, null, headers, setLoader);
      if (response) {
        let allCountries: Selects[] = [];
        for (let i = 0; i < response?.length; i++) {
          allCountries.push({
            label: response[i]?.name,
            value: response[i]?.id,
            latitude: response[i]?.latitude,
            longitude: response[i]?.longitude,
          });
        }
        setCountries(allCountries);
        setDirecction({
          ...direcction,
          country: allCountries[0]?.value,
        });
      } else {
        ToastCall('error', Languages[language].SCREENS.AddressScreen.ERRORS.message1, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const getStates = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
      const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "STATES_RU_URL")?.vale as string}${direcction.country}`
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "STATES_RU_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, 'application/json');
      const response: any = await HttpService(method, host, url, null, headers, setLoader);

      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }

      let allStates: Selects[] = response.map((data: any) => ({
        label: data?.name,
        value: data?.id,
        latitude: data?.latitude,
        longitude: data?.longitude,
      }));
      setStates(allStates);
      setDirecction({
        ...direcction,
        state: allStates[0]?.value,
      });
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const getCities = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
      const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CITIES_RU_URL")?.vale as string}${direcction.state}`
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "CITIES_RU_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, 'application/json');
      const response: any = await HttpService(method, host, url, null, headers, setLoader);

      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }

      let allCities: Selects[] = response.map((data: any) => ({
        label: data?.name,
        value: data?.id,
        latitude: data?.latitude,
        longitude: data?.longitude,
      }));
      setCities(allCities);
      setDirecction({
        ...direcction,
        city: allCities[0]?.value,
        name: allCities[0]?.label,
        latitude: response[0]?.latitude,
        longitude: response[0]?.longitude,
      });
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const onSubmit = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
      let url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SAVE_ADDRESS_URL")?.vale as string
      let method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SAVE_ADDRESS_METHOD")?.vale as Method
      const req: AddressReq = {
        id: null,
        postalCode: direcction.postalCode,
        streetAddress: direcction.streetAddress,
        city: {
          id: direcction.city,
          latitude: direcction.latitude,
          longitude: direcction.longitude,
          name: direcction.name,
        },
      };

      const headers = GetHeader(tokenRU, 'application/json');
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      if (!response) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }

      url = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "EDIT_USER_URL")?.vale as string}${sesion?.id}`
      method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_DOCUMENT_METHOD")?.vale as Method;
      let responseUser: any = await HttpService(method, host, url, req, headers, setLoader);

      if (!responseUser) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
        return;
      }
      responseUser.addressId = response?.id;
      
      method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "EDIT_USER_METHOD")?.vale as Method;
      const responseReq: any = await HttpService(method, host, url, responseUser, headers, setLoader);

      if (responseReq?.addressId) {
        const sesion2 = sesion as Sesion;
        setSesion({ ...sesion2, addressId: response?.id });
        navigation.replace('PersonalInfo');
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestError, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const changeSelect = (value: string | number, key: string | number) => {
    setDirecction({
      ...direcction,
      [key]: value,
    });
  };
  const change = (value: string, key: string) => {
    setDirecction({
      ...direcction,
      [key]: value,
    });
  };
  const disabled = () => {
    const { streetAddress, postalCode } = direcction;
    return !streetAddress.length || !(postalCode.length >= 4);
  };
  useEffect(() => {
    getCountries();
  }, []);
  useEffect(() => {
    if (direcction?.country) {
      getStates();
    }
  }, [direcction?.country]);
  useEffect(() => {
    if (direcction?.state) {
      getCities();
    }
  }, [direcction?.state]);

  return (
    <ScreenContainer onRefresh={getCountries}>
      <View style={styles.containerForm}>
        <Text style={styles.textTitle}>{Languages[language].SCREENS.AddressScreen.title}</Text>
        <View style={{ width: '90%' }}>
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.AddressScreen.text1}</Text>
          <Select
            items={countries}
            styleText={{ paddingHorizontal: 20 }}
            lengthText={30}
            value={direcction.country}
            setState={changeSelect}
            name={'country'}
          />
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.AddressScreen.text2}</Text>
          <Select items={states} lengthText={30} value={direcction.state} setState={changeSelect} name={'state'} />
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.AddressScreen.text3}</Text>
          <Select items={cities} lengthText={30} value={direcction.city} setState={changeSelect} name={'city'} />
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.AddressScreen.text5}</Text>
          <Input
            placeholder={Languages[language].SCREENS.AddressScreen.placeholder2}
            value={direcction.postalCode}
            onChangeText={(e: string) => {
              change(e, 'postalCode');
            }}
            keyboardType="numeric"
            maxLength={8}
          />
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.AddressScreen.text4}</Text>
          <Input
            value={direcction.streetAddress}
            placeholder={Languages[language].SCREENS.AddressScreen.placeholder1}
            onChangeText={(e: string) => {
              change(e, 'streetAddress');
            }}
            maxLength={100}
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: width * 0.5, alignItems: 'center' }}>
            <Button onPress={() => onSubmit()} disabled={disabled()} />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  containerForm: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: '100%',
  },
  textTitle: {
    color: Colors.blackBackground,
    fontSize: 32,
    fontFamily: "DosisMedium",
    marginHorizontal: 25,
    marginVertical: 20,
  },
  textSubTitle: {
    color: Colors.blackBackground,
    fontSize: 18,
    fontFamily: "DosisBold",
  },
});

export default AddressScreen;
