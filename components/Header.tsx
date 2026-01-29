import { ArrowLeftIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-gray-100">
            <button className="p-2 -ml-2 text-foreground active:opacity-70 transition-opacity">
                <ArrowLeftIcon className="w-6 h-6" />
            </button>

            <h1 className="font-semibold text-base text-foreground truncate max-w-[60%]">
                {title}
            </h1>

            <button className="p-2 -mr-2 text-foreground active:opacity-70 transition-opacity">
                <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>
        </header>
    );
}
