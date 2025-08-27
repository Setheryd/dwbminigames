# 🚀 Quick Start: Integrating GitHub Games

## The Easy Way (Recommended)

### 1. Find a Game on GitHub
Search for games using these terms:
- `flappy bird html5`
- `snake game javascript`
- `tetris html5`
- `phaser game examples`
- `js13k games`

### 2. Use the Automated Script
```bash
# Format: npm run integrate-github <github-url> <game-id> <game-title> [description]

# Example 1: Simple HTML5 game
npm run integrate-github https://github.com/username/flappy-bird.git flappy-bird "Flappy Bird" "A simple flappy bird game"

# Example 2: Phaser.js game
npm run integrate-github https://github.com/username/platformer.git platformer "Platform Adventure" "A 2D platformer game"

# Example 3: Three.js game
npm run integrate-github https://github.com/username/maze-game.git maze "3D Maze" "Navigate through a 3D maze"
```

### 3. Test Your Game
```bash
npm run dev
# Visit: http://localhost:3000/games/[game-id]
```

## The Manual Way

### 1. Clone the Game
```bash
git clone https://github.com/username/game-name.git
cd game-name
```

### 2. Build (if needed)
```bash
npm install
npm run build
```

### 3. Add to Your Website
```bash
npm run add-game game-name "Game Title" "Game description"
```

### 4. Copy Files
```bash
# For built games
cp -r dist/* ../public/games/game-name/

# For simple HTML games
cp index.html ../public/games/game-name/
cp -r assets ../public/games/game-name/
```

### 5. Fix Common Issues
- **Asset paths**: Change `/images/` to `./images/`
- **External dependencies**: Download and include locally
- **Iframe issues**: Remove `window.top` references

## 🎯 Game Types by Difficulty

### Easy (HTML5 Canvas)
- Flappy Bird clones
- Snake games
- Tetris clones
- Simple arcade games

### Medium (Game Frameworks)
- Phaser.js games
- PixiJS games
- Simple Three.js games

### Hard (Complex Frameworks)
- React/Vue games
- Complex WebGL games
- Games with build systems

## 🔧 Common Fixes

### Fix Asset Paths
```bash
# Replace absolute paths with relative paths
sed -i 's|src="/|src="./|g' public/games/my-game/index.html
sed -i 's|href="/|href="./|g' public/games/my-game/index.html
```

### Download External Libraries
```bash
# Download Phaser.js locally
wget https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js -O public/games/my-game/lib/phaser.min.js
```

### Fix Iframe Issues
```javascript
// Add this to game JavaScript
if (window.self !== window.top) {
    console.log('Running in iframe mode');
    // Disable problematic features
}
```

## 🚨 Troubleshooting

### Game Won't Load
1. Check browser console for errors
2. Verify all asset paths are relative
3. Test game standalone first
4. Check for iframe restrictions

### Game Looks Broken
1. Check if CSS is loading
2. Verify canvas sizing
3. Check asset loading
4. Look for JavaScript errors

### Performance Issues
1. Optimize images and sounds
2. Check for memory leaks
3. Remove external requests
4. Optimize game loop

## 📚 Recommended GitHub Searches

### Simple Games
```
flappy bird html5 canvas
snake game javascript
tetris html5
memory game javascript
```

### Framework Games
```
phaser game examples
pixijs game
threejs game
babylonjs game
```

### Game Jams
```
js13k games
ludum dare
itch.io game jam
```

## 🎮 Example Integration

Let's integrate a simple Flappy Bird clone:

```bash
# 1. Find a game
# Search: "flappy bird html5 canvas" on GitHub

# 2. Integrate it
npm run integrate-github https://github.com/username/flappy-bird.git flappy-bird "Flappy Bird" "A simple flappy bird game"

# 3. Test it
npm run dev
# Visit: http://localhost:3000/games/flappy-bird

# 4. Add thumbnail
# Copy a screenshot to: public/Thumbnails/flappy-bird.jpg
```

## 🎯 Pro Tips

1. **Start simple**: Begin with basic HTML5 games
2. **Test thoroughly**: Always test in iframe context
3. **Document changes**: Keep notes of what you modified
4. **Respect licenses**: Check game licenses before using
5. **Optimize assets**: Compress images and sounds
6. **Version control**: Consider forking the original game

## 🚀 Ready to Start?

Pick a simple game from GitHub and try the automated script:

```bash
npm run integrate-github https://github.com/username/simple-game.git my-first-game "My First Game" "A simple game from GitHub"
```

Happy game integrating! 🎮
