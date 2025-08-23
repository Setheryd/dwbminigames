'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Settings, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import GameCard from '@/components/GameCard';
import { games } from '@/lib/games';

export default function Home() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameSelect = (gameId: string) => {
    setSelectedGame(gameId);
    router.push(`/games/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 p-4">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-bold text-white mb-2 retro-border p-4 inline-block">
          DWB Mini Games
        </h1>
        <p className="text-xl text-gray-300">DickWifButt Gaming Community</p>
      </motion.header>

      {/* Navigation */}
      <motion.nav 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center mb-8 space-x-4"
      >
        <button className="pixel-button px-6 py-3 text-white font-bold rounded-none">
          <Home className="inline mr-2" />
          Home
        </button>
        <button 
          onClick={() => router.push('/leaderboard')}
          className="pixel-button px-6 py-3 text-white font-bold rounded-none"
        >
          <Trophy className="inline mr-2" />
          Leaderboard
        </button>
        <button className="pixel-button px-6 py-3 text-white font-bold rounded-none">
          <Settings className="inline mr-2" />
          Settings
        </button>
      </motion.nav>

      {/* Games Grid */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Available Games</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={handleGameSelect}
              index={index}
            />
          ))}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-12 text-gray-400"
      >
        <p>© 2024 DWB Mini Games - Powered by DickWifButt Community</p>
      </motion.footer>
    </div>
  );
}
