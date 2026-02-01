"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSettlement } from '@/context/SettlementContext';
import { mockSettlementDetail } from '@/data/mockData';
import SettlementRepaymentModal from '@/components/settlement/SettlementRepaymentModal';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SettlementDetailPage() {
    const router = useRouter();
    const { myId } = useSettlement();
    // Using state for summary to allow (mock) updates
    const [summary, setSummary] = useState(mockSettlementDetail);

    // Modal State
    const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<typeof summary.details[0] | null>(null);


    const isReceive = summary.type === 'receive';
    const amountColor = isReceive ? 'text-green-500' : 'text-red-500'; // Updated to Green for receive, Red for pay
    const message = isReceive ? '내가 받을 돈' : '내가 지불할 돈';

    // Reusing the formatting logic
    const formattedTotalAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KRW',
        currencyDisplay: 'code'
    }).format(summary.totalAmount).replace('KRW', '').trim();


    // Unified sorted list: My details first, then others
    const sortedDetails = [...summary.details].sort((a, b) => {
        const aIsMyRelated = a.debtor.id === myId || a.creditor.id === myId;
        const bIsMyRelated = b.debtor.id === myId || b.creditor.id === myId;
        if (aIsMyRelated && !bIsMyRelated) return -1;
        if (!aIsMyRelated && bIsMyRelated) return 1;
        return 0;
    });

    const handleRepaymentClick = (detail: typeof summary.details[0]) => {
        setSelectedDetail(detail);
        setIsRepaymentModalOpen(true);
    };

    const handleRepaymentConfirm = (amount: number) => {
        // Here you would typically make an API call.
        // For now, we'll just log it.
        console.log(`Repayment confirmed: ${amount} won from ${selectedDetail?.debtor.name} to ${selectedDetail?.creditor.name}`);

        // Local state update removed as per request (will be handled by API later)

        setIsRepaymentModalOpen(false); // Close modal after confirmation
    };

    const renderDetailItem = (detail: typeof summary.details[0]) => {
        const isMeDebtor = detail.debtor.id === myId;
        const isMeCreditor = detail.creditor.id === myId;
        const isMyRelated = isMeDebtor || isMeCreditor;

        // Styling: Uniform container and text, distinct amount color
        const containerClass = "bg-white shadow-sm border border-gray-100";
        const textColor = "text-gray-900";
        const arrowColor = "text-gray-300";

        // Amount color: Blue for me, Gray for others
        const amountTextClass = isMyRelated ? "text-blue-600 font-bold" : "text-gray-400 font-medium";

        return (
            <motion.div
                key={`${detail.debtor.id}-${detail.creditor.id}`}
                layout // Animate layout changes when items are removed
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-2xl ${containerClass}`}
            >
                <div className="flex items-center justify-between mb-3">
                    {/* Debtor (Left) */}
                    <div className={`flex-1 text-left font-semibold text-lg ${textColor}`}>
                        {detail.debtor.name}
                        {isMeDebtor && <span className="ml-1 text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded align-middle">나</span>}
                    </div>

                    {/* Arrow (Center) */}
                    <div className={`flex items-center flex-[0.5] justify-center ${arrowColor} px-2`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {/* Creditor (Right) */}
                    <div className={`flex-1 text-right font-semibold text-lg ${textColor}`}>
                        {detail.creditor.name}
                        {isMeCreditor && <span className="ml-1 text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded align-middle">나</span>}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className={`text-lg ${amountTextClass}`}>
                        {detail.amount.toLocaleString()}원
                    </span>
                    <button
                        onClick={() => handleRepaymentClick(detail)}
                        className="px-4 py-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-lg transition-colors shadow-sm active:scale-95"
                    >
                        정산 완료
                    </button>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 flex justify-center">
            <div className="w-full max-w-md bg-background shadow-xl h-[100dvh] relative flex flex-col overflow-hidden">
                {/* Header */}
                <header className="px-6 py-4 flex items-center border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold">정산 상세</h1>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {/* Top Summary Section */}
                    <div className="px-6 py-10 bg-white border-b border-gray-100">
                        <p className="text-gray-500 text-sm mb-1 font-medium text-center">{message}</p>
                        <div className={`text-4xl font-bold tracking-tighter ${amountColor} text-center mb-2`}>
                            {formattedTotalAmount}<span className="text-2xl text-foreground/80 text-gray-900"> 원</span>
                        </div>
                    </div>

                    {/* Details List */}
                    <div className="p-6 space-y-3">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-1 mb-3">
                            상세 내역
                        </h3>
                        {sortedDetails.map(detail => renderDetailItem(detail))}

                        {sortedDetails.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                정산할 내역이 없습니다.
                            </div>
                        )}
                    </div>
                </main>

                {selectedDetail && (
                    <SettlementRepaymentModal
                        isOpen={isRepaymentModalOpen}
                        onClose={() => setIsRepaymentModalOpen(false)}
                        totalAmount={selectedDetail.amount}
                        debtorName={selectedDetail.debtor.name}
                        creditorName={selectedDetail.creditor.name}
                        onConfirm={handleRepaymentConfirm}
                    />
                )}
            </div>
        </div>
    );
}
