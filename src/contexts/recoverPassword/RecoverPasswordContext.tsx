import React, {createContext} from 'react';
import {RecoverPasswordContextProps} from './RecoverPasswordInterfaces';

const RecoverPasswordContext = createContext({} as RecoverPasswordContextProps);

export default RecoverPasswordContext;
