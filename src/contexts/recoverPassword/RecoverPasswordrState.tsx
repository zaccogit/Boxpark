import React, {useState, PropsWithChildren} from 'react';
import RecoverPasswordContext from './RecoverPasswordContext';

import {RecoverPasswordRequest} from './RecoverPasswordInterfaces';

const RecoverPasswordState = ({children}: PropsWithChildren) => {
  const RecoverPasswordInitialState: RecoverPasswordRequest = {
    firstQuestion: '',
    secundQuestion: '',
    email: '',
    phoneNumber: '',
    phoneCode: '',
  };

  const [recoverPassword, setRecoverPassword] = useState<RecoverPasswordRequest>(RecoverPasswordInitialState);
  const [nacionality, setNacionality] = useState<number>(0);

  return (
    <RecoverPasswordContext.Provider
      value={{
        recoverPassword,
        nacionality,
        RecoverPasswordInitialState,
        setRecoverPassword,
        setNacionality,
      }}>
      {children}
    </RecoverPasswordContext.Provider>
  );
};

export default RecoverPasswordState;
