'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { ImageGallery } from '@/components/player/ImageGallery';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function ImageGalleryPage() {
  const router = useRouter();
  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Image Gallery</h1>
              <p className="text-gray-600">Browse and view your images</p>
            </div>
          </div>
        </div>

        <ImageGallery />
      </main>
    </div>
  );
}

export default function ImageGalleryRoute() {
  return (
    <AuthGuard>
      <ImageGalleryPage />
    </AuthGuard>
  );
}
