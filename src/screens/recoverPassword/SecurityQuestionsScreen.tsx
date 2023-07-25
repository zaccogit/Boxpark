import React, { useState, useContext, useCallback, useEffect } from 'react';
import { ScreenContainer, Button, Input } from '../../components';
import { Text, View, StyleSheet, Image, Dimensions } from 'react-native';
import { Colors } from '../../utils';
import { Fonts, SVG } from '../../../assets';
import { HttpService } from '../../services';
import { AuthContext, RenderContext, EndPointsInterface, RecoverPasswordContext } from '../../contexts';
import Languages from '../../utils/Languages.json';
import { StackScreenProps } from '@react-navigation/stack';
import { GetHeader, ToastCall } from '../../utils/GeneralMethods';

interface Props extends StackScreenProps<any, any> { }

interface SecQuestion {
  id: number;
  question: string;
}
interface Answers {
  answer1: string;
  answer2: string;
}

interface ValidateAnswer {
  userId: number;
  respuestasUsuario: AnswersUser[];
  respuestasUsuarioLength: number;
}

interface AnswersUser {
  answer_question: string;
  question: number;
}

type Method = "get" | "post" | "put" | "delete"

const width: number = Dimensions.get('window').width;
const height: number = Dimensions.get('window').height;

const VerifySecQuestionsScreen = ({ navigation, route: { params } }: Props) => {
  const { tokenRU, endPoints } = useContext(AuthContext);
  const { setLoader, language } = useContext(RenderContext);
  const { setRecoverPassword, RecoverPasswordInitialState } = useContext(RecoverPasswordContext)
  const [secQuestion, setSecQuestion] = useState<SecQuestion[]>([]);
  const [sqFail, setSQFail] = useState({
    type: false,
    documentId: ""
  })
  const [answers, setAnswers] = useState<Answers>({
    answer1: '',
    answer2: '',
  });
  const change = (value: string, key: string) => {
    setAnswers({
      ...answers,
      [key]: value,
    });
  };
  const changeDocument = (value: string, key: string) => {
    setSQFail({
      ...sqFail,
      [key]: value,
    });
  };
  const getSecQuestions = async () => {
    if (params?.sesion || tokenRU) {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
      const url: string = `${endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SQ_USER_URL")?.vale as string}${params?.sesion?.id}`
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "SQ_USER_METHOD")?.vale as Method
      const headers = GetHeader(tokenRU, 'application/json');
      try {
        const response = await HttpService(method, host, url, {}, headers, setLoader);
        if (!response) {
          ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
        }
        if (!response?.length) {
          setSQFail({
            ...sqFail,
            type: true
          })
          /* ToastCall('error', "Su usuario no posee preguntas de seguridad registradas. Le invitamos a comunicarse con nuestro personal de soporte", language);
          setRecoverPassword(RecoverPasswordInitialState)
          navigation.push("Login") */
          return
        }
        let random1 = Math.floor(Math.random() * response.length);
        let random2 = Math.floor(Math.random() * response.length);
        if (random1 === random2) {
          do {
            random2 = Math.floor(Math.random() * response.length);
          } while (random1 === random2);
        }
        let data: SecQuestion[] = [];
        data.push(
          {
            question: response[random1]?.question?.description,
            id: response[random1]?.question.id,
          },
          {
            question: response[random2]?.question?.description,
            id: response[random2]?.question.id,
          },
        );
        setSecQuestion(data);
      } catch (err) {
        ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
      }
    }
  };
  const onSubmit = async () => {
    if(sqFail.type){
      const documentId = `${params?.sesion?.documentId}`
      if (sqFail.documentId === documentId) {
        navigation.push('ChangePassword', {
          sesion: params?.sesion,
          type: params?.type,
          tokenUser: params?.tokenUser,
          reReq: params?.reReq,
          sqFail: true
        });
      }else{
        ToastCall('error', Languages[language].SCREENS.SecurityQuestionsScreen.ERRORS.message4, language);
      }
      return
    }
    const { answer1, answer2 } = answers;
    try {
      const host: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API")?.vale as string
      const url: string = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_SQ_USER_URL")?.vale as string
      const method: Method = endPoints?.find((endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_SQ_USER_METHOD")?.vale as Method
      const req: ValidateAnswer = {
        userId: params?.sesion?.id,
        respuestasUsuario: [
          {
            answer_question: answer1.toLocaleLowerCase().trimEnd().trimStart(),
            question: secQuestion[0]?.id,
          },
          {
            answer_question: answer2.toLocaleLowerCase().trimEnd().trimStart(),
            question: secQuestion[1]?.id,
          },
        ],
        respuestasUsuarioLength: 2,
      };
      const headers = GetHeader(tokenRU, 'application/json');
      const response = await HttpService(method, host, url, req, headers, setLoader);
      if (response) {
        if (response?.codigoRespuesta === '00') {
          navigation.push('ChangePassword', {
            sesion: params?.sesion,
            type: params?.type,
            tokenUser: params?.tokenUser,
            reReq: params?.reReq,
            secQuestion,
            answers,
            sqFail: false
          });
        } else if (response?.codigoRespuesta === '06') {
          ToastCall('error', Languages[language].SCREENS.SecurityQuestionsScreen.ERRORS.message1, language);
          setTimeout(() => {
            navigation.push('Login');
          }, 500);
        } else if (response?.codigoRespuesta === '42') {
          ToastCall('warning', Languages[language].SCREENS.SecurityQuestionsScreen.ERRORS.message2, language);
          getSecQuestions();
        }

      } else {
        ToastCall('error', Languages[language].GENERAL.ERRORS.RequestInformationError, language);
      }
    } catch (err) {
      ToastCall('error', Languages[language].GENERAL.ERRORS.GeneralError, language);
    }
  };
  const disabled = () => {
    const { answer1, answer2 } = answers;
    const { type, documentId } = sqFail
    if (!type) {
      return !(answer1.length >= 4 && answer1.length <= 30) || !(answer2.length >= 4 && answer2.length <= 30);
    } else {
      return !documentId.length
    }
  };
  useEffect(() => {
    if (!params?.sesion || !tokenRU) {
      navigation.push('ResetPassword');
    } else {
      getSecQuestions();
    }
  }, []);
  return (
    <ScreenContainer onRefresh={getSecQuestions}>
      <View style={styles.imageContainer}>
        <SVG.ZaccoLogoDSVG width={300} height={150} />
      </View>
      <View style={styles.containerForm}>
        <Text style={styles.text}>{Languages[language].SCREENS.SecurityQuestionsScreen.title}</Text>

        {
          !sqFail.type && (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.text, { fontSize: 20 }]}>{secQuestion[0]?.question}?</Text>
              <Input
                placeholder={Languages[language].SCREENS.SecurityQuestionsScreen.placeholder1}
                onChangeText={(e: string) => change(e, 'answer1')}
                value={answers.answer1}
              />
              <Text style={[styles.text, { fontSize: 20 }]}>{secQuestion[1]?.question}?</Text>
              <Input
                placeholder={Languages[language].SCREENS.SecurityQuestionsScreen.placeholder1}
                onChangeText={(e: string) => change(e, 'answer2')}
                value={answers.answer2}
              />
            </View>
          )
        }
        {
          sqFail.type && (
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.text, { fontSize: 20 }]}>{Languages[language].SCREENS.SecurityQuestionsScreen.text1}</Text>
              <Input
                placeholder={Languages[language].SCREENS.SecurityQuestionsScreen.placeholder2}
                value={sqFail?.documentId}
                onChangeText={(e: string) => changeDocument(e.replace(/[^0-9a-zA-Z]/g, ''), 'documentId')}
                keyboardType="numeric"
                maxLength={20}
              />
            </View>
          )
        }
        <View style={{ width: width * 0.4, alignItems: 'center' }}>
          <Button
            styleText={{ fontSize: 20 }}
            disabled={disabled()}
            onPress={() => {
              onSubmit();
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    height: height * 0.2,
    alignItems: 'center',
  },
  containerForm: {
    width: width * 0.9,
    height: height * 0.7,
    paddingVertical: 30,
    marginHorizontal: width * 0.05,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text: {
    color: Colors.blackBackground,
    fontSize: 22,
    fontFamily: Fonts.DosisBold,
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
  },
});

export default VerifySecQuestionsScreen;
