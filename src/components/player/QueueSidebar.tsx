'use client';

import { usePlayerStore } from '@/store/playerStore';
import { Button } from '@/components/ui/button';
import { X, GripVertical, Trash2 } from 'lucide-react';
import { isAudioFile, isVideoFile, isImageFile, formatFileSize } from '@/lib/drive';

interface QueueSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QueueSidebar({ isOpen, onClose }: QueueSidebarProps) {
  const { queue, currentIndex, playAtIndex, removeFromQueue, clearQueue } = usePlayerStore();

  if (!isOpen) return null;

  const getMediaIcon = (mimeType: string) => {
    if (isAudioFile(mimeType)) return '🎵';
    if (isVideoFile(mimeType)) return '🎥';
    if (isImageFile(mimeType)) return '🖼️';
    return '📁';
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold">Queue</h2>
            <p className="text-sm text-gray-600">{queue.length} tracks</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearQueue}
              disabled={queue.length === 0}
            >
              Clear All
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <List className="h-12 w-12 mb-2" />
              <p>Queue is empty</p>
            </div>
          ) : (
            <div className="p-2">
              {queue.map((file, index) => (
                <div
                  key={`${file.id}-${index}`}
                  className={`group flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer transition-colors ${
                    index === currentIndex
                      ? 'bg-purple-50 border border-purple-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => playAtIndex(index)}
                >
                  {/* Drag Handle */}
                  <div className="opacity-0 group-hover:opacity-100 cursor-grab">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>

                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0">{getMediaIcon(file.mimeType)}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${
                        index === currentIndex ? 'text-purple-600' : ''
                      }`}
                    >
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.size ? formatFileSize(file.size) : 'Unknown size'}
                    </p>
                  </div>

                  {/* Index */}
                  <div className="text-sm text-gray-400 flex-shrink-0">
                    {index === currentIndex ? '▶' : index + 1}
                  </div>

                  {/* Remove */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(index);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
