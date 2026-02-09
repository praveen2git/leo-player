'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Music, Download, Loader2, Play, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { usePlayerStore } from '@/store/playerStore';
import { debounce } from '@/lib/utils';
import { DriveFile } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface OnlineResult {
  id: string;
  title: string;
  artist: string;
  duration: string;
  thumbnail: string;
  source: 'youtube' | 'spotify' | 'soundcloud';
  url: string;
  downloadUrl?: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [driveResults, setDriveResults] = useState<DriveFile[]>([]);
  const [onlineResults, setOnlineResults] = useState<OnlineResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'drive' | 'online'>('drive');
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const { toast } = useToast();
  const getActiveDriveToken = useAuthStore((state) => state.getActiveDriveToken);
  const { playFolder } = usePlayerStore();

  // Search Drive
  const searchDrive = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setDriveResults([]);
      return;
    }

    setLoading(true);
    try {
      const token = getActiveDriveToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `/api/drive/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setDriveResults(data.files || []);
    } catch (error: any) {
      console.error('Drive search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search Online (YouTube Music, etc.)
  const searchOnline = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setOnlineResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search/music?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) throw new Error('Online search failed');

      const data = await response.json();
      setOnlineResults(data.results || []);
    } catch (error: any) {
      console.error('Online search error:', error);
      toast({
        title: 'Search failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  const debouncedDriveSearch = debounce(searchDrive, 300);
  const debouncedOnlineSearch = debounce(searchOnline, 500);

  useEffect(() => {
    if (activeTab === 'drive') {
      debouncedDriveSearch(query);
    } else {
      debouncedOnlineSearch(query);
    }
  }, [query, activeTab]);

  // Download from online source to Drive
  const handleDownload = async (result: OnlineResult) => {
    setDownloadingIds((prev) => new Set(prev).add(result.id));

    try {
      const token = getActiveDriveToken();
      if (!token) throw new Error('Not authenticated');

      toast({
        title: 'Downloading...',
        description: `Downloading "${result.title}" to your Drive`,
      });

      const response = await fetch('/api/download/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          videoId: result.id,
          title: result.title,
          artist: result.artist,
        }),
      });

      if (!response.ok) throw new Error('Download failed');

      const data = await response.json();

      toast({
        title: 'Download complete!',
        description: `"${result.title}" saved to your Drive`,
      });

      // Refresh Drive search to show new file
      searchDrive(query);
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(result.id);
        return next;
      });
    }
  };

  // Play Drive result
  const handlePlayDrive = (file: DriveFile) => {
    const mediaFile = {
      ...file,
      streamUrl: `/api/drive/stream/${file.id}`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
    };
    playFolder([mediaFile]);
    setIsOpen(false);
  };

  // Keyboard shortcut to open search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="w-64 justify-start text-gray-500"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        Search music... <kbd className="ml-auto text-xs">⌘K</kbd>
      </Button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl z-50 max-h-[80vh] flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search music in Drive or online..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 text-lg"
              autoFocus
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mt-4">
            <Button
              variant={activeTab === 'drive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('drive')}
            >
              My Drive
              {driveResults.length > 0 && (
                <span className="ml-2 bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs">
                  {driveResults.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === 'online' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('online')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Online
              {onlineResults.length > 0 && (
                <span className="ml-2 bg-white text-purple-600 px-2 py-0.5 rounded-full text-xs">
                  {onlineResults.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : activeTab === 'drive' ? (
            // Drive Results
            driveResults.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                {query ? 'No results in your Drive' : 'Start typing to search...'}
              </div>
            ) : (
              <div className="space-y-2">
                {driveResults.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                    onClick={() => handlePlayDrive(file)}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                        <Music className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-sm text-gray-500">From your Drive</p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Online Results
            onlineResults.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                {query ? 'No online results found' : 'Search for music online...'}
              </div>
            ) : (
              <div className="space-y-2">
                {onlineResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-12 h-12 rounded object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{result.title}</p>
                        <p className="text-sm text-gray-500">
                          {result.artist} • {result.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(result)}
                        disabled={downloadingIds.has(result.id)}
                      >
                        {downloadingIds.has(result.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t text-xs text-gray-500 text-center">
          Press <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to close •{' '}
          <kbd className="px-2 py-1 bg-gray-100 rounded">⌘K</kbd> to search
        </div>
      </div>
    </>
  );
}
