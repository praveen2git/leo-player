'use client';

import { useEffect, useRef, useState } from 'react';
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
  Maximize,
  Minimize,
  Settings,
} from 'lucide-react';
import { formatDuration } from '@/lib/drive';

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    currentFile,
    queue,
    currentIndex,
    isPlaying,
    volume,
    isMuted,
    isFullscreen,
    currentTime,
    duration,
    playbackSpeed,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    toggleMute,
    toggleFullscreen,
    setCurrentTime,
    setDuration,
    setPlaybackSpeed,
  } = usePlayerStore();

  // Video element control
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(console.error);
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // Volume control
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Load new video
  useEffect(() => {
    if (videoRef.current && currentFile) {
      videoRef.current.src = currentFile.streamUrl;
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(console.error);
      }
    }
  }, [currentFile]);

  // Show "Next Episode" overlay 30 seconds before end
  useEffect(() => {
    if (duration - currentTime <= 30 && duration - currentTime > 0 && currentIndex < queue.length - 1) {
      setShowNextOverlay(true);
    } else {
      setShowNextOverlay(false);
    }
  }, [currentTime, duration, currentIndex, queue.length]);

  // Fullscreen handling
  useEffect(() => {
    if (!containerRef.current) return;

    if (isFullscreen) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
      }
    }
  }, [isFullscreen]);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  if (!currentFile) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 text-white">
        <p>No video file selected</p>
      </div>
    );
  }

  const nextFile = queue[currentIndex + 1];

  return (
    <div
      ref={containerRef}
      className="relative bg-black group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onClick={togglePlay}
      />

      {/* Next Episode Overlay */}
      {showNextOverlay && nextFile && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg max-w-xs">
          <p className="text-white text-sm mb-2">Up Next</p>
          <p className="text-white font-semibold mb-3">{nextFile.name}</p>
          <div className="flex space-x-2">
            <Button size="sm" onClick={playNext}>
              Play Now
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowNextOverlay(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-white mt-2">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={playPrevious}>
              <SkipBack className="h-5 w-5 text-white" />
            </Button>

            <Button variant="ghost" size="icon" onClick={togglePlay}>
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white" />
              )}
            </Button>

            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward className="h-5 w-5 text-white" />
            </Button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-white" />
                ) : (
                  <Volume2 className="h-5 w-5 text-white" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={(v) => setVolume(v[0])}
                className="w-24"
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            {/* Speed */}
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-white/20 text-white px-2 py-1 rounded text-sm"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-white" />
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize className="h-5 w-5 text-white" />
              ) : (
                <Maximize className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
