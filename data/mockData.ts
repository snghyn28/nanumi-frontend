
export interface Expense {
    id: string;
    title: string;
    amount: number;
    date: string;
    payer: string;
}

export interface SettlementSummary {
    groupTitle: string;
    totalAmount: number;
    type: 'pay' | 'receive';
}

export const mockSummary: SettlementSummary = {
    groupTitle: "3박 4일 제주도 여행",
    totalAmount: 45000,
    type: 'receive',
};

export const mockExpenses: Expense[] = [
    {
        id: '1',
        title: '흑돼지 바베큐',
        amount: 120000,
        date: '2024-05-01T18:30:00',
        payer: '민지',
    },
    {
        id: '2',
        title: '편의점',
        amount: 15000,
        date: '2024-05-01T21:00:00',
        payer: '현우',
    },
    {
        id: '3',
        title: '박물관 티켓',
        amount: 12000,
        date: '2024-05-02T10:00:00',
        payer: '상현',
    },
    {
        id: '4',
        title: '주유비',
        amount: 50000,
        date: '2024-05-02T14:00:00',
        payer: '민지',
    },
    {
        id: '5',
        title: '스타벅스',
        amount: 22000,
        date: '2024-05-03T13:00:00',
        payer: '현우',
    },
    {
        id: '6',
        title: '기념품',
        amount: 35000,
        date: '2024-05-03T16:00:00',
        payer: '상현',
    },
];
