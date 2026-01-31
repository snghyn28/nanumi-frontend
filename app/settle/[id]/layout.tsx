"use client";

import { SettlementProvider } from '@/context/SettlementContext';

export default function SettlementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SettlementProvider>
            {children}
        </SettlementProvider>
    );
}
