export interface RegisterContextProps {
  registerReq: RegisterRequest;
  nacionality: string | number;
  initialStateRegister: RegisterRequest;
  setRegisterReq: (e: RegisterRequest) => void;
  setNacionality: (e: string | number) => void;
  partPhoto: FileReq | null;
  setpartPhoto: (e: FileReq | null) => void;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentId: string;
  credential: string;
  credentialRepeat: string;
  gender: string;
  positionX: string;
  positionY: string;
  deviceId: string;
  documentTypeId: string;
  referenceNumber: string;
  typeCondition: string;
}
export interface FileReq {
  uri: string | undefined;
  type: any;
  name: string | undefined;
}
