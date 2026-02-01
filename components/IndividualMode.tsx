import React, { useState } from 'react';
import { PARTICIPANTS } from '../data/mockData';
import { Participant } from '@/types';
import MemberDropdown from './MemberDropdown';
import AdvancedSettings from './AdvancedSettings';

interface IndividualModeProps {
    amounts: Record<string, string>;
    onAmountsChange: (amounts: Record<string, string>) => void;
    payer: Participant;
    onPayerChange: (participant: Participant) => void;
    date: string;
    onDateChange: (date: string) => void;
    readOnly?: boolean;
    labels?: {
        payer?: string;
        amountLabel?: string;
    };
    participants: Participant[];
    myId: string;
}

const IndividualMode: React.FC<IndividualModeProps> = ({
    amounts,
    onAmountsChange,
    payer,
    onPayerChange,
    date,
    onDateChange,
    readOnly = false,
    labels,
    participants,
    myId
}) => {
    // Sort participants to put "Me" first
    const sortedParticipants = [...participants].sort((a, b) => {
        if (a.id === myId) return -1;
        if (b.id === myId) return 1;
        return 0; // Maintain original order for others
    });

    // Calculate total amount from all entered amounts
    const totalAmount = Object.values(amounts)
        .reduce((sum, amount) => sum + (Number(amount.replace(/[^0-9]/g, '')) || 0), 0);

    const formattedTotalAmount = totalAmount.toLocaleString();

    const handleAmountChange = (id: string, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const formattedValue = numericValue ? Number(numericValue).toLocaleString() : '';
        onAmountsChange({ ...amounts, [id]: formattedValue });
    };

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
            {/* Payer Selection Section */}
            <MemberDropdown
                label={labels?.payer || "누가 결제했나요?"}
                selected={payer}
                onSelect={onPayerChange}
                readOnly={readOnly}
                participants={participants}
                myId={myId}
            />

            <div className="space-y-3">
                {/* Individual Amount Input Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-medium text-gray-500">{labels?.amountLabel || "각자 얼마를 계산하나요?"}</label>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-2 flex flex-col">
                        <div className="flex flex-col gap-2">
                            {sortedParticipants.map((person) => {
                                const amount = amounts[person.id] || '';
                                const hasAmount = amount.length > 0;

                                return (
                                    <div
                                        key={person.id}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${hasAmount ? 'bg-white shadow-sm' : readOnly ? '' : 'hover:bg-white/50'} ${readOnly && !hasAmount ? 'opacity-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className={`font-medium ${hasAmount ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {person.name}
                                            </span>
                                            {myId === person.id && (
                                                <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md whitespace-nowrap">나</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 justify-end">
                                            <div className="relative w-32">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="0"
                                                    value={amount}
                                                    onChange={(e) => handleAmountChange(person.id, e.target.value)}
                                                    readOnly={readOnly}
                                                    className={`w-full text-right text-lg font-bold bg-transparent border-b border-gray-200 focus:border-blue-500 py-1 pr-6 focus:outline-none transition-all ${hasAmount ? 'text-gray-900' : 'text-gray-400'} ${readOnly ? 'cursor-default border-none' : ''}`}
                                                />
                                                <span className={`absolute right-0 top-1/2 -translate-y-1/2 font-bold text-sm pointer-events-none ${hasAmount ? 'text-gray-900' : 'text-gray-400'}`}>원</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 mx-2 mt-3 mb-1" />

                        {/* Total Amount Display (Read-only) */}
                        <div className="flex justify-between items-center px-4 py-2">
                            <span className="text-lg font-bold text-gray-600">
                                합계
                            </span>
                            <div className="flex items-center gap-1">
                                <span className={`text-2xl font-bold ${totalAmount > 0 ? 'text-blue-600' : 'text-gray-300'}`}>
                                    {formattedTotalAmount || '0'}
                                </span>
                                <span className={`text-lg font-bold ${totalAmount > 0 ? 'text-gray-900' : 'text-gray-300'}`}>원</span>
                            </div>
                        </div>
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

export default IndividualMode;
