import React, {
  useState,
  useContext,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Input, Modal } from "..";
import {
  AuthContext,
  RenderContext,
  SesionContext,
  EndPointsInterface,
} from "../../contexts";
import { GetHeader, ToastCall } from "../../utils/GeneralMethods";
import { HttpService } from "../../services";
import { Colors } from "../../utils";
import Languages from "../../utils/Languages.json";
import { styles } from "./AuthTokenTransacctionResources";
import { Props, Method } from "./AuthTokenInterfaces";
import useTransactionsState from "../../contexts/transactions/TransactionsState";

const formatNumber = (number: number) => `0${number}`.slice(-2);

const getRemaining = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

export default function AuthTokenTransacction({
  isActive,
  setIsActive,
  onSubmit,
}: Props) {
  const {
    tokenRU,
    channelTypeId,
    setChannelTypeId,
    tokenTransaction,
    endPoints,
  } = useContext(AuthContext);
  const { setLoader, language } = useContext(RenderContext);
  const { UserCardData } = useTransactionsState();
  const { sesion } = useContext(SesionContext);
  const [timer1, setTimer1] = useState<number>(150);
  const [timer2, setTimer2] = useState<number>(20);
  const [activeTimer1, setActiveTimer1] = useState<boolean>(false);
  const [activeTimer2, setActiveTimer2] = useState<boolean>(false);
  const [tokenAuth, setTokenAuth] = useState<string>("");
  const { mins, secs } = getRemaining(timer1);
  var intervalTimer: any = null;
  var intervalTimer2: any = null;

  const sendToken = useCallback(async () => {
    try {
      const host: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API"
      )?.vale.trim() as string;
      const url: string = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_URL"
      )?.vale as string;
      const method: Method = endPoints?.find(
        (endPoint: EndPointsInterface) => endPoint.name === "SEND_TOKEN_METHOD"
      )?.vale as Method;
      const req = {
        userId: UserCardData.idUser,
        email: "",
        phoneNumber: UserCardData.phone,
        channelTypeId,
        tokenTypeId: 2,
      };
      const headers = GetHeader(tokenRU, "application/json");
      const response: any = await HttpService(
        method,
        host,
        url,
        req,
        headers,
        setLoader
      );
      if (response?.status === "ENTREGADO") {
        setTimer1(150);
        setTimer2(20);
        setActiveTimer1(true);
        setActiveTimer2(true);
      } else {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.ErrorSendToken,
          language
        );
      }
    } catch (err) {
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.GeneralError,
        language
      );
    }
  }, [sesion, channelTypeId, language, channelTypeId]);
  const validateToken = useCallback(async () => {
    setIsActive(false);
    const host: string = endPoints?.find(
      (endPoint: EndPointsInterface) => endPoint.name === "APP_BASE_API"
    )?.vale.trim() as string;
    const url: string = endPoints?.find(
      (endPoint: EndPointsInterface) => endPoint.name === "VALIDATE_TOKEN_URL"
    )?.vale as string;
    const method: Method = endPoints?.find(
      (endPoint: EndPointsInterface) =>
        endPoint.name === "VALIDATE_TOKEN_METHOD"
    )?.vale as Method;
    let req = {
      userId: UserCardData.idUser,
      email: channelTypeId,
      phoneNumber: UserCardData.phone,
      token: tokenAuth,
      channelTypeId,
    };
    const headers = GetHeader(tokenRU, "application/json");
    try {
      const response: any = await HttpService(
        method,
        host,
        url,
        req,
        headers,
        setLoader
      );
      if (response?.codigoRespuesta === "00") {
        setTimer1(150);
        setTimer2(20);
        setActiveTimer1(false);
        setActiveTimer2(false);
        onSubmit(tokenAuth);
      } else {
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.ErrorValidateToken,
          language
        );
      }
    } catch (err) {
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.GeneralError,
        language
      );
    }
  }, [sesion, channelTypeId, tokenAuth, language]);

  useLayoutEffect(() => {
    let intervalTimer: any;

    if (isActive) {
      if (activeTimer1 && timer1 > 0) {
        intervalTimer = setInterval(() => {
          setTimer1((remainingSecs) => remainingSecs - 1);
        }, 1000);
      } else if (!activeTimer1 || timer1 === 0) {
        clearInterval(intervalTimer);
      }
      return () => clearInterval(intervalTimer);
    }
  }, [activeTimer1, timer1]);

  useLayoutEffect(() => {
    let intervalTimer2: any;
    if (isActive) {
      if (activeTimer2 && timer2 > 0) {
        intervalTimer2 = setInterval(() => {
          setTimer2((remainingSecs) => remainingSecs - 1);
        }, 1000);
      } else if (!activeTimer2 || timer2 === 0) {
        clearInterval(intervalTimer2);
      }
      return () => clearInterval(intervalTimer2);
    }
  }, [activeTimer2, timer2]);

  useEffect(() => {
    isActive && sendToken();
  }, [isActive]);

  if (tokenTransaction) return null;
  return (
    <>
      <Modal
        active={isActive}
        disabledButton={!tokenAuth.length}
        onClose={() => {
          setIsActive(false);
        }}
        onSubmit={validateToken}
      >
        <Text style={[styles.text]}>
          {Languages[language].SCREENS.PreQRPaymentScreen.text10}{" "}
          {channelTypeId === 1 ? "sms" : "email"}
        </Text>
        <Input
          placeholder={
            Languages[language].SCREENS.PreQRPaymentScreen.placeholder1
          }
          maxLength={6}
          value={tokenAuth}
          onChangeText={(e: string) => {
            setTokenAuth(e.replace(/[^0-9]/g, "").trim());
          }}
          keyboardType="numeric"
          styleContainer={{ marginTop: 30 }}
        />
        <View style={styles.containerWidth}>
          <Text
            style={[
              styles.text,
              {
                color: timer1 > 10 ? Colors.green : Colors.danger,
                textAlign: "left",
              },
            ]}
          >
            {mins}:{secs}
          </Text>
        </View>
        <TouchableOpacity
          disabled={timer2 ? true : false}
          onPress={() => {
            sendToken();
          }}
        >
          <Text
            style={[
              styles.text,
              { color: timer2 > 0 ? Colors.danger : Colors.green },
            ]}
          >
            {Languages[language].GENERAL.BUTTONS.textResend}{" "}
            {channelTypeId === 1 ? "sms" : "email"}{" "}
            {timer2 > 0 ? `${formatNumber(timer2)}s` : null}
          </Text>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
