export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  createdTime?: string;
  modifiedTime?: string;
  thumbnailLink?: string;
  iconLink?: string;
  webContentLink?: string;
}

export interface DriveFolder {
  id: string;
  name: string;
}

export interface MediaFile extends DriveFile {
  streamUrl: string;
  downloadUrl: string;
  duration?: number;
}

export interface PlaybackState {
  currentFile: MediaFile | null;
  queue: MediaFile[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  playbackSpeed: number;
  currentTime: number;
  duration: number;
}

export interface UserPreferences {
  autoplay: boolean;
  crossfade: number;
  equalizerPreset: string;
  playbackSpeed: number;
  volume: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  files: MediaFile[];
  createdAt: string;
  updatedAt: string;
}

export interface PlaybackHistory {
  fileId: string;
  fileName: string;
  position: number;
  timestamp: string;
}

export type MediaType = 'audio' | 'video' | 'image';

export type RepeatMode = 'none' | 'one' | 'all';

export interface DriveConnection {
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
