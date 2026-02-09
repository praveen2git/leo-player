'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/store/playerStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  List,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { isAudioFile, isVideoFile, isImageFile } from '@/lib/drive';

interface MiniPlayerProps {
  onOpenQueue?: () => void;
}

export function MiniPlayer({ onOpenQueue }: MiniPlayerProps) {
  const router = useRouter();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const {
    currentFile,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    toggleMute,
    setCurrentTime,
    clearQueue,
  } = usePlayerStore();

  if (!currentFile) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getMediaIcon = () => {
    if (isAudioFile(currentFile.mimeType)) return '🎵';
    if (isVideoFile(currentFile.mimeType)) return '🎥';
    if (isImageFile(currentFile.mimeType)) return '🖼️';
    return '📁';
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime((value[0] / 100) * duration);
  };

  const openFullPlayer = () => {
    if (isAudioFile(currentFile.mimeType)) {
      router.push('/player/audio');
    } else if (isVideoFile(currentFile.mimeType)) {
      router.push('/player/video');
    } else if (isImageFile(currentFile.mimeType)) {
      router.push('/player/gallery');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-purple-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-2xl flex-shrink-0">
              {getMediaIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{currentFile.name}</p>
              <p className="text-sm text-gray-500 truncate">Playing from Drive</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={playPrevious}>
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button size="icon" onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>

            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Slider */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="flex-1"
            />
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center space-x-2">
            {/* Volume */}
            <div
              className="relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg p-2">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.01}
                    onValueChange={(v) => setVolume(v[0])}
                    orientation="vertical"
                    className="h-24"
                  />
                </div>
              )}
            </div>

            {/* Queue */}
            {onOpenQueue && (
              <Button variant="ghost" size="icon" onClick={onOpenQueue}>
                <List className="h-4 w-4" />
              </Button>
            )}

            {/* Expand */}
            <Button variant="ghost" size="icon" onClick={openFullPlayer}>
              <Maximize2 className="h-4 w-4" />
            </Button>

            {/* Close */}
            <Button variant="ghost" size="icon" onClick={clearQueue}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
