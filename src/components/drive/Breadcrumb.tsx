'use client';

import { useDriveStore } from '@/store/driveStore';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const { breadcrumb, setCurrentFolder } = useDriveStore();

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Home className="h-4 w-4 text-gray-500" />
      {breadcrumb.map((folder, index) => (
        <div key={folder.id} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          <button
            onClick={() => setCurrentFolder(folder.id)}
            className={`hover:text-purple-600 transition-colors ${
              index === breadcrumb.length - 1
                ? 'font-semibold text-gray-900'
                : 'text-gray-600'
            }`}
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  );
}
