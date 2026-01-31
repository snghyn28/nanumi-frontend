"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSettlement } from '@/context/SettlementContext';
import { motion } from 'framer-motion';
import MemberDeleteModal from '@/components/MemberDeleteModal';

export default function SettingsPage() {
    const router = useRouter();
    const { groupTitle, updateGroupTitle, participants, updateParticipantName, addParticipant, removeParticipant, myId, setMyId } = useSettlement();
    const [newMemberName, setNewMemberName] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMemberName.trim()) {
            addParticipant(newMemberName.trim());
            setNewMemberName('');
        }
    };

    const initiateDelete = (id: string) => {
        setMemberToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (memberToDelete) {
            removeParticipant(memberToDelete);
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
        }
    };

    const getMemberName = (id: string) => {
        return participants.find(p => p.id === id)?.name || '';
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 flex justify-center">
            <div className="w-full max-w-md bg-background shadow-xl h-[100dvh] relative flex flex-col overflow-hidden">
                {/* Header */}
                <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold">정산 설정</h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Group Title Section */}
                    <section className="space-y-3">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">
                            모임 이름
                        </label>
                        <input
                            type="text"
                            value={groupTitle}
                            onChange={(e) => updateGroupTitle(e.target.value)}
                            className="w-full bg-white px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none text-lg font-bold shadow-sm transition-all"
                        />
                    </section>

                    {/* Members Section */}
                    <section className="space-y-4">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">
                            멤버 관리
                        </label>

                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100/50 space-y-4">
                            {participants.map((person) => (
                                <div key={person.id} className="flex items-center gap-3">
                                    {/* Me Selection Radio */}
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="myId"
                                            checked={myId === person.id}
                                            onChange={() => setMyId(person.id)}
                                            className="appearance-none w-6 h-6 rounded-full border-2 border-gray-300 checked:border-blue-500 checked:bg-blue-500 transition-all cursor-pointer"
                                        />
                                        <div className="absolute pointer-events-none w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Name Input */}
                                    <input
                                        type="text"
                                        value={person.name}
                                        onChange={(e) => updateParticipantName(person.id, e.target.value)}
                                        className="flex-1 min-w-0 bg-gray-50 px-4 py-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none font-medium transition-all"
                                    />

                                    {myId === person.id ? (
                                        <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg whitespace-nowrap">
                                            나
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => initiateDelete(person.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Member Form */}
                        <form onSubmit={handleAddMember} className="flex gap-2">
                            <input
                                type="text"
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                placeholder="새 멤버 이름"
                                className="flex-1 bg-white px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none shadow-sm font-medium transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newMemberName.trim()}
                                className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none hover:bg-blue-700 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </form>
                    </section>
                </main>

                <MemberDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    memberName={memberToDelete ? getMemberName(memberToDelete) : ''}
                />
            </div>
        </div>
    );
}
