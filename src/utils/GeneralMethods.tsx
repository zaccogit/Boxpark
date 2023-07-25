import Languages from "./Languages.json";
import { HttpService } from "../services";
import { SesionInterface, AccountsInterface } from "../contexts";
import { Toast } from "react-native-toast-message/lib/src/Toast";

interface User extends SesionInterface {
  products: SavingsAccounts;
}

interface SavingsAccounts {
  savingsAccounts: AccountsInterface[];
}

interface Response {
  codigoRespuesta: string;
  mensajeRespuesta: string;
  usuario: User | null;
}

interface Headers {
  Authorization: string;
  accept: string;
  "Content-Type": string;
}

type Token = string | null;
type ContentType =
  | "application/json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded";
type TypeToast = "warning" | "error" | "success";
type Method = "get" | "post" | "put" | "delete";

export const CloseSesion = async (
  host: string,
  url: string,
  method: Method,
  token: string,
  sesion: SesionInterface | null,
  language: "EN" | "ES",
  setLoader?: (e: boolean) => void
) => {
  try {
    /* const method = 'post';
    const url = '/services/ruuser/api/sesion-usuarios/closeSession'; */
    const headers = GetHeader(token, "application/json");
    const req = {};
    const response = await HttpService(
      method,
      host,
      url,
      req,
      headers,
      setLoader
    );
    if (response?.codigoRespuesta === "00") {
      return;
    } else if (response?.codigoRespuesta === "23") {
      ToastCall(
        "warning",
        Languages[language].SCREENS.LoginScreen.ERRORS.message10,
        language
      );
    } else {
      ToastCall(
        "error",
        Languages[language].GENERAL.ERRORS.RequestInformationError,
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
};

export const DestroySesion = async (
  setSesion: (e: SesionInterface | null) => void,
  setAccounts: (e: AccountsInterface[]) => void,
  setTokenTransaction: (e: string | null) => void
) => {
 /*  setSesion(null); */
  setAccounts([]);
  setTokenTransaction(null);
};

export const RefreshAccounts = async (
  method: Method,
  host: string,
  url: string,
  id: number,
  setAccounts: (e: AccountsInterface[]) => void,
  tokenRU: string,
  setLoader?: (e: boolean) => void
) => {
  try {
    /* const method = 'get';
    const url: string = `/services/ruuser/api/usuario-alodigas/getUserById/${id}`; */
    const headers: any = GetHeader(tokenRU, "application/json");
    const response: Response = await HttpService(
      method,
      host,
      `${url}${id}`,
      {},
      headers,
      setLoader
    );

    if (!response || response?.codigoRespuesta !== "00") {
      throw new Error("");
    }
    if (!response?.usuario) {
      throw new Error("");
    }
    const { products } = response?.usuario;
    if (!products) {
      throw new Error("");
    }
    const { savingsAccounts } = response?.usuario?.products;
    if (!savingsAccounts) {
      throw new Error("");
    }
    setAccounts(savingsAccounts);
  } catch (err) {
    throw new Error("");
  }
};

export const GetHeader = (token: Token, contentType: ContentType): Headers => {
  let obj: any = {
    Authorization: `Bearer ${token}`,
    accept: "*/*",
    "Content-Type": contentType,
  };

  if (contentType === "multipart/form-data") {
    obj["Content-Disposition"] = "form-data";
  }

  return obj;
};

export const ToastCall = (
  type: TypeToast,
  message: string,
  language: "ES" | "EN"
): void => {
  Toast.show({
    type: type,
    text1: Languages[language].GENERAL.ALERTS[type],
    text2: message,
    visibilityTime: 2000,
  });
};
