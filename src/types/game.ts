export interface Game {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  highScore: number;
  isAvailable: boolean;
  thumbnail: string;
  category: GameCategory;
  estimatedPlayTime: string;
}

export type GameCategory = 'Arcade' | 'Puzzle' | 'Action' | 'Strategy' | 'Racing';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  gameId: string;
  timestamp: Date;
  walletAddress?: string;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  lives: number;
  level: number;
  gameOver: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  controls: {
    keyboard: boolean;
    touch: boolean;
    mouse: boolean;
  };
}

export interface Player {
  id: string;
  name: string;
  walletAddress?: string;
  totalScore: number;
  gamesPlayed: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GameStats {
  totalPlays: number;
  averageScore: number;
  highestScore: number;
  totalPlayTime: number;
  uniquePlayers: number;
}
