import React from 'react';
import { motion } from 'framer-motion';

interface KeypadProps {
    onPress: (key: string) => void;
    onDelete: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onPress, onDelete }) => {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0'];

    return (
        <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl mt-6">
            {keys.map((key) => (
                <KeyButton key={key} value={key} onClick={() => onPress(key)} />
            ))}
            <button
                onClick={onDelete}
                className="flex items-center justify-center py-4 rounded-xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-900">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12l-2.25 2.25m-2.25-2.25l-2.25 2.25m0 0L9.75 12m0 0l-2.25-2.25M9.75 12l2.25 2.25M9.75 12l2.25-2.25m-2.25 2.25L12 9.75m-3-3l-3.5 3.5a2.25 2.25 0 000 3.182l3.5 3.5a2.25 2.25 0 002.121.659l9-3.5A2.25 2.25 0 0021.75 15V9a2.25 2.25 0 00-1.879-2.19l-9-3.5a2.25 2.25 0 00-2.121.659z" />
                </svg>
            </button>
        </div>
    );
};

const KeyButton: React.FC<{ value: string; onClick: () => void }> = ({ value, onClick }) => (
    <button
        onClick={onClick}
        className="py-4 text-2xl font-bold text-gray-900 bg-white shadow-sm border border-gray-100 rounded-xl active:scale-95 transition-transform hover:bg-gray-50"
    >
        {value}
    </button>
);

export default Keypad;
