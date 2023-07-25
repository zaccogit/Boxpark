import React, { useState, PropsWithChildren, useContext } from "react";
import TransactionsContext from "./TransactionsContext";
import { ProcessPaymentScanning, UserCard } from "./TransactionsInterface";

const initialStateProcessPaymentScanning: ProcessPaymentScanning = {
  country: "",
  reason: "",
  amount: "",
  loteNumber: "",
  operatorId: 0,
  virtualPosId: 0,
  posId: 0,
  idCard: 0,
  numberPhone: "",
  token_bank: "",
  userId: "",
  ref: "",
};
const initialStateUserCard: UserCard = {
  idUser: "",
  nameUser: "",
  phone: "",
  numberCard: "",
  idCard: "",
  key: "",
  code_bank: "",
  currency: "",
  numberDocument: "",
};

export const TransactionsStateProvider = ({ children }: PropsWithChildren) => {
  const [ProcessPaymentScanningRequest, setProcessPaymentScanningRequest] =
    useState<ProcessPaymentScanning>(initialStateProcessPaymentScanning);
  const [UserCardData, setUserCardData] =
    useState<UserCard>(initialStateUserCard);

  const ResetUserCardData = () => {
    setUserCardData(initialStateUserCard);
  };
  const ResetProcessPaymentScanningRequest = () => {
    setProcessPaymentScanningRequest(initialStateProcessPaymentScanning);
  };

  return (
    <TransactionsContext.Provider
      value={{
        ProcessPaymentScanningRequest,
        setProcessPaymentScanningRequest,
        UserCardData,
        setUserCardData,
        ResetUserCardData,
        ResetProcessPaymentScanningRequest,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

const useTransactionsState = () => useContext(TransactionsContext);

export default useTransactionsState;
