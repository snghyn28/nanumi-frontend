export interface Expense {
    id: string;
    title: string;
    amount: number;
    date: string;
    payer: string;
    participants: number;
    isParticipant: boolean;
    borrower?: string;
}

export type ExpenseType = 'SPLIT' | 'INDIVIDUAL' | 'LOAN';
