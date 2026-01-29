import Header from "@/components/Header";
import SettlementSummary from "@/components/SettlementSummary";
import ExpenseList from "@/components/ExpenseList";
import AddExpenseButton from "@/components/AddExpenseButton";
import { mockSummary, mockExpenses } from "@/data/mockData";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      {/* Mobile Wrapper */}
      <div className="w-full max-w-md bg-white shadow-xl h-screen relative flex flex-col overflow-hidden">
        <Header title={mockSummary.groupTitle} />

        <main className="flex-1 overflow-y-auto pt-[50px]">
          <SettlementSummary summary={mockSummary} />
          <ExpenseList expenses={mockExpenses} />
        </main>

        <AddExpenseButton />
      </div>
    </div>
  );
}
