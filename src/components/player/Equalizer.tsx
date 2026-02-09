'use client';

import { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface EqualizerProps {
  audioElement: HTMLAudioElement | null;
}

const PRESETS = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  rock: [8, 5, -4, -6, -3, 3, 6, 8, 9, 9],
  pop: [-2, 3, 5, 6, 4, 0, -2, -2, -2, -2],
  jazz: [4, 3, 2, 2, -2, -2, 0, 2, 3, 4],
  classical: [5, 4, 3, 2, -2, -2, 0, 2, 3, 4],
  bass: [8, 7, 6, 4, 2, -2, -4, -5, -6, -6],
  treble: [-6, -6, -5, -4, -2, 2, 4, 6, 7, 8],
  vocal: [-2, -3, -2, 2, 4, 4, 3, 2, 0, -2],
};

const FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export function Equalizer({ audioElement }: EqualizerProps) {
  const [bands, setBands] = useState(PRESETS.flat);
  const [currentPreset, setCurrentPreset] = useState<keyof typeof PRESETS>('flat');
  const audioContextRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);

  // Setup audio context and filters
  useEffect(() => {
    if (!audioElement) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(audioElement);

    // Create filters for each frequency band
    const filters = FREQUENCIES.map((frequency, index) => {
      const filter = audioContext.createBiquadFilter();
      filter.type = index === 0 ? 'lowshelf' : index === FREQUENCIES.length - 1 ? 'highshelf' : 'peaking';
      filter.frequency.value = frequency;
      filter.Q.value = 1;
      filter.gain.value = bands[index];
      return filter;
    });

    // Connect filters in series
    source.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(audioContext.destination);

    audioContextRef.current = audioContext;
    filtersRef.current = filters;

    return () => {
      audioContext.close();
    };
  }, [audioElement]);

  // Update filter gains when bands change
  useEffect(() => {
    filtersRef.current.forEach((filter, index) => {
      if (filter) {
        filter.gain.value = bands[index];
      }
    });
  }, [bands]);

  const handleBandChange = (index: number, value: number[]) => {
    const newBands = [...bands];
    newBands[index] = value[0];
    setBands(newBands);
    setCurrentPreset('flat'); // Custom preset
  };

  const applyPreset = (preset: keyof typeof PRESETS) => {
    setBands(PRESETS[preset]);
    setCurrentPreset(preset);
  };

  const resetAll = () => {
    setBands(PRESETS.flat);
    setCurrentPreset('flat');
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Equalizer</h3>
        <Button variant="outline" size="sm" onClick={resetAll}>
          Reset
        </Button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(PRESETS).map((preset) => (
          <Button
            key={preset}
            variant={currentPreset === preset ? 'default' : 'outline'}
            size="sm"
            onClick={() => applyPreset(preset as keyof typeof PRESETS)}
            className="capitalize"
          >
            {preset}
          </Button>
        ))}
      </div>

      {/* Frequency Bands */}
      <div className="flex space-x-4 justify-between">
        {FREQUENCIES.map((frequency, index) => (
          <div key={frequency} className="flex flex-col items-center space-y-2 flex-1">
            {/* Slider */}
            <Slider
              value={[bands[index]]}
              min={-12}
              max={12}
              step={0.5}
              onValueChange={(value) => handleBandChange(index, value)}
              orientation="vertical"
              className="h-32"
            />

            {/* Value */}
            <span className="text-xs font-medium">
              {bands[index] > 0 ? '+' : ''}{bands[index].toFixed(1)}
            </span>

            {/* Frequency */}
            <span className="text-xs text-gray-500">
              {frequency >= 1000 ? `${frequency / 1000}k` : frequency}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
