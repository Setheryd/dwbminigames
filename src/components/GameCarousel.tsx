'use client';

import { Game } from '@/types/game';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock } from 'lucide-react';

interface GameCarouselProps {
  games: Game[];
  title?: string;
  showLabels?: boolean;
}

export default function GameCarousel({ games, title, showLabels = false }: GameCarouselProps) {
  return (
    <div className="game-carousel-container">
      {title && (
        <h2 className="text-xl font-bold mb-4 px-4">{title}</h2>
      )}
      
             <div className="game-carousel-wrapper">
         <ul className="game-carousel-list scrollbar-hide">
          {games.map((game, index) => (
            <li key={game.id} className="game-carousel-item">
              <Link 
                href={`/games/${game.id}`}
                className="game-thumb-link"
              >
                {/* Game Labels */}
                {showLabels && (
                  <>
                    {game.isRecent && (
                      <div className="game-thumb-label game-thumb-label-updated">
                        New
                      </div>
                    )}
                    {game.isPopular && (
                      <div className="game-thumb-label game-thumb-label-top-rated">
                        Popular
                      </div>
                    )}
                    {game.isBest && (
                      <div className="game-thumb-label game-thumb-label-top-rated">
                        Top Rated
                      </div>
                    )}
                  </>
                )}
                
                {/* Game Title */}
                <div className="game-thumb-title">
                  {game.title}
                </div>
                
                {/* Game Image */}
                <div className="game-thumb-image-container">
                  <Image 
                    src={game.thumbnail} 
                    alt={game.title}
                    width={273}
                    height={154}
                    className="game-thumb-image"
                    loading={index < 6 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 168px, 273px"
                  />
                </div>
                
                {/* Game Meta Info */}
                <div className="game-thumb-meta">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span>{game.highScore.toLocaleString()}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{game.estimatedPlayTime}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
