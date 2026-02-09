'use client';

import { useDriveStore } from '@/store/driveStore';
import { Button } from '@/components/ui/button';
import { Music, Video, Image, Folder, Grid } from 'lucide-react';

export function FilterTabs() {
  const { filterType, setFilterType } = useDriveStore();

  const filters = [
    { type: 'all' as const, label: 'All', icon: Grid },
    { type: 'audio' as const, label: 'Audio', icon: Music },
    { type: 'video' as const, label: 'Video', icon: Video },
    { type: 'image' as const, label: 'Images', icon: Image },
    { type: 'folder' as const, label: 'Folders', icon: Folder },
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {filters.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          variant={filterType === type ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterType(type)}
          className="flex items-center space-x-2"
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );
}
