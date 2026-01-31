import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpenseDetail, Participant } from '@/types';
import { useSettlement } from '@/context/SettlementContext';
import SplitMode from './SplitMode';
import IndividualMode from './IndividualMode';
import LoanMode from './LoanMode';
import ExpenseDeleteModal from '../ExpenseDeleteModal';

interface ExpenseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    expenseDetail: ExpenseDetail | null;
}

const TABS = ['1/N', '각자 분담', '대여'];

const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({ isOpen, onClose, expenseDetail }) => {
    const { participants, myId } = useSettlement();
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [amountType, setAmountType] = useState<'total' | 'perPerson'>('total');
    const [date, setDate] = useState('');
    const [payer, setPayer] = useState<Participant | null>(null);
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [individualAmounts, setIndividualAmounts] = useState<Record<string, string>>({});
    const [selectedTab, setSelectedTab] = useState(TABS[0]);
    const [borrower, setBorrower] = useState<Participant | null>(null);

    // Initialize state when expenseDetail changes
    useEffect(() => {
        if (expenseDetail) {
            setTitle(expenseDetail.title);
            setDate(expenseDetail.date);
            setPayer(expenseDetail.payer);
            setIsEditing(false); // Reset edit mode on open

            if (expenseDetail.type === 'SPLIT') {
                setAmount(expenseDetail.amount.toLocaleString());
                setSelectedParticipantIds(expenseDetail.participants.map(p => p.id));
                setAmountType('total'); // Default to total for now
            } else if (expenseDetail.type === 'INDIVIDUAL') {
                const amounts: Record<string, string> = {};
                expenseDetail.participants.forEach((p: { participant: Participant; amount: number }) => {
                    amounts[p.participant.id] = p.amount.toLocaleString();
                });
                setIndividualAmounts(amounts);
            } else if (expenseDetail.type === 'LOAN') {
                setAmount(expenseDetail.amount.toLocaleString());
                setBorrower(expenseDetail.borrower);
                setSelectedTab(TABS[2]);
            }

            if (expenseDetail.type === 'SPLIT') setSelectedTab(TABS[0]);
            else if (expenseDetail.type === 'INDIVIDUAL') setSelectedTab(TABS[1]);
            else if (expenseDetail.type === 'LOAN') setSelectedTab(TABS[2]);
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

        return (
            <>
                {/* Title Input */}
                <div className="mb-6">
                    <label className="text-sm font-medium text-gray-500 ml-1 mb-1 block">사용처</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        readOnly={!isEditing}
                        placeholder="사용처를 입력해주세요 (예: 스타벅스)"
                        className={`w-full text-xl font-bold border-b-2 py-2 px-1 focus:outline-none bg-transparent transition-colors ${isEditing
                            ? 'border-gray-100 focus:border-gray-800 placeholder-gray-300'
                            : 'border-transparent cursor-default'
                            }`}
                    />
                </div>

                {/* Segmented Tabs */}
                <div className={`bg-gray-100 p-1 rounded-xl flex relative mb-6 ${!isEditing ? 'opacity-75 pointer-events-none' : ''}`}>
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => isEditing && setSelectedTab(tab)}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg relative z-10 transition-colors duration-200 ${selectedTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                            {selectedTab === tab && (
                                <motion.div
                                    layoutId="activeDetailTab"
                                    className="absolute inset-0 bg-white shadow-sm rounded-lg -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {(() => {
                    if (!payer) return null; // Ensure payer is set
                    switch (selectedTab) {
                        case '1/N':
                            return (
                                <SplitMode
                                    participants={participants}
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
                                    myId={myId}
                                />
                            );
                        case '각자 분담':
                            return (
                                <IndividualMode
                                    participants={participants}
                                    amounts={individualAmounts}
                                    onAmountsChange={setIndividualAmounts}
                                    payer={payer}
                                    onPayerChange={setPayer}
                                    date={date}
                                    onDateChange={setDate}
                                    readOnly={!isEditing}
                                    labels={{
                                        payer: "결제한 멤버",
                                        amountLabel: "계산한 금액"
                                    }}
                                    myId={myId}
                                />
                            );
                        case '대여':
                            return (
                                <LoanMode
                                    participants={participants}
                                    amount={amount}
                                    onAmountChange={handleAmountChange}
                                    lender={payer} // payer is lender in base interface
                                    onLenderChange={setPayer}
                                    borrower={borrower || participants[0]} // Fallback
                                    onBorrowerChange={setBorrower}
                                    date={date}
                                    onDateChange={setDate}
                                    readOnly={!isEditing}
                                    labels={{
                                        lender: "빌려준 멤버",
                                        borrower: "빌린 멤버",
                                        amount: "빌려준 금액"
                                    }}
                                    myId={myId}
                                />
                            );
                        default:
                            return null;
                    }
                })()}
            </>
        );
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-[60]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[70] flex justify-center pointer-events-none"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl pointer-events-auto h-[85dvh] flex flex-col">
                            <div className="pt-5 pb-2 px-6 flex-none">
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3" />
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{isEditing ? '지출 수정' : '지출 상세'}</h2>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {renderContent()}

                                {!isEditing && (
                                    <div className="mt-8">
                                        <button
                                            onClick={() => setIsDeleteModalOpen(true)}
                                            className="w-full py-3 rounded-xl bg-red-50 text-red-500 font-medium text-sm hover:bg-red-100 transition-colors"
                                        >
                                            지출 삭제
                                        </button>
                                    </div>
                                )}

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
                        </div >
                    </motion.div >

                    <ExpenseDeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={handleDeleteConfirm}
                    />
                </>
            )}
        </AnimatePresence >
    );
};

export default ExpenseDetailModal;
