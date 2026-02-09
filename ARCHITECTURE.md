# Leo Player - Technical Architecture

## System Overview

```
┌────────────────────────────────────────┐
│          USER (Browser)                    │
└──────────────┬─────────────────────────┘
               │
               │ HTTPS
               │
┌──────────────┴─────────────────────────┐
│     Next.js Application (Vercel)          │
│                                           │
│  ┌─────────────────────────────────┐  │
│  │  React Components (Client)       │  │
│  │  - Auth UI                        │  │
│  │  - Drive Browser                 │  │
│  │  - Media Player                  │  │
│  │  - Mini Player                   │  │
│  └─────────────────────────────────┘  │
│                                           │
│  ┌─────────────────────────────────┐  │
│  │  Zustand State Management        │  │
│  │  - authStore                     │  │
│  │  - driveStore                    │  │
│  │  - playerStore                   │  │
│  └─────────────────────────────────┘  │
│                                           │
│  ┌─────────────────────────────────┐  │
│  │  API Routes (Server)             │  │
│  │  - /api/auth/*                   │  │
│  │  - /api/drive/*                  │  │
│  │  - /api/user/*                   │  │
│  └─────────────────────────────────┘  │
└────────────────────────────────────────┘
               │
       ┌───────┼────────┐
       │       │        │
   ┌───┴───┐  ┌─┴────┐  ┌─┴─────────────┐
   │Firebase│  │Google│  │ Google Drive │
   │  Auth  │  │Cloud │  │     API      │
   │         │  │      │  │              │
   │Firestore│  │OAuth │  │ - Files      │
   │         │  │      │  │ - Metadata   │
   └─────────┘  └──────┘  │ - Streaming  │
                          └──────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Layout (Global)
│   ├── Toaster
│   └── MiniPlayer (Persistent)
│
├── Pages
│   ├── Home (/)
│   │   └── Hero, Features, CTA
│   │
│   ├── Auth (/auth/login)
│   │   ├── EmailLoginForm
│   │   └── GoogleLoginButton
│   │
│   ├── Drive Browser (/drive)
│   │   ├── AuthGuard
│   │   ├── Navbar
│   │   ├── Breadcrumb
│   │   ├── SearchBar
│   │   ├── FilterTabs
│   │   ├── FileGrid
│   │   │   ├── FolderCard
│   │   │   │   ├── PlayAllButton
│   │   │   │   └── ShuffleButton
│   │   │   │
│   │   │   └── MediaCard
│   │   │       ├── Thumbnail
│   │   │       ├── Metadata
│   │   │       └── ContextMenu
│   │   │
│   │   └── InfiniteScroll
│   │
│   └── Player (/player)
│       ├── AudioPlayer
│       │   ├── WaveformVisualizer
│       │   ├── ProgressBar
│       │   ├── Controls
│       │   ├── VolumeControl
│       │   └── QueueSidebar
│       │
│       ├── VideoPlayer
│       │   ├── VideoElement
│       │   ├── CustomControls
│       │   ├── NextEpisodeOverlay
│       │   └── SubtitleTrack
│       │
│       └── ImageGallery
│           ├── ThumbnailGrid
│           ├── Lightbox
│           └── SlideshowControls
│
└── Shared Components
    ├── ui/ (shadcn/ui)
    ├── Navbar
    ├── MiniPlayer
    └── AuthGuard
```

### State Management (Zustand)

#### authStore
```typescript
{
  user: User | null,
  driveConnections: DriveConnection[],
  activeDriveEmail: string | null,
  
  // Actions
  setUser(), addDriveConnection(),
  removeDriveConnection(), setActiveDrive(),
  getActiveDriveToken(), logout()
}
```

#### driveStore
```typescript
{
  currentFolderId: string,
  breadcrumb: DriveFolder[],
  files: DriveFile[],
  loading: boolean,
  searchQuery: string,
  filterType: 'all' | 'audio' | 'video' | 'image',
  nextPageToken: string | null,
  
  // Actions
  setCurrentFolder(), setBreadcrumb(),
  setFiles(), appendFiles(), setLoading(),
  setSearchQuery(), setFilterType()
}
```

#### playerStore
```typescript
{
  currentFile: MediaFile | null,
  queue: MediaFile[],
  currentIndex: number,
  isPlaying: boolean,
  volume: number,
  shuffle: boolean,
  repeat: 'none' | 'one' | 'all',
  
  // Actions
  playFolder(), playNext(), playPrevious(),
  togglePlay(), setVolume(), toggleShuffle(),
  cycleRepeat(), addToQueue()
}
```

## Backend Architecture

### API Routes

#### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login with email/password
GET    /api/auth/callback      - OAuth callback
POST   /api/auth/refresh       - Refresh access token
POST   /api/auth/logout        - Logout user
```

#### Drive API
```
GET    /api/drive/connect      - Initiate Drive OAuth
GET    /api/drive/files        - List files in folder
       ?folderId=xyz&pageToken=abc
       
