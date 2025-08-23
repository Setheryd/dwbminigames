import { Game } from '@/types/game';

export const games: Game[] = [
  {
    id: 'flappy-dwb',
    title: 'Flappy DWB',
    description: 'Navigate your DickWifButt through obstacles in this classic flappy bird style game! Tap or click to make your character flap and avoid the pipes.',
    difficulty: 'Medium',
    highScore: 0,
    isAvailable: true,
    thumbnail: '/api/placeholder/300/200',
    category: 'Arcade',
    estimatedPlayTime: '2-5 minutes'
  },
  {
    id: 'kitty-cannon-dwb',
    title: 'DWB Cannon',
    description: 'Launch your DickWifButt character to hit targets and score points! Adjust your angle and power to hit the bullseye.',
    difficulty: 'Easy',
    highScore: 0,
    isAvailable: false,
    thumbnail: '/api/placeholder/300/200',
    category: 'Arcade',
    estimatedPlayTime: '3-7 minutes'
  },
  {
    id: 'dwb-runner',
    title: 'DWB Runner',
    description: 'Run, jump, and dodge obstacles as your DickWifButt character! Collect coins and power-ups while avoiding enemies.',
    difficulty: 'Hard',
    highScore: 0,
    isAvailable: false,
    thumbnail: '/api/placeholder/300/200',
    category: 'Action',
    estimatedPlayTime: '5-10 minutes'
  },
  {
    id: 'dwb-puzzle',
    title: 'DWB Puzzle',
    description: 'Match and clear DickWifButt tiles in this addictive puzzle game! Create combos and special matches for bonus points.',
    difficulty: 'Easy',
    highScore: 0,
    isAvailable: false,
    thumbnail: '/api/placeholder/300/200',
    category: 'Puzzle',
    estimatedPlayTime: '5-15 minutes'
  },
  {
    id: 'dwb-tetris',
    title: 'DWB Tetris',
    description: 'Classic Tetris with a DickWifButt twist! Stack the falling blocks and clear lines to score points.',
    difficulty: 'Medium',
    highScore: 0,
    isAvailable: false,
    thumbnail: '/api/placeholder/300/200',
    category: 'Puzzle',
    estimatedPlayTime: '10-20 minutes'
  },
  {
    id: 'dwb-snake',
    title: 'DWB Snake',
    description: 'Guide your DickWifButt snake to eat food and grow longer! Don\'t hit the walls or yourself.',
    difficulty: 'Medium',
    highScore: 0,
    isAvailable: false,
    thumbnail: '/api/placeholder/300/200',
    category: 'Arcade',
    estimatedPlayTime: '3-8 minutes'
  }
];

export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};

export const getAvailableGames = (): Game[] => {
  return games.filter(game => game.isAvailable);
};

export const getGamesByCategory = (category: string): Game[] => {
  return games.filter(game => game.category === category);
};

export const getGamesByDifficulty = (difficulty: string): Game[] => {
  return games.filter(game => game.difficulty === difficulty);
};
