#!/usr/bin/env node
/**
 * filter-games-targeted.mjs
 * 
 * Targeted filtering for specific game types:
 * fps games, platformers, maze, strategy, digging games, multiplayer, 
 * soccer, shooter, driving, tower defense, escape, and clicker games
 * 
 * Usage:
 *   node filter-games-targeted.mjs --input out/permissive_games.json --output out/targeted_games.json
 */

import fs from 'node:fs';
import path from 'node:path';

// Parse command line arguments
const args = parseArgs(process.argv.slice(2));
const inputFile = args.input || 'out/permissive_games.json';
const outputFile = args.output || 'out/targeted_games.json';
const minStars = parseInt(args['min-stars'] || '5');
const maxResults = parseInt(args['max-results'] || '500');

console.log(`Targeted filtering for specific game types from: ${inputFile}`);
console.log(`Output to: ${outputFile}`);
console.log(`Min stars: ${minStars}`);
console.log(`Max results: ${maxResults}`);
console.log('');

// Keywords for the specific game types we want
const TARGETED_GAME_KEYWORDS = [
  // FPS games
  'fps', 'first person shooter', 'first-person shooter', 'shooter', 'gun', 'weapon', 'aim', 'shoot',
  
  // Platformers
  'platformer', 'platform', 'jump', 'jumping', 'run', 'runner', 'side-scroller', 'sidescroller',
  
  // Maze games
  'maze', 'labyrinth', 'puzzle', 'escape room', 'escape-room',
  
  // Strategy games
  'strategy', 'tactical', 'turn-based', 'turn based', 'rts', 'real-time strategy', 'real time strategy',
  
  // Digging games
  'dig', 'digging', 'mine', 'mining', 'excavate', 'excavation', 'drill', 'drilling', 'tunnel', 'tunneling',
  
  // Multiplayer games
  'multiplayer', 'multi-player', 'multi player', 'online', 'coop', 'co-op', 'cooperative', 'versus', 'vs',
  
  // Soccer games
  'soccer', 'football', 'fifa', 'kick', 'kicking', 'goal', 'scoring',
  
  // Driving games
  'driving', 'racing', 'car', 'vehicle', 'speed', 'track', 'race', 'driver', 'drift', 'drifting',
  
  // Tower defense
  'tower defense', 'tower-defense', 'towerdefense', 'defense', 'defence', 'tower', 'towers',
  
  // Escape games
  'escape', 'escape room', 'escape-room', 'breakout', 'break out', 'flee', 'fleeing',
  
  // Clicker games
  'clicker', 'clicking', 'idle', 'incremental', 'tap', 'tapping', 'auto', 'automation'
];

// Keywords that indicate this is NOT a game (engines, utilities, etc.)
const NOT_GAME_KEYWORDS = [
  'player', 'video', 'audio', 'media', 'stream', 'playback', 'recorder',
  'engine', 'framework', 'library', 'sdk', 'api', 'plugin', 'loader', 'boilerplate',
  'template', 'starter', 'example', 'sample', 'tutorial', 'guide', 'documentation',
  'typescript-definitions', 'wrapper', 'binding', 'port', 'bridge', 'adapter',
  'middleware', 'core', 'base', 'foundation', 'utility', 'helper', 'tool', 'cli',
  'development', 'dev', 'build', 'test', 'spec', 'specification', 'benchmark',
  'performance', 'optimization', 'polyfill', 'shim', 'compatibility',
  'simulation', 'fluid', 'physics', 'particle', 'visualization', 'demo',
  'editor', 'creator', 'maker', 'builder', 'generator', 'converter', 'transformer',
  'parser', 'validator', 'formatter', 'minifier', 'bundler', 'compiler',
  'interpreter', 'runtime', 'virtual machine', 'emulator', 'debugger',
  'profiler', 'analyzer', 'monitor', 'logger', 'tracker', 'manager',
  'controller', 'router', 'server', 'client', 'proxy', 'gateway',
  'database', 'storage', 'cache', 'queue', 'scheduler', 'cron',
  'authentication', 'authorization', 'security', 'encryption', 'hash',
  'compression', 'decompression', 'archive', 'backup', 'sync',
  'notification', 'alert', 'message', 'chat', 'forum', 'blog',
  'cms', 'ecommerce', 'payment', 'billing', 'invoice', 'report',
  'dashboard', 'admin', 'panel', 'console', 'terminal', 'shell'
];

