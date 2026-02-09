import { useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';

/**
 * Media Session API integration for system media controls
 * (lock screen, notification center, keyboard media keys)
 */
export function useMediaSession() {
  const { currentFile, isPlaying, playNext, playPrevious, togglePlay } = usePlayerStore();

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    if (currentFile) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentFile.name,
        artist: 'Google Drive',
        album: 'Leo Player',
        artwork: currentFile.thumbnailLink
          ? [
              {
                src: currentFile.thumbnailLink,
                sizes: '512x512',
                type: 'image/jpeg',
              },
            ]
          : [],
      });

      navigator.mediaSession.setActionHandler('play', togglePlay);
      navigator.mediaSession.setActionHandler('pause', togglePlay);
      navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);

      // Update playback state
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [currentFile, isPlaying, playNext, playPrevious, togglePlay]);
}
