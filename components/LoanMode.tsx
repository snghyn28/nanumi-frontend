import React, { useState } from 'react';
import { PARTICIPANTS, Participant } from '../data/mockData';
import MemberDropdown from './MemberDropdown';
import AdvancedSettings from './AdvancedSettings';

interface LoanModeProps {
    amount: string;
    onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoanMode: React.FC<LoanModeProps> = ({ amount, onAmountChange }) => {
    // Dropdown States
    const [lender, setLender] = useState<Participant>(PARTICIPANTS[0]);
    const [borrower, setBorrower] = useState<Participant>(PARTICIPANTS[1]);

    // Initialize with current date-time in local ISO format
    const [expenseDate, setExpenseDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    return (
        <div className="space-y-6">
            {/* Lender Selection */}
            <MemberDropdown
                label="누가 빌려줬나요?"
                selected={lender}
                onSelect={setLender}
            />

            {/* Borrower Selection */}
            <MemberDropdown
                label="누구에게 빌려줬나요?"
                selected={borrower}
                onSelect={setBorrower}
            />

            {/* Amount Section */}
            <div>
                <label className="text-sm font-medium text-gray-500 ml-1">얼마를 빌려줬나요?</label>
                <div className="flex items-end gap-3 border-b-2 border-gray-100 pb-2 transition-colors focus-within:border-gray-800 mt-2">
                    {/* Amount Input */}
                    <div className="flex-1 flex items-center justify-end gap-1">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={amount}
                            onChange={onAmountChange}
                            placeholder="0"
                            className="w-full bg-transparent text-right text-3xl font-bold text-gray-900 placeholder-gray-200 focus:outline-none"
                        />
                        <span className={`text-xl font-bold mb-1 ${amount ? 'text-gray-900' : 'text-gray-300'}`}>원</span>
                    </div>
                </div>
            </div>

            {/* Advanced Settings Section */}
            <AdvancedSettings
                date={expenseDate}
                onDateChange={setExpenseDate}
            />
        </div>
    );
};

export default LoanMode;
