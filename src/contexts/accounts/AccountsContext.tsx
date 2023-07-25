import {createContext} from 'react';
import {AccountStateProps} from './AccountsInterface';

const AccountsContext = createContext({} as AccountStateProps);

export default AccountsContext;
