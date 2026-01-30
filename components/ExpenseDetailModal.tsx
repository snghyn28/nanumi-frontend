import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseDetail, PARTICIPANTS, Participant } from '../data/mockData';
import SplitMode from './SplitMode';
import IndividualMode from './IndividualMode';
import LoanMode from './LoanMode';
import DeleteModal from './DeleteModal';

interface ExpenseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    expenseDetail: ExpenseDetail | null;
}

const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({ isOpen, onClose, expenseDetail }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Form State
    const [amount, setAmount] = useState('');
    const [amountType, setAmountType] = useState<'total' | 'perPerson'>('total');
    const [date, setDate] = useState('');
    const [payer, setPayer] = useState<Participant>(PARTICIPANTS[0]);
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [individualAmounts, setIndividualAmounts] = useState<Record<string, string>>({});
    const [borrower, setBorrower] = useState<Participant>(PARTICIPANTS[1]);

    // Initialize state when expenseDetail changes
    useEffect(() => {
        if (expenseDetail) {
            setDate(expenseDetail.date);
            setPayer(expenseDetail.payer);
            setIsEditing(false); // Reset edit mode on open

            if (expenseDetail.type === 'SPLIT') {
                setAmount(expenseDetail.amount.toLocaleString());
                setSelectedParticipantIds(expenseDetail.participants.map(p => p.id));
                setAmountType('total'); // Default to total for now
            } else if (expenseDetail.type === 'INDIVIDUAL') {
                const amounts: Record<string, string> = {};
                expenseDetail.participants.forEach(p => {
                    amounts[p.participant.id] = p.amount.toLocaleString();
                });
                setIndividualAmounts(amounts);
            } else if (expenseDetail.type === 'LOAN') {
                setAmount(expenseDetail.amount.toLocaleString());
                setBorrower(expenseDetail.borrower);
            }
        }
    }, [expenseDetail, isOpen]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value ? Number(value).toLocaleString() : '');
    };

    const handleDeleteConfirm = () => {
        console.log("Delete confirmed");
        setIsDeleteModalOpen(false);
        onClose();
    };

    const renderContent = () => {
        if (!expenseDetail) return null;

        switch (expenseDetail.type) {
            case 'SPLIT':
                return (
                    <SplitMode
                        amount={amount}
                        onAmountChange={handleAmountChange}
                        amountType={amountType}
                        onAmountTypeChange={setAmountType}
                        payer={payer}
                        onPayerChange={setPayer}
                        selectedParticipantIds={selectedParticipantIds}
                        onParticipantsChange={setSelectedParticipantIds}
                        date={date}
                        onDateChange={setDate}
                        readOnly={!isEditing}
                        labels={{
                            payer: "결제한 멤버",
                            amount: "결제한 금액"
                        }}
                    />
                );
            case 'INDIVIDUAL':
                return (
                    <IndividualMode
                        amounts={individualAmounts}
                        onAmountsChange={setIndividualAmounts}
                        payer={payer}
                        onPayerChange={setPayer}
                        date={date}
                        onDateChange={setDate}
                        readOnly={!isEditing}
                        labels={{
                            payer: "결제한 멤버",
                            amountLabel: "결제한 금액"
                        }}
                    />
                );
            case 'LOAN':
                return (
                    <LoanMode
                        amount={amount}
                        onAmountChange={handleAmountChange}
                        lender={payer} // payer is lender in base interface
                        onLenderChange={setPayer}
                        borrower={borrower}
                        onBorrowerChange={setBorrower}
                        date={date}
                        onDateChange={setDate}
                        readOnly={!isEditing}
                        labels={{
                            lender: "빌려준 멤버",
                            borrower: "빌린 멤버",
                            amount: "빌려준 금액"
                        }}
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
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">지출 상세</h2>
                                    <button
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {renderContent()}
                                <div className="h-12" />
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex-none p-6 pt-4 border-t border-gray-100 bg-white pb-8">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            if (isEditing) {
                                                setIsEditing(false); // Cancel edit
                                                // Revert to original is handled by re-render or explicit reset if needed
                                                // But for now simple toggle is fine
                                                // Ideally we should reset state to expenseDetail props here
                                            } else {
                                                onClose();
                                            }
                                        }}
                                        className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        {isEditing ? '취소' : '뒤로'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (isEditing) {
                                                // Save Logic
                                                console.log("Save changes");
                                                setIsEditing(false);
                                            } else {
                                                setIsEditing(true);
                                            }
                                        }}
                                        className={`flex-1 py-4 rounded-2xl text-white font-bold transition-colors shadow-lg ${isEditing
                                            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                                            : 'bg-gray-900 hover:bg-gray-800 shadow-gray-500/30'
                                            }`}
                                    >
                                        {isEditing ? '저장' : '수정'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                    />
                </>
            )}
        </AnimatePresence>
    );
};

export default ExpenseDetailModal;
