import React, {createContext} from 'react';
import {RegisterContextProps} from './RegisterInterfaces';

const RegisterContext = createContext({} as RegisterContextProps);

export default RegisterContext;
