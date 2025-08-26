'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import GameCard from '@/components/GameCard';
import GameCarousel from '@/components/GameCarousel';
import { useSidebar } from '@/contexts/SidebarContext';
import { 
  getPopularGames, 
  getFeaturedGames, 
  getRecentGames, 
  getBestGames,
  getAvailableGames 
} from '@/lib/games';
import { Star, TrendingUp, Clock, Trophy } from 'lucide-react';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const router = useRouter();
  const { isCollapsed } = useSidebar();
  
  const popularGames = getPopularGames();
  const featuredGames = getFeaturedGames();
  const recentGames = getRecentGames();
  const bestGames = getBestGames();
  const allGames = getAvailableGames();

  const handleGameClick = (gameId: string) => {
    router.push(`/games/${gameId}`);
  };

  const GameSection = ({ 
    title, 
    games, 
    icon: Icon, 
    className = '' 
  }: { 
    title: string; 
    games: any[]; 
    icon: any; 
    className?: string;
  }) => (
    <section className={`mb-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-header"
      >
        <Icon className="icon" size={24} />
        <h2>{title}</h2>
      </motion.div>
      <GameCarousel games={games} showLabels={true} />
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`} style={{ marginLeft: isCollapsed ? '64px' : '256px' }}>
          <div className="container">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Welcome to <span className="text-primary">DWB Games</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Discover and play thousands of free online games
              </p>
              <div className="flex justify-center gap-4">
                <button className="pixel-button text-lg px-8 py-3">
                  Start Playing
                </button>
                <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-8 py-3 rounded font-medium transition-colors text-lg">
                  Browse Games
                </button>
              </div>
            </motion.div>

            {/* Featured Games */}
            {featuredGames.length > 0 && (
              <GameSection 
                title="Featured Games" 
                games={featuredGames} 
                icon={Star}
              />
            )}

            {/* Popular Games */}
            {popularGames.length > 0 && (
              <GameSection 
                title="Popular Games" 
                games={popularGames} 
                icon={TrendingUp}
              />
            )}

            {/* Recent Games */}
            {recentGames.length > 0 && (
              <GameSection 
                title="Recently Added" 
                games={recentGames} 
                icon={Clock}
              />
            )}

            {/* Best Games */}
            {bestGames.length > 0 && (
              <GameSection 
                title="Best Games" 
                games={bestGames} 
                icon={Trophy}
              />
            )}

            {/* All Games Carousel */}
            <section className="mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="section-header"
              >
                <h2>All Games</h2>
                <span className="text-muted-foreground">({allGames.length} games)</span>
              </motion.div>
              <GameCarousel games={allGames.slice(0, 20)} showLabels={true} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
