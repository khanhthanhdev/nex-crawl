
export enum PackId {
    SMALL = "SMALL",
    MEDIUM = "MEDIUM",
    LARGE = "LARGE",

}

export type CreditsPack = {
    id: PackId;
    credits: number;
    name: string;
    label: string;
    price: number;
}

export const CreditsPack:CreditsPack[] = [
    {
        id: PackId.SMALL,
        name: "Small Pack",
        label: "1000 Credits",
        credits: 1000,
        price: 999, // 9.99$
    }
];

export const getCreditsPack = (id: PackId) => 
    CreditsPack.find((pack) => pack.id === id);