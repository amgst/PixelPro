import React, { useState } from 'react';
import { X, Gamepad2, Briefcase, Search } from 'lucide-react';
import PixelSnake from './PixelSnake';
import BusinessTycoon from './BusinessTycoon';
import SEOWordHunter from './SEOWordHunter';

interface GameModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GameModal: React.FC<GameModalProps> = ({ isOpen, onClose }) => {
    const [activeGame, setActiveGame] = useState<'snake' | 'tycoon' | 'seo' | null>(null);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-6xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Gamepad2 className="text-blue-500" /> PixelPro Arcade
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                    {!activeGame ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-center justify-center max-w-6xl mx-auto">
                            {/* Snake Card */}
                            <button
                                onClick={() => setActiveGame('snake')}
                                className="group relative h-72 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all hover:scale-105 focus:outline-none"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-slate-900 group-hover:from-green-800 transition-colors"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform">
                                        <Gamepad2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Pixel Snake</h3>
                                    <p className="text-slate-400">Classic snake game. Eat pixels, grow longer, beat the high score!</p>
                                </div>
                            </button>

                            {/* Tycoon Card */}
                            <button
                                onClick={() => setActiveGame('tycoon')}
                                className="group relative h-72 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all hover:scale-105 focus:outline-none"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 group-hover:from-blue-800 transition-colors"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                                        <Briefcase size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Agency Tycoon</h3>
                                    <p className="text-slate-400">Build your digital empire. Click to earn, hire team members, and grow!</p>
                                </div>
                            </button>

                            {/* SEO Hunter Card */}
                            <button
                                onClick={() => setActiveGame('seo')}
                                className="group relative h-72 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all hover:scale-105 focus:outline-none"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-slate-900 group-hover:from-purple-800 transition-colors"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                                        <Search size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">SEO Hunter</h3>
                                    <p className="text-slate-400">Type fast! Catch the falling keywords before they crash your rankings.</p>
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <button
                                onClick={() => setActiveGame(null)}
                                className="self-start mb-4 text-sm text-slate-400 hover:text-white flex items-center gap-1"
                            >
                                ← Back to Games
                            </button>
                            <div className="flex-1 flex items-center justify-center">
                                {activeGame === 'snake' && <PixelSnake />}
                                {activeGame === 'tycoon' && <BusinessTycoon />}
                                {activeGame === 'seo' && <SEOWordHunter />}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameModal;
