import {createContext} from 'react';
import {SesionContextProps} from './SesionInterface';

const SesionContext = createContext({} as SesionContextProps);

export default SesionContext;
