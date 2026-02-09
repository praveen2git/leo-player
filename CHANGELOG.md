# Changelog

All notable changes to Leo Player will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-09

### Added

#### Audio Features
- **Audio Visualizations**: 3 types (Bars, Waveform, Circular) with real-time analysis
- **10-Band Equalizer**: Graphic equalizer with 8 presets and custom settings
- **Sleep Timer**: Auto-pause after customizable duration (15-120 minutes)
- **Playlist Manager**: Create, save, and load playlists
- **Speed Control**: Adjust playback speed from 0.5x to 2x
- **Gapless Playback**: Smooth transitions between audio tracks

#### Video Features
- **VideoPlayer Component**: Full-featured video player
- **Auto-Play Next**: "Next Episode" overlay 30 seconds before end
- **Custom Controls**: Auto-hiding player controls with 3s timeout
- **Picture-in-Picture**: Continue watching while browsing
- **Fullscreen Mode**: Immersive viewing experience
- **Resume Playback**: Pick up where you left off

#### Image Features
- **ImageGallery Component**: Masonry grid layout
- **Lightbox Viewer**: Full-screen image viewing with zoom
- **Slideshow Mode**: Auto-play with customizable intervals (2s-10s)
- **Zoom Controls**: 1x to 3x zoom with pan gestures
- **Thumbnail Strip**: Quick navigation in lightbox

#### Drive Browser
- **FileBrowser Component**: Complete file browsing system
- **Breadcrumb Navigation**: Easy folder traversal
- **Real-time Search**: Instant search with 300ms debounce
- **Smart Filters**: Filter by audio, video, images, or folders
- **FolderCard**: "Play All" and "Shuffle" buttons on folders
- **MediaCard**: Preview and play individual files
- **Infinite Scroll**: Load more files seamlessly

#### Player Controls
- **MiniPlayer**: Persistent bottom bar across all pages
- **QueueSidebar**: Slide-in queue management panel
- **Drag & Drop**: Reorder tracks in queue
- **Current Track Highlighting**: Visual feedback for active track

#### Keyboard Shortcuts
- `Space/K` - Play/Pause
- `←/→` - Previous/Next track
- `↑/↓` - Volume control
- `M` - Mute/Unmute
- `S` - Shuffle
- `R` - Repeat mode
- `F` - Fullscreen
- `Esc` - Exit fullscreen/lightbox
- `?` - Show shortcuts help

#### Custom Hooks
- **useKeyboardShortcuts**: Global keyboard navigation
- **useMediaSession**: System media controls integration
- **useDownloadProgress**: Track buffer/download progress

#### API Routes
- `/api/drive/files` - List files in folder
- `/api/drive/stream/[fileId]` - Stream media files
- `/api/drive/search` - Search Drive files

### Enhanced
- **State Management**: Complete Zustand stores for auth, drive, and player
- **TypeScript**: Full type safety across all components
- **Responsive Design**: Mobile-first approach with touch controls
- **Error Handling**: Graceful error messages and retry logic
- **Loading States**: Smooth loading indicators

### Documentation
- **FEATURES.md**: Comprehensive features list (150+ features)
- **ARCHITECTURE.md**: Complete technical documentation
- **DEPLOYMENT.md**: Multi-platform deployment guides
- **CONTRIBUTING.md**: Contribution guidelines
- **CHANGELOG.md**: This file

## [0.1.0] - 2026-02-09

### Added

#### Core Infrastructure
- **Next.js 14** setup with App Router
- **TypeScript** configuration
- **Tailwind CSS** with custom theming
- **shadcn/ui** component library integration

#### Authentication
- **Firebase Authentication** setup
- Email/Password authentication
- Google OAuth 2.0 integration
- Google Drive API OAuth scopes
- Protected routes with AuthGuard

#### State Management
- **authStore**: User and Drive connection management
- **driveStore**: File browser state
- **playerStore**: Media playback state
- Zustand with localStorage persistence

#### UI Components
- **Navbar**: Navigation bar with user info
- **Landing Page**: Beautiful gradient homepage
- **Login Page**: Email and Google OAuth login
- **Drive Page**: Basic Drive integration

#### Core Libraries
- **firebase.ts**: Firebase configuration
- **drive.ts**: Google Drive API wrapper
- **utils.ts**: Helper functions (debounce, throttle, shuffle)
- **types/index.ts**: TypeScript type definitions

#### Documentation
- **README.md**: Project overview and quick start
- **SETUP.md**: Detailed setup instructions
- **.env.example**: Environment variables template

### Technical Details
- Node.js 18+ requirement
- Next.js 14.1.0
- React 18.2.0
- TypeScript 5
- Tailwind CSS 3.3.0

---

## Upcoming Features

### Phase 3: Advanced Features
- Chromecast/AirPlay support
- Offline mode (PWA)
- Lyrics display (.lrc files)
- Dark mode
- Custom themes
- Voice commands
- AI-powered recommendations
- Last.fm scrobbling
- Export/import playlists
- Collaborative playlists

---

**For detailed feature descriptions, see [FEATURES.md](FEATURES.md)**