// Specific game names that match our target types
const SPECIFIC_TARGETED_GAMES = [
  // FPS
  'doom', 'quake', 'counter-strike', 'counterstrike', 'csgo', 'valorant', 'overwatch',
  
  // Platformers
  'mario', 'sonic', 'mega man', 'megaman', 'castlevania', 'metroid', 'hollow knight',
  
  // Maze/Puzzle
  'pac-man', 'pacman', 'maze runner', 'labyrinth', 'escape room',
  
  // Strategy
  'chess', 'checkers', 'risk', 'civilization', 'civ', 'age of empires', 'starcraft',
  
  // Digging/Mining
  'minecraft', 'terraria', 'stardew valley', 'dig dug', 'digdug',
  
  // Multiplayer
  'among us', 'fall guys', 'fortnite', 'pubg', 'battle royale',
  
  // Soccer
  'fifa', 'pro evolution soccer', 'pes', 'soccer stars',
  
  // Driving/Racing
  'need for speed', 'needforspeed', 'nfs', 'gran turismo', 'forza', 'outrun',
  
  // Tower Defense
  'plants vs zombies', 'plantsvszombies', 'pvz', 'bloons', 'kingdom rush',
  
  // Escape
  'breakout', 'escape room', 'room escape',
  
  // Clicker
  'cookie clicker', 'adventure capitalist', 'clicker heroes', 'idle miner'
];

function isTargetedGameType(repo) {
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
  
  // Check for specific targeted game names first
  const hasSpecificGame = SPECIFIC_TARGETED_GAMES.some(game => 
    text.includes(game.toLowerCase())
  );
  
  if (hasSpecificGame) {
    return true;
  }
  
  // Check if it has our targeted game keywords
  const hasTargetedKeywords = TARGETED_GAME_KEYWORDS.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  // Check if it's NOT an engine/utility/player/etc
  const isNotUtility = !NOT_GAME_KEYWORDS.some(keyword => 
    text.includes(keyword.toLowerCase())
  );
  
  // Must have targeted game keywords AND not be a utility
  return hasTargetedKeywords && isNotUtility;
}

function getGameType(repo) {
  const text = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();
  
  if (text.includes('fps') || text.includes('first person') || text.includes('shooter') || text.includes('gun') || text.includes('aim')) {
    return 'fps';
  }
  if (text.includes('platformer') || text.includes('platform') || text.includes('jump') || text.includes('side-scroll')) {
    return 'platformer';
  }
  if (text.includes('maze') || text.includes('labyrinth') || text.includes('puzzle')) {
    return 'maze';
  }
  if (text.includes('strategy') || text.includes('tactical') || text.includes('turn-based') || text.includes('rts')) {
    return 'strategy';
  }
  if (text.includes('dig') || text.includes('mine') || text.includes('excavate') || text.includes('drill')) {
    return 'digging';
  }
  if (text.includes('multiplayer') || text.includes('multi-player') || text.includes('online') || text.includes('coop')) {
    return 'multiplayer';
  }
  if (text.includes('soccer') || text.includes('football') || text.includes('fifa') || text.includes('kick')) {
    return 'soccer';
  }
  if (text.includes('driving') || text.includes('racing') || text.includes('car') || text.includes('vehicle')) {
    return 'driving';
  }
  if (text.includes('tower defense') || text.includes('tower-defense') || text.includes('defense')) {
    return 'tower defense';
  }
  if (text.includes('escape') || text.includes('breakout') || text.includes('flee')) {
    return 'escape';
  }
  if (text.includes('clicker') || text.includes('clicking') || text.includes('idle') || text.includes('incremental')) {
    return 'clicker';
  }
  
  return 'other';
}

