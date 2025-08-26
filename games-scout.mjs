#!/usr/bin/env node
/**
 * games-scout.mjs
 *
 * Usage:
 *   # 1) Search GitHub for browser games (permissive + no-license)
 *   node games-scout.mjs scan --out out --min-stars 0 --include-forks false
 *
 *   # 2) Prepare the extra curated sources list (and optionally clone them)
 *   node games-scout.mjs extras --out out --clone false
 *
 * ENV:
 *   GH_TOKEN=ghp_xxx   # strongly recommended to avoid tiny rate limits
 *
 * Outputs (in --out):
 *   permissive_games.json, no_license_games.json, all_games.csv
 *   extras.json  (always) and cloned repos if --clone true
 */

import fs from 'node:fs';
import {spawn} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import 'dotenv/config';

// ---------- CLI & config ----------
const args = parseArgs(process.argv.slice(2));
const CMD = args._[0] || 'scan'; // 'scan' | 'extras'
const OUT_DIR = path.resolve(process.cwd(), args.out || 'out');
const GH_TOKEN = process.env.GH_TOKEN || '';
const INCLUDE_FORKS = strToBool(args['include-forks'], false);
const MIN_STARS = num(args['min-stars'], 0);
const MAX_PAGES = num(args['max-pages'], 10);         // per query, 100 items per page
const RATE_CARE = strToBool(args['rate-care'], true); // pause on rate limit
const USER_AGENT = 'games-scout/1.0 (+seth)';
const GITHUB_API = 'https://api.github.com';

const PERMISSIVE = [
  'mit', 'apache-2.0', 'bsd-2-clause', 'bsd-3-clause', 'isc', 'unlicense', 'cc0-1.0', 'zlib'
];

// Keywords specifically for the game types you want
const KEYWORDS = [
  // FPS games
  '"fps game"', '"first person shooter"', '"shooter game"', '"gun game"',
  
  // Platformers
  '"platformer game"', '"platform game"', '"jumping game"', '"runner game"', '"side-scroller"',
  
  // Maze games
  '"maze game"', '"labyrinth game"', '"puzzle game"', '"escape room game"',
  
  // Strategy games
  '"strategy game"', '"tactical game"', '"turn-based game"', '"rts game"',
  
  // Digging games
  '"digging game"', '"mining game"', '"excavation game"', '"drilling game"',
  
  // Multiplayer games
  '"multiplayer game"', '"multi-player game"', '"online game"', '"coop game"',
  
  // Soccer games
  '"soccer game"', '"football game"', '"fifa game"',
  
  // Driving games
  '"driving game"', '"racing game"', '"car game"', '"vehicle game"',
  
  // Tower defense
  '"tower defense game"', '"tower-defense game"', '"defense game"',
  
  // Escape games
  '"escape game"', '"escape room game"', '"breakout game"',
  
  // Clicker games
  '"clicker game"', '"clicking game"', '"idle game"', '"incremental game"',
  
  // Specific game names
  '2048', 'tetris', 'snake', 'pong', 'breakout', 'asteroids', 'pac-man', 'pacman',
  'chess', 'checkers', 'minecraft', 'terraria', 'among us', 'fall guys', 'fortnite',
  'fifa', 'need for speed', 'plants vs zombies', 'cookie clicker'
];
const LANGS = ['JavaScript', 'TypeScript'];
// Date windows to avoid the 1k result cap: tune or add more
const WINDOWS = [
  {from: '2012-01-01', to: '2016-12-31'},
  {from: '2017-01-01', to: '2019-12-31'},
  {from: '2020-01-01', to: '2022-12-31'},
  {from: '2023-01-01', to: todayISO()},
];

// ---------- entry ----------
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, {recursive: true});

if (CMD === 'scan') {
  await scanAll();
} else if (CMD === 'extras') {
  await writeExtras();
} else {
  console.error(`Unknown command: ${CMD}`);
  process.exit(1);
}

