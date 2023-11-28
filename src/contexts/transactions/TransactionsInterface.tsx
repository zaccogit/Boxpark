export interface TransactionsContextProps {
    qrPaymentRequest: QrPayment;
    transferRequest: Transfer;
    withdrawalRequest: Withdrawal;
    rechargeCredicar: any;
    setQrPaymentRequest: (e: QrPayment) => void;
    setTransferRequest: (e: Transfer) => void;
    setWithdrawalRequest: (e: Withdrawal) => void;
    setRechargeCredicar: (e: any) => void;
  }
  
  export interface QrPayment {
    displaySymbol: string;
    accountPaymentId: number;
    accountPaymentBalance: number;
    accountPaymentNumber: string;
    accountPaymentName: string;
    businessName: string;
    sucursalName: string;
    userCoreId: string;
    accountBusinessId: number;
    accountBusinessName: string;
    accountBusinessNumber: string;
    amount: string;
    concept: string;
    resourceId: string;
    businessDestinationId: string;
  }
  
  export interface Transfer {
    displaySymbol: string;
    accountPaymentId: number;
    accountPaymentBalance: number;
    accountPaymentNumber: string;
    accountPaymentName: string;
    userCoreId: string;
    userDestinationName: string;
    userDestinationLastName: string;
    accountDestinationId: number;
    accountDestinationName: string;
    accountDestinationNumber: string;
    amount: string;
    concept: string;
    resourceId: string;
    userDestinationId: string;
  }
  
  export interface Withdrawal {
    accountPaymentBalance: number;
    accountPaymentNumber: string;
    accountPaymentName: string;
    accountPaymentId: number;
    accountBankId: string;
    userCoreId?: number | null;
    documentId: string;
    concept: string;
    amount: string;
    alias: string;
    displaySymbol: string;
    phoneNumber: string;
  }
  