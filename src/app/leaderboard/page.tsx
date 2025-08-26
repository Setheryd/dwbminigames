'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Crown } from 'lucide-react';
import Link from 'next/link';
import { games } from '@/lib/games';
import { LeaderboardEntry } from '@/types/game';

// Mock leaderboard data - in a real app, this would come from your backend
const mockLeaderboardData: Record<string, LeaderboardEntry[]> = {
  'flappy-dwb': [
    { id: '1', playerName: 'DWB_Champion', score: 1250, gameId: 'flappy-dwb', timestamp: new Date(), walletAddress: '0x123...' },
    { id: '2', playerName: 'FlappyMaster', score: 980, gameId: 'flappy-dwb', timestamp: new Date(), walletAddress: '0x456...' },
    { id: '3', playerName: 'CryptoGamer', score: 756, gameId: 'flappy-dwb', timestamp: new Date(), walletAddress: '0x789...' },
    { id: '4', playerName: 'DWB_Holder', score: 634, gameId: 'flappy-dwb', timestamp: new Date(), walletAddress: '0xabc...' },
    { id: '5', playerName: 'GameOn', score: 521, gameId: 'flappy-dwb', timestamp: new Date(), walletAddress: '0xdef...' },
  ],
  'kitty-cannon-dwb': [
    { id: '6', playerName: 'CannonKing', score: 890, gameId: 'kitty-cannon-dwb', timestamp: new Date(), walletAddress: '0x111...' },
    { id: '7', playerName: 'TargetMaster', score: 745, gameId: 'kitty-cannon-dwb', timestamp: new Date(), walletAddress: '0x222...' },
  ],
  'dwb-runner': [
    { id: '8', playerName: 'SpeedRunner', score: 2340, gameId: 'dwb-runner', timestamp: new Date(), walletAddress: '0x333...' },
    { id: '9', playerName: 'JumpMaster', score: 1890, gameId: 'dwb-runner', timestamp: new Date(), walletAddress: '0x444...' },
  ]
};

export default function Leaderboard() {
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const getLeaderboardData = () => {
    if (selectedGame === 'all') {
      // Combine all games and sort by score
      const allEntries = Object.values(mockLeaderboardData).flat();
      return allEntries.sort((a, b) => b.score - a.score).slice(0, 20);
    }
    return mockLeaderboardData[selectedGame] || [];
  };

  const getGameTitle = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game?.title || gameId;
  };

  const getMedalIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-gray-400 font-bold">{index + 1}</span>;
  };

  const leaderboardData = getLeaderboardData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 p-4">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-8"
      >
        <Link href="/" className="pixel-button px-4 py-2 text-white font-bold rounded-none">
          <ArrowLeft className="inline mr-2" />
          Back to Games
        </Link>
        
        <h1 className="text-4xl font-bold text-white flex items-center">
          <Trophy className="mr-3 text-yellow-400" />
          Leaderboard
        </h1>
        
        <div className="w-32"></div> {/* Spacer for centering */}
      </motion.header>

      {/* Filters */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <div className="flex flex-wrap justify-center gap-4">
          {/* Game Filter */}
          <div className="flex flex-col">
            <label className="text-white text-sm mb-2 font-bold">Game</label>
            <select 
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="pixel-button px-4 py-2 text-white font-bold rounded-none bg-transparent border-2"
            >
              <option value="all">All Games</option>
              {games.map(game => (
                <option key={game.id} value={game.id}>{game.title}</option>
              ))}
            </select>
          </div>

          {/* Time Filter */}
          <div className="flex flex-col">
            <label className="text-white text-sm mb-2 font-bold">Time Period</label>
            <select 
              value={timeFilter}
                             onChange={(e) => setTimeFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              className="pixel-button px-4 py-2 text-white font-bold rounded-none bg-transparent border-2"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        <div className="leaderboard p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {selectedGame === 'all' ? 'Global Leaderboard' : `${getGameTitle(selectedGame)} Leaderboard`}
          </h2>

          {leaderboardData.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No scores yet!</p>
              <p className="text-sm mt-2">Be the first to set a record!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboardData.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="leaderboard-row flex items-center justify-between p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getMedalIcon(index)}
                    </div>
                    <div>
                      <p className="text-white font-bold">{entry.playerName}</p>
                      {selectedGame === 'all' && (
                        <p className="text-gray-400 text-sm">{getGameTitle(entry.gameId)}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-white font-bold text-xl">{entry.score.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">
                      {entry.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-4xl mx-auto mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="game-card p-4 text-center">
            <p className="text-gray-400 text-sm">Total Players</p>
            <p className="text-white text-2xl font-bold">1,234</p>
          </div>
          <div className="game-card p-4 text-center">
            <p className="text-gray-400 text-sm">Games Played</p>
            <p className="text-white text-2xl font-bold">5,678</p>
          </div>
          <div className="game-card p-4 text-center">
            <p className="text-gray-400 text-sm">Highest Score</p>
            <p className="text-white text-2xl font-bold">2,340</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
