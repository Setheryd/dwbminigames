'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getGameById, getGamesByCategory, getAvailableGames } from '@/lib/games';
import { Header } from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import GameCarousel from '@/components/GameCarousel';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSidebar } from '@/contexts/SidebarContext';

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;
  const game = getGameById(gameId);
  const { isCollapsed } = useSidebar();
  const [gameUrl, setGameUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = `/games/${gameId}/index.html`;
    fetch(url, { method: 'HEAD' })
      .then(res => {
        if (res.ok) setGameUrl(url);
      })
      .catch(() => {});
  }, [gameId]);

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
          <main className="flex-1 transition-all duration-300" style={{
            marginLeft: isCollapsed ? 'clamp(56px, 4vw, 80px)' : 'clamp(240px, 16vw, 320px)',
            padding: 'clamp(1rem, 2vw, 2rem)',
            width: `calc(100vw - ${isCollapsed ? 'clamp(56px, 4vw, 80px)' : 'clamp(240px, 16vw, 320px)'})`,
          }}>
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
        <main
          className="flex-1 transition-all duration-300"
          style={{
            marginLeft: isCollapsed ? 'clamp(56px, 4vw, 80px)' : 'clamp(240px, 16vw, 320px)',
            padding: 'clamp(1rem, 2vw, 2rem)',
            width: `calc(100vw - ${isCollapsed ? 'clamp(56px, 4vw, 80px)' : 'clamp(240px, 16vw, 320px)'})`,
          }}
        >
          <div className="container">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft size={20} />
              Back to Games
            </Link>

            <div
              className="relative w-full bg-black rounded-lg overflow-hidden flex items-center justify-center mb-8"
              style={{ height: 'clamp(400px, 70vh, 900px)' }}
            >
              {gameUrl ? (
                <iframe src={gameUrl} className="w-full h-full border-0" allowFullScreen />
              ) : (
                <Image
                  src={game.thumbnail}
                  alt={game.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 50vw"
                />
              )}
            </div>
            {!gameUrl && (
              <p className="text-center text-muted-foreground mb-8">Game coming soon!</p>
            )}

            <h1
              className="font-bold mb-2"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              {game.title}
            </h1>
            <p
              className="text-muted-foreground mb-6"
              style={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}
            >
              {game.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400" />
                <span>High Score: {game.highScore.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground" />
                <span>{game.estimatedPlayTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-12">
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                {game.category}
              </span>
              <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                {game.difficulty}
              </span>
            </div>

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
