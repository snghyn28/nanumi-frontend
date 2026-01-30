"use client";

import React, { useState } from 'react';
import { Expense } from '@/data/mockData';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import DeleteModal from './DeleteModal';

import { useRouter } from 'next/navigation';

interface ExpenseCardProps {
    expense: Expense;
    isLast: boolean;
    isParticipant: boolean;
    borrower?: string;
    showDate?: boolean;
    onClick?: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, isLast, isParticipant, borrower, showDate = true, onClick }) => {
    const router = useRouter();

    // Format date specifically: e.g., "5.1"
    const dateObj = new Date(expense.date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const formattedDate = `${month}.${day}`;

    // Format amount
    const formattedAmount = new Intl.NumberFormat('en-US').format(expense.amount);

    const controls = useAnimation();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        if (info.offset.x > 50) {
            // Swiped right enough
            setIsDeleteModalOpen(true);
        } else {
            // Snap back
            controls.start({ x: 0 });
        }
    };

    const handleClick = () => {
        if (!isDragging && !isDeleteModalOpen) {
            if (onClick) {
                onClick();
            } else {
                router.push('/test');
            }
        }
    };

    const handleCloseModal = () => {
        setIsDeleteModalOpen(false);
        controls.start({ x: 0 });
    };

    const handleConfirmDelete = () => {
        // Implement delete logic here later
        console.log('Deleted expense:', expense.id);
        setIsDeleteModalOpen(false);
        controls.start({ x: 0 }); // Or animate out
    };

    return (
        <div className="flex gap-4 relative">
            {/* Timeline Line */}
            <div
                className={`absolute left-[15px] w-[2px] bg-gray-100 ${showDate ? "top-8" : "top-0"} bottom-[-16px]`}
            />

            {/* Date Circle */}
            <div className="relative z-10 flex-shrink-0 w-8 flex justify-center">
                {showDate && (
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100/50 shadow-sm">
                        <span className="text-[10px] font-bold text-gray-400">{formattedDate}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4 min-w-0 relative group">
                {/* Delete Background */}
                <div className="absolute inset-y-0 left-0 w-full bg-red-500 rounded-2xl flex items-center justify-start px-6 mb-6 transform scale-[0.98]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </div>

                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 100 }}
                    dragElastic={{ left: 0, right: 0.1 }}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    animate={controls}
                    whileTap={{ cursor: "grabbing" }}
                    onClick={handleClick}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/60 hover:shadow-md transition-shadow duration-200 relative cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-base font-semibold text-foreground truncate pr-2">{expense.title}</h3>
                        <span className={`font-bold whitespace-nowrap ${isParticipant ? "text-accent" : "text-gray-500"}`}>
                            {formattedAmount}원
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">{expense.payer}</span>
                            {borrower && (
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-gray-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                    <span className="font-semibold">{borrower}</span>
                                </span>
                            )}
                        </div>
                        {borrower ? '대여' : <span>참여 <span className="font-semibold">{expense.participants}명</span></span>}
                    </div>
                </motion.div>
            </div >

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </div >
    );
};

export default ExpenseCard;
