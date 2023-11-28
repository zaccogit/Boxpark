import React, { useState, PropsWithChildren } from 'react';
import AccountsContext from './AccountsContext';
import { Accounts } from './AccountsInterface';

const AccountsState = (props: PropsWithChildren) => {
  const [accounts, setAccounts] = useState<Accounts[]>([]);

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        setAccounts,
      }}>
      {props.children}
    </AccountsContext.Provider>
  );
};

export default AccountsState;