// ---------- main: scan ----------
async function scanAll() {
  const seen = new Set();
  
  // Load existing results if they exist
  const permissivePath = path.join(OUT_DIR, 'permissive_games.json');
  const noLicensePath = path.join(OUT_DIR, 'no_license_games.json');
  
  let permissiveRows = [];
  let noLicenseRows = [];
  
  // Try to load existing results
  if (fs.existsSync(permissivePath)) {
    try {
      permissiveRows = JSON.parse(fs.readFileSync(permissivePath, 'utf8'));
      console.log(`Loaded ${permissiveRows.length} existing permissive games`);
      // Add existing repos to seen set
      for (const repo of permissiveRows) {
        seen.add(repo.full_name.toLowerCase());
      }
    } catch (e) {
      console.warn('Could not load existing permissive_games.json, starting fresh');
    }
  }
  
  if (fs.existsSync(noLicensePath)) {
    try {
      noLicenseRows = JSON.parse(fs.readFileSync(noLicensePath, 'utf8'));
      console.log(`Loaded ${noLicenseRows.length} existing no-license games`);
      // Add existing repos to seen set
      for (const repo of noLicenseRows) {
        seen.add(repo.full_name.toLowerCase());
      }
    } catch (e) {
      console.warn('Could not load existing no_license_games.json, starting fresh');
    }
  }

  console.log(`Scanning GitHub for targeted game types (permissive + no-license) …`);
  console.log(`Total queries to run: ${PERMISSIVE.length * LANGS.length * WINDOWS.length * KEYWORDS.length * 2} (permissive + no-license)`);
  console.log(`Targeting: FPS, Platformers, Maze, Strategy, Digging, Multiplayer, Soccer, Driving, Tower Defense, Escape, Clicker games`);
  console.log(`Languages: ${LANGS.join(', ')}`);
  console.log(`Time windows: ${WINDOWS.length} periods`);
  console.log('');

  // 1) Permissive licenses — multiple, search separately to avoid query validation errors
  for (const spdx of PERMISSIVE) {
    for (const lang of LANGS) {
      for (const w of WINDOWS) {
        for (const kw of KEYWORDS) {
          const q = [
            kw,
            `language:${lang}`,
            `license:${spdx}`,
            INCLUDE_FORKS ? 'fork:true' : 'fork:false',
            `stars:>=${MIN_STARS}`,
            `created:${w.from}..${w.to}`,
            'is:public',
            'in:name,description,readme',
            // bias to repos that look like games, not engines
            // (heuristic only – we don't *exclude* engines)
          ].join(' ');
          console.log(`Searching: ${q}`);
          const items = await searchRepos(q);
          let newItems = 0;
          for (const it of items) {
            const key = it.full_name.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            if (!isTargetedGame(it)) continue;
            permissiveRows.push(normalizeRepo(it));
            newItems++;
          }
          console.log(`Found ${newItems} new permissive games from this query`);
          
          // Write incrementally after each query
          if (newItems > 0) {
            sortRows(permissiveRows);
            writeJSON(permissivePath, permissiveRows);
            console.log(`Updated ${permissivePath} (${permissiveRows.length} total)`);
          }
        }
      }
    }
  }

  // 2) No license (for outreach only) - Fixed the API error
  for (const lang of LANGS) {
    for (const w of WINDOWS) {
      for (const kw of KEYWORDS) {
        const q = [
          kw,
          `language:${lang}`,
          'license:unlicense', // Fixed: was 'license:none' which is invalid
          INCLUDE_FORKS ? 'fork:true' : 'fork:false',
          `stars:>=${MIN_STARS}`,
          `created:${w.from}..${w.to}`,
          'is:public',
          'in:name,description,readme'
        ].join(' ');
        console.log(`Searching: ${q}`);
        const items = await searchRepos(q);
        let newItems = 0;
        for (const it of items) {
          const key = it.full_name.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
                      if (!isTargetedGame(it)) continue;
          noLicenseRows.push(normalizeRepo(it));
          newItems++;
        }
        console.log(`Found ${newItems} new no-license games from this query`);
        
        // Write incrementally after each query
        if (newItems > 0) {
          sortRows(noLicenseRows);
          writeJSON(noLicensePath, noLicenseRows);
          console.log(`Updated ${noLicensePath} (${noLicenseRows.length} total)`);
        }
      }
    }
  }

  // 3) Final sort + write
  sortRows(permissiveRows);
  sortRows(noLicenseRows);

  const csvPath = path.join(OUT_DIR, 'all_games.csv');

  writeJSON(permissivePath, permissiveRows);
  writeJSON(noLicensePath, noLicenseRows);
  writeCSV(csvPath, permissiveRows.concat(noLicenseRows));

  // 4) Provide a tiny starter catalog for your site loader (self-host only)
  const siteCatalog = permissiveRows.slice(0, 25).map(r => ({
    id: slug(`${r.owner}-${r.name}`),
    title: titleFromRepo(r),
    license: r.license || 'UNKNOWN',
    sourceRepo: r.html_url,
    type: 'self-host',
    embedUrl: `/games/${slug(r.name)}/index.html`
  }));
  writeJSON(path.join(OUT_DIR, 'games.json'), siteCatalog);

  console.log('');
  console.log(`✔ Wrote:`);
  console.log(`  ${rel(permissivePath)} (${permissiveRows.length} repos)`);
  console.log(`  ${rel(noLicensePath)} (${noLicenseRows.length} repos)`);
  console.log(`  ${rel(csvPath)}`);
  console.log(`  ${rel(path.join(OUT_DIR, 'games.json'))} (starter catalog, top 25)`);
  console.log('');
  console.log(`Note: "no license" repos are *not* legally deployable without permission.`);
}

