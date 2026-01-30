"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import SettlementSummary from "@/components/SettlementSummary";
import ExpenseList from "@/components/ExpenseList";
import AddExpenseButton from "@/components/AddExpenseButton";
import AddExpenseModal from "@/components/AddExpenseModal";
import { mockSummary, mockExpenses } from "@/data/mockData";

export default function Home() {
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex justify-center">
      {/* Mobile Wrapper */}
      <div className="w-full max-w-md bg-background shadow-xl h-[100dvh] relative flex flex-col overflow-hidden">
        <Header title={mockSummary.groupTitle} />

        <main className="flex-1 overflow-y-auto pt-[50px]">
          <SettlementSummary summary={mockSummary} />
          <ExpenseList expenses={mockExpenses} />
        </main>

        <AddExpenseButton onClick={() => setIsAddExpenseModalOpen(true)} />

        <AddExpenseModal
          isOpen={isAddExpenseModalOpen}
          onClose={() => setIsAddExpenseModalOpen(false)}
        />
      </div>
    </div>
  );
}
