import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
            <h1 className="text-lg font-bold text-foreground tracking-tight">{title}</h1>
        </header>
    );
};

export default Header;
