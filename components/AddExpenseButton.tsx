import React from 'react';

const AddExpenseButton: React.FC = () => {
    return (
        <div className="absolute bottom-8 left-0 right-0 px-6 z-20 flex justify-center pointer-events-none">
            <button className="bg-foreground text-background font-semibold px-6 py-3.5 rounded-full shadow-lg hover:checkbox-accent hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 pointer-events-auto cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                지출 추가
            </button>
        </div>
    );
};

export default AddExpenseButton;
