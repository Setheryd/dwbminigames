# 🎮 Integrating GitHub Games into DWB Mini Games

## Overview

This guide shows you how to integrate existing games from GitHub into your DWB Mini Games website. This is different from building games from scratch - we're taking complete games and making them work in your iframe-based platform.

## 🎯 Common GitHub Game Types

### 1. **HTML5 Canvas Games** (Easiest)
- Pure HTML/CSS/JavaScript games
- Usually single HTML file or simple structure
- Examples: Flappy Bird clones, simple arcade games

### 2. **WebGL/Three.js Games** (Medium)
- 3D games using WebGL
- May have complex asset loading
- Examples: 3D platformers, puzzle games

### 3. **Game Framework Games** (Harder)
- Built with Phaser, PixiJS, Babylon.js, etc.
- Complex build processes
- Examples: Professional web games

### 4. **React/Vue/Angular Games** (Most Complex)
- Framework-based games
- Require build process
- Examples: Modern web applications

## 🚀 Integration Process

### Step 1: Analyze the GitHub Repository

```bash
# Clone the game repository
git clone https://github.com/username/game-name.git
cd game-name

# Look for these files:
ls -la
# - index.html (main entry point)
# - package.json (build process)
# - README.md (instructions)
# - dist/ or build/ (compiled files)
```

### Step 2: Determine Integration Method

#### Method A: Direct Copy (HTML5 Games)
For simple HTML5 games:
```bash
# Copy the main HTML file and assets
cp index.html public/games/my-game/
cp -r assets/ public/games/my-game/
cp -r images/ public/games/my-game/
```

#### Method B: Build and Copy (Framework Games)
For games that need building:
```bash
# Install dependencies
npm install

# Build the game
npm run build

# Copy built files
cp -r dist/* public/games/my-game/
```

#### Method C: Extract and Modify (Complex Games)
For games that need modifications:
```bash
# Build the game first
npm run build

# Copy and then modify files
cp -r dist/* public/games/my-game/
# Then edit files to fix paths and iframe issues
```

### Step 3: Fix Common Issues

#### Issue 1: Asset Paths
**Problem**: Assets use absolute paths or wrong relative paths
**Solution**: Update all asset references

```html
<!-- Before -->
<img src="/images/player.png">
<script src="/js/game.js">

<!-- After -->
<img src="./images/player.png">
<script src="./js/game.js">
```

#### Issue 2: Iframe Compatibility
**Problem**: Game tries to access `window.top` or `window.parent`
**Solution**: Remove or modify these references

```javascript
// Before
window.top.location.href = '/';

// After
// window.top.location.href = '/'; // Commented out for iframe
```

#### Issue 3: External Dependencies
**Problem**: Game loads resources from CDN
**Solution**: Download and include locally

```html
<!-- Before -->
<script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>

<!-- After -->
<script src="./lib/phaser.min.js"></script>
```

### Step 4: Test and Debug

```bash
# Start your development server
npm run dev

# Visit your game
http://localhost:3000/games/my-game
```

## 📋 Step-by-Step Examples

### Example 1: Simple HTML5 Game

```bash
# 1. Clone the game
git clone https://github.com/username/simple-flappy-bird.git
cd simple-flappy-bird

# 2. Add to your website
npm run add-game flappy-bird "Flappy Bird Clone" "A simple flappy bird game"

# 3. Copy game files
cp index.html public/games/flappy-bird/
cp -r assets/ public/games/flappy-bird/

# 4. Fix paths in index.html
# Change: src="/assets/background.png"
# To: src="./assets/background.png"
```

### Example 2: Phaser.js Game

```bash
# 1. Clone the game
git clone https://github.com/username/phaser-platformer.git
cd phaser-platformer

# 2. Install and build
npm install
npm run build

# 3. Add to your website
npm run add-game platformer "Platform Adventure" "A 2D platformer game"

# 4. Copy built files
cp -r dist/* public/games/platformer/

# 5. Fix asset paths and iframe issues
# Edit index.html to use relative paths
```

### Example 3: Three.js 3D Game

```bash
# 1. Clone the game
git clone https://github.com/username/threejs-maze.git
cd threejs-maze

# 2. Build the game
npm install
npm run build

# 3. Add to your website
npm run add-game maze "3D Maze" "Navigate through a 3D maze"

# 4. Copy files and fix issues
cp -r dist/* public/games/maze/
# Fix paths and iframe compatibility
```

## 🔧 Common Fixes

### Fix 1: Update Asset Paths
```bash
# Use sed to replace absolute paths with relative paths
sed -i 's|src="/|src="./|g' public/games/my-game/index.html
sed -i 's|href="/|href="./|g' public/games/my-game/index.html
```

