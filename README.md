# Leo Player 🎵🎬📸

> A Spotify/YouTube-like experience for your Google Drive media files. Instantly play entire music folders, binge-watch video collections, or slideshow through photo albums with one click.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange)](https://firebase.google.com/)

![Leo Player Banner](https://img.shields.io/badge/Leo%20Player-Production%20Ready-success)

## ✨ Features

### 🎵 Audio Player
- **Audio Visualizations**: 3 types (Bars, Waveform, Circular)
- **10-Band Equalizer**: 8 presets + custom settings
- **Sleep Timer**: Auto-pause after set duration
- **Playlist Manager**: Create and manage playlists
- **Gapless Playback**: Smooth transitions between tracks
- **Speed Control**: 0.5x to 2x playback speed

### 🎥 Video Player
- **Auto-Play Next**: "Next Episode" overlay 30s before end
- **Custom Controls**: Auto-hiding player controls
- **Picture-in-Picture**: Continue watching while browsing
- **Resume Playback**: Pick up where you left off
- **Speed Control**: Adjustable playback speed
- **Fullscreen Mode**: Immersive viewing experience

### 🖼️ Image Gallery
- **Lightbox Viewer**: Full-screen image viewing
- **Zoom Controls**: 1x to 3x zoom with pan
- **Slideshow Mode**: Auto-play with customizable intervals
- **Thumbnail Strip**: Quick navigation
- **Keyboard Navigation**: Arrow keys, Space, Esc

### 📁 Drive Browser
- **Folder Navigation**: Breadcrumb trail for easy navigation
- **Real-time Search**: Instant search with 300ms debounce
- **Smart Filters**: Filter by audio, video, images, or folders
- **Folder Playback**: "Play All" and "Shuffle" buttons
- **Infinite Scroll**: Load more files seamlessly

### ⌨️ Keyboard Shortcuts
- `Space/K` - Play/Pause
- `←/→` - Previous/Next track
- `↑/↓` - Volume up/down
- `M` - Mute/Unmute
- `S` - Shuffle
- `R` - Repeat mode
- `F` - Fullscreen
- `Esc` - Exit fullscreen/lightbox
- `?` - Show shortcuts help

### 📱 Mini Player
- **Persistent Bottom Bar**: Always accessible
- **Works Across Pages**: Continuous playback while browsing
- **Quick Controls**: Play, pause, skip, volume
- **Expand to Full**: Open dedicated player page
- **Queue Access**: Quick access to upcoming tracks

### 🎮 Queue Management
- **Drag & Drop Reordering**: Rearrange tracks
- **Add/Remove Tracks**: Manage queue easily
- **Current Track Highlighting**: Know what's playing
- **Queue Sidebar**: Slide-in panel with full queue

### 🔒 Security & Auth
- **Firebase Authentication**: Email/Password + Google OAuth
- **Secure Token Management**: Encrypted storage
- **Multi-Account Support**: Connect multiple Google Drives
- **Auto Token Refresh**: Seamless session management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase account
- Google Cloud Console account

### Installation

```bash
# Clone the repository
git clone https://github.com/praveen2git/leo-player.git
cd leo-player

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Configuration

See [SETUP.md](SETUP.md) for detailed setup instructions including:
- Firebase project setup
- Google Drive API configuration
- OAuth credentials
- Environment variables

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Vercel, AWS, Docker
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
- **[FEATURES.md](FEATURES.md)** - Comprehensive features list (150+)
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

## 📁 Project Structure

```
leo-player/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes (Drive, Auth)
│   │   ├── auth/              # Authentication pages
│   │   ├── drive/             # Drive browser
│   │   └── player/            # Audio/Video/Gallery players
│   ├── components/
│   │   ├── auth/              # Auth components
│   │   ├── drive/             # File browser components
│   │   ├── player/            # Media player components
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── AudioVisualizer.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── MiniPlayer.tsx
│   │   │   ├── QueueSidebar.tsx
│   │   │   ├── Equalizer.tsx
│   │   │   ├── SleepTimer.tsx
│   │   │   └── PlaylistManager.tsx
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/                 # Custom React hooks
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useMediaSession.ts
│   │   └── useDownloadProgress.ts
│   ├── lib/                   # Utilities and configs
│   │   ├── firebase.ts        # Firebase setup
│   │   ├── drive.ts           # Drive API helpers
│   │   └── utils.ts           # Helper functions
│   ├── store/                 # Zustand state stores
│   │   ├── authStore.ts
│   │   ├── driveStore.ts
│   │   └── playerStore.ts
│   └── types/                 # TypeScript definitions
├── public/                    # Static assets
├── package.json
└── next.config.js
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **API Integration**: Google Drive API
- **Audio Processing**: Web Audio API
- **Deployment**: Vercel

## 🎨 Screenshots

### Homepage
Beautiful landing page with gradient design and feature highlights.

### Audio Player
Advanced audio player with 3 visualization types and 10-band equalizer.

### Video Player
Custom video player with auto-play next and picture-in-picture.

### Drive Browser
Intuitive file browser with search, filters, and folder playback.

### Mini Player
Persistent mini player that works across all pages.

## 📊 Performance

- ✅ Folder load to play: <2 seconds
- ✅ 100+ files folder: Smooth loading
- ✅ Gapless audio playback
- ✅ 60fps visualizations
- ✅ Mobile responsive
- ✅ Cross-browser support

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Good First Issues

Look for issues labeled:
- `good first issue` - Perfect for newcomers
- `help wanted` - Community help needed
- `enhancement` - New features
- `bug` - Bug fixes

## 📝 Roadmap

### ✅ Phase 1: MVP (Completed)
- [x] Firebase Authentication
- [x] Google Drive OAuth
- [x] Folder browser
- [x] Basic audio player
- [x] Mini player bar

### ✅ Phase 2: Features (Completed)
- [x] Audio visualizations
- [x] Video player with auto-play
- [x] Image gallery with lightbox
- [x] Equalizer & sleep timer
- [x] Keyboard shortcuts
- [x] Queue management
- [x] Playlist manager

### 🔮 Phase 3: Advanced (Upcoming)
- [ ] Chromecast/AirPlay support
- [ ] Offline mode (PWA)
- [ ] Lyrics display
- [ ] Dark mode
- [ ] Custom themes
- [ ] Sharing capabilities
- [ ] Voice commands
- [ ] AI recommendations

## 💬 Support

For issues or questions:
- 🐛 [Report a bug](https://github.com/praveen2git/leo-player/issues/new?template=bug_report.md)
- 🚀 [Request a feature](https://github.com/praveen2git/leo-player/issues/new?template=feature_request.md)
- 💬 [Ask a question](https://github.com/praveen2git/leo-player/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Praveen Kumar**
- GitHub: [@praveen2git](https://github.com/praveen2git)
- Location: Salem, Tamil Nadu, India
- Experience: 8+ years in PHP, Node.js, Python, React.js, Next.js, AWS

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Firebase](https://firebase.google.com/) - Authentication & Database
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

## ⭐ Star History

If you find Leo Player useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=praveen2git/leo-player&type=Date)](https://star-history.com/#praveen2git/leo-player&Date)

---

<div align="center">
  <strong>Made with ❤️ for Drive media lovers</strong>
  <br>
  <sub>Built with passion by Praveen Kumar</sub>
</div>