// ---------- main: extras ----------
async function writeExtras() {
  console.log('Preparing extras.json (curated sources)…');

  // Excalibur sample repos: fetch from org and filter by name
  const excaliburSamples = await searchReposOrg('excaliburjs', 'sample in:name');
  const excaliburFiltered = excaliburSamples
    .filter(r => /^sample(-|$)/i.test(r.name))
    .map(normalizeRepo);

  const extras = {
    playcanvas_examples: {
      repo: 'playcanvas/engine',
      notes: 'Examples Browser is MIT; code is open-source. Swap out demo assets if needed. See examples folder.',
      license: 'MIT',
      paths_hint: 'examples/src/examples',
      links: {
        repo: 'https://github.com/playcanvas/engine',
        examples_browser: 'https://playcanvas.github.io/'
      }
    },
    phaser3_examples: {
      repo: 'phaserjs/examples',
      notes: 'Code examples are MIT; many assets are not licensed for redistribution. Replace with your own art/audio.',
      license: 'MIT (code), assets typically restricted',
      links: {
        repo: 'https://github.com/phaserjs/examples',
        labs: 'https://labs.phaser.io/'
      }
    },
    phaser_ce_examples_mirror: {
      repo: 'samme/phaser-examples-mirror',
      notes: 'Mirror of Phaser CE examples. Code MIT; media files included without license—do not use them commercially.',
      license: 'MIT (code), media not licensed',
      links: {
        repo: 'https://github.com/samme/phaser-examples-mirror',
        live: 'https://samme.github.io/phaser-examples-mirror/'
      }
    },
    excalibur_samples: {
      org: 'excaliburjs',
      license: 'BSD-2-Clause (engine & sample projects)',
      samples: excaliburFiltered.map(pickFields)
    },
    single_repos: [
      pick('gabrielecirulli/2048', 'MIT'),
      pick('jakesgordon/javascript-tetris', 'MIT'),
      pick('jakesgordon/javascript-racer', 'MIT'),
      pick('jakesgordon/javascript-pong', 'MIT'),
      pick('BKcore/HexGL', 'MIT (code & resources unless marked otherwise)'),
      pick('wayou/t-rex-runner', 'BSD-3-Clause'),
      pick('robatron/sudoku.js', 'MIT'),
      pick('oakmac/chessboardjs', 'MIT'),
      pick('jhlywa/chess.js', 'MIT'),
      // Multiplayer demo with dual-license (code & content):
      pick('mozilla/BrowserQuest', 'MPL-2.0 (code) / CC-BY-SA 3.0 (content)')
    ]
  };

  const extrasPath = path.join(OUT_DIR, 'extras.json');
  writeJSON(extrasPath, extras);
  console.log(`✔ Wrote ${rel(extrasPath)}`);

  if (strToBool(args.clone, false)) {
    console.log('Cloning curated sources (this may take a while)…');
    const toClone = [
      'playcanvas/engine',
      'phaserjs/examples',
      'samme/phaser-examples-mirror',
      'excaliburjs/Excalibur',
      ...excaliburFiltered.map(r => `${r.owner}/${r.name}`),
      'gabrielecirulli/2048',
      'jakesgordon/javascript-tetris',
      'jakesgordon/javascript-racer',
      'jakesgordon/javascript-pong',
      'BKcore/HexGL',
      'wayou/t-rex-runner',
      'robatron/sudoku.js',
      'oakmac/chessboardjs',
      'jhlywa/chess.js',
      'mozilla/BrowserQuest'
    ];
    for (const full of toClone) {
      await gitCloneIfNeeded(full, path.join(OUT_DIR, 'repos'));
    }
    console.log('✔ Clone step finished.');
  }
}

// ---------- helpers ----------
function sortRows(rows) {
  rows.sort((a, b) => {
    // newer pushes, then more stars
    const ap = a.pushed_at || '';
    const bp = b.pushed_at || '';
    if (ap !== bp) return (bp > ap) ? 1 : -1;
    return (b.stars || 0) - (a.stars || 0);
  });
}

