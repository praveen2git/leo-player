'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Music, Video, Image as ImageIcon, FolderOpen } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.push('/drive');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Leo Player
            </span>
          </div>
          <Button onClick={() => router.push('/auth/login')}>Get Started</Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Your Drive,
            <br />
            Your Media Player
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A Spotify/YouTube-like experience for your Google Drive. Play entire music folders,
            binge-watch videos, or slideshow through photos with one click.
          </p>
          <Button size="lg" onClick={() => router.push('/auth/login')} className="px-8 py-6 text-lg">
            Start Playing Now
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Music className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Audio Player</h3>
            <p className="text-gray-600">
              Gapless playback, folder queue, equalizer, and crossfade for your music collection.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Video className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Video Player</h3>
            <p className="text-gray-600">
              Auto-play next episode, resume playback, and picture-in-picture support.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <ImageIcon className="h-12 w-12 text-pink-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Image Gallery</h3>
            <p className="text-gray-600">
              Beautiful lightbox, auto-slideshow, and zoom controls for your photos.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-white p-12 rounded-2xl shadow-lg max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">✨ Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded">
                <span className="text-2xl">🎵</span>
              </div>
              <div>
                <h4 className="font-semibold">Folder-Level Playback</h4>
                <p className="text-sm text-gray-600">One-click to play all media in any folder</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded">
                <span className="text-2xl">🔀</span>
              </div>
              <div>
                <h4 className="font-semibold">Smart Queue</h4>
                <p className="text-sm text-gray-600">Shuffle, repeat, and manage your playback</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-pink-100 p-2 rounded">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h4 className="font-semibold">Persistent Player</h4>
                <p className="text-sm text-gray-600">Music continues as you browse</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded">
                <span className="text-2xl">⌨️</span>
              </div>
              <div>
                <h4 className="font-semibold">Keyboard Shortcuts</h4>
                <p className="text-sm text-gray-600">Power user controls for quick navigation</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-white/80 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>Made with ❤️ by Praveen Kumar | Leo Player v0.1.0</p>
        </div>
      </footer>
    </div>
  );
}