GET    /api/drive/file/:id    - Get file metadata
GET    /api/drive/stream/:id   - Stream media file
GET    /api/drive/search       - Search Drive files
       ?q=query&type=audio
       
GET    /api/drive/breadcrumb   - Get folder breadcrumb
       ?folderId=xyz
```

#### User Preferences
```
GET    /api/user/preferences   - Get user preferences
PUT    /api/user/preferences   - Update preferences
POST   /api/user/history       - Save playback history
GET    /api/user/playlists     - Get user playlists
POST   /api/user/playlists     - Create playlist
```

## Data Flow

### Authentication Flow
```
1. User clicks "Login with Google"
2. Redirect to Google OAuth consent
3. User grants permissions (Drive + Auth)
4. Google redirects to /api/auth/callback
5. Exchange code for access token
6. Create Firebase user session
7. Store Drive token in Firestore
8. Redirect to /drive
```

### Media Playback Flow
```
1. User navigates to folder
2. Load files via /api/drive/files
3. Filter media files (audio/video/image)
4. User clicks "Play All"
5. Create queue in playerStore
6. Load first file metadata
7. Stream via /api/drive/stream/:id
8. Play media in <audio>/<video> element
9. Auto-advance to next file
10. Update playback history
```

### Folder Queue Flow
```
┌───────────────────────────────────────┐
│ Folder: "My Music" (50 files)         │
└───────────────────────────────────────┘
                  │
                  │ Click "Play All"
                  │
                  └─────────────────────┐
                                │
┌─────────────────────────────┴─────────────────────────────┐
│ 1. Filter media files only (audio/video)             │
│ 2. Shuffle if enabled                                │
│ 3. Create queue: [file1, file2, ..., file50]        │
│ 4. Set currentIndex = 0                              │
│ 5. Load file1 metadata                               │
│ 6. Start streaming file1                             │
│ 7. Preload file2 in background                       │
│ 8. Show mini player                                  │
└──────────────────────────────────────────────────────┘
                  │
                  │ On file1 ended
                  │
                  └─────────────────────┐
                                │
┌─────────────────────────────┴─────────────────────────────┐
│ 1. Check repeat mode                                 │
│ 2. Increment currentIndex                            │
│ 3. Play file2 (already preloaded)                    │
│ 4. Preload file3                                     │
│ 5. Update playback history                           │
│ 6. Continue until end of queue                       │
└──────────────────────────────────────────────────────┘
```

## Database Schema (Firestore)

```
users/
  {uid}/
    email: string
    displayName: string
    photoURL: string
    createdAt: timestamp
    lastLogin: timestamp
    
    drives/
      {driveEmail}/
        accessToken: string (encrypted)
        refreshToken: string (encrypted)
        expiresAt: timestamp
        
    preferences/
      autoplay: boolean
      crossfade: number
      equalizerPreset: string
      playbackSpeed: number
      volume: number
      
    playlists/
      {playlistId}/
        name: string
        description: string
        files: array<MediaFile>
        createdAt: timestamp
        updatedAt: timestamp
        
    history/
      {historyId}/
        fileId: string
        fileName: string
        position: number
        duration: number
        timestamp: timestamp
```

## Performance Optimizations

### Client-Side
1. **Code Splitting**: Route-based code splitting via Next.js
2. **Lazy Loading**: Components loaded on demand
3. **Image Optimization**: Next.js Image component
4. **Virtual Scrolling**: For large file lists
5. **Debounced Search**: 300ms delay on search input
6. **Memoization**: React.memo for expensive components

### Server-Side
1. **API Caching**: Cache Drive API responses (5 min TTL)
2. **Edge Functions**: Deploy API routes to edge
3. **Streaming**: Progressive media loading
4. **Compression**: Gzip/Brotli for API responses
5. **Rate Limiting**: Prevent API abuse

### Media Streaming
1. **Progressive Loading**: Stream media as it plays
2. **Preloading**: Load next 2 files in queue
3. **Buffer Management**: Adaptive bitrate
4. **CDN Caching**: Cache popular files

## Security Measures

1. **Authentication**: Firebase Auth with session management
2. **Authorization**: Firestore security rules
3. **Token Management**: Encrypted storage, auto-refresh
4. **CORS**: Strict origin whitelisting
5. **Input Validation**: Sanitize all user inputs
6. **Rate Limiting**: API call throttling
7. **HTTPS Only**: Enforce secure connections
8. **CSP Headers**: Content Security Policy

## Scalability Considerations

### Current Limits
- Firebase: 50K reads/day (free tier)
- Drive API: 1000 requests/user/day
- Vercel: 100GB bandwidth/month (hobby)

### Scaling Strategy
1. **Caching Layer**: Redis for Drive metadata
2. **CDN**: Cloudflare for media proxy
3. **Database**: Upgrade Firestore plan
4. **API Gateway**: Implement rate limiting
5. **Load Balancing**: Multiple regions

---

**This architecture supports 10K+ concurrent users with proper caching and CDN setup.**
