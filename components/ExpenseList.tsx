import React from 'react';
import { Expense } from '@/data/mockData';
import ExpenseCard from './ExpenseCard';

interface ExpenseListProps {
    expenses: Expense[];
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses }) => {
    return (
        <div className="px-6 pb-24">
            <h2 className="text-sm font-semibold text-gray-400 mb-6 tracking-wide uppercase">Activities</h2>
            <div className="flex flex-col">
                {expenses.map((expense, index) => (
                    <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        isLast={index === expenses.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExpenseList;
