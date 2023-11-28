export interface SesionContextProps {
  sesion: Sesion | null;
  sesionDash: boolean;
  timerSesion: number;
  modalLogout: boolean;
  modalAlert: boolean;
  setSesion: (e: Sesion | null) => void;
  setSesionDash: (e: boolean) => void;
  setTimerSesion: (e: number) => void;
  startTimerSesion: () => void;
  restartTimerSesion: () => void;
  stopTimerSesion: () => void;
  setModalLogout: (e: boolean) => void;
  setModalAlert: (e: boolean) => void;
}

export interface Sesion {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  birthDate: string | null;
  phone: string | null;
  gender: string | null;
  status: string | null;
  addressId: number | null;
  documentId: string | null;
  compliance: string | null;
  userCoreId: number | null;
  profileImage: ProfileImage | null;
  perfils: any[] | null;
  civil_status: string | null;
  birthplace: string | null;
  documentType: DocumentType;
  token: string;
  code: string;
  typeCondition: string;
}

interface ProfileImage {
  id?: number;
  name?: string;
  url?: string;
}

interface DocumentType {
  id: number;
  name: string;
  documentType: string;
  country: Country;
}

interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  phoneCode: number;
}