function calculateGameScore(repo) {
  let score = 0;
  
  // Base score from stars
  score += repo.stars || 0;
  
  // Bonus for recent activity
  if (repo.pushed_at) {
    const pushedDate = new Date(repo.pushed_at);
    const now = new Date();
    const daysSincePush = (now - pushedDate) / (1000 * 60 * 60 * 24);
    
    // Bonus for recent pushes (within last year)
    if (daysSincePush < 365) {
      score += Math.max(0, 100 - daysSincePush);
    }
  }
  
  // Bonus for having a homepage
  if (repo.homepage) {
    score += 50;
  }
  
  // Bonus for having topics
  if (repo.topics && repo.topics.length > 0) {
    score += repo.topics.length * 10;
  }
  
  // Penalty for being archived
  if (repo.archived) {
    score *= 0.5;
  }
  
  // Penalty for being a fork
  if (repo.fork) {
    score *= 0.8;
  }
  
  return Math.round(score);
}

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = (i+1 < argv.length && !argv[i+1].startsWith('-')) ? argv[++i] : 'true';
      out[k] = v;
    } else if (a.startsWith('-')) {
      out[a.replace(/^-+/, '')] = 'true';
    } else {
      out._.push(a);
    }
  }
  return out;
}

async function main() {
  try {
    // Read the input file
    console.log('Reading input file...');
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    console.log(`Loaded ${data.length} repositories`);
    
    // Filter for targeted game types
    console.log('Filtering for targeted game types...');
    const games = [];
    let processed = 0;
    
    for (const repo of data) {
      processed++;
      if (processed % 1000 === 0) {
        console.log(`Processed ${processed}/${data.length} repositories...`);
      }
      
      // Skip if below minimum stars
      if ((repo.stars || 0) < minStars) {
        continue;
      }
      
      // Check if it's one of our targeted game types
      if (isTargetedGameType(repo)) {
        const gameScore = calculateGameScore(repo);
        const gameType = getGameType(repo);
        games.push({
          ...repo,
          gameScore,
          gameType
        });
      }
    }
    
    console.log(`Found ${games.length} targeted games`);
    
    // Sort by game score (popularity)
    console.log('Sorting by popularity...');
    games.sort((a, b) => b.gameScore - a.gameScore);
    
    // Limit results
    const limitedGames = games.slice(0, maxResults);
    
    // Write output
    console.log(`Writing ${limitedGames.length} games to ${outputFile}...`);
    fs.writeFileSync(outputFile, JSON.stringify(limitedGames, null, 2));
    
    // Also create a CSV for easy viewing
    const csvFile = outputFile.replace('.json', '.csv');
    console.log(`Writing CSV to ${csvFile}...`);
    
    const csvHeaders = [
      'name', 'owner', 'full_name', 'description', 'stars', 'gameScore', 'gameType',
      'language', 'license', 'homepage', 'html_url', 'topics', 'pushed_at'
    ];
    
    const csvLines = [csvHeaders.join(',')];
    for (const game of limitedGames) {
      const row = csvHeaders.map(header => {
        let value = game[header] || '';
        if (Array.isArray(value)) {
          value = value.join('|');
        }
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvLines.push(row.join(','));
    }
    
    fs.writeFileSync(csvFile, csvLines.join('\n'));
    
    // Print summary by game type
    console.log('\nGames found by type:');
    console.log('===================');
    const typeCounts = {};
    games.forEach(game => {
      typeCounts[game.gameType] = (typeCounts[game.gameType] || 0) + 1;
    });
    Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
      console.log(`${type}: ${count} games`);
    });
    
    // Print top 20 games
    console.log('\nTop 20 games by popularity:');
    console.log('============================');
    limitedGames.slice(0, 20).forEach((game, index) => {
      console.log(`${index + 1}. ${game.full_name} (${game.stars} stars, ${game.gameType}, score: ${game.gameScore})`);
      console.log(`   ${game.description || 'No description'}`);
      console.log(`   ${game.html_url}`);
      console.log('');
    });
    
    console.log(`✅ Done! Found ${games.length} targeted games, saved top ${limitedGames.length} to:`);
    console.log(`   ${outputFile}`);
    console.log(`   ${csvFile}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
