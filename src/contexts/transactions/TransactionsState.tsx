import React, { useState, PropsWithChildren, useContext } from "react";
import TransactionsContext from "./TransactionsContext";
import {QrPayment, Transfer, Withdrawal} from './TransactionsInterface';

export const initialStateQRPayment: QrPayment = {
  accountPaymentId: 0,
  displaySymbol: '',
  accountPaymentBalance: 0,
  accountPaymentNumber: '',
  accountPaymentName: '',
  businessDestinationId: '',
  businessName: '',
  sucursalName: '',
  userCoreId: '',
  accountBusinessId: 0,
  accountBusinessName: '',
  accountBusinessNumber: '',
  amount: '',
  concept: '',
  resourceId: '',
};

const initialStateTransfer: Transfer = {
  displaySymbol: '',
  accountPaymentId: 0,
  accountPaymentBalance: 0,
  accountPaymentNumber: '',
  accountPaymentName: '',
  userCoreId: '',
  userDestinationId: '',
  userDestinationName: '',
  userDestinationLastName: '',
  accountDestinationId: 0,
  accountDestinationName: '',
  accountDestinationNumber: '',
  amount: '',
  concept: '',
  resourceId: '',
};

const initialStateWithdrawal: Withdrawal = {
  accountPaymentBalance: 0,
  accountPaymentNumber: '',
  accountPaymentName: '',
  accountPaymentId: 0,
  accountBankId: '',
  userCoreId: 0,
  documentId: '',
  alias: '',
  concept: '',
  amount: '',
  displaySymbol: '',
  phoneNumber: '',
};

export const TransactionsStateProvider = ({ children }: PropsWithChildren) => {
  const [qrPaymentRequest, setQrPaymentRequest] = useState<QrPayment>(initialStateQRPayment);
  const [transferRequest, setTransferRequest] = useState<Transfer>(initialStateTransfer);
  const [withdrawalRequest, setWithdrawalRequest] = useState<Withdrawal>(initialStateWithdrawal);
  const [rechargeCredicar, setRechargeCredicar] = useState<Withdrawal>(initialStateWithdrawal);

  return (
    <TransactionsContext.Provider
      value={{
        qrPaymentRequest,
        transferRequest,
        withdrawalRequest,
        rechargeCredicar,
        setQrPaymentRequest,
        setTransferRequest,
        setWithdrawalRequest,
        setRechargeCredicar
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

const useTransactionsState = () => useContext(TransactionsContext);

export default useTransactionsState;
