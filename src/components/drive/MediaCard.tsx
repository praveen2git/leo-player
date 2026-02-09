'use client';

import { DriveFile } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { isAudioFile, isVideoFile, isImageFile, formatFileSize } from '@/lib/drive';
import { Music, Video, Image as ImageIcon, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaCardProps {
  file: DriveFile;
}

export function MediaCard({ file }: MediaCardProps) {
  const { playFolder } = usePlayerStore();

  const getIcon = () => {
    if (isAudioFile(file.mimeType)) return <Music className="h-8 w-8" />;
    if (isVideoFile(file.mimeType)) return <Video className="h-8 w-8" />;
    if (isImageFile(file.mimeType)) return <ImageIcon className="h-8 w-8" />;
    return null;
  };

  const getGradient = () => {
    if (isAudioFile(file.mimeType)) return 'from-purple-100 to-pink-100';
    if (isVideoFile(file.mimeType)) return 'from-blue-100 to-cyan-100';
    if (isImageFile(file.mimeType)) return 'from-green-100 to-emerald-100';
    return 'from-gray-100 to-gray-200';
  };

  const getIconColor = () => {
    if (isAudioFile(file.mimeType)) return 'text-purple-600';
    if (isVideoFile(file.mimeType)) return 'text-blue-600';
    if (isImageFile(file.mimeType)) return 'text-green-600';
    return 'text-gray-600';
  };

  const handlePlay = () => {
    const mediaFile = {
      ...file,
      streamUrl: `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
    };
    playFolder([mediaFile]);
  };

  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      {/* Thumbnail/Icon */}
      <div
        className={`aspect-square bg-gradient-to-br ${getGradient()} rounded-lg flex items-center justify-center mb-3 relative overflow-hidden`}
      >
        {file.thumbnailLink ? (
          <img
            src={file.thumbnailLink}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={getIconColor()}>{getIcon()}</div>
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <Button
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handlePlay}
          >
            <Play className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* File Info */}
      <div>
        <p className="font-medium truncate mb-1" title={file.name}>
          {file.name}
        </p>
        {file.size && (
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        )}
      </div>
    </div>
  );
}
