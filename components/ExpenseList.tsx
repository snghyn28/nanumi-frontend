import React from 'react';
import { Expense } from '@/types';
import ExpenseCard from './ExpenseCard';

interface ExpenseListProps {
    expenses: Expense[];
    onExpenseClick: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onExpenseClick }) => {
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="px-6 pb-24 bg-background">
            <h2 className="text-sm font-semibold text-gray-400 mb-6 tracking-wide uppercase">지출 내역</h2>
            <div className="flex flex-col">
                {sortedExpenses.map((expense, index) => {
                    const isNewDate = index === 0 ||
                        new Date(sortedExpenses[index - 1].date).getDate() !== new Date(expense.date).getDate();

                    return (
                        <ExpenseCard
                            key={expense.id}
                            expense={expense}
                            isLast={index === sortedExpenses.length - 1}
                            isParticipant={expense.isParticipant}
                            borrower={expense.borrower}
                            showDate={isNewDate}
                            onClick={() => onExpenseClick(expense.id)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ExpenseList;
