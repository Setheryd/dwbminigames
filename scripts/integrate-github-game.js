#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// GitHub game integration script
function integrateGitHubGame() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node scripts/integrate-github-game.js <github-url> <game-id> <game-title> [description]');
    console.log('');
    console.log('Example: node scripts/integrate-github-game.js https://github.com/username/flappy-bird.git flappy-bird "Flappy Bird" "A simple flappy bird game"');
    process.exit(1);
  }

  const githubUrl = args[0];
  const gameId = args[1];
  const gameTitle = args[2];
  const description = args[3] || 'An exciting game from GitHub';

  // Validate game ID
  if (!/^[a-z0-9-]+$/.test(gameId)) {
    console.error('❌ Game ID must contain only lowercase letters, numbers, and hyphens');
    process.exit(1);
  }

  const tempDir = path.join(__dirname, '..', 'temp-game');
  const gamesDir = path.join(__dirname, '..', 'public', 'games');
  const gameDir = path.join(gamesDir, gameId);
  const thumbnailsDir = path.join(__dirname, '..', 'public', 'Thumbnails');
  const gamesFile = path.join(__dirname, '..', 'src', 'lib', 'games.ts');

  console.log(`🎮 Integrating GitHub game: ${gameTitle}`);
  console.log(`📦 Repository: ${githubUrl}`);
  console.log(`🆔 Game ID: ${gameId}`);
  console.log('');

  try {
    // 1. Create game directory using existing script
    console.log('📁 Creating game directory...');
    if (!fs.existsSync(gameDir)) {
      fs.mkdirSync(gameDir, { recursive: true });
    }

    // 2. Clone the GitHub repository
    console.log('⬇️  Cloning GitHub repository...');
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    try {
      execSync(`git clone ${githubUrl} ${tempDir}`, { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to clone repository. Check the URL and try again.');
      process.exit(1);
    }

    // 3. Analyze the repository structure
    console.log('🔍 Analyzing repository structure...');
    const tempFiles = fs.readdirSync(tempDir);
    console.log('Found files:', tempFiles.join(', '));

    // 4. Check for package.json and build process
    const hasPackageJson = fs.existsSync(path.join(tempDir, 'package.json'));
    const hasIndexHtml = fs.existsSync(path.join(tempDir, 'index.html'));
    const hasDist = fs.existsSync(path.join(tempDir, 'dist'));
    const hasBuild = fs.existsSync(path.join(tempDir, 'build'));

    console.log(`📦 Has package.json: ${hasPackageJson}`);
    console.log(`🌐 Has index.html: ${hasIndexHtml}`);
    console.log(`📁 Has dist folder: ${hasDist}`);
    console.log(`🔨 Has build folder: ${hasBuild}`);

    // 5. Build if necessary
    if (hasPackageJson) {
      console.log('🔨 Installing dependencies and building...');
      try {
        execSync('npm install', { cwd: tempDir, stdio: 'inherit' });
        
        // Try different build commands
        const buildCommands = ['npm run build', 'npm run dist', 'npm run compile'];
        let buildSuccess = false;
        
        for (const command of buildCommands) {
          try {
            execSync(command, { cwd: tempDir, stdio: 'inherit' });
            buildSuccess = true;
            console.log(`✅ Build successful with: ${command}`);
            break;
          } catch (error) {
            console.log(`⚠️  Build failed with: ${command}`);
          }
        }
        
        if (!buildSuccess) {
          console.log('⚠️  Build failed, but continuing with source files...');
        }
      } catch (error) {
        console.log('⚠️  Build process failed, continuing with source files...');
      }
    }

    // 6. Copy files to game directory
    console.log('📋 Copying files to game directory...');
    
    // Determine source directory
    let sourceDir = tempDir;
    if (hasDist && fs.existsSync(path.join(tempDir, 'dist'))) {
      sourceDir = path.join(tempDir, 'dist');
    } else if (hasBuild && fs.existsSync(path.join(tempDir, 'build'))) {
      sourceDir = path.join(tempDir, 'build');
    }

    // Copy files
    copyDirectory(sourceDir, gameDir);
    console.log('✅ Files copied successfully');

    // 7. Fix common issues
    console.log('🔧 Fixing common issues...');
    fixCommonIssues(gameDir);

    // 8. Add game metadata
    console.log('📝 Adding game metadata...');
    addGameMetadata(gameId, gameTitle, description, gamesFile);

    // 9. Check for thumbnail
    const thumbnailPath = path.join(thumbnailsDir, `${gameId}.jpg`);
    if (!fs.existsSync(thumbnailPath)) {
      console.log('⚠️  No thumbnail found. Please add:', thumbnailPath);
      console.log('   Recommended size: 400x300 pixels');
    } else {
      console.log('✅ Thumbnail found');
    }

    // 10. Clean up
    console.log('🧹 Cleaning up temporary files...');
    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log('');
    console.log('🎉 Game integration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Test your game: http://localhost:3000/games/' + gameId);
    console.log('2. Add a thumbnail image to:', thumbnailPath);
    console.log('3. Check for any remaining issues in browser console');
    console.log('4. Update game metadata in src/lib/games.ts if needed');
    console.log('');
    console.log('Common issues to check:');
    console.log('- Asset paths (should be relative: ./assets/image.png)');
    console.log('- External dependencies (should be local)');
    console.log('- Iframe compatibility (no window.top references)');
    console.log('');
    console.log('Happy gaming! 🚀');

  } catch (error) {
    console.error('❌ Error during integration:', error.message);
    
    // Clean up on error
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    process.exit(1);
  }
}

function copyDirectory(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function fixCommonIssues(gameDir) {
  const files = fs.readdirSync(gameDir);
  
  files.forEach(file => {
    const filePath = path.join(gameDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixCommonIssues(filePath);
    } else if (file.endsWith('.html') || file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix asset paths
      content = content.replace(/src="\//g, 'src="./');
      content = content.replace(/href="\//g, 'href="./');
      content = content.replace(/url\("\/\//g, 'url("./');
      content = content.replace(/url\('\/\//g, "url('./");
      
      // Comment out problematic iframe code
      content = content.replace(/window\.top\./g, '// window.top.');
      content = content.replace(/window\.parent\./g, '// window.parent.');
      
      // Add iframe detection
      if (file.endsWith('.html') && content.includes('<script>')) {
        const iframeCheck = `
// Iframe compatibility check
if (window.self !== window.top) {
    console.log('Running in iframe mode');
    // Disable problematic features here if needed
}
`;
        content = content.replace('<script>', '<script>' + iframeCheck);
      }
      
      fs.writeFileSync(filePath, content);
    }
  });
}

function addGameMetadata(gameId, gameTitle, description, gamesFile) {
  try {
    let gamesContent = fs.readFileSync(gamesFile, 'utf8');
    
    // Check if game already exists
    if (gamesContent.includes(`id: '${gameId}'`)) {
      console.log('⚠️  Game already exists in games.ts');
      return;
    }

    // Create game entry
    const gameEntry = `  {
    id: '${gameId}',
    title: '${gameTitle}',
    description: '${description}',
    difficulty: 'Medium',
    highScore: 0,
    isAvailable: true,
    thumbnail: '/Thumbnails/${gameId}.jpg',
    category: 'Arcade',
    estimatedPlayTime: '5-15 minutes',
    isPopular: false,
    isFeatured: false,
    isRecent: true,
    isBest: false,
  },`;

    // Insert before the closing bracket of the games array
    const insertIndex = gamesContent.lastIndexOf('];');
    if (insertIndex !== -1) {
      gamesContent = gamesContent.slice(0, insertIndex) + gameEntry + '\n' + gamesContent.slice(insertIndex);
      fs.writeFileSync(gamesFile, gamesContent);
      console.log('✅ Added game to games.ts');
    } else {
      console.log('❌ Could not find games array in games.ts');
    }
  } catch (error) {
    console.log('❌ Error updating games.ts:', error.message);
  }
}

integrateGitHubGame();
