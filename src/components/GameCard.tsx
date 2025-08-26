'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Star } from 'lucide-react';
import { Game } from '@/types/game';
import Image from 'next/image';

interface GameCardProps {
  game: Game;
  onClick: (gameId: string) => void;
  index: number;
}

export default function GameCard({ game, onClick, index }: GameCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Arcade':
        return 'bg-blue-500';
      case 'Puzzle':
        return 'bg-purple-500';
      case 'Action':
        return 'bg-red-500';
      case 'Strategy':
        return 'bg-green-500';
      case 'Racing':
        return 'bg-orange-500';
      case 'Adventure':
        return 'bg-indigo-500';
      case 'Horror':
        return 'bg-gray-700';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 * index }}
      className={`game-card ${
        !game.isAvailable ? 'opacity-50' : ''
      }`}
      onClick={() => game.isAvailable && onClick(game.id)}
      whileHover={game.isAvailable ? { scale: 1.05 } : {}}
      whileTap={game.isAvailable ? { scale: 0.95 } : {}}
    >
      {/* Game Thumbnail */}
      <div className="relative bg-muted rounded-lg h-32 mb-4 overflow-hidden">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />

        {/* Coming Soon Badge */}
        {!game.isAvailable && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
            Coming Soon
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="pixel-button">
            <Play className="inline mr-2" />
            Play Now
          </button>
        </div>
      </div>

      {/* Game Title */}
      <h3 className="text-lg font-bold mb-2 line-clamp-1">{game.title}</h3>

      {/* Game Description */}
      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{game.description}</p>

      {/* Game Meta Info */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getDifficultyColor(game.difficulty)}`}>
          {game.difficulty}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getCategoryColor(game.category)}`}>
          {game.category}
        </span>
        <span className="px-2 py-1 rounded text-xs font-bold bg-muted text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {game.estimatedPlayTime}
        </span>
      </div>

      {/* High Score */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-muted-foreground text-sm flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          High Score: {game.highScore.toLocaleString()}
        </span>
      </div>

      {/* Play Button */}
      <button
        className={`w-full pixel-button py-2 text-white font-bold rounded ${
          !game.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!game.isAvailable}
        onClick={(e) => {
          e.stopPropagation();
          if (game.isAvailable) {
            onClick(game.id);
          }
        }}
      >
        <Play className="inline mr-2" />
        {game.isAvailable ? 'Play Now' : 'Coming Soon'}
      </button>
    </motion.div>
  );
}
