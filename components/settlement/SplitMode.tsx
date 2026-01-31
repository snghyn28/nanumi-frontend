import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PARTICIPANTS } from '../../data/mockData';
import { Participant } from '@/types';
import MemberDropdown from '../MemberDropdown';
import AdvancedSettings from '../AdvancedSettings';

interface SplitModeProps {
    amount: string;
    onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    amountType: 'total' | 'perPerson';
    onAmountTypeChange: (type: 'total' | 'perPerson') => void;
    payer: Participant;
    onPayerChange: (participant: Participant) => void;
    selectedParticipantIds: string[];
    onParticipantsChange: (ids: string[]) => void;
    date: string;
    onDateChange: (date: string) => void;
    readOnly?: boolean;
    labels?: {
        payer?: string;
        amount?: string;
    };
}

const SplitMode: React.FC<SplitModeProps> = ({
    amount,
    onAmountChange,
    amountType,
    onAmountTypeChange,
    payer,
    onPayerChange,
    selectedParticipantIds,
    onParticipantsChange,
    date,
    onDateChange,
    readOnly = false,
    labels
}) => {
    // Amount Type Dropdown State
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleSelectAll = () => {
        if (readOnly) return;
        if (selectedParticipantIds.length === PARTICIPANTS.length) {
            onParticipantsChange([]);
        } else {
            onParticipantsChange(PARTICIPANTS.map(p => p.id));
        }
    };

    const toggleParticipant = (id: string) => {
        if (readOnly) return;
        if (selectedParticipantIds.includes(id)) {
            onParticipantsChange(selectedParticipantIds.filter(pId => pId !== id));
        } else {
            onParticipantsChange([...selectedParticipantIds, id]);
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        { value: 'total', label: '총' },
        { value: 'perPerson', label: '인당' }
    ];

    const selectedLabel = options.find(opt => opt.value === amountType)?.label;

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
            />

            {/* Amount Section */}
            <div>
                <label className="text-sm font-medium text-gray-500 ml-1">{labels?.amount || "얼마를 결제했나요?"}</label>
                <div className="flex items-end gap-3 border-b-2 border-gray-100 pb-2 transition-colors focus-within:border-gray-800 mt-2">
                    {/* Custom Styled Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => !readOnly && setIsDropdownOpen(!isDropdownOpen)}
                            disabled={readOnly}
                            className={`flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full transition-colors group ${readOnly ? 'cursor-default' : 'hover:bg-gray-50'}`}
                        >
                            <span className="text-xl font-bold text-gray-900 leading-none pb-0.5">
                                {selectedLabel}
                            </span>
                            {!readOnly && (
                                <div className={`text-gray-400 group-hover:text-gray-600 transition-colors duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -5 }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                    className="absolute left-0 top-full mt-2 w-auto min-w-[5rem] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-20"
                                >
                                    <div className="p-1.5 flex flex-col gap-0.5">
                                        {options.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    onAmountTypeChange(option.value as 'total' | 'perPerson');
                                                    setIsDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-base font-semibold rounded-xl transition-all ${amountType === option.value
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

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

            {/* Participants Checklist Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-sm font-medium text-gray-500">함께한 멤버</label>
                    {!readOnly && (
                        <button
                            onClick={toggleSelectAll}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                        >
                            {selectedParticipantIds.length === PARTICIPANTS.length ? '선택 해제' : '모두 선택'}
                        </button>
                    )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-2 flex flex-col gap-2">
                    {PARTICIPANTS.map((person) => {
                        const isSelected = selectedParticipantIds.includes(person.id);
                        return (
                            <button
                                key={person.id}
                                onClick={() => toggleParticipant(person.id)}
                                disabled={readOnly}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${isSelected ? 'bg-white shadow-sm' : readOnly ? '' : 'hover:bg-white/50'} ${readOnly && !isSelected ? 'opacity-50' : ''}`}
                            >
                                <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {person.name}
                                </span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-300'
                                    }`}>
                                    {isSelected && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white">
                                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        );
                    })}
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

export default SplitMode;
