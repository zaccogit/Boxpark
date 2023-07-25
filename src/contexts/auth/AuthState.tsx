import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  PropsWithChildren,
} from "react";
import AuthContext from "./AuthContext";
import { HttpConfigService } from "../../services";
import Languages from "../../utils/Languages.json";
import { GetHeader, ToastCall } from "../../utils/GeneralMethods";
import { EndPoints, Request, Response } from "./AuthInterfaces";
import enviroments from "../../../enviroments.json";
import { RenderContext } from "../";
const AuthState = (props: PropsWithChildren) => {
  const { language } = useContext(RenderContext);
  const [tokenRU, setTokenRU] = useState<string | null>(null);
  const [tokenGateway, setTokenGateway] = useState<string | null>(null);
  const [tokenCompliance, setTokenCompliance] = useState<string | null>(null);
  const [tokenPromotions, setTokenPromotions] = useState<string | null>(null);
  const [tokenTransaction, setTokenTransaction] = useState<string | null>(null);
  const [tokenBP, setTokenBP] = useState<string | null>(null);
  const [channelTypeId, setChannelTypeId] = useState<number>(0);
  const [virtualPosId, setVirtualPosId] = useState<number>(0);
  const [endPoints, setEndPoints] = useState<EndPoints[]>([]);
  const getRequest = useCallback((): Request => {
    return {
      username: enviroments.AUTH_API_USERNAME,
      password: enviroments.AUTH_API_PASSWORD,
      rememberMe: true,
    };
  }, []);
  const onSubmit = useCallback(async () => {
    try {
      let method: "get" | "post" = "post";
      let url: string = "/api/authenticate";
      const req: Request = getRequest();
      const response: Response = await HttpConfigService(method, url, req);
      if (response) {
        method = "get";
        url = "/api/attributes?page=0&size=150";
        const headers = GetHeader(response.id_token, "application/json");
        const responseEndPoints: EndPoints[] = await HttpConfigService(
          method,
          url,
          {},
          headers
        );
        if (responseEndPoints?.length) {
          setEndPoints(responseEndPoints);
        }
      }
    } catch (err: any) {
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
  }, []);
  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        tokenRU,
        tokenGateway,
        tokenCompliance,
        tokenPromotions,
        tokenTransaction,
        tokenBP,
        channelTypeId,
        endPoints,
        virtualPosId,
        setTokenRU,
        setTokenGateway,
        setTokenCompliance,
        setTokenPromotions,
        setTokenTransaction,
        setTokenBP,
        setChannelTypeId,
        setEndPoints,
        setVirtualPosId,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
