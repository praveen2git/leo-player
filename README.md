# Leo Player 🎵🎬📸

> A Spotify/YouTube-like experience for your Google Drive media files with advanced search and download capabilities. Search online music, download to Drive, and stream M3U8 playlists - all in one place!

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange)](https://firebase.google.com/)

![Leo Player Banner](https://img.shields.io/badge/Leo%20Player-Production%20Ready-success)

## ✨ Features

### 🆕 **NEW: Global Search & Download**
- **Global Search**: `Ctrl+K` to search Drive or online sources
- **YouTube Music Integration**: Search millions of songs
- **Download to Drive**: Save high-quality audio (up to 320kbps)
- **Download Queue**: Manage multiple downloads with progress tracking
- **M3U8 Streaming**: Play HLS/IPTV live streams
- **Per-User Playlists**: Save and organize playlists in Firestore

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
- `Ctrl+K` / `⌘K` - Global search
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
- YouTube Data API key (for search feature)

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
- YouTube Data API setup
- OAuth credentials
- Environment variables

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Vercel, AWS, Docker
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
- **[FEATURES.md](FEATURES.md)** - Comprehensive features list (170+)
- **[SEARCH_DOWNLOAD.md](SEARCH_DOWNLOAD.md)** - Search & download guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

## 🔍 How Search & Download Works

### 1. Search Your Drive
```
Ctrl+K → Type song name → "My Drive" tab shows results → Click to play
```

### 2. Search Online & Download
```
Ctrl+K → Switch to "Online" tab → Search YouTube Music →
Click download button → High-quality audio saved to Drive →
Find in Drive search after download completes
```

### 3. Stream M3U8 Playlists
```
Playlists → M3U8 Streams tab → Add M3U8 URL →
Click play → HLS streaming with adaptive bitrate
```

## 📁 Project Structure

```
leo-player/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── drive/         # Drive API endpoints
│   │   │   ├── search/        # Search API (YouTube)
│   │   │   └── download/      # Download API
│   │   ├── auth/              # Authentication pages
│   │   ├── drive/             # Drive browser
│   │   ├── player/            # Media players
│   │   └── playlists/         # Playlist management
│   ├── components/
│   │   ├── auth/              # Auth components
│   │   ├── drive/             # File browser
│   │   ├── player/            # Media players
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── M3U8Player.tsx     # NEW
│   │   │   ├── Equalizer.tsx
│   │   │   └── ...
│   │   ├── search/            # NEW
│   │   │   └── GlobalSearch.tsx
│   │   ├── download/          # NEW
│   │   │   └── DownloadQueue.tsx
│   │   ├── playlist/          # NEW
│   │   │   └── PlaylistManager.tsx
│   │   └── ui/                # shadcn/ui
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities
│   ├── store/                 # Zustand stores
│   └── types/                 # TypeScript types
├── public/
└── ...
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **APIs**: Google Drive API, YouTube Data API
- **Streaming**: HLS.js (M3U8 support)
- **Audio Processing**: Web Audio API
- **Deployment**: Vercel

## 🎨 Screenshots

### Global Search
Unified search interface for Drive and online sources with download capability.

### Audio Player
Advanced audio player with 3 visualization types and 10-band equalizer.

### Video Player
Custom video player with auto-play next and picture-in-picture.

### M3U8 Streaming
Live streaming support with adaptive bitrate and quality controls.

### Download Queue
Manage multiple downloads with real-time progress tracking.

## 📊 Performance

- ✅ Folder load to play: <2 seconds
- ✅ Search response: <300ms
- ✅ Download to Drive: 30s - 2min (depends on quality)
- ✅ M3U8 stream start: <5 seconds
- ✅ 100+ files folder: Smooth loading
- ✅ Gapless audio playback
- ✅ 60fps visualizations
- ✅ Mobile responsive
- ✅ Cross-browser support

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

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

### ✅ Phase 3: Search & Download (Completed)
- [x] Global search with Ctrl+K
- [x] YouTube Music integration
- [x] Download to Drive
- [x] Download queue manager
- [x] M3U8/HLS streaming
- [x] Per-user playlist storage

### 🔮 Phase 4: Advanced (Upcoming)
- [ ] Spotify search integration
- [ ] SoundCloud support
- [ ] Automatic metadata tagging
- [ ] Album art embedding
- [ ] Lyrics display
- [ ] Chromecast/AirPlay support
- [ ] Offline mode (PWA)
- [ ] Dark mode
- [ ] Custom themes
- [ ] Voice commands
- [ ] AI recommendations

## ⚠️ Legal Notice

**Important**: This application is for personal use only.

- Respect copyright laws and content creator rights
- Follow YouTube's Terms of Service
- Do not redistribute downloaded content
- Use for personal, non-commercial purposes only
- Always obtain proper licenses for commercial use

See [SEARCH_DOWNLOAD.md](SEARCH_DOWNLOAD.md) for detailed legal considerations.

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
- [HLS.js](https://github.com/video-dev/hls.js) - HLS streaming
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [YouTube Data API](https://developers.google.com/youtube/v3) - Music search

## ⭐ Star History

If you find Leo Player useful, please consider giving it a star!

[![Star History Chart](https://api.star-history.com/svg?repos=praveen2git/leo-player&type=Date)](https://star-history.com/#praveen2git/leo-player&Date)

---

<div align="center">
  <strong>Made with ❤️ for Drive media lovers</strong>
  <br>
  <sub>Built with passion by Praveen Kumar</sub>
  <br><br>
  <strong>v0.3.0 - Now with Global Search & Download!</strong>
</div>
