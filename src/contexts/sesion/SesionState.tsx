import React, {
  useState,
  useEffect,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import { AppState, StyleSheet, Text } from "react-native";
import SesionContext from "./SesionContext";
import { CloseSesion } from "../../utils/GeneralMethods";
import { Colors } from "../../utils";
import { useAuth } from "../auth/AuthState";
import { useRender } from "../render/RenderState";
import { EndPoints } from "../auth/AuthInterfaces";
import Modal from "../../components/Modal/Modal";
import { Sesion } from "./SesionInterface";

type Method = "get" | "post" | "put" | "delete";

var intervalSesion: any = null;
const SesionState = ({ children }: PropsWithChildren) => {
  const { tokenRU, setChannelTypeId, endPoints } = useAuth();
  const { language } = useRender();
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const [sesionDash, setSesionDash] = useState<boolean>(false);
  const [timerSesion, setTimerSesion] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [oldTime, setOldTime] = useState<number>(new Date().getTime());
  const [modalLogout, setModalLogout] = useState<boolean>(false);
  const [modalAlert, setModalAlert] = useState<boolean>(false);

  const startTimerSesion = useCallback(() => {
    clearInterval(intervalSesion);
    intervalSesion = null;
    if (!intervalSesion) {
      setSesionDash(true);
      setTimerSesion(150);
      setTimerActive(true);
      setOldTime(new Date().getTime());
    }
  }, [intervalSesion]);

  const restartTimerSesion = useCallback(() => {
    if (sesion && sesionDash) {
      setTimerSesion(150);
      setTimerActive(true);
      setOldTime(new Date().getTime());
    }
  }, [sesionDash, sesion]);

  const stopTimerSesion = useCallback(() => {
    clearInterval(intervalSesion);
    setTimerActive(false);
    setSesionDash(false);
    setOldTime(new Date().getTime());
  }, [intervalSesion]);

  const closeSesion = useCallback((): void => {
    modalAlert && setModalAlert(false);
    !modalLogout && setModalLogout(true);
    if (sesion) {
      const host: string = endPoints?.find(
        (endPoint: EndPoints) => endPoint.name === "APP_BASE_API"
      )?.vale.trim() as string;
      const url: string = endPoints?.find(
        (endPoint: EndPoints) => endPoint.name === "CLOSE_SESION_URL"
      )?.vale as string;
      const method: Method = endPoints?.find(
        (endPoint: EndPoints) => endPoint.name === "CLOSE_SESION_METHOD"
      )?.vale as Method;
      CloseSesion(host, url, method, tokenRU ?? "", sesion, language);

      setChannelTypeId(0);
      setSesion(null);
    }
    stopTimerSesion();
  }, [tokenRU, sesion, language, endPoints, modalAlert, modalLogout]);

  useEffect(() => {
    if (!timerActive || !timerSesion || !sesion || !sesionDash) {
      if (!sesion) stopTimerSesion();
      return () => clearInterval(intervalSesion);
    }
    if (timerSesion > 15) {
      intervalSesion = setInterval(() => {
        setOldTime(new Date().getTime());
        setTimerSesion((remainingSecs) => remainingSecs - 15);
      }, 10000);
    }
    if (timerSesion <= 15) {
      intervalSesion = setInterval(() => {
        setOldTime(new Date().getTime());
        setTimerSesion((remainingSecs) => remainingSecs - 1);
      }, 1000);
    }
    return () => clearInterval(intervalSesion);
  }, [timerActive, timerSesion]);

  useEffect(() => {
    AppState.addEventListener("change", () => {
      if (sesion && sesionDash && timerActive && timerSesion) {
        const date2 = new Date().getTime();
        const dif = date2 - oldTime;
        if (dif >= 130000) {
          stopTimerSesion();
          setModalLogout(true);
        } else {
          restartTimerSesion();
        }
      }
    });
  }, [sesion, sesionDash]);

  /* useEffect(() => {
    if (timerSesion > 15) modalAlert && setModalAlert(false);
    if (timerSesion <= 15 && timerSesion > 0)
      !modalAlert && setModalAlert(true);
    if (timerSesion <= 0) sesion && closeSesion();
  }, [timerSesion]); */

  return (
    <SesionContext.Provider
      value={{
        sesion,
        sesionDash,
        timerSesion,
        setSesion,
        setSesionDash,
        setTimerSesion,
        startTimerSesion,
        restartTimerSesion,
        stopTimerSesion,
        setModalLogout,
        modalLogout,
        modalAlert,
        setModalAlert,
      }}
    >
      {children}
    </SesionContext.Provider>
  );
};

export const useSesion = () => useContext(SesionContext);

export default SesionState;
