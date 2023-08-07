import React, {useState, PropsWithChildren} from 'react';
import RegisterContext from './RegisterContext';

import {RegisterRequest} from './RegisterInterfaces';

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

  return (
    <RegisterContext.Provider
      value={{
        registerReq,
        nacionality,
        initialStateRegister,
        setRegisterReq,
        setNacionality,
      }}>
      {children}
    </RegisterContext.Provider>
  );
};

export default RegisterState;
