import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSettlement } from '@/context/SettlementContext';
import { Participant } from '@/types';
import SplitMode from './SplitMode';
import IndividualMode from './IndividualMode';
import LoanMode from './LoanMode';

interface AddExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TABS = ['1/N', '각자 분담', '대여'];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
    const { participants, myId } = useSettlement();
    const [selectedTab, setSelectedTab] = useState(TABS[0]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [amountType, setAmountType] = useState<'total' | 'perPerson'>('total');

    // Shared State
    const [date, setDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    // Split Mode State
    // We need to initialize state based on participants, but hooks cannot be conditional or dependent on changing props in a way that breaks rules.
    // However, participants come from context.
    const [selectedPayer, setSelectedPayer] = useState<Participant | null>(null);

    // Initialize defaults when participants load or modal opens? 
    // For simplicity, we can default to participants[0] if available during render, or handle null.
    // But useState(participants[0]) only runs once. If participants are empty initially?
    // Let's assume participants are always loaded or we handle it.

    // Better: use useEffect to set default payer if not set?

    // Actually, let's keep it simple. If participants might change, we should probably derive defaults or use Effects.
    // But for this refactor, let's stick to simple state, initialized lazily or updated via effect.

    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);

    React.useEffect(() => {
        if (participants.length > 0 && !selectedPayer) {
            setSelectedPayer(participants[0]);
            setSelectedParticipantIds(participants.map(p => p.id));
            setLender(participants[0]);
            setBorrower(participants[1] || participants[0]);
        }
    }, [participants]);

    // Individual Mode State
    const [individualAmounts, setIndividualAmounts] = useState<Record<string, string>>({});

    // Loan Mode State
    const [lender, setLender] = useState<Participant | null>(null);
    const [borrower, setBorrower] = useState<Participant | null>(null);


    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setAmount(value ? Number(value).toLocaleString() : '');
    };

    if (!selectedPayer || !lender || !borrower) return null; // Wait for initialization

    const renderModeContent = () => {
        switch (selectedTab) {
            case '1/N':
                return (
                    <SplitMode
                        participants={participants}
                        amount={amount}
                        onAmountChange={handleAmountChange}
                        amountType={amountType}
                        onAmountTypeChange={setAmountType}
                        payer={selectedPayer!}
                        onPayerChange={setSelectedPayer}
                        selectedParticipantIds={selectedParticipantIds}
                        onParticipantsChange={setSelectedParticipantIds}
                        date={date}
                        onDateChange={setDate}
                        myId={myId}
                    />
                );
            case '각자 분담':
                return (
                    <IndividualMode
                        participants={participants}
                        amounts={individualAmounts}
                        onAmountsChange={setIndividualAmounts}
                        payer={selectedPayer!}
                        onPayerChange={setSelectedPayer}
                        date={date}
                        onDateChange={setDate}
                        myId={myId}
                    />
                );
            case '대여':
                return (
                    <LoanMode
                        participants={participants}
                        amount={amount}
                        onAmountChange={handleAmountChange}
                        lender={lender!}
                        onLenderChange={setLender}
                        borrower={borrower!}
                        onBorrowerChange={setBorrower}
                        date={date}
                        onDateChange={setDate}
                        myId={myId}
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
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={{ top: 0, bottom: 0.2 }} // Reduced elastic for bottom slightly
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                                onClose();
                            }
                        }}
                    >
                        <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl pointer-events-auto h-[85dvh] flex flex-col">
                            {/* Handle for visual cues */}
                            <div className="pt-5 pb-2 px-6 flex-none">
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3" />
                                <h2 className="text-xl font-bold text-gray-900 mb-2">지출 추가</h2>
                            </div>

                            {/* Content based on Tab */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {/* Title Input */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-gray-500 ml-1 mb-1 block">사용처</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="예) 카페, 점심, 숙소"
                                        className="w-full text-xl font-bold border-b-2 border-gray-100 py-2 px-1 focus:border-gray-800 focus:outline-none bg-transparent placeholder-gray-300 transition-colors"
                                    />
                                </div>

                                {/* Segmented Tabs */}
                                <div className="bg-gray-100 p-1 rounded-xl flex relative mb-6">
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
