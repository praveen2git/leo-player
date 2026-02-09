'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { usePlayerStore } from '@/store/playerStore';
import { Clock, X } from 'lucide-react';

export function SleepTimer() {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(30);
  const { togglePlay, isPlaying } = usePlayerStore();

  const presets = [15, 30, 45, 60, 90, 120];

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Timer expired - pause playback
          if (isPlaying) {
            togglePlay();
          }
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, isPlaying, togglePlay]);

  const startTimer = (minutes: number) => {
    setSelectedMinutes(minutes);
    setTimeRemaining(minutes * 60);
    setIsActive(true);
  };

  const cancelTimer = () => {
    setIsActive(false);
    setTimeRemaining(0);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold">Sleep Timer</h3>
      </div>

      {!isActive ? (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Automatically pause playback after a set time
          </p>

          <div className="grid grid-cols-3 gap-2">
            {presets.map((minutes) => (
              <Button
                key={minutes}
                variant="outline"
                onClick={() => startTimer(minutes)}
              >
                {minutes} min
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {formatTime(timeRemaining)}
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Music will pause in {Math.ceil(timeRemaining / 60)} minutes
          </p>
          <div className="flex space-x-2 justify-center">
            <Button variant="outline" onClick={cancelTimer}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => setTimeRemaining((prev) => prev + 5 * 60)}
            >
              +5 min
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
