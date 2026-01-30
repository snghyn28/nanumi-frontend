"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import SettlementSummary from "@/components/SettlementSummary";
import ExpenseList from "@/components/ExpenseList";
import AddExpenseButton from "@/components/AddExpenseButton";
import AddExpenseModal from "@/components/AddExpenseModal";
import ExpenseDetailModal from "@/components/ExpenseDetailModal";
import { mockSummary, mockExpenses, getExpenseDetail, ExpenseDetail } from "@/data/mockData";

export default function Home() {
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
        <Header title={mockSummary.groupTitle} />

        <main className="flex-1 overflow-y-auto pt-[50px]">
          <SettlementSummary summary={mockSummary} />
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
