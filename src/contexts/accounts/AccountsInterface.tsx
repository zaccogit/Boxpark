export interface AccountStateProps {
  accounts: Accounts[];
  setAccounts: (e: Accounts[]) => void;
}

export interface Accounts {
  id: number;
  accountNo: string;
  externalId: string;
  productId: number;
  productName: string;
  shortProductName: string;
  accountBalance: number;
  lastActiveTransactionDate: number[];
  accountType?: ICV;
  depositType?: ICV;
  timeline?: Timeline;
  currency?: Currency;
  status?: Status;
  subStatus?: SubStatus;
}

interface ICV {
  id: number;
  code: string;
  value: string;
}

interface Timeline {
  submittedOnDate: number[];
  submittedByUsername: string;
  submittedByFirstname: string;
  submittedByLastname: string;
  approvedOnDate: number[];
  approvedByUsername: string;
  approvedByFirstname: string;
  approvedByLastname: string;
  activatedOnDate: number[];
  activatedByUsername: string;
  activatedByFirstname: string;
  activatedByLastname: string;
  closedOnDate: number[];
  closedByUsername: string;
  closedByFirstname: string;
  closedByLastname: string;
}

interface Currency {
  code: string;
  name: string;
  displaySymbol: string;
  nameCode: string;
  displayLabel: string;
  decimalPlaces: number;
  inMultiplesOf: number;
}
interface Status {
  id: number;
  code: string;
  value: string;
  submittedAndPendingApproval: boolean;
  approved: boolean;
  rejected: boolean;
  withdrawnByApplicant: boolean;
  active: boolean;
  closed: boolean;
  prematureClosed: boolean;
  transferInProgress: boolean;
  transferOnHold: boolean;
  matured: boolean;
}
interface SubStatus {
  id: number;
  code: string;
  value: string;
  none: boolean;
  inactive: boolean;
  dormant: boolean;
  escheat: boolean;
  block: boolean;
  blockCredit: boolean;
  blockDebit: boolean;
}