function normalizeRepo(r) {
  return {
    id: r.id,
    owner: r.owner?.login || '',
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    description: r.description || '',
    homepage: r.homepage || '',
    license: r.license?.spdx_id || (r.license?.key || '') || 'NONE',
    stars: r.stargazers_count || 0,
    forks: r.forks_count || 0,
    language: r.language || '',
    topics: r.topics || [],
    archived: !!r.archived,
    fork: !!r.fork,
    default_branch: r.default_branch || 'main',
    pushed_at: r.pushed_at || '',
    created_at: r.created_at || ''
  };
}

function isTargetedGame(it) {
  // Heuristic to focus on **specific game types** you want
  const txt = `${it.name} ${it.description || ''} ${(it.topics || []).join(' ')}`.toLowerCase();
  
  // Keywords for the specific game types you want
  const targetGameKeywords = [
    // FPS
    'fps', 'first person shooter', 'shooter', 'gun', 'weapon', 'aim',
    // Platformers
    'platformer', 'platform', 'jump', 'jumping', 'run', 'runner', 'side-scroller',
    // Maze
    'maze', 'labyrinth', 'puzzle', 'escape room',
    // Strategy
    'strategy', 'tactical', 'turn-based', 'rts', 'real-time strategy',
    // Digging
    'dig', 'digging', 'mine', 'mining', 'excavate', 'excavation', 'drill', 'drilling',
    // Multiplayer
    'multiplayer', 'multi-player', 'online', 'coop', 'cooperative',
    // Soccer
    'soccer', 'football', 'fifa', 'kick', 'kicking',
    // Driving
    'driving', 'racing', 'car', 'vehicle', 'speed', 'track', 'race',
    // Tower defense
    'tower defense', 'tower-defense', 'defense', 'defence',
    // Escape
    'escape', 'breakout', 'flee',
    // Clicker
    'clicker', 'clicking', 'idle', 'incremental', 'tap', 'tapping'
  ];
  
  // Specific game names that are definitely games
  const specificGames = [
    '2048', 'tetris', 'snake', 'pong', 'breakout', 'asteroids', 'pac-man', 'pacman',
    'chess', 'checkers', 'minecraft', 'terraria', 'among us', 'fall guys', 'fortnite',
    'fifa', 'need for speed', 'plants vs zombies', 'cookie clicker'
  ];
  
  // Must have one of our target game keywords or specific game names
  const hasTargetKeyword = targetGameKeywords.some(keyword => txt.includes(keyword));
  const hasSpecificGame = specificGames.some(game => txt.includes(game));
  
  // Exclude engines, frameworks, utilities, and development tools
  const isEngineOrUtility = /\bengine|framework|library|sdk|api|plugin|loader|boilerplate|template|starter|example|sample|tutorial|guide|documentation|typescript-definitions|wrapper|binding|port|bridge|adapter|middleware|core|base|foundation|utility|helper|tool|cli|development|dev|build|test|spec|specification|benchmark|performance|optimization|polyfill|shim|compatibility|simulation|fluid|physics|particle|visualization|demo|editor|creator|maker|builder|generator|converter|transformer|parser|validator|formatter|minifier|bundler|compiler|interpreter|runtime|virtual machine|emulator|debugger|profiler|analyzer|monitor|logger|tracker|manager|controller|router|server|client|proxy|gateway|database|storage|cache|queue|scheduler|cron|authentication|authorization|security|encryption|hash|compression|decompression|archive|backup|sync|notification|alert|message|chat|forum|blog|cms|ecommerce|payment|billing|invoice|report|dashboard|admin|panel|console|terminal|shell|chart|graph|data|analytics|visualization|diagram|player|video|audio|media|stream|playback|recorder\b/.test(txt);
  
  // Language check
  const langOk = (it.language === 'JavaScript' || it.language === 'TypeScript');
  
  // Not archived
  const notArchived = !it.archived;
  
  // Final decision: must have target keywords, not be an engine/utility, and meet other criteria
  return (hasTargetKeyword || hasSpecificGame) && langOk && notArchived && !isEngineOrUtility;
}

function titleFromRepo(r) {
  if (/2048/i.test(r.name)) return '2048';
  if (/tetris/i.test(r.name)) return 'Tetris';
  if (/racer|outrun/i.test(r.name)) return 'Racer';
  if (/pong/i.test(r.name)) return 'Pong';
  return r.name.replace(/[-_]/g, ' ');
}

