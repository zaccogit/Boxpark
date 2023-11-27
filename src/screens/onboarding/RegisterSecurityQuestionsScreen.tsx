import React, { useEffect, useState, useContext } from 'react';
import { ScreenContainer, Input, Button, Select } from '../../components';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts } from '../../../assets';
import { RenderContext, AuthContext, SesionContext, EndPointsInterface } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { HttpService } from '../../services';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';
import { Method } from '../auth/LoginScreen';

const width: number = Dimensions.get('window').width;

interface Props extends StackScreenProps<any, any> { }

interface itemsSelect {
  label: string;
  value: number;
}

const SecurityQuestionsScreen = ({ navigation }: Props) => {
  const { setLoader, language } = useContext(RenderContext);
  const { tokenRU, endPoints } = useContext(AuthContext);
  const { sesion } = useContext(SesionContext);
  const [secQuestions, setSecQuestions] = useState<itemsSelect[]>([]);
  const [secQuestions1, setSecQuestions1] = useState<itemsSelect[]>([]);
  const [secQuestions2, setSecQuestions2] = useState<itemsSelect[]>([]);
  const [secQuestions3, setSecQuestions3] = useState<itemsSelect[]>([]);
  const [sqSelected, setSQSelected] = useState({
    question1: 0,
    answer1: '',
    question2: 1,
    answer2: '',
    question3: 2,
    answer3: '',
  });
  const onSubmit = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SAVE_LIST_SQ_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SAVE_LIST_SQ_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, 'application/json');
      const req = {
        preguntaUsuarioRequests: [
          {
            id: null,
            answer_question: sqSelected?.answer1?.toLowerCase().trimEnd().trimStart(),
            userId: sesion?.id,
            question: sqSelected.question1,
          },
          {
            id: null,
            answer_question: sqSelected?.answer2?.toLowerCase().trimEnd().trimStart(),
            userId: sesion?.id,
            question: sqSelected.question2,
          },
          {
            id: null,
            answer_question: sqSelected?.answer3?.toLowerCase().trimEnd().trimStart(),
            userId: sesion?.id,
            question: sqSelected.question3,
          },
        ],
      };
      const response: any = await HttpService(method, host, url, req, headers, setLoader);
      if (response) {
        setSQSelected({
          ...sqSelected,
          question1: secQuestions[0]?.value,
          question2: secQuestions[1]?.value,
          question3: secQuestions[2]?.value,
        });
        navigation.push('Onboarding');
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
      }
    } catch (err) {
      console.log(JSON.stringify(err))
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const getSecQuestions = async () => {
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale.trim() as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GET_SQ_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "GET_SQ_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, 'application/json');
      const response: any = await HttpService(method, host, url, {}, headers, setLoader);
      if (response) {
        let dataResponse: itemsSelect[] = [];
        for (let i = 0; i < response.length; i++) {
          dataResponse.push({
            label: response[i].description,
            value: response[i].id,
          });
        }
        setSQSelected({
          ...sqSelected,
          question1: dataResponse[0].value,
          question2: dataResponse[1].value,
          question3: dataResponse[2].value,
        });
        setSecQuestions(dataResponse);
        setSecQuestions1(
          dataResponse.filter(item => item.value !== dataResponse[1].value && item.value !== dataResponse[2].value),
        );
        setSecQuestions2(
          dataResponse.filter(item => item.value !== dataResponse[0].value && item.value !== dataResponse[2].value),
        );
        setSecQuestions3(
          dataResponse.filter(item => item.value !== dataResponse[0].value && item.value !== dataResponse[1].value),
        );
      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const change = (value: string, key: string) => {
    setSQSelected({
      ...sqSelected,
      [key]: value,
    });
  };
  const changeSelect = (value: number | string, key: string| number) => {
    setSQSelected({
      ...sqSelected,
      [key]: value,
    });
  };
  const disabled = () => {
    const { answer1, answer2, answer3 } = sqSelected;
    return !(answer1.length >= 3) || !(answer2.length >= 3) || !(answer3.length >= 3);
  };
  useEffect(() => {
    getSecQuestions();
  }, []);
  useEffect(() => {
    setSecQuestions1(
      secQuestions.filter(item => item.value !== sqSelected.question2 && item.value !== sqSelected.question3),
    );
  }, [sqSelected.question2, sqSelected.question3]);
  useEffect(() => {
    setSecQuestions2(
      secQuestions.filter(item => item.value !== sqSelected.question1 && item.value !== sqSelected.question3),
    );
  }, [sqSelected.question1, sqSelected.question3]);
  useEffect(() => {
    setSecQuestions3(
      secQuestions.filter(item => item.value !== sqSelected.question1 && item.value !== sqSelected.question2),
    );
  }, [sqSelected.question1, sqSelected.question2]);
  return (
    <ScreenContainer onRefresh={getSecQuestions}>
      <View style={styles.containerForm}>
        <Text style={styles.textTitle}>{Languages[language].SCREENS.RegisterSecurityQuestionScreen.title}</Text>
        <View style={{ width: '90%' }}>
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.RegisterSecurityQuestionScreen.text1}</Text>
          <Select
            styleText={{ paddingHorizontal: 20 }}
            lengthText={30}
            items={secQuestions1}
            value={sqSelected.question1}
            setState={changeSelect}
            name={'question1'}
          />
          <Input
            placeholder={Languages[language].SCREENS.RegisterSecurityQuestionScreen.placeholder1}
            styleInput={{ paddingHorizontal: 20 }}
            value={sqSelected.answer1}
            onChangeText={(e: string) => {
              change(e, 'answer1');
            }}
            maxLength={20}
          />
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.RegisterSecurityQuestionScreen.text2}</Text>
          <Select
            styleText={{ paddingHorizontal: 20 }}
            lengthText={30}
            items={secQuestions2}
            value={sqSelected.question2}
            setState={changeSelect}
            name={'question2'}
          />
          <Input
            placeholder={Languages[language].SCREENS.RegisterSecurityQuestionScreen.placeholder2}
            styleInput={{ paddingHorizontal: 20 }}
            value={sqSelected.answer2}
            onChangeText={(e: string) => {
              change(e, 'answer2');
            }}
            maxLength={20}
          />
          <Text style={styles.textSubTitle}>{Languages[language].SCREENS.RegisterSecurityQuestionScreen.text3}</Text>
          <Select
            styleText={{ paddingHorizontal: 20 }}
            lengthText={30}
            items={secQuestions3}
            value={sqSelected.question3}
            setState={changeSelect}
            name={'question3'}
          />
          <Input
            placeholder={Languages[language].SCREENS.RegisterSecurityQuestionScreen.placeholder3}
            styleInput={{ paddingHorizontal: 20 }}
            value={sqSelected.answer3}
            onChangeText={(e: string) => {
              change(e, 'answer3');
            }}
            maxLength={20}
          />
        </View>
        <View style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
            <Button
              white
              text={Languages[language].GENERAL.BUTTONS.textBack}
              onPress={() => navigation.push('Login')}
            />
          </View>
          <View style={{ width: width * 0.3, alignItems: 'center' }}>
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
    marginHorizontal: width * 0.05,
    minHeight: '100%',
  },
  textTitle: {
    textAlign: 'center',
    color: Colors.blackBackground,
    fontSize: 32,
    fontFamily: "DosisMedium",
    marginHorizontal: 10,
    marginVertical: 22,
  },
  textSubTitle: {
    color: Colors.blackBackground,
    fontSize: 18,
    fontFamily: "DosisBold",
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

export default SecurityQuestionsScreen;
