import React, { useState } from 'react';
import { PARTICIPANTS, Participant } from '../data/mockData';
import MemberDropdown from './MemberDropdown';
import AdvancedSettings from './AdvancedSettings';

const IndividualMode: React.FC = () => {
    // Amounts state: keys are participant IDs, values are string amounts
    const [amounts, setAmounts] = useState<Record<string, string>>({});
    const [selectedPayer, setSelectedPayer] = useState<Participant>(PARTICIPANTS[0]);

    // Initialize with current date-time in local ISO format
    const [expenseDate, setExpenseDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    // Calculate total amount from all entered amounts
    const totalAmount = Object.values(amounts)
        .reduce((sum, amount) => sum + (Number(amount.replace(/[^0-9]/g, '')) || 0), 0);

    const formattedTotalAmount = totalAmount.toLocaleString();

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
                {/* Individual Amount Input Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                        <label className="text-sm font-medium text-gray-500">각자 얼마를 계산하나요?</label>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-2 flex flex-col">
                        <div className="flex flex-col gap-2">
                            {PARTICIPANTS.map((person) => {
                                const amount = amounts[person.id] || '';
                                const hasAmount = amount.length > 0;

                                return (
                                    <div
                                        key={person.id}
                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${hasAmount ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <span className={`font-medium ${hasAmount ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {person.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 justify-end">
                                            <div className="relative w-32">
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="0"
                                                    value={amount}
                                                    onChange={(e) => handleAmountChange(person.id, e.target.value)}
                                                    className={`w-full text-right text-lg font-bold bg-transparent border-b border-gray-200 focus:border-blue-500 py-1 pr-6 focus:outline-none transition-all ${hasAmount ? 'text-gray-900' : 'text-gray-400'}`}
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

            {/* Advanced Settings Section */}
            <AdvancedSettings
                date={expenseDate}
                onDateChange={setExpenseDate}
            />
        </div>
    );
};

export default IndividualMode;
