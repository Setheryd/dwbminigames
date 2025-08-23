'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Star } from 'lucide-react';
import { Game } from '@/types/game';

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
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 * index }}
      className={`game-card rounded-lg p-4 cursor-pointer ${
        !game.isAvailable ? 'opacity-50' : ''
      }`}
      onClick={() => game.isAvailable && onClick(game.id)}
      whileHover={game.isAvailable ? { scale: 1.05 } : {}}
      whileTap={game.isAvailable ? { scale: 0.95 } : {}}
    >
      {/* Game Thumbnail */}
      <div className="bg-gray-800 rounded-lg h-32 mb-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-20"></div>
        <span className="text-gray-400 text-sm relative z-10">Game Thumbnail</span>
        
        {/* Coming Soon Badge */}
        {!game.isAvailable && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
            Coming Soon
          </div>
        )}
      </div>
      
      {/* Game Title */}
      <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
      
      {/* Game Description */}
      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{game.description}</p>
      
      {/* Game Meta Info */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(game.difficulty)}`}>
          {game.difficulty}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-bold ${getCategoryColor(game.category)}`}>
          {game.category}
        </span>
        <span className="px-2 py-1 rounded text-xs font-bold bg-gray-600 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {game.estimatedPlayTime}
        </span>
      </div>
      
      {/* High Score */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-gray-400 text-sm flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400" />
          High Score: {game.highScore.toLocaleString()}
        </span>
      </div>
      
      {/* Play Button */}
      <button 
        className={`w-full pixel-button py-2 text-white font-bold rounded-none ${
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
