# DWB Mini Games 🎮

A collection of mini-games themed around the DWB (DickWifButt) cryptocurrency community. Built with Next.js, TypeScript, and Tailwind CSS for a retro gaming experience.

## 🚀 Features

- **Retro Gaming Aesthetic**: Old-school gaming vibe inspired by addictinggames.com and miniclip.com
- **Multiple Games**: Collection of classic games with DWB theming
- **Leaderboards**: Track high scores for each game
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Powered by Framer Motion
- **TypeScript**: Full type safety and better developer experience

## 🎯 Available Games

### Currently Available
- **Flappy DWB** - Navigate your DickWifButt through obstacles (Flappy Bird style)

### Coming Soon
- **DWB Cannon** - Launch your character to hit targets (Kitty Cannon style)
- **DWB Runner** - Run, jump, and dodge obstacles
- **DWB Puzzle** - Match and clear DickWifButt tiles
- **DWB Tetris** - Classic Tetris with a DWB twist
- **DWB Snake** - Guide your DWB snake to eat food

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Custom CSS with retro gaming theme
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dwbminigames.git
   cd dwbminigames
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Play

### Flappy DWB
- **Objective**: Navigate your DickWifButt character through pipes
- **Controls**: 
  - Click or tap to flap
  - Press Spacebar to flap
- **Scoring**: Pass through pipes to earn points
- **Game Over**: Hit pipes, ground, or ceiling

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── games/             # Individual game pages
│   │   └── flappy-dwb/    # Flappy DWB game
│   ├── leaderboard/       # Leaderboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── GameCard.tsx       # Game card component
│   ├── GameCarousel.tsx   # Carousel of games
│   ├── GameGrid.tsx       # Grid layout for games
│   ├── Header.tsx         # Site header
│   └── Sidebar.tsx        # Sidebar navigation
├── lib/                   # Utility functions
│   └── games.ts           # Game data and utilities
└── types/                 # TypeScript type definitions
    └── game.ts            # Game-related types
```

## 🎨 Customization

### Adding Your DWB Character
1. Add your SVG character to the `public/` directory
2. Update the game canvas drawing functions to use your character
3. Replace placeholder rectangles with your character sprite

### Adding New Games
1. Create a new directory in `src/app/games/`
2. Add game data to `src/lib/games.ts`
3. Implement game logic using HTML5 Canvas
4. Add leaderboard integration

### Styling
- Colors are defined in `src/app/globals.css` as CSS variables
- Retro gaming styles are in the same file
- Use the `pixel-button` and `game-card` classes for consistent styling

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔮 Future Features

- **Wallet Integration**: Connect crypto wallets for player identification
- **NFT Rewards**: Award NFTs for high scores and achievements
- **Multiplayer**: Real-time multiplayer games
- **Chat System**: In-game chat for the community
- **Tournaments**: Scheduled competitive events
- **Mobile App**: React Native version for mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-game`)
3. Commit your changes (`git commit -m 'Add amazing game'`)
4. Push to the branch (`git push origin feature/amazing-game`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Project setup with Next.js
- [x] Basic game framework
- [x] Flappy DWB implementation
- [x] Leaderboard system
- [x] Retro gaming UI

### Phase 2: Expansion 🚧
- [ ] Add DWB Cannon game
- [ ] Add DWB Runner game
- [ ] Add DWB Puzzle game
- [ ] Improve character sprites
- [ ] Add sound effects

### Phase 3: Community Features 📋
- [ ] User authentication
- [ ] Wallet integration
- [ ] Achievement system
- [ ] Social features
- [ ] Tournament system

### Phase 4: Advanced Features 📋
- [ ] Multiplayer games
- [ ] NFT integration
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Community marketplace

## 🐛 Known Issues

- Game canvas may not scale properly on very small screens
- Sound effects not yet implemented
- Leaderboard data is currently mock data

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Join the DWB community Discord
- Contact the development team

---

**Built with ❤️ for the DWB (DickWifButt) Community**