### Fix 2: Remove External Dependencies
```bash
# Download external libraries locally
wget https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js -O public/games/my-game/lib/phaser.min.js
```

### Fix 3: Fix Iframe Issues
```javascript
// Add this to the game's JavaScript
if (window.self !== window.top) {
    // Running in iframe - disable problematic features
    console.log('Running in iframe mode');
}
```

## 🎮 Game Categories and Examples

### Arcade Games
- **Flappy Bird clones**: Usually simple HTML5
- **Snake games**: Canvas-based, easy to integrate
- **Tetris clones**: Often pure JavaScript

### Puzzle Games
- **Match-3 games**: May use frameworks
- **Sudoku**: Usually simple HTML/CSS/JS
- **Memory games**: Canvas or DOM-based

### Action Games
- **Platformers**: Often use Phaser.js
- **Shooters**: May use WebGL
- **Racing games**: Can be complex

### Strategy Games
- **Tower defense**: Often framework-based
- **Chess**: Usually simple HTML/CSS/JS
- **Card games**: May use React/Vue

## 🛠️ Tools and Scripts

### Automated Integration Script
```bash
#!/bin/bash
# integrate-game.sh

GAME_URL=$1
GAME_ID=$2
GAME_TITLE=$3

echo "Integrating game: $GAME_TITLE"

# Clone the repository
git clone $GAME_URL temp-game
cd temp-game

# Try to build if package.json exists
if [ -f "package.json" ]; then
    npm install
    npm run build
    cp -r dist/* ../public/games/$GAME_ID/
else
    # Copy files directly
    cp index.html ../public/games/$GAME_ID/
    cp -r assets ../public/games/$GAME_ID/ 2>/dev/null || true
    cp -r images ../public/games/$GAME_ID/ 2>/dev/null || true
    cp -r js ../public/games/$GAME_ID/ 2>/dev/null || true
fi

cd ..
rm -rf temp-game

echo "Game integrated! Check public/games/$GAME_ID/"
```

### Path Fixing Script
```javascript
// fix-paths.js
const fs = require('fs');
const path = require('path');

function fixPaths(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            fixPaths(filePath);
        } else if (file.endsWith('.html') || file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Fix asset paths
            content = content.replace(/src="\//g, 'src="./');
            content = content.replace(/href="\//g, 'href="./');
            content = content.replace(/url\("\/\//g, 'url("./');
            
            fs.writeFileSync(filePath, content);
        }
    });
}

fixPaths('./public/games/my-game');
```

## 🚨 Troubleshooting

### Game Won't Load
1. **Check file paths**: All assets must use relative paths
2. **Check console errors**: Look for 404s or JavaScript errors
3. **Test standalone**: Open the game directly in browser first
4. **Check iframe restrictions**: Some games block iframe embedding

### Game Looks Broken
1. **CSS issues**: Check if styles are loading correctly
2. **Canvas sizing**: May need responsive canvas setup
3. **Asset loading**: Verify all images/sounds load
4. **JavaScript errors**: Check browser console

### Performance Issues
1. **Large assets**: Optimize images and sounds
2. **Memory leaks**: Check for unclosed intervals/timeouts
3. **Heavy computation**: May need to optimize game loop
4. **External requests**: Remove or localize external dependencies

## 📚 Recommended GitHub Game Sources

### Simple HTML5 Games
- GitHub search: `flappy bird html5 canvas`
- GitHub search: `snake game javascript`
- GitHub search: `tetris html5`

### Framework Games
- GitHub search: `phaser game examples`
- GitHub search: `pixijs game`
- GitHub search: `threejs game`

### Game Jams
- GitHub search: `js13k games`
- GitHub search: `ludum dare`
- GitHub search: `itch.io game jam`

## 🎯 Best Practices

1. **Start simple**: Begin with basic HTML5 games
2. **Test thoroughly**: Always test in iframe context
3. **Optimize assets**: Compress images and sounds
4. **Document changes**: Keep notes of what you modified
5. **Version control**: Consider forking the original game
6. **Respect licenses**: Check game licenses before using

## 🚀 Quick Start

```bash
# 1. Find a game on GitHub
# 2. Clone it
git clone https://github.com/username/game-name.git

# 3. Add to your website
npm run add-game game-name "Game Title" "Game description"

# 4. Copy and fix files
cp -r game-name/* public/games/game-name/
# Fix paths and iframe issues

# 5. Test
npm run dev
# Visit: http://localhost:3000/games/game-name
```

This approach will help you integrate existing GitHub games into your website efficiently while maintaining compatibility with your iframe-based platform!
