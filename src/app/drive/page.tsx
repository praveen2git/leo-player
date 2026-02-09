'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { FileBrowser } from '@/components/drive/FileBrowser';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { QueueSidebar } from '@/components/player/QueueSidebar';
import { useState } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useMediaSession } from '@/hooks/useMediaSession';

function DrivePageContent() {
  const [showQueue, setShowQueue] = useState(false);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();
  useMediaSession();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">My Drive</h1>
          <p className="text-gray-600">
            Browse and play your media files from Google Drive
          </p>
        </div>
        <FileBrowser />
      </main>

      <MiniPlayer onOpenQueue={() => setShowQueue(true)} />
      <QueueSidebar isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </div>
  );
}

export default function DrivePage() {
  return (
    <AuthGuard>
      <DrivePageContent />
    </AuthGuard>
  );
}
