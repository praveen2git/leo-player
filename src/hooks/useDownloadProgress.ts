import { useState, useEffect } from 'react';

/**
 * Hook to track download/buffer progress for media files
 */
export function useDownloadProgress(mediaElement: HTMLMediaElement | null) {
  const [buffered, setBuffered] = useState(0);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (!mediaElement) return;

    const updateProgress = () => {
      if (mediaElement.buffered.length > 0) {
        const bufferedEnd = mediaElement.buffered.end(mediaElement.buffered.length - 1);
        const duration = mediaElement.duration;
        const bufferedPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0;
        setBuffered(bufferedPercent);
      }
    };

    const handleProgress = () => {
      updateProgress();
    };

    const handleLoadProgress = (e: ProgressEvent) => {
      if (e.lengthComputable) {
        const loadedPercent = (e.loaded / e.total) * 100;
        setLoaded(loadedPercent);
      }
    };

    mediaElement.addEventListener('progress', handleProgress);
    mediaElement.addEventListener('loadeddata', updateProgress);

    return () => {
      mediaElement.removeEventListener('progress', handleProgress);
      mediaElement.removeEventListener('loadeddata', updateProgress);
    };
  }, [mediaElement]);

  return { buffered, loaded };
}
