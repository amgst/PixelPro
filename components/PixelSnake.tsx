import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Trophy } from 'lucide-react';

// Game Constants
const GRID_SIZE = 20;
const CELL_SIZE = 20; // px
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const PixelSnake: React.FC = () => {
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 15, y: 10 });
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [speed, setSpeed] = useState(INITIAL_SPEED);

    const directionRef = useRef<Direction>('RIGHT');
    const gameLoopRef = useRef<number | null>(null);

    // Initialize high score from local storage
    useEffect(() => {
        const saved = localStorage.getItem('pixelSnakeHighScore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    // Handle keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying) return;

            switch (e.key) {
                case 'ArrowUp':
                    if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
                    break;
                case 'ArrowDown':
                    if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
                    break;
                case 'ArrowLeft':
                    if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
                    break;
                case 'ArrowRight':
                    if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]);

    // Generate random food position
    const generateFood = useCallback((): Point => {
        return {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
    }, []);

    // Game Loop
    const moveSnake = useCallback(() => {
        if (gameOver) return;

        setSnake(prevSnake => {
            const head = { ...prevSnake[0] };
            const currentDir = directionRef.current;
            setDirection(currentDir); // Update state for UI if needed

            switch (currentDir) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
            }

            // Check collisions
            if (
                head.x < 0 || head.x >= GRID_SIZE ||
                head.y < 0 || head.y >= GRID_SIZE ||
                prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
            ) {
                setGameOver(true);
                setIsPlaying(false);
                if (score > highScore) {
                    setHighScore(score);
                    localStorage.setItem('pixelSnakeHighScore', score.toString());
                }
                return prevSnake;
            }

            const newSnake = [head, ...prevSnake];

            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 10);
                setSpeed(s => Math.max(50, s - SPEED_INCREMENT));
                setFood(generateFood());
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    }, [food, gameOver, generateFood, highScore, score]);

    useEffect(() => {
        if (isPlaying && !gameOver) {
            gameLoopRef.current = window.setInterval(moveSnake, speed);
        } else {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        }
        return () => {
            if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        };
    }, [isPlaying, gameOver, moveSnake, speed]);

    const startGame = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(generateFood());
        setDirection('RIGHT');
        directionRef.current = 'RIGHT';
        setScore(0);
        setSpeed(INITIAL_SPEED);
        setGameOver(false);
        setIsPlaying(true);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-3xl shadow-2xl max-w-md mx-auto border border-slate-800">
            <div className="flex justify-between items-center w-full mb-6 text-white">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        Pixel Snake
                    </h3>
                    <p className="text-xs text-slate-400">Use arrow keys to move</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-blue-400">{score}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                        <Trophy size={10} /> High: {highScore}
                    </div>
                </div>
            </div>

            <div
                className="relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-inner"
                style={{
                    width: GRID_SIZE * CELL_SIZE,
                    height: GRID_SIZE * CELL_SIZE
                }}
            >
                {/* Grid Background (Optional) */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
                        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                    }}
                ></div>

                {/* Snake */}
                {snake.map((segment, i) => (
                    <div
                        key={`${segment.x}-${segment.y}-${i}`}
                        className="absolute rounded-sm transition-all duration-75"
                        style={{
                            left: segment.x * CELL_SIZE,
                            top: segment.y * CELL_SIZE,
                            width: CELL_SIZE - 2,
                            height: CELL_SIZE - 2,
                            backgroundColor: i === 0 ? '#60A5FA' : '#3B82F6', // Head is lighter blue
                            zIndex: 10
                        }}
                    />
                ))}

                {/* Food */}
                <div
                    className="absolute rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"
                    style={{
                        left: food.x * CELL_SIZE,
                        top: food.y * CELL_SIZE,
                        width: CELL_SIZE - 4,
                        height: CELL_SIZE - 4,
                        margin: 2,
                        backgroundColor: '#22C55E',
                        zIndex: 10
                    }}
                />

                {/* Game Over Overlay */}
                {gameOver && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <h4 className="text-2xl font-bold text-white mb-2">Game Over!</h4>
                        <p className="text-slate-300 mb-6">Score: {score}</p>
                        <button
                            onClick={startGame}
                            className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all flex items-center gap-2"
                        >
                            <RotateCcw size={18} /> Try Again
                        </button>
                    </div>
                )}

                {/* Start Overlay */}
                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <button
                            onClick={startGame}
                            className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-500 hover:scale-110 transition-all shadow-xl"
                        >
                            <Play size={32} className="ml-1" />
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile Controls (Visible only on small screens) */}
            <div className="grid grid-cols-3 gap-2 mt-6 md:hidden w-full max-w-[200px]">
                <div></div>
                <button
                    className="bg-slate-800 p-4 rounded-xl text-white active:bg-slate-700"
                    onClick={() => { if (directionRef.current !== 'DOWN') directionRef.current = 'UP'; }}
                >↑</button>
                <div></div>
                <button
                    className="bg-slate-800 p-4 rounded-xl text-white active:bg-slate-700"
                    onClick={() => { if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; }}
                >←</button>
                <button
                    className="bg-slate-800 p-4 rounded-xl text-white active:bg-slate-700"
                    onClick={() => { if (directionRef.current !== 'UP') directionRef.current = 'DOWN'; }}
                >↓</button>
                <button
                    className="bg-slate-800 p-4 rounded-xl text-white active:bg-slate-700"
                    onClick={() => { if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; }}
                >→</button>
            </div>
        </div>
    );
};

export default PixelSnake;
