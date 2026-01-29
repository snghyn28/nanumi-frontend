import React from 'react';
import { SettlementSummary as SummaryType } from '@/data/mockData';

interface SettlementSummaryProps {
    summary: SummaryType;
}

const SettlementSummary: React.FC<SettlementSummaryProps> = ({ summary }) => {
    const isReceive = summary.type === 'receive';
    const amountColor = isReceive ? 'text-receive' : 'text-pay';
    const message = isReceive ? 'You will receive' : 'You need to pay';

    // Format currency
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KRW',
        currencyDisplay: 'code'
    }).format(summary.totalAmount).replace('KRW', '').trim();

    return (
        <div className="px-6 py-8 bg-background">
            <p className="text-gray-500 text-sm mb-1 font-medium">{message}</p>
            <div className={`text-4xl font-bold tracking-tighter ${amountColor} mb-6`}>
                {formattedAmount} <span className="text-2xl text-foreground/80">KRW</span>
            </div>
            <button className="flex items-center text-sm font-medium text-gray-500 hover:text-foreground transition-colors group">
                View settlement details
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    );
};

export default SettlementSummary;
