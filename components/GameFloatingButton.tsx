import React from 'react';
import { Gamepad2 } from 'lucide-react';

interface GameFloatingButtonProps {
    onClick: () => void;
}

const GameFloatingButton: React.FC<GameFloatingButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed right-6 bottom-6 z-40 group flex items-center justify-center"
            aria-label="Open Games"
        >
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20 group-hover:opacity-40"></div>
            <div className="relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white transform transition-transform group-hover:scale-110 group-hover:rotate-12 border-2 border-white/20">
                <Gamepad2 size={24} />
            </div>
            <div className="absolute right-full mr-3 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Play Games
            </div>
        </button>
    );
};

export default GameFloatingButton;
