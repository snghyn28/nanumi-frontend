import React from 'react';
import { Expense } from '@/data/mockData';
import ExpenseCard from './ExpenseCard';

interface ExpenseListProps {
    expenses: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="px-6 pb-24">
            <h2 className="text-sm font-semibold text-gray-400 mb-6 tracking-wide uppercase">Activities</h2>
            <div className="flex flex-col">
                {sortedExpenses.map((expense, index) => (
                    <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        isLast={index === sortedExpenses.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExpenseList;
