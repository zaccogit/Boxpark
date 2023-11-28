import {createContext} from 'react';
import {AuthContextProps} from './AuthInterfaces';

const AuthContext = createContext({} as AuthContextProps);

export default AuthContext;
