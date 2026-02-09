'use client';

import { useState, useEffect } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react';
import Image from 'next/image';

export function ImageGallery() {
  const { queue, currentIndex, playAtIndex } = usePlayerStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [slideshow, setSlideshow] = useState(false);
  const [interval, setIntervalTime] = useState(3000);

  // Slideshow
  useEffect(() => {
    if (!slideshow) return;

    const timer = setInterval(() => {
      setLightboxIndex((prev) => (prev + 1) % queue.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slideshow, interval, queue.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setZoom(1);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSlideshow(false);
  };

  const goToPrevious = () => {
    setLightboxIndex((prev) => (prev - 1 + queue.length) % queue.length);
    setZoom(1);
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev + 1) % queue.length);
    setZoom(1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!lightboxOpen) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        goToPrevious();
        break;
      case 'ArrowRight':
        goToNext();
        break;
      case ' ':
        e.preventDefault();
        setSlideshow(!slideshow);
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, slideshow]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {queue.map((file, index) => (
          <div
            key={file.id}
            className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={file.thumbnailLink || file.streamUrl}
              alt={file.name}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
            <div className="text-white">
              <p className="font-semibold">{queue[lightboxIndex]?.name}</p>
              <p className="text-sm text-gray-400">
                {lightboxIndex + 1} / {queue.length}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {/* Slideshow Controls */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSlideshow(!slideshow)}
              >
                {slideshow ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white" />
                )}
              </Button>

              {/* Interval Selector */}
              <select
                value={interval}
                onChange={(e) => setIntervalTime(Number(e.target.value))}
                className="bg-white/20 text-white px-2 py-1 rounded text-sm"
              >
                <option value="2000">2s</option>
                <option value="3000">3s</option>
                <option value="5000">5s</option>
                <option value="10000">10s</option>
              </select>

              {/* Zoom Controls */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
              >
                <ZoomOut className="h-5 w-5 text-white" />
              </Button>
              <span className="text-white text-sm w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              >
                <ZoomIn className="h-5 w-5 text-white" />
              </Button>

              <Button variant="ghost" size="icon" onClick={closeLightbox}>
                <X className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex-1 relative flex items-center justify-center">
            <Image
              src={queue[lightboxIndex]?.streamUrl || ''}
              alt={queue[lightboxIndex]?.name || ''}
              fill
              className="object-contain"
              style={{ transform: `scale(${zoom})` }}
            />

            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={goToNext}
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </Button>
          </div>

          {/* Thumbnail Strip */}
          <div className="p-4 bg-black/80 backdrop-blur-sm overflow-x-auto">
            <div className="flex space-x-2">
              {queue.map((file, index) => (
                <div
                  key={file.id}
                  className={`relative w-20 h-20 rounded cursor-pointer flex-shrink-0 ${
                    index === lightboxIndex ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setLightboxIndex(index)}
                >
                  <Image
                    src={file.thumbnailLink || file.streamUrl}
                    alt={file.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
