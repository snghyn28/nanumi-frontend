import React from 'react';
import { Settlement as SummaryType } from '@/types';

import Link from 'next/link';

interface SettlementSummaryProps {
    summary: SummaryType;
    detailLink?: string;
}

const SettlementSummary: React.FC<SettlementSummaryProps> = ({ summary, detailLink }) => {
    const isReceive = summary.type === 'receive';
    const amountColor = isReceive ? 'text-receive' : 'text-pay';
    const message = isReceive ? '내가 받을 돈' : '내가 지불할 돈';

    // Format currency
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KRW',
        currencyDisplay: 'code'
    }).format(summary.totalAmount).replace('KRW', '').trim();

    return (
        <div className="px-6 py-8 bg-background">
            <p className="text-gray-500 text-sm mb-1 font-medium">{message}</p>
            <div className={`text-4xl font-bold tracking-tighter ${amountColor} mb-2`}>
                {formattedAmount}<span className="text-2xl text-foreground/80"> 원</span>
            </div>
            {detailLink && (
                <Link href={detailLink} className="flex items-center text-sm font-bold text-blue-400 hover:text-blue-500 transition-colors group">
                    정산 상세 보기
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform mb-[1px]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </Link>
            )}
        </div>
    );
};

export default SettlementSummary;
