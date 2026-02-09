import { useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();
  const {
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleFullscreen,
    volume,
    isPlaying,
  } = usePlayerStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;

        case 'ArrowLeft':
          e.preventDefault();
          playPrevious();
          break;

        case 'ArrowRight':
          e.preventDefault();
          playNext();
          break;

        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;

        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;

        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;

        case 's':
        case 'S':
          e.preventDefault();
          toggleShuffle();
          break;

        case 'r':
        case 'R':
          e.preventDefault();
          cycleRepeat();
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;

        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;

        case '?':
          e.preventDefault();
          // Show keyboard shortcuts help
          showShortcutsHelp();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume, isPlaying]);

  const showShortcutsHelp = () => {
    // This can be a modal showing all shortcuts
    alert(`Keyboard Shortcuts:

Space/K - Play/Pause
←/→ - Previous/Next
↑/↓ - Volume Up/Down
M - Mute/Unmute
S - Shuffle
R - Repeat
F - Fullscreen
Esc - Exit Fullscreen
? - Show this help`);
  };
}
