import React, { useState } from 'react';
import { PARTICIPANTS, Participant } from '../data/mockData';
import MemberDropdown from './MemberDropdown';
import AdvancedSettings from './AdvancedSettings';

const IndividualMode: React.FC = () => {
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>(
        PARTICIPANTS.map(p => p.id)
    );
    const [amounts, setAmounts] = useState<Record<string, string>>({});
    const [selectedPayer, setSelectedPayer] = useState<Participant>(PARTICIPANTS[0]);
    // Initialize with current date-time in local ISO format
    const [expenseDate, setExpenseDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    // Calculate total amount
    const totalAmount = Object.entries(amounts)
        .filter(([id]) => selectedParticipantIds.includes(id))
        .reduce((sum, [_, amount]) => sum + (Number(amount.replace(/,/g, '')) || 0), 0);

    const formattedTotalAmount = totalAmount.toLocaleString();

    const toggleSelectAll = () => {
        if (selectedParticipantIds.length === PARTICIPANTS.length) {
            setSelectedParticipantIds([]);
        } else {
            setSelectedParticipantIds(PARTICIPANTS.map(p => p.id));
        }
    };

    const toggleParticipant = (id: string) => {
        if (selectedParticipantIds.includes(id)) {
            setSelectedParticipantIds(prev => prev.filter(pId => pId !== id));
        } else {
            setSelectedParticipantIds(prev => [...prev, id]);
        }
    };

    const handleAmountChange = (id: string, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const formattedValue = numericValue ? Number(numericValue).toLocaleString() : '';
        setAmounts(prev => ({ ...prev, [id]: formattedValue }));
    };

    return (
        <div className="space-y-6">
            {/* Payer Selection Section */}
            <MemberDropdown
                label="누가 지불했나요?"
                selected={selectedPayer}
                onSelect={setSelectedPayer}
            />

            <div className="space-y-3">
                {/* Participants Checklist Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-medium text-gray-500">함께한 멤버</label>
                        <button
                            onClick={toggleSelectAll}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                        >
                            {selectedParticipantIds.length === PARTICIPANTS.length ? '선택 해제' : '모두 선택'}
                        </button>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-2 flex flex-col">
                        <div className="flex flex-col gap-2">
                            {PARTICIPANTS.map((person) => {
                                const isSelected = selectedParticipantIds.includes(person.id);
                                return (
                                    <div
                                        key={person.id}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isSelected ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                                            }`}
                                    >
                                        <button
                                            onClick={() => toggleParticipant(person.id)}
                                            className="flex items-center gap-3 flex-1 text-left"
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${isSelected
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'border-gray-300'
                                                }`}>
                                                {isSelected && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white">
                                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {person.name}
                                            </span>
                                        </button>

                                        {isSelected && (
                                            <div className="flex items-center gap-2 justify-end animate-in fade-in slide-in-from-right-4 duration-200">
                                                <div className="relative w-32">
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        placeholder="0"
                                                        value={amounts[person.id] || ''}
                                                        onChange={(e) => handleAmountChange(person.id, e.target.value)}
                                                        className="w-full text-right text-lg font-bold bg-gray-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-lg py-1.5 pl-2 pr-8 focus:outline-none placeholder-gray-400 text-gray-900 transition-all"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm pointer-events-none">원</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200 mx-2 mt-1" />

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

            {/* Advanced Settings Section */}
            <AdvancedSettings
                date={expenseDate}
                onDateChange={setExpenseDate}
            />
        </div>
    );
};

export default IndividualMode;
