# Changelog

All notable changes to Leo Player will be documented in this file.

## [0.3.0] - 2026-02-09

### 🆕 NEW FEATURES

#### Global Search & Download
- **Global Search Modal**: Unified search interface with `Ctrl+K` keyboard shortcut
  - Search across Google Drive files
  - Search YouTube Music for millions of songs
  - Tabbed interface for Drive vs Online results
  - Real-time search with debouncing
  - Beautiful modal with thumbnails and metadata

- **YouTube Music Integration**:
  - Search YouTube music catalog
  - Display song title, artist, duration, thumbnail
  - Direct links to YouTube
  - Integration with YouTube Data API v3

- **Download to Drive**:
  - One-click download from YouTube to Google Drive
  - High-quality audio extraction (up to 320kbps MP3)
  - Automatic file naming and organization
  - Direct upload to user's Drive
  - Downloaded files searchable immediately

- **Download Queue Manager**:
  - Queue-based download system
  - Real-time progress tracking with progress bars
  - Multiple simultaneous downloads
  - Download status indicators (pending, downloading, completed, failed)
  - Error handling with retry capability
  - Toast notifications for download events
  - Collapsible queue UI (bottom-right)
  - Clear completed downloads

#### M3U8/HLS Streaming
- **M3U8Player Component**:
  - Full HLS streaming support using HLS.js
  - Adaptive bitrate streaming
  - Native HLS support for Safari
  - Custom video controls
  - Quality selection
  - Buffer management
  - Error recovery and retry logic

- **M3U8 Playlist Manager**:
  - Save M3U8 stream URLs
  - Per-user playlist storage in Firestore
  - Add/edit/delete playlists
  - Quick play from saved URLs
  - Support for IPTV and live streams
  - External link access

#### Enhanced Playlist Management
- **Firestore Integration**:
  - Per-user playlist storage
  - Real-time sync across devices
  - Offline support
  - Create playlists from current queue
  - Edit playlist names and descriptions
  - Delete playlists with confirmation
  - Load playlists into player

- **Playlist Organization**:
  - Separate collections for music and M3U8
  - User isolation with security rules
  - Track count display
  - Creation and update timestamps
  - Rich metadata support

### Components Added
- `GlobalSearch.tsx` - Unified search modal
- `DownloadQueue.tsx` - Download manager UI
- `M3U8Player.tsx` - HLS video player
- `M3U8PlaylistViewer.tsx` - M3U8 playlist manager
- `PlaylistManager.tsx` - Enhanced playlist management
- `Progress.tsx` - Radix UI progress component
- `Tabs.tsx` - Radix UI tabs component

### API Routes Added
- `/api/search/music` - Search YouTube Music
- `/api/download/youtube` - Download and upload to Drive

### Pages Added
- `/playlists` - Unified playlist management page with tabs

### Updated Components
- **Navbar**: Added GlobalSearch integration
- **Package.json**: Added HLS.js and Radix UI dependencies

### Configuration
- Added YouTube API key to environment variables
- Updated Firestore security rules for playlists
- Added M3U8 playlist collection

### Documentation
- **SEARCH_DOWNLOAD.md**: Complete guide for search and download features
- **Updated FEATURES.md**: Added 20+ new features (170+ total)
- **Updated README.md**: Highlighted search and download capabilities
- **Updated .env.example**: Added YouTube API configuration

### Technical Improvements
- HLS.js integration for adaptive streaming
- Queue-based download architecture
- Firestore real-time sync
- Enhanced error handling
- Better loading states
- Toast notification system

---

## [0.2.0] - 2026-02-09

### Added

#### Audio Features
- **Audio Visualizations**: 3 types (Bars, Waveform, Circular)
- **10-Band Equalizer**: 8 presets and custom settings
- **Sleep Timer**: Auto-pause with presets
- **Playlist Manager**: Create and save playlists
- **Speed Control**: 0.5x to 2x playback
- **Gapless Playback**: Smooth transitions

#### Video Features
- **VideoPlayer Component**: Full-featured player
- **Auto-Play Next**: Next episode overlay
- **Custom Controls**: Auto-hiding UI
- **Picture-in-Picture**: Multitasking support

#### Other Features
- **ImageGallery**: Lightbox and slideshow
- **FileBrowser**: Complete Drive navigation
- **Keyboard Shortcuts**: 10+ shortcuts
- **MiniPlayer**: Persistent bottom bar
- **QueueSidebar**: Queue management

---

## [0.1.0] - 2026-02-09

### Initial Release
- Firebase Authentication
- Google Drive integration
- Basic media playback
- File browser
- State management with Zustand

---

**For detailed feature descriptions, see [FEATURES.md](FEATURES.md)**
