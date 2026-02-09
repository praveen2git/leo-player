'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { QueueSidebar } from '@/components/player/QueueSidebar';
import { useState } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useMediaSession } from '@/hooks/useMediaSession';

function VideoPlayerPage() {
  const [showQueue, setShowQueue] = useState(false);

  useKeyboardShortcuts();
  useMediaSession();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto">
        <VideoPlayer />
      </div>

      <QueueSidebar isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </div>
  );
}

export default function VideoPlayerRoute() {
  return (
    <AuthGuard>
      <VideoPlayerPage />
    </AuthGuard>
  );
}
