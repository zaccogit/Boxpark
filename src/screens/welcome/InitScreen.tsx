import { useEffect, useContext, useCallback } from "react";
import { Dimensions, View, StatusBar } from "react-native";
import { ScreenContainer } from "../../components";
import { Colors } from "../../utils";
import { Images, SVG } from "../../../assets";
import { HttpService } from "../../services";
import { RenderContext, AuthContext, EndPointsInterface } from "../../contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Languages from "../../utils/Languages.json";
import { StackScreenProps } from "@react-navigation/stack";
import { ToastCall } from "../../utils/GeneralMethods";
import { Image } from "expo-image";

interface Props extends StackScreenProps<any, any> {}

interface Response {
  id_token: string;
}

interface Request {
  username: string;
  password: string;
  rememberMe: boolean;
}
type Method = "get" | "post" | "put" | "delete";
const width: number = Dimensions.get("window").width;

const InitScreen = ({ navigation }: Props) => {
  const {
    tokenRU,
    setTokenRU,
    tokenGateway,
    setTokenGateway,
    tokenCompliance,
    setTokenCompliance,
    tokenPromotions,
    setTokenPromotions,
    endPoints,
  } = useContext(AuthContext);
  const { language, setLanguage } = useContext(RenderContext);

  const getRequest = useCallback(
    (username: string, password: string): Request => {
      return {
        username,
        password,
        rememberMe: true,
      };
    },
    []
  );
  const onSubmit = useCallback(async () => {
    try {
      const username: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_RU_USERNAME"
      )[0]?.vale;
      const password: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_RU_PASSWORD"
      )[0]?.vale;
      const host: string = endPoints?.filter(
        (endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API"
      )[0]?.vale;
      const url: string = endPoints?.filter(
        (endPoint: EndPointsInterface) => endPoint.name === "AUTHENTICATION_URL"
      )[0]?.vale;
      const method: Method = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "AUTHENTICATION_METHOD"
      )[0]?.vale as Method;
      const req: Request = getRequest(username, password);

      const response: Response = await HttpService(method, host, url, req);
      if (response) {
        setTokenRU(response?.id_token);
        onSubmitGateway();
      }
    } catch (err: any) {
      console.error(JSON.stringify(err), "User");
      if (err && err?.status) {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.GeneralError,
          language
        );
      } else {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.ConnectionError,
          language
        );
      }
    }
  }, [endPoints]);
  const onSubmitGateway = useCallback(async () => {
    try {
      const username: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_GATEWAY_USERNAME"
      )[0]?.vale;
      const password: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_GATEWAY_PASSWORD"
      )[0]?.vale;
      const host: string = endPoints?.filter(
        (endPoint: EndPointsInterface) => endPoint.name === "GATEWAY_BASE_API"
      )[0]?.vale;
      const url: string = endPoints?.filter(
        (endPoint: EndPointsInterface) => endPoint.name === "AUTHENTICATION_URL"
      )[0]?.vale;
      const method: Method = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "AUTHENTICATION_METHOD"
      )[0]?.vale as Method;
      const req: Request = getRequest(username, password);
      const response: Response = await HttpService(method, host, url, req);
      if (response) {
        setTokenGateway(response.id_token);
        onSubmitCompliance();
      }
    } catch (err: any) {
      console.error(err, "Gateway");
      if (err && err?.status) {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.GeneralError,
          language
        );
      } else {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.ConnectionError,
          language
        );
      }
    }
  }, [endPoints]);
  const onSubmitCompliance = useCallback(async () => {
    try {
      const username: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_COMPLIANCE_USERNAME"
      )[0]?.vale;
      const password: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_COMPLIANCE_PASSWORD"
      )[0]?.vale;
      const host: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "COMPLIANCE_BASE_API"
      )[0]?.vale;
      const url: string = endPoints?.filter(
        (endPoint: EndPointsInterface) => endPoint.name === "AUTHENTICATION_URL"
      )[0]?.vale;
      const method: Method = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "AUTHENTICATION_METHOD"
      )[0]?.vale as Method;
      const req: Request = getRequest(username, password);
      const response: Response = await HttpService(method, host, url, req);
      if (response) {
        setTokenCompliance(response.id_token);
        onSubmitPromotions();
      }
    } catch (err: any) {
      console.error(err, "compliance");
      if (err && err?.status) {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.GeneralError,
          language
        );
      } else {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.ConnectionError,
          language
        );
      }
    }
  }, [endPoints]);
  const onSubmitPromotions = useCallback(async () => {
    try {
      const username: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_PROMOTIONS_USERNAME"
      )[0]?.vale;
      const password: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_PROMOTIONS_PASSWORD"
      )[0]?.vale;
      const host: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "PROMOTIONS_BASE_API"
      )[0]?.vale;
      const url: string = endPoints?.filter(
        (endPoint: EndPointsInterface) => endPoint.name === "AUTHENTICATION_URL"
      )[0]?.vale;
      const method: Method = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "AUTHENTICATION_METHOD"
      )[0]?.vale as Method;
      const req: Request = getRequest(username, password);
      const response: Response = await HttpService(method, host, url, req);
      if (response) {
        setTokenPromotions(response.id_token);
        /* onSubmitBP(); */
      }
    } catch (err: any) {
      console.error(err, "promo");
      if (err && err?.status) {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.GeneralError,
          language
        );
      } else {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.ConnectionError,
          language
        );
      }
    }
  }, [endPoints]);
