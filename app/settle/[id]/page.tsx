"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import SettlementSummary from "@/components/settlement/SettlementSummary";
import ExpenseList from "@/components/settlement/ExpenseList";
import AddExpenseButton from "@/components/settlement/AddExpenseButton";
import AddExpenseModal from "@/components/settlement/AddExpenseModal";
import ExpenseDetailModal from "@/components/settlement/ExpenseDetailModal";
import { mockSettlement, mockExpenses, getExpenseDetail } from "@/data/mockData";
import { ExpenseDetail } from "@/types";
import { useSettlement } from "@/context/SettlementContext";
import { useParams } from "next/navigation";

export default function SettlePage() {
    const { groupTitle } = useSettlement();
    const params = useParams();
    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
    const [selectedExpenseDetail, setSelectedExpenseDetail] = useState<ExpenseDetail | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleExpenseClick = (id: string) => {
        const detail = getExpenseDetail(id);
        if (detail) {
            setSelectedExpenseDetail(detail);
            setIsDetailModalOpen(true);
        } else {
            console.warn(`Expense detail not found for id: ${id}`);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 flex justify-center">
            {/* Mobile Wrapper */}
            <div className="w-full max-w-md bg-background shadow-xl h-[100dvh] relative flex flex-col overflow-hidden">
                <Header title={groupTitle} settingsLink={`/settle/${params.id}/settings`} />

                <main className="flex-1 overflow-y-auto pt-[50px]">
                    <SettlementSummary
                        summary={mockSettlement}
                        detailLink={`/settle/${params.id}/detail`}
                    />
                    <ExpenseList
                        expenses={mockExpenses}
                        onExpenseClick={handleExpenseClick}
                    />
                </main>

                <AddExpenseButton onClick={() => setIsAddExpenseModalOpen(true)} />

                <AddExpenseModal
                    isOpen={isAddExpenseModalOpen}
                    onClose={() => setIsAddExpenseModalOpen(false)}
                />

                <ExpenseDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    expenseDetail={selectedExpenseDetail}
                />
            </div>
        </div>
    );
}
