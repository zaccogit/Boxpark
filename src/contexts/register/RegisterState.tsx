import React, {useState, PropsWithChildren} from 'react';
import RegisterContext from './RegisterContext';

import {RegisterRequest} from './RegisterInterfaces';

const RegisterState = ({children}: PropsWithChildren) => {
  const initialState: RegisterRequest = {
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

  const [registerReq, setRegisterReq] = useState<RegisterRequest>(initialState);
  const [nacionality, setNacionality] = useState<string | number>(0);

  return (
    <RegisterContext.Provider
      value={{
        registerReq,
        nacionality,
        setRegisterReq,
        setNacionality,
      }}>
      {children}
    </RegisterContext.Provider>
  );
};

export default RegisterState;
