import React, { useState, useContext } from 'react';
import { ScreenContainer, Input, Button, Select } from '../../components';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import { HttpService } from '../../services';
import { AuthContext, RenderContext, SesionContext, EndPointsInterface } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { ToastCall, GetHeader } from '../../utils/GeneralMethods';

const width: number = Dimensions.get('window').width;

interface Props extends StackScreenProps<any, any> { }

interface Selects {
  label: string;
  value: string;
}

type Method = "get" | "post" | "put" | "delete"

const maxDate = () => {
  const date = new Date();
  const dateOld = new Date(date.setFullYear(date.getFullYear() - 18));
  return dateOld;
};

const PersonalInfoScreen = ({ navigation }: Props) => {
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, endPoints } = useContext(AuthContext);
  const { sesion } = useContext(SesionContext);
  const [datePicker, setDatePicker] = useState<boolean>(false);
  const [date, setDate] = useState(maxDate());
  const [personalInfo, setPersonalInfo] = useState({
    civilStatus: 'SOLTERO',
    placeBirth: '',
  });
  const civilStatus: Selects[] = [
    {
      label: Languages[language].SCREENS.PersonalInfoScreen.civilStatus1,
      value: 'SOLTERO',
    },
    {
      label: Languages[language].SCREENS.PersonalInfoScreen.civilStatus2,
      value: 'CASADO',
    },
    {
      label: Languages[language].SCREENS.PersonalInfoScreen.civilStatus3,
      value: 'VIUDO',
    },
    {
      label: Languages[language].SCREENS.PersonalInfoScreen.civilStatus4,
      value: 'DIVORCIADO',
    },
  ];
  const change = (value: string | number, key: string | number) => {
    setPersonalInfo({
      ...personalInfo,
      [key]: value,
    });
  };
  const disabled = () => {
    const { placeBirth } = personalInfo;
    return !placeBirth.length;
  };
  const onSubmit = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
      const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "EDIT_USER_URL")?.vale as string}${sesion?.id}`;
      let method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_DOCUMENT_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, "application/json")

      let responseUser: any = await HttpService(method, host, url, {}, headers, setLoader);
      if (!responseUser) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
      }

      responseUser.birthDate = date;
      responseUser.birthplace = personalInfo.placeBirth;
      responseUser.civil_status = personalInfo.civilStatus;

      method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "EDIT_USER_METHOD")?.vale as Method
      const responseReq: any = await HttpService(method, host, url, responseUser, headers, setLoader);
      if (responseReq?.birthDate) {
        navigation.replace('CollectionsTypes', { redirect: 'DNI' });
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  return (
    <ScreenContainer>
      <View style={styles.containerForm}>
        <Text style={styles.textTitle}>{Languages[language].SCREENS.PersonalInfoScreen.title}</Text>
        <View>
          <View>
            <Text style={styles.textSubTitle}>{Languages[language].SCREENS.PersonalInfoScreen.text1}</Text>
            <Select
              styleText={{ paddingHorizontal: 20 }}
              lengthText={30}
              items={civilStatus}
              value={personalInfo.civilStatus}
              setState={change}
              name={'civilStatus'}
            />
          </View>

          <View style={{ width: width * 0.9 }}>
            <Text style={styles.textSubTitle}>{Languages[language].SCREENS.PersonalInfoScreen.text2}</Text>
            <Button
              onPress={() => {
                setDatePicker(true);
              }}
              text={date.toLocaleDateString(language + '-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })}
              styleButton={{
                backgroundColor: Colors.gray,
                justifyContent: 'flex-start',
                paddingLeft: 8,
                borderColor: Colors.gray,
                shadowColor: '#FFF',
              }}
              styleText={{
                color: Colors.blackBackground,
                textAlign: 'left',
                fontFamily: "Dosis",
              }}
            />
          </View>
          <View>
            <Text style={styles.textSubTitle}>{Languages[language].SCREENS.PersonalInfoScreen.text3}</Text>
            <Input
              value={personalInfo.placeBirth}
              onChangeText={(e: string) => {
                change(e, 'placeBirth');
              }}
              maxLength={250}
            />
          </View>
        </View>
        <View style={{ width: width * 0.5, alignItems: 'center' }}>
          <Button disabled={disabled()} onPress={() => onSubmit()} />
        </View>
      </View>

      {
        datePicker &&
        <DateTimePicker
          value={date}
          mode="date"
          locale={language.toLocaleLowerCase() + "-" + language}
          maximumDate={maxDate()}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            setDatePicker(false);
            if (date)
              setDate(date);
          }}
        />

      }

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
  },
  textSubTitle: {
    color: Colors.blackBackground,
    fontSize: 18,
    fontFamily: "DosisBold",
    width: '100%',
    textAlign: 'left',
  },
  buttonDate: {
    width: '100%',
    height: 40,
    borderStyle: 'solid',
    borderColor: Colors.blackBackground,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  textDate: {
    color: Colors.blackBackground,
    fontFamily: "DosisBold",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: Colors.transparent,
    marginBottom: 0,
    marginTop: 10,
    elevation: 0,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: Colors.blackBackground,
    shadowColor: Colors.blackBackground,
  },
  confirmButton: {
    marginBottom: 0,
    marginTop: 10,
    shadowColor: Colors.blackBackground,
  },
});

export default PersonalInfoScreen;
