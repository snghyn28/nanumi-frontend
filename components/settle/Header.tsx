import React from 'react';
import Link from 'next/link';

import { Cog6ToothIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
    title: string;
    settingsLink?: string;
}

const Header: React.FC<HeaderProps> = ({ title, settingsLink }) => {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h1 className="text-lg font-bold text-foreground tracking-tight flex-1 min-w-0 truncate pr-2">{title}</h1>
            <Link href={settingsLink || "/test"} className="flex-shrink-0 ml-4 p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <Cog6ToothIcon className="w-6 h-6" />
            </Link>
        </header>
    );
};

export default Header;
