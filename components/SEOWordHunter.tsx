import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Trophy, AlertCircle, Play, RotateCcw } from 'lucide-react';

interface Word {
    id: number;
    text: string;
    x: number;
    y: number;
    speed: number;
}

const KEYWORDS = [
    'SEO', 'REACT', 'WEB', 'DESIGN', 'CODE', 'PIXEL', 'PRO', 'SHOP', 'APP', 'DATA',
    'CLOUD', 'API', 'CSS', 'HTML', 'JS', 'NODE', 'GIT', 'UI', 'UX', 'BRAND',
    'LOGO', 'ART', 'TECH', 'FAST', 'GROW', 'SALE', 'LEAD', 'RANK', 'HOST', 'BOT'
];

const SEOWordHunter: React.FC = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [level, setLevel] = useState(1);

    const gameLoopRef = useRef<number | null>(null);
    const spawnRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const spawnWord = useCallback(() => {
        if (!containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const id = Date.now();
        const text = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
        const x = Math.random() * (width - 100); // Keep within bounds
        const speed = 1 + (level * 0.2);

        setWords(prev => [...prev, { id, text, x, y: -50, speed }]);
    }, [level]);

    // Game Loop
    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const loop = () => {
            setWords(prev => {
                const newWords = prev.map(w => ({ ...w, y: w.y + w.speed }));

                // Check for words hitting bottom
                const missed = newWords.filter(w => w.y > 400); // Assuming container height 400
                if (missed.length > 0) {
                    setLives(l => {
                        const newLives = l - missed.length;
                        if (newLives <= 0) {
                            setGameOver(true);
                            setIsPlaying(false);
                        }
                        return Math.max(0, newLives);
                    });
                    return newWords.filter(w => w.y <= 400);
                }

                return newWords;
            });

            gameLoopRef.current = requestAnimationFrame(loop);
        };

        gameLoopRef.current = requestAnimationFrame(loop);

        // Spawn words
        const spawnInterval = Math.max(1000, 2000 - (level * 100));
        spawnRef.current = window.setInterval(spawnWord, spawnInterval);

        return () => {
            if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
            if (spawnRef.current) clearInterval(spawnRef.current);
        };
    }, [isPlaying, gameOver, level, spawnWord]);

    // Handle Input
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        setInput(val);

        const match = words.find(w => w.text === val);
        if (match) {
            setWords(prev => prev.filter(w => w.id !== match.id));
            setScore(s => s + 10);
            setInput('');

            // Level up every 50 points
            if ((score + 10) % 50 === 0) {
                setLevel(l => l + 1);
            }
        }
    };

    const startGame = () => {
        setWords([]);
        setScore(0);
        setLives(3);
        setLevel(1);
        setInput('');
        setGameOver(false);
        setIsPlaying(true);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-3xl shadow-2xl max-w-2xl mx-auto border border-slate-800 w-full">
            <div className="flex justify-between items-center w-full mb-6 text-white">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Search className="text-blue-500" /> SEO Word Hunter
                    </h3>
                    <p className="text-xs text-slate-400">Type the keywords before they fall!</p>
                </div>
                <div className="flex gap-6">
                    <div className="text-center">
                        <div className="text-xs text-slate-500">SCORE</div>
                        <div className="text-xl font-mono font-bold text-green-400">{score}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-slate-500">LIVES</div>
                        <div className="flex gap-1">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-full ${i < lives ? 'bg-red-500' : 'bg-slate-700'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref={containerRef}
                className="relative bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-inner w-full h-[400px] mb-6"
            >
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
                        backgroundSize: `40px 40px`
                    }}
                ></div>

                {/* Words */}
                {words.map(word => (
                    <div
                        key={word.id}
                        className="absolute px-3 py-1 bg-blue-600/80 text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm border border-blue-400/30 transition-transform"
                        style={{
                            left: word.x,
                            top: word.y,
                        }}
                    >
                        {word.text}
                    </div>
                ))}

                {/* Game Over Overlay */}
                {gameOver && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-fade-in">
                        <AlertCircle size={48} className="text-red-500 mb-4" />
                        <h4 className="text-3xl font-bold text-white mb-2">System Crash!</h4>
                        <p className="text-slate-300 mb-6">Final Score: {score}</p>
                        <button
                            onClick={startGame}
                            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-500/25"
                        >
                            <RotateCcw size={18} /> Reboot System
                        </button>
                    </div>
                )}

                {/* Start Overlay */}
                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <button
                            onClick={startGame}
                            className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-500 hover:scale-110 transition-all shadow-xl mb-4"
                        >
                            <Play size={40} className="ml-2" />
                        </button>
                        <p className="text-white font-medium">Click to Start</p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="w-full max-w-md relative">
                <input
                    type="text"
                    value={input}
                    onChange={handleInput}
                    disabled={!isPlaying || gameOver}
                    placeholder={isPlaying ? "TYPE KEYWORDS HERE..." : "PRESS START"}
                    className="w-full bg-slate-800 text-white px-6 py-4 rounded-full border-2 border-slate-700 focus:border-blue-500 focus:outline-none text-center text-xl font-mono tracking-widest placeholder:text-slate-600 uppercase transition-all shadow-lg"
                    autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Search size={20} />
                </div>
            </div>
        </div>
    );
};

export default SEOWordHunter;
