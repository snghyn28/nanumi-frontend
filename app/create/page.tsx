"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/settle/Header';
import Toast from '@/components/shared/Toast';

export default function CreatePage() {
    const router = useRouter();

    // Form State
    const [groupTitle, setGroupTitle] = useState('');
    const [myName, setMyName] = useState('');
    const [members, setMembers] = useState<string[]>([]);
    const [newMemberName, setNewMemberName] = useState('');

    // UI State
    const [isToastVisible, setIsToastVisible] = useState(false);

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMemberName.trim()) {
            setMembers([...members, newMemberName.trim()]);
            setNewMemberName('');
        }
    };

    const handleRemoveMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            } catch (fallbackErr) {
                return false;
            }
        }
    };

    const handleCreate = async () => {
        if (!groupTitle.trim() || !myName.trim()) return;

        // 1. Generate ID
        const newId = crypto.randomUUID ? crypto.randomUUID() : `settle-${Date.now()}`;

        // 2. Prepare Data
        const myId = String(Date.now());
        const participantData = [
            { id: myId, name: myName.trim() },
            ...members.map((name, idx) => ({
                id: String(Date.now() + idx + 1),
                name: name.trim()
            }))
        ];

        const settlementData = {
            groupTitle: groupTitle.trim(),
            participants: participantData,
        };

        // 3. Save to LocalStorage
        localStorage.setItem(`nanumi_data_${newId}`, JSON.stringify(settlementData));

        // 4. Update History
        const recentKey = 'nanumi_recent_settlements';
        const recent = JSON.parse(localStorage.getItem(recentKey) || '[]');
        const newHistoryItem = {
            id: newId,
            title: groupTitle.trim(),
            lastAccess: Date.now()
        };
        localStorage.setItem(recentKey, JSON.stringify([newHistoryItem, ...recent]));

        // 5. Copy Link & Notify
        const link = `${window.location.origin}/settle/${newId}`;
        const copied = await copyToClipboard(link);

        if (copied) {
            setIsToastVisible(true);
            setTimeout(() => {
                router.push(`/settle/${newId}`);
            }, 1000);
        } else {
            router.push(`/settle/${newId}`);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-gray-50 flex justify-center">
            <div className="w-full max-w-md bg-white shadow-xl h-[100dvh] relative flex flex-col overflow-hidden">
                <header className="px-6 py-4 flex items-center border-b border-gray-100 bg-white sticky top-0 z-10">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-bold">새 정산 모임 만들기</h1>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                    {/* Group Name */}
                    <section className="space-y-3">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-1">
                            모임 이름
                        </label>
                        <input
                            type="text"
                            value={groupTitle}
                            onChange={(e) => setGroupTitle(e.target.value)}
                            placeholder="예) 제주도 3박4일, 7월 회식"
                            className="w-full bg-gray-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-lg font-bold placeholder-gray-300"
                            autoFocus
                        />
                    </section>

                    {/* My Name */}
                    <section className="space-y-3">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-1">
                            나의 이름
                        </label>
                        <input
                            type="text"
                            value={myName}
                            onChange={(e) => setMyName(e.target.value)}
                            placeholder="본명 또는 닉네임"
                            className="w-full bg-gray-50 px-4 py-3 rounded-2xl border-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-lg font-semibold placeholder-gray-300"
                        />
                    </section>

                    {/* Members */}
                    <section className="space-y-3">
                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wide ml-1">
                            함께하는 멤버 <span className="text-gray-400 text-xs font-normal normal-case ml-1">({members.length}명)</span>
                        </label>

                        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                            {/* Member List */}
                            {members.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {members.map((member, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                                            <span className="font-medium text-gray-800">{member}</span>
                                            <button
                                                onClick={() => handleRemoveMember(idx)}
                                                className="text-gray-400 hover:text-red-500 p-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Form */}
                            <form onSubmit={handleAddMember} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                    placeholder="멤버 이름 입력"
                                    className="flex-1 min-w-0 bg-white px-4 py-3 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all font-medium placeholder-gray-300"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMemberName.trim()}
                                    className="bg-gray-900 text-white p-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-gray-900 transition-colors shrink-0"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </section>
                </main>

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 pb-8">
                    <div className="pb-3 text-center">
                        <p className="text-xs text-gray-400">
                            모임 이름과 멤버는 나중에 설정에서 언제든지 수정할 수 있어요.
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={!groupTitle.trim() || !myName.trim()}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        정산 모임 만들기
                    </button>
                </div>

                <Toast
                    message="링크가 복사됐습니다"
                    isVisible={isToastVisible}
                    onClose={() => setIsToastVisible(false)}
                />
            </div>
        </div>
    );
}
