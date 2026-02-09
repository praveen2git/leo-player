import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MediaFile, RepeatMode } from '@/types';
import { shuffleArray } from '@/lib/utils';

interface PlayerState {
  currentFile: MediaFile | null;
  queue: MediaFile[];
  originalQueue: MediaFile[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  playbackSpeed: number;
  currentTime: number;
  duration: number;
  isFullscreen: boolean;

  // Actions
  setCurrentFile: (file: MediaFile | null) => void;
  setQueue: (files: MediaFile[]) => void;
  addToQueue: (files: MediaFile[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playFolder: (files: MediaFile[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  playAtIndex: (index: number) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  toggleFullscreen: () => void;
  reset: () => void;
}

const initialState = {
  currentFile: null,
  queue: [],
  originalQueue: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 0.8,
  isMuted: false,
  shuffle: false,
  repeat: 'none' as RepeatMode,
  playbackSpeed: 1,
  currentTime: 0,
  duration: 0,
  isFullscreen: false,
};

export const usePlayerStore = create<PlayerState>()()
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentFile: (file) => set({ currentFile: file }),

      setQueue: (files) =>
        set({
          queue: files,
          originalQueue: files,
          currentIndex: 0,
        }),

      addToQueue: (files) =>
        set((state) => ({
          queue: [...state.queue, ...files],
          originalQueue: [...state.originalQueue, ...files],
        })),

      removeFromQueue: (index) =>
        set((state) => ({
          queue: state.queue.filter((_, i) => i !== index),
          currentIndex:
            index < state.currentIndex ? state.currentIndex - 1 : state.currentIndex,
        })),

      clearQueue: () =>
        set({
          queue: [],
          originalQueue: [],
          currentIndex: 0,
          currentFile: null,
          isPlaying: false,
        }),

      playFolder: (files) => {
        const state = get();
        const queueToUse = state.shuffle ? shuffleArray(files) : files;
        set({
          queue: queueToUse,
          originalQueue: files,
          currentIndex: 0,
          currentFile: queueToUse[0] || null,
          isPlaying: true,
        });
      },

      playNext: () => {
        const state = get();
        const { queue, currentIndex, repeat } = state;

        if (repeat === 'one') {
          set({ currentTime: 0 });
          return;
        }

        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
          set({
            currentIndex: nextIndex,
            currentFile: queue[nextIndex],
            currentTime: 0,
          });
        } else if (repeat === 'all') {
          set({
            currentIndex: 0,
            currentFile: queue[0],
            currentTime: 0,
          });
        } else {
          set({ isPlaying: false });
        }
      },

      playPrevious: () => {
        const state = get();
        const { queue, currentIndex, currentTime } = state;

        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }

        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
          set({
            currentIndex: prevIndex,
            currentFile: queue[prevIndex],
            currentTime: 0,
          });
        }
      },

      playAtIndex: (index) => {
        const state = get();
        if (index >= 0 && index < state.queue.length) {
          set({
            currentIndex: index,
            currentFile: state.queue[index],
            isPlaying: true,
            currentTime: 0,
          });
        }
      },

      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      toggleShuffle: () => {
        const state = get();
        const newShuffle = !state.shuffle;

        if (newShuffle) {
          const currentFile = state.currentFile;
          const shuffled = shuffleArray(state.originalQueue);
          const newIndex = currentFile
            ? shuffled.findIndex((f) => f.id === currentFile.id)
            : 0;

          set({
            shuffle: true,
            queue: shuffled,
            currentIndex: newIndex >= 0 ? newIndex : 0,
          });
        } else {
          const currentFile = state.currentFile;
          const newIndex = currentFile
            ? state.originalQueue.findIndex((f) => f.id === currentFile.id)
            : 0;

          set({
            shuffle: false,
            queue: state.originalQueue,
            currentIndex: newIndex >= 0 ? newIndex : 0,
          });
        }
      },

      cycleRepeat: () => {
        const state = get();
        const modes: RepeatMode[] = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(state.repeat);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        set({ repeat: nextMode });
      },

      setPlaybackSpeed: (speed) =>
        set({ playbackSpeed: Math.max(0.25, Math.min(2, speed)) }),

      setCurrentTime: (time) => set({ currentTime: time }),

      setDuration: (duration) => set({ duration }),

      toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),

      reset: () => set(initialState),
    }),
    {
      name: 'player-storage',
      partialize: (state) => ({
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
        playbackSpeed: state.playbackSpeed,
      }),
    }
  );
