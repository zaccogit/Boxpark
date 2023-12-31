export interface AuthContextProps {
  tokenRU: string | null;
  tokenGateway: string | null;
  tokenCompliance: string | null;
  tokenPromotions: string | null;
  tokenTransaction: string | null;
  tokenBP: string | null;
  deviceId: string;
  channelTypeId: number;
  endPoints: EndPoints[];
  setTokenRU: (e: string | null) => void;
  setTokenGateway: (e: string | null) => void;
  setTokenCompliance: (e: string | null) => void;
  setTokenPromotions: (e: string | null) => void;
  setTokenTransaction: (e: string | null) => void;
  setTokenBP: (e: string | null) => void;
  setdeviceId: (e: string) => void;
  setChannelTypeId: (e: number) => void;
  setEndPoints: (e: EndPoints[]) => void;
  DataCoordenadas: Coodernadas;
  setDataCoordenadas: (e: Coodernadas) => void;

}

export interface EndPoints {
  id: number;
  name: string;
  vale: string | "get" | "post" | "put" | "delete";
  application: string;
}

export interface Request {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface Response {
  id_token: string;
}


export interface Coodernadas {
  coords: Coords;
}

export interface Coords {
  longitude: number;
  latitude: number;
}
