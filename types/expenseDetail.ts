import { Participant } from './participant';
import { ExpenseType } from './expense';

export interface ExpenseDetailBase {
    id: string;
    title: string;
    date: string;
    type: ExpenseType;
    payer: Participant;
}

export interface ExpenseDetailSplit extends ExpenseDetailBase {
    type: 'SPLIT';
    amount: number;
    participants: Participant[];
}

export interface ExpenseDetailIndividual extends ExpenseDetailBase {
    type: 'INDIVIDUAL';
    totalAmount: number;
    participants: {
        participant: Participant;
        amount: number;
    }[];
}

export interface ExpenseDetailLoan extends ExpenseDetailBase {
    type: 'LOAN';
    amount: number;
    borrower: Participant;
}

export type ExpenseDetail = ExpenseDetailSplit | ExpenseDetailIndividual | ExpenseDetailLoan;
