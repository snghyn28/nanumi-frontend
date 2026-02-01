import React, { useState } from 'react';
import { PARTICIPANTS } from '../data/mockData';
import { Participant } from '@/types';
import MemberDropdown from './MemberDropdown';
import AdvancedSettings from './AdvancedSettings';

interface LoanModeProps {
    amount: string;
    onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    lender: Participant;
    onLenderChange: (participant: Participant) => void;
    borrower: Participant;
    onBorrowerChange: (participant: Participant) => void;
    date: string;
    onDateChange: (date: string) => void;
    readOnly?: boolean;
    labels?: {
        lender?: string;
        borrower?: string;
        amount?: string;
    };
    participants: Participant[];
    myId: string;
}

const LoanMode: React.FC<LoanModeProps> = ({
    amount,
    onAmountChange,
    lender,
    onLenderChange,
    borrower,
    onBorrowerChange,
    date,
    onDateChange,
    readOnly = false,
    labels,
    participants,
    myId
}) => {
    // Helper to format date for display
    const getFormattedDate = (isoString: string) => {
        const dateObj = new Date(isoString);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}. ${month}. ${day}`;
    };

    return (
        <div className="space-y-6">
            {/* Lender Selection */}
            <MemberDropdown
                label={labels?.lender || "누가 빌려줬나요?"}
                selected={lender}
                onSelect={onLenderChange}
                readOnly={readOnly}
                participants={participants}
                myId={myId}
            />

            {/* Borrower Selection */}
            <MemberDropdown
                label={labels?.borrower || "누구에게 빌려줬나요?"}
                selected={borrower}
                onSelect={onBorrowerChange}
                readOnly={readOnly}
                participants={participants}
                myId={myId}
            />

            {/* Amount Section */}
            <div>
                <label className="text-sm font-medium text-gray-500 ml-1">{labels?.amount || "얼마를 빌려줬나요?"}</label>
                <div className="flex items-end gap-3 border-b-2 border-gray-100 pb-2 transition-colors focus-within:border-gray-800 mt-2">
                    {/* Amount Input */}
                    <div className="flex-1 flex items-center justify-end gap-1">
                        <input
                            type="text"
                            inputMode="numeric"
                            value={amount}
                            onChange={onAmountChange}
                            readOnly={readOnly}
                            placeholder="0"
                            className={`w-full bg-transparent text-right text-3xl font-bold text-gray-900 placeholder-gray-200 focus:outline-none ${readOnly ? 'cursor-default' : ''}`}
                        />
                        <span className={`text-xl font-bold mb-1 ${amount ? 'text-gray-900' : 'text-gray-300'}`}>원</span>
                    </div>
                </div>
            </div>

            {/* Advanced Settings Section handled by readOnly */}
            {readOnly ? (
                <div className="flex items-center justify-between px-1">
                    <span className="text-sm font-medium text-gray-500">날짜</span>
                    <span className="text-base font-semibold text-gray-900">{getFormattedDate(date)}</span>
                </div>
            ) : (
                <AdvancedSettings
                    date={date}
                    onDateChange={onDateChange}
                />
            )}
        </div>
    );
};

export default LoanMode;
