import React from 'react';
import { Expense } from '@/data/mockData';

interface ExpenseCardProps {
    expense: Expense;
    isLast: boolean;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, isLast }) => {
    // Format date specifically: e.g., "5.1"
    const dateObj = new Date(expense.date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const formattedDate = `${month}.${day}`;

    // Format amount
    const formattedAmount = new Intl.NumberFormat('en-US').format(expense.amount);

    return (
        <div className="flex gap-4 relative">
            {/* Timeline Line */}
            {!isLast && (
                <div className="absolute left-[19px] top-10 bottom-[-16px] w-[2px] bg-gray-100" />
            )}

            {/* Date Circle */}
            <div className="relative z-10 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100/50 shadow-sm">
                    <span className="text-xs font-bold text-gray-500">{formattedDate}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-8 min-w-0">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/60 hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-base font-semibold text-foreground truncate pr-2">{expense.title}</h3>
                        <span className={`text-base font-bold whitespace-nowrap ${expense.type === 'receive' ? 'text-receive' : 'text-pay'}`}>
                            {formattedAmount}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                        <span>{expense.payer} paid</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 font-medium">
                            {expense.type === 'receive' ? 'To receive' : 'To send'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseCard;
