import React, {
  useState,
  useContext,
  useCallback,
  useLayoutEffect,
  useEffect,
} from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
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
import { Fonts } from "../../../assets";
import { styles } from "./AsyncVitualPosModalResources";
import { Props, Method } from "./AsyncVitualPosModalInterfaces";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Env from "../../../enviroments.json";
import { brand, modelName } from "expo-device";
import { getIosIdForVendorAsync, androidId } from "expo-application";

const formatNumber = (number: number) => `0${number}`.slice(-2);

const getRemaining = (time: number) => {
  const mins = Math.floor(time / 60);
  const secs = time - mins * 60;
  return { mins: formatNumber(mins), secs: formatNumber(secs) };
};

export default function AsyncVitualPosModal({
  isActive,
  setIsActive,
  onSubmit,
}: Props) {
  const {
    tokenBP,
    channelTypeId,
    setChannelTypeId,
    tokenTransaction,
    virtualPosId,
  } = useContext(AuthContext);
  const { setLoader, language } = useContext(RenderContext);
  const { sesion } = useContext(SesionContext);
  const [timer1, setTimer1] = useState<number>(150);
  const [timer2, setTimer2] = useState<number>(20);
  const [activeTimer1, setActiveTimer1] = useState<boolean>(false);
  const [activeTimer2, setActiveTimer2] = useState<boolean>(false);
  const [tokenAuth, setTokenAuth] = useState<string>("");
  const { mins, secs } = getRemaining(timer1);

  const sendToken = useCallback(async () => {
    try {
      const host: string = Env.HOST_BP;
      const method = "get";
      const headers = GetHeader(tokenBP, "application/json");
      const url = `/api/virtual-pos/sendTokenVirtualPos/${virtualPosId}/${channelTypeId}`;
      const response: any = await HttpService(
        method,
        host,
        url,
        {},
        headers,
        setLoader
      );
      if (response?.codigoRespuesta === "00") {
        setTimer1(150);
        setTimer2(20);
        setActiveTimer1(true);
        setActiveTimer2(true);
      } else {
        console.log(response);
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.ErrorSendToken,
          language
        );
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.GeneralError,
        language
      );
    }
  }, [sesion, channelTypeId, language, tokenBP, virtualPosId]);
  const validateToken = useCallback(async () => {
    setIsActive(false);
    const host: string = Env.HOST_BP;
    const url: string = "/api/virtual-pos/syncUpVirtualPos";
    const method: Method = "post";

    let req = {
      channelTypeId,
      deviceId:
        Platform.OS === "android" ? androidId : await getIosIdForVendorAsync(),
      imei: "1111111",
      model: modelName,
      os: Platform.OS,
      token: tokenAuth,
      trademark: brand,
      virtualPosId,
    };

    const headers = GetHeader(tokenBP, "application/json");

    console.log(req);

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
        console.log(response);
        setTokenAuth("");
        ToastCall(
          "error",
          Languages[language].GENERAL.ERRORS.ErrorValidateToken,
          language
        );
      }
    } catch (err) {
      setTokenAuth("");
      console.log(JSON.stringify(err));
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.GeneralError,
        language
      );
    }
  }, [sesion, channelTypeId, tokenBP, language, virtualPosId, tokenAuth]);

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
      {!channelTypeId && (
        <>
          <Text
            style={[
              styles.textSubTitle,
              { marginVertical: 30, textAlign: "center" },
            ]}
          >
            {Languages[language].SCREENS.AddAccountScreen.text5}
          </Text>
          <View style={styles.containerCheck}>
            <BouncyCheckbox
              size={20}
              fillColor={Colors.blackBackground}
              unfillColor="#FFFFFF"
              textComponent={
                <Text style={[styles.text, { marginHorizontal: 5 }]}>SMS</Text>
              }
              iconStyle={{ borderColor: Colors.black }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ fontFamily: "DosisBold" }}
              style={{ marginVertical: 5 }}
              onPress={() => {
                setChannelTypeId(1);
              }}
              isChecked={channelTypeId === 1}
              disableBuiltInState={true}
            />
            <BouncyCheckbox
              size={20}
              fillColor={Colors.blackBackground}
              unfillColor="#FFFFFF"
              textComponent={
                <Text style={[styles.text, { marginHorizontal: 5 }]}>
                  EMAIL
                </Text>
              }
              iconStyle={{ borderColor: Colors.black }}
              innerIconStyle={{ borderWidth: 2 }}
              textStyle={{ fontFamily: "DosisBold" }}
              style={{ marginVertical: 5 }}
              onPress={() => {
                setChannelTypeId(2);
              }}
              isChecked={channelTypeId === 2}
              disableBuiltInState={true}
            />
          </View>
        </>
      )}

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
