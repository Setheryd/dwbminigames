'use client';

import { useParams } from 'next/navigation';
import { getGameById, getGamesByCategory, getAvailableGames } from '@/lib/games';
import { Header } from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import GameCarousel from '@/components/GameCarousel';
import { ArrowLeft, Play, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '@/contexts/SidebarContext';

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;
  const game = getGameById(gameId);
  const { isCollapsed } = useSidebar();
  
  // Get related games (same category, excluding current game)
  const relatedGames = getGamesByCategory(game?.category || '')
    .filter(g => g.id !== gameId)
    .slice(0, 10);
  
  // Get more games if we don't have enough related games
  const allGames = getAvailableGames()
    .filter(g => g.id !== gameId)
    .slice(0, 10);
  
  const gamesToShow = relatedGames.length > 0 ? relatedGames : allGames;

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`} style={{ marginLeft: isCollapsed ? '64px' : '256px' }}>
            <div className="container text-center">
              <h1 className="text-2xl font-bold mb-4">Game not found</h1>
              <Link href="/" className="pixel-button">
                <ArrowLeft className="inline mr-2" />
                Back to Home
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`} style={{ marginLeft: isCollapsed ? '64px' : '256px' }}>
          <div className="container">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft size={20} />
              Back to Games
            </Link>

            {/* Game Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Game Image */}
              <div className="relative bg-muted rounded-lg h-96 overflow-hidden">
                <Image 
                  src={game.thumbnail} 
                  alt={game.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Game Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{game.title}</h1>
                  <p className="text-muted-foreground text-lg">{game.description}</p>
                </div>

                {/* Game Meta */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400" />
                    <span>High Score: {game.highScore.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground" />
                    <span>{game.estimatedPlayTime}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    {game.category}
                  </span>
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                    {game.difficulty}
                  </span>
                </div>

                {/* Play Button */}
                <button className="w-full pixel-button text-lg py-4 flex items-center justify-center gap-2">
                  <Play size={24} />
                  Play Now
                </button>

                {/* Additional Info */}
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-bold mb-2">About this game</h3>
                  <p className="text-muted-foreground text-sm">
                    This is a placeholder for game-specific information. In a real implementation, 
                    this would contain detailed game instructions, controls, and other relevant information.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Games */}
            {gamesToShow.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">
                  {relatedGames.length > 0 ? `More ${game.category} Games` : 'More Games'}
                </h2>
                <GameCarousel games={gamesToShow} showLabels={true} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