/*   const onSubmitBP = useCallback(async () => {
    try {
      const username: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_PROMOTIONS_USERNAME"
      )[0]?.vale;
      const password: string = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "APP_BASE_PROMOTIONS_PASSWORD"
      )[0]?.vale;
      const host: string = Env.HOST_BP;
      const url: string = endPoints?.filter(
        (endPoint: EndPointsInterface) => endPoint.name === "AUTHENTICATION_URL"
      )[0]?.vale;

      const method: Method = endPoints?.filter(
        (endPoint: EndPointsInterface) =>
          endPoint.name === "AUTHENTICATION_METHOD"
      )[0]?.vale as Method;
      console.log(method);
      const req: Request = getRequest(username, password);
      const response: Response = await HttpService(method, host, url, req);
      if (response) {
        setTokenBP(response.id_token);
      }
    } catch (err: any) {
      console.error(err, "BP");
      if (err && err?.status) {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.GeneralError,
          language
        );
      } else {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.ConnectionError,
          language
        );
      }
    }
  }, [endPoints]); */
  const changeLanguage = useCallback(async () => {
    try {
      const lang: any = await AsyncStorage.getItem("language");
      if (lang !== null && (lang === "EN" || lang === "ES")) {
        setLanguage(lang);
      } else {
        await AsyncStorage.setItem("language", "ES");
        setLanguage("ES");
      }
    } catch (err) {
      setLanguage("ES");
    }
  }, []);
  const redirect = useCallback(async () => {
    let firsTime: any;
    try {
      /* firsTime = await AsyncStorage.getItem("firsTime");

      if (firsTime) {
        navigation.replace("Login");
      }else{
        navigation.replace("Welcome")
      } */

      navigation.replace("Welcome")
    } catch (err) {
      if (firsTime !== "true") navigation.replace("Welcome");
    }
  }, []);
  useEffect(() => {
    changeLanguage();
  }, []);
  useEffect(() => {
    if (endPoints?.length) {
      onSubmit();
    }
  }, [endPoints.length]);

  useEffect(() => {
    if (
      tokenRU &&
      tokenGateway &&
      tokenCompliance &&
      tokenPromotions
    ) {
      redirect();
    }
  }, [tokenRU, tokenGateway, tokenCompliance, tokenPromotions]);

  return (
    <ScreenContainer
      disabledPaddingTop
      disabledPaddingBottom
      disabledStatusBar
      onRefresh={onSubmit}
    >
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={Colors.blackBackground}
      />
      <View style={{ flex: 1 }}>
      </View>
      <View className=" w-full h-full absolute justify-center items-center top-0 left-0">
        <Image source={Images.SplashLogoGif} style={{ width: 300, height: 150 }} />
      </View>
    </ScreenContainer>
  );
};

export default InitScreen;
