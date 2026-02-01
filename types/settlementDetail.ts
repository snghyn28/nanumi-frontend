import { Participant } from "./participant";

export interface SettlementDetail {
    totalAmount: number;
    type: 'pay' | 'receive';
    details: {
        debtor: Participant;
        creditor: Participant;
        amount: number;
    }[];
}
