import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettlementRepaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    debtorName: string;
    creditorName: string;
    onConfirm: (amount: number) => void;
}

const SettlementRepaymentModal: React.FC<SettlementRepaymentModalProps> = ({
    isOpen,
    onClose,
    totalAmount,
    debtorName,
    creditorName,
    onConfirm
}) => {
    const [amount, setAmount] = useState(totalAmount);

    useEffect(() => {
        if (isOpen) {
            setAmount(totalAmount);
        }
    }, [isOpen, totalAmount]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(e.target.value));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Allow empty string for better typing experience, but validate on blur/confirm
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val === '') {
            setAmount(0); // Or handle as empty string slightly differently if using a string state
            return;
        }
        const numVal = parseInt(val, 10);
        setAmount(Math.min(numVal, totalAmount));
    };

    const handleConfirm = () => {
        onConfirm(amount);
        onClose();
    };

    // Format currency
    const formatCurrency = (val: number) => new Intl.NumberFormat('ko-KR').format(val);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-x-0 bottom-0 md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="text-center space-y-1">
                                <h2 className="text-xl font-bold text-gray-900">정산 완료 설정</h2>
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold text-gray-900">{debtorName}</span>님이
                                    <span className="font-semibold text-gray-900"> {creditorName}</span>님에게
                                </p>
                            </div>

                            {/* Amount Display & Input */}
                            <div className="space-y-4">
                                <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl">
                                    <div className="flex items-baseline gap-1">
                                        <input
                                            type="text"
                                            value={amount.toLocaleString()} // Use distinct state for input string if needed, but simplistic approach here
                                            onChange={handleInputChange}
                                            className="text-4xl font-bold text-center bg-transparent w-auto min-w-[100px] outline-none text-blue-600"
                                            style={{ width: `${Math.max(3, amount.toString().length) * 0.7}em` }} // Dynamic width helper
                                        />
                                        <span className="text-xl font-bold text-gray-400">원</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2">
                                        총 상환액 {formatCurrency(totalAmount)}원 중
                                    </p>
                                </div>

                                {/* Slider */}
                                <div className="space-y-2 px-2">
                                    <input
                                        type="range"
                                        min={Math.min(1000, totalAmount)}
                                        max={totalAmount}
                                        step="1000"
                                        value={amount}
                                        onChange={handleSliderChange}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                                        <span>{formatCurrency(Math.min(1000, totalAmount))}원</span>
                                        <span>{formatCurrency(totalAmount)}원</span>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3.5 px-4 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors"
                                    type="button"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 py-3.5 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors shadow-lg shadow-blue-200"
                                    type="button"
                                >
                                    완료
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettlementRepaymentModal;
