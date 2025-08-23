'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Pause, Play } from 'lucide-react';
import Link from 'next/link';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  gap: number;
}

export default function FlappyDWB() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bird, setBird] = useState<GameObject>({
    x: 100,
    y: 300,
    width: 30,
    height: 30,
    velocity: 0
  });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [gravity] = useState(0.5);
  const [jumpForce] = useState(-8);
  const [gameSpeed] = useState(2);
  const [pipeGap] = useState(150);
  const [pipeWidth] = useState(50);
  const [pipeSpacing] = useState(200);

  const gameLoopRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Initialize game
  const initGame = useCallback(() => {
    setBird({
      x: 100,
      y: 300,
      width: 30,
      height: 30,
      velocity: 0
    });
    setPipes([]);
    setScore(0);
    setGameState('playing');
  }, []);

  // Handle jump
  const handleJump = useCallback(() => {
    if (gameState === 'playing') {
      setBird(prev => ({ ...prev, velocity: jumpForce }));
    }
  }, [gameState, jumpForce]);

  // Check collision
  const checkCollision = useCallback((bird: GameObject, pipes: Pipe[]) => {
    // Check pipe collisions
    for (const pipe of pipes) {
      if (
        bird.x < pipe.x + pipe.width &&
        bird.x + bird.width > pipe.x &&
        (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
      ) {
        return true;
      }
    }

    // Check ground/ceiling collision
    if (bird.y <= 0 || bird.y + bird.height >= 600) {
      return true;
    }

    return false;
  }, []);

  // Update game state
  const updateGame = useCallback((deltaTime: number) => {
    if (gameState !== 'playing') return;

    // Update bird
    setBird(prev => ({
      ...prev,
      y: prev.y + prev.velocity,
      velocity: prev.velocity + gravity
    }));

    // Update pipes
    setPipes(prev => {
      const updatedPipes = prev.map(pipe => ({
        ...pipe,
        x: pipe.x - gameSpeed
      })).filter(pipe => pipe.x + pipe.width > 0);

      // Add new pipes
      if (updatedPipes.length === 0 || 
          updatedPipes[updatedPipes.length - 1].x < 800 - pipeSpacing) {
        const topHeight = Math.random() * (400 - pipeGap);
        updatedPipes.push({
          x: 800,
          topHeight,
          bottomY: topHeight + pipeGap,
          width: pipeWidth,
          gap: pipeGap
        });
      }

      return updatedPipes;
    });

    // Update score
    setPipes(prev => {
      const newScore = prev.filter(pipe => pipe.x + pipe.width < 100).length;
      if (newScore > score) {
        setScore(newScore);
        if (newScore > highScore) {
          setHighScore(newScore);
        }
      }
      return prev;
    });
  }, [gameState, gravity, gameSpeed, pipeGap, pipeWidth, pipeSpacing, score, highScore]);

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    updateGame(deltaTime);

    // Check collision
    if (checkCollision(bird, pipes)) {
      setGameState('gameOver');
      return;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, checkCollision, bird, pipes]);

  // Start game loop
  useEffect(() => {
    if (gameState === 'playing') {
      lastTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, gameLoop]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'menu') {
          initGame();
        } else if (gameState === 'playing') {
          handleJump();
        } else if (gameState === 'gameOver') {
          initGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, initGame, handleJump]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 550, canvas.width, 50);

    // Draw bird (placeholder for DWB character)
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw pipes
    ctx.fillStyle = '#228B22';
    pipes.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, 600 - pipe.bottomY);
    });

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);

  }, [bird, pipes, score, highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 p-4">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <Link href="/" className="pixel-button px-4 py-2 text-white font-bold rounded-none">
          <ArrowLeft className="inline mr-2" />
          Back to Games
        </Link>
        
        <h1 className="text-4xl font-bold text-white">Flappy DWB</h1>
        
        <div className="flex gap-2">
          {gameState === 'playing' && (
            <button 
              onClick={() => setGameState('paused')}
              className="pixel-button px-4 py-2 text-white font-bold rounded-none"
            >
              <Pause className="w-4 h-4" />
            </button>
          )}
          {gameState === 'paused' && (
            <button 
              onClick={() => setGameState('playing')}
              className="pixel-button px-4 py-2 text-white font-bold rounded-none"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.header>

      {/* Game Container */}
      <div className="flex justify-center">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="game-canvas"
            onClick={handleJump}
          />
          
          {/* Game Overlay */}
          {gameState === 'menu' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Flappy DWB</h2>
              <p className="text-white text-center mb-6 max-w-md">
                Navigate your DickWifButt through obstacles!<br />
                Click or press Space to flap.
              </p>
              <button
                onClick={initGame}
                className="pixel-button px-8 py-3 text-white font-bold rounded-none text-xl"
              >
                Start Game
              </button>
            </motion.div>
          )}

          {gameState === 'gameOver' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
              <p className="text-white text-xl mb-2">Score: {score}</p>
              <p className="text-white text-lg mb-6">High Score: {highScore}</p>
              <div className="flex gap-4">
                <button
                  onClick={initGame}
                  className="pixel-button px-6 py-2 text-white font-bold rounded-none"
                >
                  <RotateCcw className="inline mr-2" />
                  Play Again
                </button>
                <Link
                  href="/"
                  className="pixel-button px-6 py-2 text-white font-bold rounded-none"
                >
                  <ArrowLeft className="inline mr-2" />
                  Main Menu
                </Link>
              </div>
            </motion.div>
          )}

          {gameState === 'paused' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Paused</h2>
              <button
                onClick={() => setGameState('playing')}
                className="pixel-button px-8 py-3 text-white font-bold rounded-none text-xl"
              >
                Resume
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6 text-white"
      >
        <p className="text-lg">Click or press Space to make your DickWifButt flap!</p>
        <p className="text-sm text-gray-300 mt-2">Avoid the pipes and try to get the highest score!</p>
      </motion.div>
    </div>
  );
}
