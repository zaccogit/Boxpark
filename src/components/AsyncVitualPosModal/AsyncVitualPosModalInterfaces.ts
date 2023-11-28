export interface Props {
    isActive: boolean;
    setIsActive: (value: boolean) => void;
    onSubmit: (e: string) => any;
}

export type Method = "get" | "post" | "put" | "delete"