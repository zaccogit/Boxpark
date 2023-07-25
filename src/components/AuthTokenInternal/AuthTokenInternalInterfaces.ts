export interface Props {
    active: boolean;
    setActive: (value: boolean) => void;
    onSubmit: () => any;
}

export type Method = "get" | "post" | "put" | "delete"