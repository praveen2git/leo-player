'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { PlaylistManager } from '@/components/playlist/PlaylistManager';
import { M3U8PlaylistViewer } from '@/components/player/M3U8PlaylistViewer';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { QueueSidebar } from '@/components/player/QueueSidebar';
import { useState } from 'react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, Radio } from 'lucide-react';

function PlaylistsPageContent() {
  const [showQueue, setShowQueue] = useState(false);
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Playlists</h1>
          <p className="text-gray-600">
            Manage your music playlists and M3U8 streams
          </p>
        </div>

        <Tabs defaultValue="music" className="space-y-6">
          <TabsList>
            <TabsTrigger value="music" className="flex items-center space-x-2">
              <Music className="h-4 w-4" />
              <span>Music Playlists</span>
            </TabsTrigger>
            <TabsTrigger value="m3u8" className="flex items-center space-x-2">
              <Radio className="h-4 w-4" />
              <span>M3U8 Streams</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="music">
            <PlaylistManager />
          </TabsContent>

          <TabsContent value="m3u8">
            <M3U8PlaylistViewer />
          </TabsContent>
        </Tabs>
      </main>

      <MiniPlayer onOpenQueue={() => setShowQueue(true)} />
      <QueueSidebar isOpen={showQueue} onClose={() => setShowQueue(false)} />
    </div>
  );
}

export default function PlaylistsPage() {
  return (
    <AuthGuard>
      <PlaylistsPageContent />
    </AuthGuard>
  );
}
