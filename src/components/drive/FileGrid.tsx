'use client';

import { useDriveStore } from '@/store/driveStore';
import { isFolder, isAudioFile, isVideoFile, isImageFile } from '@/lib/drive';
import { FolderCard } from './FolderCard';
import { MediaCard } from './MediaCard';

export function FileGrid() {
  const { files, filterType, searchQuery } = useDriveStore();

  // Filter files
  const filteredFiles = files.filter((file) => {
    // Search filter
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Type filter
    if (filterType === 'all') return true;
    if (filterType === 'folder') return isFolder(file.mimeType);
    if (filterType === 'audio') return isAudioFile(file.mimeType);
    if (filterType === 'video') return isVideoFile(file.mimeType);
    if (filterType === 'image') return isImageFile(file.mimeType);

    return true;
  });

  if (filteredFiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="text-lg">No files found</p>
        <p className="text-sm">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filteredFiles.map((file) =>
        isFolder(file.mimeType) ? (
          <FolderCard key={file.id} folder={file} />
        ) : (
          <MediaCard key={file.id} file={file} />
        )
      )}
    </div>
  );
}
