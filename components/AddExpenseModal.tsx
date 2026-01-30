import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OneMNMode from './OneMNMode';
import IndividualMode from './IndividualMode';
import LoanMode from './LoanMode';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TABS = ['1/N', '각자 분담', '대여'];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
    const [selectedTab, setSelectedTab] = useState(TABS[0]);
    const [amount, setAmount] = useState('');
    const [amountType, setAmountType] = useState<'total' | 'perPerson'>('total');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value ? Number(value).toLocaleString() : '');
    };

    const renderModeContent = () => {
        switch (selectedTab) {
            case '1/N':
                return (
                    <OneMNMode
                        amount={amount}
                        onAmountChange={handleAmountChange}
                        amountType={amountType}
                        onAmountTypeChange={setAmountType}
                    />
                );
            case '각자 분담':
                return <IndividualMode />;
            case '대여':
                return (
                    <LoanMode
                        amount={amount}
                        onAmountChange={handleAmountChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-[60]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Bottom Sheet Modal */}
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center pointer-events-none"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl pointer-events-auto h-[85dvh] flex flex-col">
                            {/* Handle for visual cues */}
                            <div className="pt-6 pb-2 px-6 flex-none">
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                                <h2 className="text-xl font-bold text-gray-900 mb-4">지출 추가</h2>

                                {/* Segmented Tabs */}
                                <div className="bg-gray-100 p-1 rounded-xl flex relative">
                                    {TABS.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setSelectedTab(tab)}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg relative z-10 transition-colors duration-200 ${selectedTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            {tab}
                                            {selectedTab === tab && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Content based on Tab */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {renderModeContent()}
                                {/* Bottom spacer for scrolling past content */}
                                <div className="h-12" />
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex-none p-6 pt-4 border-t border-gray-100 bg-white pb-8">
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log("Add expense");
                                            onClose();
                                        }}
                                        className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                    >
                                        추가
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddExpenseModal;