function pick(full, licenseNote) {
  const [owner, name] = full.split('/');
  return { owner, name, full_name: full, license_note: licenseNote };
}
function pickFields(n) {
  return {
    owner: n.owner,
    name: n.name,
    full_name: n.full_name,
    html_url: n.html_url,
    license: n.license,
    stars: n.stars
  };
}

function writeJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}
function writeCSV(p, rows) {
  const head = [
    'owner','name','full_name','license','stars','forks','language','archived','fork',
    'topics','homepage','html_url','pushed_at','created_at','description'
  ];
  const lines = [head.join(',')];
  for (const r of rows) {
    const vals = [
      r.owner, r.name, r.full_name, r.license, r.stars, r.forks, r.language, r.archived, r.fork,
      (r.topics || []).join('|'), r.homepage, r.html_url, r.pushed_at, r.created_at, r.description?.replace(/\n/g, ' ')
    ].map(csv);
    lines.push(vals.join(','));
  }
  fs.writeFileSync(p, lines.join('\n'));
}

function csv(x) {
  const s = x == null ? '' : String(x);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
function num(x, d) { const n = Number(x); return Number.isFinite(n) ? n : d; }
function strToBool(x, d=false) {
  if (x === true || x === false) return x;
  if (typeof x !== 'string') return d;
  return /^(1|true|yes|on)$/i.test(x);
}
function rel(p) { return path.relative(process.cwd(), p); }
function todayISO() { return new Date().toISOString().slice(0,10); }

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

// ---------- GitHub calls ----------
async function gh(url) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': USER_AGENT
  };
  if (GH_TOKEN) headers['Authorization'] = `Bearer ${GH_TOKEN}`;
  const res = await fetch(url, {headers});
  // Handle rate-limit
  if (res.status === 403 && RATE_CARE) {
    const rem = res.headers.get('x-ratelimit-remaining');
    const reset = res.headers.get('x-ratelimit-reset');
    if (rem === '0' && reset) {
      const waitMs = Math.max(0, (Number(reset) * 1000) - Date.now()) + 1000;
      console.warn(`Rate limited. Sleeping ${(waitMs/1000).toFixed(0)}s…`);
      await sleep(waitMs);
      return gh(url);
    }
  }
  if (!res.ok) {
    const t = await res.text().catch(()=> '');
    throw new Error(`${res.status} ${res.statusText} :: ${url}\n${t}`);
  }
  return { json: await res.json(), headers: res.headers };
}

async function searchRepos(q) {
  // paginate until < 100 results or MAX_PAGES
  const items = [];
  for (let page=1; page<=MAX_PAGES; page++) {
    const url = new URL(`${GITHUB_API}/search/repositories`);
    url.searchParams.set('q', q);
    url.searchParams.set('sort', 'stars'); // deterministic-ish
    url.searchParams.set('order', 'desc');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    
    try {
      const {json} = await gh(url.href);
      const batch = Array.isArray(json.items) ? json.items : [];
      console.log(`  Page ${page}: ${batch.length} results`);
      
      for (const it of batch) {
        // request topics for richer filtering when available (search often includes them)
        if (!Array.isArray(it.topics)) it.topics = [];
        items.push(it);
      }
      
      if (batch.length < 100) {
        console.log(`  No more pages (got ${batch.length} results)`);
        break;
      }
    } catch (error) {
      console.error(`Error on page ${page}: ${error.message}`);
      // Continue with what we have so far
      break;
    }
  }
  return items;
}

async function searchReposOrg(org, extraQ='') {
  const q = [
    `org:${org}`,
    extraQ || '',
    'is:public',
    INCLUDE_FORKS ? 'fork:true' : 'fork:false'
  ].join(' ').trim();
  return searchRepos(q);
}

// ---------- git ----------
async function gitCloneIfNeeded(ownerRepo, destRoot) {
  const [owner, name] = ownerRepo.split('/');
  const dest = path.join(destRoot, owner, name);
  if (fs.existsSync(dest)) {
    console.log(`  ↩ exists: ${rel(dest)}`);
    return;
  }
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  await exec('git', ['clone', `https://github.com/${ownerRepo}.git`, dest], {stdio: 'inherit'});
  console.log(`  ✔ cloned ${ownerRepo}`);
}

function exec(cmd, args, opts={}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {shell: os.platform()==='win32', ...opts});
    p.on('error', reject);
    p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} -> ${code}`)));
  });
}

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }
