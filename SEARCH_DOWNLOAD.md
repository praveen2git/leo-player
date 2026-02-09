# Global Search & Download Features

## Overview

Leo Player now includes advanced search capabilities that allow you to:
1. **Search your Google Drive** for existing media files
2. **Search online sources** (YouTube Music, etc.) for new music
3. **Download high-quality audio** from YouTube and save to your Drive
4. **Stream M3U8/HLS playlists** for live content

## Features

### 🔍 Global Search

**Keyboard Shortcut**: `Ctrl+K` (or `⌘K` on Mac)

The global search modal provides two search modes:

#### 1. Drive Search
- Real-time search across all your Drive files
- Searches file names and metadata
- Instant playback of results
- Shows file type icons and sizes

#### 2. Online Search
- Search YouTube Music catalog
- View song title, artist, duration, and thumbnail
- Download button to save to your Drive
- High-quality audio extraction (up to 320kbps)

### 📥 Download Manager

**Features**:
- **Queue-based downloads**: Multiple simultaneous downloads
- **Progress tracking**: Real-time download progress
- **Auto-save to Drive**: Files automatically saved to your Google Drive
- **Download history**: Track completed and failed downloads
- **Error handling**: Automatic retry on network errors

**Usage**:
1. Search for a song in the "Online" tab
2. Click the download button
3. Monitor progress in the download queue (bottom-right)
4. Once complete, find the file in your Drive search

### 📺 M3U8 Streaming

**Supports**:
- HLS (HTTP Live Streaming)
- IPTV playlists
- Live streams
- VOD (Video on Demand)

**Features**:
- **Adaptive bitrate**: Automatic quality adjustment
- **Buffer management**: Optimized for smooth playback
- **Quality selection**: Choose preferred quality level
- **Playlist management**: Save and organize M3U8 URLs

**Usage**:
1. Go to Playlists → M3U8 Streams tab
2. Click "Add M3U8"
3. Enter playlist name and M3U8 URL
4. Click "Play" to start streaming

## Setup

### 1. YouTube Data API

**Required for online search**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create API credentials (API Key)
4. Add to `.env`:

```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

**API Quotas**:
- Default: 10,000 units/day
- Each search costs 100 units
- ~100 searches per day with default quota

### 2. Download Service (Optional)

For production deployments, you may want to use a dedicated download service:

#### Option A: Self-Hosted

Create a separate backend service using:
- **ytdl-core** (Node.js)
- **youtube-dl** or **yt-dlp** (Python)
- **FFmpeg** for audio conversion

```bash
# Example with ytdl-core
npm install ytdl-core
```

#### Option B: Third-Party Service

Use services like:
- **RapidAPI** YouTube download APIs
- **Y2Mate API**
- **SaveFrom.net API**

Add credentials to `.env`:

```env
DOWNLOAD_SERVICE_URL=https://api.example.com
DOWNLOAD_SERVICE_API_KEY=your_api_key
```

### 3. Firestore Setup

M3U8 playlists are stored per-user in Firestore.

**Collections**:
- `playlists` - Music playlists from queue
- `m3u8_playlists` - Saved M3U8 stream URLs

**Security Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Playlists
    match /playlists/{playlistId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // M3U8 Playlists
    match /m3u8_playlists/{playlistId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## API Endpoints

### Search Music

```
GET /api/search/music?q=query
```

**Response**:
```json
{
  "results": [
    {
      "id": "video_id",
      "title": "Song Title",
      "artist": "Artist Name",
      "duration": "3:45",
      "thumbnail": "https://...",
      "source": "youtube",
      "url": "https://youtube.com/watch?v=..."
    }
  ]
}
```

### Download from YouTube

```
POST /api/download/youtube
Authorization: Bearer {drive_token}

{
  "videoId": "video_id",
  "title": "Song Title",
  "artist": "Artist Name"
}
```

**Response**:
```json
{
  "success": true,
  "fileId": "drive_file_id",
  "fileName": "Song_Title_-_Artist_Name.mp3"
}
```

### Search Drive

```
GET /api/drive/search?q=query&mimeType=audio/mpeg
Authorization: Bearer {drive_token}
```

## Architecture

### Download Flow

```
User searches → YouTube API → Results displayed
                                     ↓
User clicks download → Backend extracts audio → Converts to MP3
                                     ↓
                    Upload to Google Drive → Return file ID
                                     ↓
                          Refresh Drive search results
```

### M3U8 Streaming Flow

```
User adds M3U8 URL → Save to Firestore
                           ↓
          User clicks play → HLS.js loads manifest
                           ↓
                  Adaptive streaming begins
```

## Best Practices

### 1. API Rate Limits

**YouTube Data API**:
- Cache search results
- Debounce search queries (500ms)
- Implement request throttling

**Google Drive API**:
- Batch file operations
- Use resumable uploads for large files
- Implement exponential backoff

### 2. Download Quality

**Recommended settings**:
- Audio format: MP3 or AAC
- Bitrate: 256kbps or 320kbps
- Sample rate: 44.1kHz or 48kHz
- Channels: Stereo (2)

### 3. M3U8 Optimization

**HLS.js configuration**:
```javascript
const hls = new Hls({
  enableWorker: true,
  lowLatencyMode: true,
  backBufferLength: 90,
  maxBufferLength: 30,
  maxMaxBufferLength: 600,
});
```

### 4. Storage Management

**Drive organization**:
- Create a dedicated "Leo Player Downloads" folder
- Use metadata tags for downloaded files
- Implement duplicate detection
- Regular cleanup of old downloads

## Troubleshooting

### YouTube API Quota Exceeded

**Solution**:
1. Request quota increase from Google
2. Implement caching layer
3. Use multiple API keys with rotation
4. Switch to alternative search sources

### Download Failures

**Common issues**:
- Video unavailable or region-locked
- Age-restricted content
- Premium/paid content
- Copyright-protected music

**Solutions**:
- Show clear error messages
- Implement retry logic
- Provide alternative sources
- Check video availability before download

### M3U8 Playback Issues

**Common issues**:
- CORS errors
- Invalid manifest format
- Expired stream URLs
- Network connectivity

**Solutions**:
- Use proxy for CORS issues
- Validate M3U8 URLs before saving
- Implement auto-reconnect
- Show network status indicator

## Legal Considerations

⚠️ **Important**: Always respect copyright laws and terms of service.

### YouTube Terms of Service

- Personal use only
- No redistribution
- Respect content creator rights
- Follow YouTube's API Terms of Service

### Recommendations

1. **Add disclaimers** in your app
2. **Implement user agreement** acceptance
3. **Respect robots.txt** and rate limits
4. **Don't circumvent** paywalls or DRM
5. **Consider licensing** for commercial use

## Future Enhancements

### Planned Features

- [ ] **Spotify integration** for richer metadata
- [ ] **SoundCloud search** and download
- [ ] **Automatic metadata tagging** (ID3 tags)
- [ ] **Album art embedding**
- [ ] **Lyrics download** from Genius/Musixmatch
- [ ] **Quality presets** in settings
- [ ] **Batch downloads**
- [ ] **Download scheduler**
- [ ] **Bandwidth limiting**
- [ ] **Storage analytics**

### Advanced Features

- [ ] **Audio fingerprinting** for duplicate detection
- [ ] **Smart recommendations** based on downloads
- [ ] **Collaborative playlists**
- [ ] **Social sharing**
- [ ] **Cross-device sync**
- [ ] **Offline mode** (PWA)
- [ ] **Background downloads** (Service Worker)

## Support

For issues related to search and download:

1. Check API quotas and credentials
2. Verify network connectivity
3. Review browser console for errors
4. Check Firestore security rules
5. Test with different search queries

---

**Built with ❤️ for music lovers**
