"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettlement } from '@/context/SettlementContext';
import MemberDeleteModal from '@/components/setting/modals/MemberDeleteModal';
import UnsavedChangesModal from '@/components/setting/modals/UnsavedChangesModal';
import { Participant } from '@/types';

export default function SettingsPage() {
    const router = useRouter();
    const {
        groupTitle: contextGroupTitle,
        updateGroupTitle,
        participants: contextParticipants,
        setParticipants,
        myId: contextMyId,
        setMyId
    } = useSettlement();

    // Local State
    const [localGroupTitle, setLocalGroupTitle] = useState('');
    const [localParticipants, setLocalParticipants] = useState<Participant[]>([]);
    const [localMyId, setLocalMyId] = useState<string>('');

    const [newMemberName, setNewMemberName] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
    const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);

    // Initialize local state from context on mount
    useEffect(() => {
        setLocalGroupTitle(contextGroupTitle);
        setLocalParticipants(contextParticipants);
        setLocalMyId(contextMyId);
    }, [contextGroupTitle, contextParticipants, contextMyId]);

    const isDirty = () => {
        const titleChanged = localGroupTitle !== contextGroupTitle;
        const myIdChanged = localMyId !== contextMyId;
        const participantsChanged = JSON.stringify(localParticipants) !== JSON.stringify(contextParticipants);

        return titleChanged || myIdChanged || participantsChanged;
    };

    const handleBack = () => {
        if (isDirty()) {
            setIsUnsavedChangesModalOpen(true);
        } else {
            router.back();
        }
    };

    const handleDiscard = () => {
        setIsUnsavedChangesModalOpen(false);
        router.back();
    };

    const handleSave = () => {
        updateGroupTitle(localGroupTitle);
        setMyId(localMyId);
        setParticipants(localParticipants);
        // Optionally show feedback here
        console.log("Settings saved");
    };

    // --- Helper Functions mapped to local state ---

    const handleLocalAddParticipant = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMemberName.trim()) {
            const newId = String(Date.now()); // Temporary ID generation for local state
            setLocalParticipants(prev => [...prev, { id: newId, name: newMemberName.trim() }]);
            setNewMemberName('');
        }
    };

    const handleLocalUpdateParticipantName = (id: string, name: string) => {
        setLocalParticipants(prev => prev.map(p => p.id === id ? { ...p, name } : p));
    };

    const initiateDelete = (id: string) => {
        setMemberToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (memberToDelete) {
            setLocalParticipants(prev => prev.filter(p => p.id !== memberToDelete));
            if (localMyId === memberToDelete && localParticipants.length > 0) {
                // Reset myId if I deleted myself. 
                // Note: logic slightly flawed if participants empty, but handle gracefully.
                const remaining = localParticipants.filter(p => p.id !== memberToDelete);
                if (remaining.length > 0) {
                    setLocalMyId(remaining[0].id);
                } else {
                    setLocalMyId(''); // Or handle otherwise
                }
            }
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
        }
    };

    const getMemberName = (id: string) => {
        return localParticipants.find(p => p.id === id)?.name || '';
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 flex justify-center">
            <div className="w-full max-w-md bg-background shadow-xl h-[100dvh] relative flex flex-col overflow-hidden">
                {/* Header */}
                <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold">정산 설정</h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
                    {/* Group Title Section */}
                    <section className="space-y-3">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">
                            모임 이름
                        </label>
                        <input
                            type="text"
                            value={localGroupTitle}
                            onChange={(e) => setLocalGroupTitle(e.target.value)}
                            className="w-full bg-white px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none text-lg font-bold shadow-sm transition-all"
                        />
                    </section>

                    {/* Members Section */}
                    <section className="space-y-4">
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide ml-1">
                            멤버 관리
                        </label>

                        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100/50 space-y-4">
                            {localParticipants.map((person) => (
                                <div key={person.id} className="flex items-center gap-3">
                                    {/* Me Selection Radio */}
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="localMyId"
                                            checked={localMyId === person.id}
                                            onChange={() => setLocalMyId(person.id)}
                                            className="appearance-none w-6 h-6 rounded-full border-2 border-gray-300 checked:border-blue-500 checked:bg-blue-500 transition-all cursor-pointer"
                                        />
                                        <div className="absolute pointer-events-none w-2.5 h-2.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Name Input */}
                                    <input
                                        type="text"
                                        value={person.name}
                                        onChange={(e) => handleLocalUpdateParticipantName(person.id, e.target.value)}
                                        className="flex-1 min-w-0 bg-gray-50 px-4 py-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none font-medium transition-all"
                                    />

                                    {localMyId === person.id ? (
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
                        <form onSubmit={handleLocalAddParticipant} className="flex gap-2">
                            <input
                                type="text"
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                placeholder="새 멤버 이름"
                                className="flex-1 min-w-0 bg-white px-4 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:outline-none shadow-sm font-medium transition-all"
                            />
                            <button
                                type="submit"
                                disabled={!newMemberName.trim()}
                                className="flex-none bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none hover:bg-blue-700 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </form>
                    </section>
                </main>

                {/* Footer with Save Button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 pb-8 flex justify-center">
                    <button
                        onClick={handleSave}
                        className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${isDirty()
                            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                            : 'bg-gray-300 cursor-not-allowed shadow-none'}`}
                        disabled={!isDirty()}
                    >
                        저장
                    </button>
                </div>

                <MemberDeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    memberName={memberToDelete ? getMemberName(memberToDelete) : ''}
                />

                <UnsavedChangesModal
                    isOpen={isUnsavedChangesModalOpen}
                    onClose={() => setIsUnsavedChangesModalOpen(false)}
                    onDiscard={handleDiscard}
                />
            </div>
        </div>
    );
}
