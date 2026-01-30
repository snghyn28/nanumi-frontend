import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedSettingsProps {
    date: string;
    onDateChange: (date: string) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ date, onDateChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors mx-auto"
            >
                고급 설정
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-2">
                            <label className="text-sm font-medium text-gray-500 ml-1">지출 날짜</label>
                            <input
                                type="datetime-local"
                                value={date}
                                onChange={(e) => onDateChange(e.target.value)}
                                className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdvancedSettings;
