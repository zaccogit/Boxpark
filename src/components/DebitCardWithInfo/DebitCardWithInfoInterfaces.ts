export interface Props {
    name?: string,
    card?: Card,
    language?: 'ES' | 'EN',
    secure?: boolean,
    action?: () => void,
    security?: boolean,
}

export interface Card {
    id: number,
    currency: string,
    card_bank_code: string,
    card_type: "DEBIT" | "CREDIT",
    card_number: string,
    expiration_month: number,
    expiration_year: number,
    holder_name: string,
    holder_id_doc: string,
    holder_id: string,
    account_type: string,
    cvc: string,
    affiliation_date: string,
    disenrollment_date: string,
    active: boolean,
    userId: number
}

export const CardInitState: Card = {
    id: 0,
    currency: "",
    card_bank_code: "",
    card_type: "DEBIT" ,
    card_number: "",
    expiration_month: 0,
    expiration_year: 0,
    holder_name: "",
    holder_id_doc: "",
    holder_id: "",
    account_type: "",
    cvc: "",
    affiliation_date: "",
    disenrollment_date: "",
    active: false,
    userId: 0
}