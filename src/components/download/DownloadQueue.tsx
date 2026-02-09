'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DownloadTask {
  id: string;
  title: string;
  artist: string;
  videoId: string;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  progress: number;
  error?: string;
  driveFileId?: string;
}

export function DownloadQueue() {
  const [downloads, setDownloads] = useState<DownloadTask[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Add download to queue
  const addDownload = (task: Omit<DownloadTask, 'status' | 'progress'>) => {
    const newTask: DownloadTask = {
      ...task,
      status: 'pending',
      progress: 0,
    };
    setDownloads((prev) => [...prev, newTask]);
    processDownload(newTask);
  };

  // Process download
  const processDownload = async (task: DownloadTask) => {
    updateDownload(task.id, { status: 'downloading', progress: 10 });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setDownloads((prev) =>
          prev.map((d) =>
            d.id === task.id && d.progress < 90
              ? { ...d, progress: d.progress + 10 }
              : d
          )
        );
      }, 500);

      // Make actual download request
      const response = await fetch('/api/download/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: task.videoId,
          title: task.title,
          artist: task.artist,
        }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const result = await response.json();

      updateDownload(task.id, {
        status: 'completed',
        progress: 100,
        driveFileId: result.fileId,
      });

      toast({
        title: 'Download complete!',
        description: `"${task.title}" saved to your Drive`,
      });
    } catch (error: any) {
      updateDownload(task.id, {
        status: 'failed',
        error: error.message,
      });

      toast({
        title: 'Download failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateDownload = (id: string, updates: Partial<DownloadTask>) => {
    setDownloads((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const removeDownload = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  };

  const clearCompleted = () => {
    setDownloads((prev) =>
      prev.filter((d) => d.status !== 'completed' && d.status !== 'failed')
    );
  };

  const activeDownloads = downloads.filter(
    (d) => d.status === 'downloading' || d.status === 'pending'
  ).length;

  if (!isOpen && downloads.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 w-96 bg-white rounded-lg shadow-2xl border z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold">Downloads</h3>
          {activeDownloads > 0 && (
            <span className="text-sm text-gray-500">({activeDownloads} active)</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={clearCompleted}>
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {/* Download List */}
      {isOpen && (
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {downloads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Download className="h-12 w-12 mx-auto mb-2" />
              <p>No downloads</p>
            </div>
          ) : (
            downloads.map((download) => (
              <div
                key={download.id}
                className="p-3 bg-gray-50 rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{download.title}</p>
                    <p className="text-sm text-gray-500">{download.artist}</p>
                  </div>
                  <div className="ml-2">
                    {download.status === 'downloading' && (
                      <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                    )}
                    {download.status === 'completed' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {download.status === 'failed' && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    {download.status === 'pending' && (
                      <Loader2 className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Progress */}
                {(download.status === 'downloading' ||
                  download.status === 'pending') && (
                  <div>
                    <Progress value={download.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {download.progress}%
                    </p>
                  </div>
                )}

                {/* Error message */}
                {download.status === 'failed' && download.error && (
                  <p className="text-xs text-red-600">{download.error}</p>
                )}

                {/* Actions */}
                <div className="flex justify-end">
                  {(download.status === 'completed' ||
                    download.status === 'failed') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeDownload(download.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Export function to add download to queue
export const useDownloadQueue = () => {
  const addToQueue = (task: Omit<DownloadTask, 'status' | 'progress'>) => {
    // This would be implemented using a global state manager or context
    console.log('Add to download queue:', task);
  };

  return { addToQueue };
};
