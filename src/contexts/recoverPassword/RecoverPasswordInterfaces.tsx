export interface RecoverPasswordContextProps {
  recoverPassword: RecoverPasswordRequest;
  nacionality: number;
  RecoverPasswordInitialState: RecoverPasswordRequest,
  setRecoverPassword: (e: RecoverPasswordRequest) => void;
  setNacionality: (e: number) => void;
}

export interface RecoverPasswordRequest {
  firstQuestion: string;
  secundQuestion: string;
  email: string;
  phoneNumber: string;
  phoneCode: string;
}
