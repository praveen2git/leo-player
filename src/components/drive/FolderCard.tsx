'use client';

import { useState } from 'react';
import { useDriveStore } from '@/store/driveStore';
import { usePlayerStore } from '@/store/playerStore';
import { DriveFile } from '@/types';
import { Button } from '@/components/ui/button';
import { Folder, Play, Shuffle, MoreVertical } from 'lucide-react';

interface FolderCardProps {
  folder: DriveFile;
}

export function FolderCard({ folder }: FolderCardProps) {
  const { setCurrentFolder } = useDriveStore();
  const { playFolder } = usePlayerStore();
  const [showActions, setShowActions] = useState(false);

  const handleOpen = () => {
    setCurrentFolder(folder.id);
  };

  const handlePlayAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Load all media files from folder and play
    // For now, just open the folder
    setCurrentFolder(folder.id);
  };

  const handleShuffle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Load all media files from folder, shuffle, and play
    setCurrentFolder(folder.id);
  };

  return (
    <div
      className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleOpen}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Folder Icon */}
      <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-3">
        <Folder className="h-12 w-12 text-blue-600" />
      </div>

      {/* Folder Name */}
      <p className="font-medium truncate mb-2">{folder.name}</p>

      {/* Action Buttons */}
      <div
        className={`flex space-x-2 transition-opacity ${
          showActions ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Button
          size="sm"
          className="flex-1"
          onClick={handlePlayAll}
        >
          <Play className="h-3 w-3 mr-1" />
          Play All
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleShuffle}
        >
          <Shuffle className="h-3 w-3" />
        </Button>
      </div>

      {/* More Options */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  );
}
