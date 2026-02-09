'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlayerStore } from '@/store/playerStore';
import { Plus, List, Trash2, Play } from 'lucide-react';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  fileCount: number;
  createdAt: Date;
}

export function PlaylistManager() {
  const { queue } = usePlayerStore();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const playlist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      description: newPlaylistDesc,
      fileCount: queue.length,
      createdAt: new Date(),
    };

    setPlaylists([...playlists, playlist]);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setShowCreateForm(false);

    // TODO: Save to Firestore
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
    // TODO: Delete from Firestore
  };

  const loadPlaylist = (id: string) => {
    // TODO: Load playlist from Firestore and add to queue
    console.log('Loading playlist:', id);
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <List className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Playlists</h3>
        </div>
        <Button size="sm" onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Playlist
        </Button>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <Input
            placeholder="Playlist name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Description (optional)"
            value={newPlaylistDesc}
            onChange={(e) => setNewPlaylistDesc(e.target.value)}
            className="mb-3"
          />
          <div className="flex space-x-2">
            <Button onClick={createPlaylist} disabled={!newPlaylistName.trim()}>
              Create from Queue ({queue.length} tracks)
            </Button>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Playlist List */}
      {playlists.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <List className="h-12 w-12 mx-auto mb-2" />
          <p>No playlists yet</p>
          <p className="text-sm">Create a playlist from your current queue</p>
        </div>
      ) : (
        <div className="space-y-2">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{playlist.name}</p>
                <p className="text-sm text-gray-500">
                  {playlist.fileCount} tracks
                  {playlist.description && ` • ${playlist.description}`}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => loadPlaylist(playlist.id)}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deletePlaylist(playlist.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
