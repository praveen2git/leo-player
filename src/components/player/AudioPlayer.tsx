'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Shuffle,
  List,
} from 'lucide-react';
import { formatDuration } from '@/lib/drive';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioPlayerProps {
  showVisualizer?: boolean;
}

export function AudioPlayer({ showVisualizer = true }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showQueue, setShowQueue] = useState(false);

  const {
    currentFile,
    isPlaying,
    volume,
    isMuted,
    repeat,
    shuffle,
    currentTime,
    duration,
    playbackSpeed,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    setCurrentTime,
    setDuration,
    setPlaybackSpeed,
  } = usePlayerStore();

  // Audio element control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Playback speed control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Load new file
  useEffect(() => {
    if (audioRef.current && currentFile) {
      audioRef.current.src = currentFile.streamUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentFile]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <p>No audio file selected</p>
      </div>
    );
  }

  const RepeatIcon = repeat === 'one' ? Repeat1 : Repeat;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Album Art / Visualizer */}
      <div className="mb-8">
        {showVisualizer ? (
          <AudioVisualizer audioElement={audioRef.current} />
        ) : (
          <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🎵</div>
              <p className="text-xl font-semibold">{currentFile.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">{currentFile.name}</h2>
        <p className="text-gray-600">Playing from Drive</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleShuffle}
          className={shuffle ? 'text-purple-600' : ''}
        >
          <Shuffle className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={playPrevious}>
          <SkipBack className="h-6 w-6" />
        </Button>

        <Button size="icon" className="h-14 w-14" onClick={togglePlay}>
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-1" />
          )}
        </Button>

        <Button variant="ghost" size="icon" onClick={playNext}>
          <SkipForward className="h-6 w-6" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={cycleRepeat}
          className={repeat !== 'none' ? 'text-purple-600' : ''}
        >
          <RepeatIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Secondary Controls */}
      <div className="flex items-center justify-between">
        {/* Volume */}
        <div className="flex items-center space-x-2 w-40">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>

        {/* Speed Control */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPlaybackSpeed(Math.max(0.5, playbackSpeed - 0.25))}
          >
            -
          </Button>
          <span className="text-sm font-medium w-12 text-center">
            {playbackSpeed}x
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPlaybackSpeed(Math.min(2, playbackSpeed + 0.25))}
          >
            +
          </Button>
        </div>

        {/* Queue Toggle */}
        <Button variant="ghost" size="icon" onClick={() => setShowQueue(!showQueue)}>
          <List className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
