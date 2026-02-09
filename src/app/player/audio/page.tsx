'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { AudioPlayer } from '@/components/player/AudioPlayer';
import { QueueSidebar } from '@/components/player/QueueSidebar';
import { Equalizer } from '@/components/player/Equalizer';
import { SleepTimer } from '@/components/player/SleepTimer';
import { PlaylistManager } from '@/components/player/PlaylistManager';
import { useState, useRef } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useMediaSession } from '@/hooks/useMediaSession';
import { Button } from '@/components/ui/button';
import { List, Sliders, Clock, Music2 } from 'lucide-react';

function AudioPlayerPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [showQueue, setShowQueue] = useState(false);
  const [activePanel, setActivePanel] = useState<'equalizer' | 'timer' | 'playlists' | null>(null);

  useKeyboardShortcuts();
  useMediaSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Player */}
            <div className="lg:col-span-2">
              <AudioPlayer showVisualizer={true} />
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Panel Selector */}
              <div className="flex space-x-2">
                <Button
                  variant={activePanel === 'equalizer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActivePanel(activePanel === 'equalizer' ? null : 'equalizer')}
                >
                  <Sliders className="h-4 w-4 mr-2" />
                  EQ
                </Button>
                <Button
                  variant={activePanel === 'timer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActivePanel(activePanel === 'timer' ? null : 'timer')}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Timer
                </Button>
                <Button
                  variant={activePanel === 'playlists' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActivePanel(activePanel === 'playlists' ? null : 'playlists')}
                >
                  <Music2 className="h-4 w-4 mr-2" />
                  Lists
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQueue(true)}
                >
                  <List className="h-4 w-4 mr-2" />
                  Queue
                </Button>
              </div>

              {/* Active Panel */}
              {activePanel === 'equalizer' && <Equalizer audioElement={audioRef.current} />}
              {activePanel === 'timer' && <SleepTimer />}
              {activePanel === 'playlists' && <PlaylistManager />}
            </div>
          </div>
        </div>
      </main>

      <QueueSidebar isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </div>
  );
}

export default function AudioPlayerRoute() {
  return (
    <AuthGuard>
      <AudioPlayerPage />
    </AuthGuard>
  );
}
