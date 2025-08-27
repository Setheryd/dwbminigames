import { describe, it, expect } from 'vitest';
import { getGameById, getGamesByCategory } from '@/lib/games';

describe('getGameById', () => {
  it('returns the game for an existing id', () => {
    const game = getGameById('flappy-dwb');
    expect(game).toBeDefined();
    expect(game?.id).toBe('flappy-dwb');
  });

  it('returns undefined for a non-existent id', () => {
    const game = getGameById('non-existent-id');
    expect(game).toBeUndefined();
  });
});

describe('getGamesByCategory', () => {
  it('returns games for an existing category', () => {
    const games = getGamesByCategory('Strategy');
    expect(games.length).toBeGreaterThan(0);
    for (const game of games) {
      expect(game.category).toBe('Strategy');
    }
  });

  it('returns an empty array for a non-existent category', () => {
    const games = getGamesByCategory('NonExistent');
    expect(games).toEqual([]);
  });
});
