export interface Props {
  loaderTransactions: boolean;
  lastTransactions: LastTransaction[];
  messageTransaction: string;
}

export interface LastTransaction {
  id: number;
  transactionNumber: string;
  transactionSequence: string;
  userSourceId: number;
  userDestinationId: number;
  transactionTypeId: number;
  transactionSourceId: number;
  amount: number;
  totalAmount: number;
  totalTax: number;
  transactionStatus: string;
  externalId: number;
  concept: string;
  transactionBusinessId: number;
  beginningDate: Date;
  endingDate: Date;
  aprovedDate: Date;
  simbol: string;
  referenceNumber: string;
  promotionId: number;
  comissionAmount: number;
  comissionId: number;
  userThirdpartyId: number;
  referenceDestination: string;
  referenceThirdParty: string;
  amountDestination: number;
  amountThirdParty: number;
  amountEnterprise: number;
  loteId: number;
  operatorId: number;
  virtualPosId: number;
  posId: number;
  type: Type;
  businessClosingId: number;
  source: Source;
  transactionElectronicComision: TransactionElectronicComision;
  creditCard: CreditCard;
  profileImage: string;
  destionationName: string;
  profileImageOrigen: string;
  origenName: string;
  accountNumberDestino: string;
  accountNumber: string;
  TransactionTypeName: string;
  transactionTypeName: string;
}

export interface CreditCard {
  id: number;
  currency: string;
  card_bank_code: string;
  card_number: string;
  expiration_month: number;
  expiration_year: number;
  holder_name: string;
  holder_id_doc: string;
  holder_id: string;
  account_type: string;
  cvc: string;
  affiliation_date: string;
  disenrollment_date: string;
  active: boolean;
  userId: number;
  cardType: CardType;
}

export interface CardType {
  id: number;
  type: string;
  description: string;
  name: string;
}

export interface Source {
  id: number;
  name: string;
  code: string;
}

export interface TransactionElectronicComision {
  id: number;
  name: string;
  description: string;
  creationDate: Date;
  endingDate: Date;
  status: boolean;
  percentValue: number;
  adicional: string;
  currencySimbol: string;
  thirdPartyPercent: number;
  businessPercent: number;
  payComission: string;
}

export interface Type {
  id: number;
  value: string;
  code: string;
  description: string;
}
