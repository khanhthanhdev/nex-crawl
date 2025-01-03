
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
    },
    {
        id: PackId.MEDIUM,
        name: "Medium Pack",
        label: "5000 Credits",
        credits: 5000,
        price: 3999, // 39.99$
    },
    {
        id: PackId.LARGE,
        name: "Large Pack",
        label: "10000 Credits",
        credits: 10000,
        price: 6999, // 69.99$
    },
];

export const getCreditsPack = (id: PackId) => 
    CreditsPack.find((pack) => pack.id === id);