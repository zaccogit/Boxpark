import React, {useState, PropsWithChildren} from 'react';
import RegisterContext from './RegisterContext';

import {FileReq, RegisterRequest} from './RegisterInterfaces';

const initialStateRegister: RegisterRequest = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  documentId: '',
  credential: '',
  credentialRepeat: '',
  gender: 'M',
  positionX: '',
  positionY: '',
  deviceId: '',
  documentTypeId: '',
  referenceNumber: '',
  typeCondition: ''
};

const RegisterState = ({children}: PropsWithChildren) => {
 

  const [registerReq, setRegisterReq] = useState<RegisterRequest>(initialStateRegister);
  const [nacionality, setNacionality] = useState<string | number>(0);
  const [partPhoto, setpartPhoto] = useState<FileReq | null>(null);

  return (
    <RegisterContext.Provider
      value={{
        registerReq,
        nacionality,
        initialStateRegister,
        setRegisterReq,
        setNacionality,
        partPhoto, setpartPhoto
      }}>
      {children}
    </RegisterContext.Provider>
  );
};

export default RegisterState;
