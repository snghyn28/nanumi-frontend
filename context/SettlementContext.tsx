"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { Participant } from '@/types';
import { PARTICIPANTS, GROUP_TITLE } from '@/data/mockData';

interface SettlementContextType {
    groupTitle: string;
    updateGroupTitle: (title: string) => void;
    participants: Participant[];
    updateParticipantName: (id: string, name: string) => void;
    addParticipant: (name: string) => void;
    removeParticipant: (id: string) => void;
    setParticipants: (participants: Participant[]) => void;
    myId: string;
    setMyId: (id: string) => void;
}

const SettlementContext = createContext<SettlementContextType | undefined>(undefined);

export const SettlementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const params = useParams();
    const settlementId = params?.id as string | undefined;

    const [groupTitle, setGroupTitle] = useState(GROUP_TITLE);
    const [participants, setParticipants] = useState<Participant[]>(PARTICIPANTS);
    const [myId, setMyId] = useState(PARTICIPANTS[0].id);

    React.useEffect(() => {
        if (!settlementId) return;

        const storageKey = `nanumi_data_${settlementId}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.groupTitle) setGroupTitle(parsed.groupTitle);
                if (parsed.participants) {
                    setParticipants(parsed.participants);
                    // Ensure myId is valid
                    if (!parsed.participants.some((p: Participant) => p.id === myId)) {
                        setMyId(parsed.participants[0]?.id || '');
                    }
                }
            } catch (e) {
                console.error("Failed to load settlement data", e);
            }
        }
    }, [settlementId]);

    // 3. Save to LocalStorage on changes
    React.useEffect(() => {
        if (!settlementId) return;

        const storageKey = `nanumi_data_${settlementId}`;
        const dataToSave = {
            groupTitle,
            participants,
            // We could save 'myId' too if that's per-device setting, but context might handle shared data vs local prefs differently. 
            // For now let's just save the shared data.
        };
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
    }, [settlementId, groupTitle, participants]);

    const updateGroupTitle = (title: string) => {
        setGroupTitle(title);
    };

    const updateParticipantName = (id: string, name: string) => {
        setParticipants(prev => prev.map(p => p.id === id ? { ...p, name } : p));
    };

    const addParticipant = (name: string) => {
        const newId = String(Date.now()); // Improved ID generation for consistency
        setParticipants(prev => [...prev, { id: newId, name }]);
    };

    const removeParticipant = (id: string) => {
        setParticipants(prev => prev.filter(p => p.id !== id));
        if (myId === id) {
            setMyId(participants.find(p => p.id !== id)?.id || '');
        }
    };

    return (
        <SettlementContext.Provider value={{
            groupTitle,
            updateGroupTitle,
            participants,
            updateParticipantName,
            addParticipant,
            removeParticipant,
            setParticipants,
            myId,
            setMyId
        }}>
            {children}
        </SettlementContext.Provider>
    );
};

export const useSettlement = () => {
    const context = useContext(SettlementContext);
    if (context === undefined) {
        throw new Error('useSettlement must be used within a SettlementProvider');
    }
    return context;
};
