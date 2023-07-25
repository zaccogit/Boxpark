import {createContext} from 'react';
import {TransactionsContextProps} from './TransactionsInterface';

const TransactionsContext = createContext({} as TransactionsContextProps);

export default TransactionsContext;
