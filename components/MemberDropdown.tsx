import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Participant } from '@/types';

interface MemberDropdownProps {
    label: string;
    selected: Participant;
    onSelect: (participant: Participant) => void;
    readOnly?: boolean;
    myId?: string;
    participants: Participant[];
}

const MemberDropdown: React.FC<MemberDropdownProps> = ({ label, selected, onSelect, readOnly = false, participants, myId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 ml-1">{label}</label>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => !readOnly && setIsOpen(!isOpen)}
                    disabled={readOnly}
                    className={`w-full flex items-center justify-between bg-gray-50 p-4 rounded-2xl transition-colors group text-left ${readOnly ? 'cursor-default' : 'hover:bg-gray-100'}`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900 ml-1">{selected.name}</span>
                        {myId === selected.id && (
                            <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md whitespace-nowrap">나</span>
                        )}
                    </div>
                    {!readOnly && (
                        <div className={`text-gray-400 group-hover:text-gray-600 transition-colors duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-30"
                        >
                            <div className="p-2 max-h-60 overflow-y-auto flex flex-col gap-1">
                                {participants.map((person) => (
                                    <button
                                        key={person.id}
                                        onClick={() => {
                                            onSelect(person);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-1.5 p-3 rounded-xl transition-colors ${selected.id === person.id
                                            ? 'bg-gray-100'
                                            : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className={`font-medium ml-1 ${selected.id === person.id ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {person.name}
                                        </span>
                                        {myId === person.id && (
                                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-md whitespace-nowrap">나</span>
                                        )}
                                        {selected.id === person.id && (
                                            <div className="ml-auto text-blue-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MemberDropdown;
