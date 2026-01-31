"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Participant } from '@/types';
import { PARTICIPANTS, GROUP_TITLE } from '@/data/mockData';

interface SettlementContextType {
    groupTitle: string;
    updateGroupTitle: (title: string) => void;
    participants: Participant[];
    updateParticipantName: (id: string, name: string) => void;
    addParticipant: (name: string) => void;
    removeParticipant: (id: string) => void;
    myId: string;
    setMyId: (id: string) => void;
}

const SettlementContext = createContext<SettlementContextType | undefined>(undefined);

export const SettlementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [groupTitle, setGroupTitle] = useState(GROUP_TITLE);
    const [participants, setParticipants] = useState<Participant[]>(PARTICIPANTS);
    const [myId, setMyId] = useState(PARTICIPANTS[0].id); // Default to first user

    const updateGroupTitle = (title: string) => {
        setGroupTitle(title);
    };

    const updateParticipantName = (id: string, name: string) => {
        setParticipants(prev => prev.map(p => p.id === id ? { ...p, name } : p));
    };

    const addParticipant = (name: string) => {
        const newId = String(participants.length + 1); // Simple ID generation
        setParticipants(prev => [...prev, { id: newId, name }]);
    };

    const removeParticipant = (id: string) => {
        setParticipants(prev => prev.filter(p => p.id !== id));
        if (myId === id) {
            setMyId(participants[0].id); // Reset to first user if current user is removed
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
