# Leo Player 🎵🎬📸

A Spotify/YouTube-like experience for your Google Drive media files. Instantly play entire music folders, binge-watch video collections, or slideshow through photo albums with one click.

## 🎯 Features

### Core Functionality
- **Folder-Level Playback**: One-click to play all media in any folder
- **Multi-Format Support**: Audio (MP3, WAV, FLAC, M4A), Video (MP4, MKV, AVI, WebM), Images (JPG, PNG, GIF)
- **Advanced Player Controls**: Shuffle, repeat, speed control, equalizer
- **Persistent Mini Player**: Continues playing as you browse
- **Queue Management**: Add, reorder, and manage your playback queue

### Authentication & Integration
- Firebase Authentication (Email/Password + Google OAuth)
- Google Drive API integration with full folder navigation
- Multi-account Drive support
- Secure token management

### User Experience
- Responsive design (Desktop & Mobile)
- Keyboard shortcuts for power users
- Resume playback from last position
- Playback history and user preferences
- Dark mode support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account
- Google Cloud Console project (for Drive API)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/praveen2git/leo-player.git
cd leo-player
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**
- Create a new project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Email/Password and Google)
- Create a Firestore database
- Copy your Firebase config

4. **Set up Google Drive API**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable Google Drive API
- Create OAuth 2.0 credentials
- Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
- Required scopes:
  - `https://www.googleapis.com/auth/drive.readonly`
  - `https://www.googleapis.com/auth/drive.metadata.readonly`

5. **Configure environment variables**
```bash
cp .env.example .env
```
Edit `.env` and fill in your credentials

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
leo-player/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Auth pages
│   │   ├── drive/          # Drive browser pages
│   │   └── player/         # Player pages
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── drive/         # Drive browser components
│   │   ├── player/        # Media player components
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # Utilities and configs
│   │   ├── firebase.ts    # Firebase configuration
│   │   ├── drive.ts       # Google Drive API helpers
│   │   └── utils.ts       # Helper functions
│   └── store/             # Zustand state management
│       ├── authStore.ts   # Auth state
│       ├── driveStore.ts  # Drive navigation state
│       └── playerStore.ts # Player state
├── public/                # Static assets
└── package.json
```

## 🎮 Keyboard Shortcuts

- `Space` - Play/Pause
- `←` / `→` - Previous/Next track
- `↑` / `↓` - Volume up/down
- `M` - Mute
- `S` - Shuffle
- `R` - Repeat
- `F` - Fullscreen (video)
- `Esc` - Close player

## 🔒 Security

- OAuth tokens stored securely (never hardcoded)
- File type validation
- Sanitized filenames and metadata
- Rate limiting on API calls
- HTTPS-only in production
- CORS properly configured

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Environment Variables for Production
- Update `NEXTAUTH_URL` to your production domain
- Update Google OAuth redirect URIs in Cloud Console
- Ensure all Firebase services are in production mode

## 📊 Performance Targets

- ✅ Folder load to play: <2 seconds
- ✅ 100+ files folder: Smooth loading
- ✅ Gapless audio playback
- ✅ Video resume from exact position
- ✅ Mobile responsive
- ✅ Cross-browser support (Chrome/Safari/Firefox)

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **API Integration**: Google Drive API
- **Deployment**: Vercel

## 📝 Roadmap

### Phase 1: MVP ✅
- [x] Firebase Authentication
- [x] Google Drive OAuth
- [x] Folder browser
- [x] Basic audio player
- [x] Mini player bar

### Phase 2: Polish (In Progress)
- [ ] Video player with auto-play
- [ ] Image gallery with slideshow
- [ ] Queue system with shuffle
- [ ] Playback state persistence
- [ ] Responsive mobile UI

### Phase 3: Advanced Features
- [ ] Equalizer presets
- [ ] Speed control
- [ ] Keyboard shortcuts
- [ ] Chromecast/AirPlay support
- [ ] Offline mode with service worker
- [ ] Playlist creation
- [ ] Sharing capabilities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

**Praveen Kumar**
- GitHub: [@praveen2git](https://github.com/praveen2git)
- Location: Salem, Tamil Nadu, India

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Made with ❤️ for Drive media lovers**
