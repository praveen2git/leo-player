'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { M3U8Player } from './M3U8Player';
import { Plus, List, Play, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

interface M3U8Playlist {
  id: string;
  name: string;
  url: string;
  description?: string;
  userId: string;
  createdAt: any;
}

export function M3U8PlaylistViewer() {
  const { toast } = useToast();
  const user = useAuthStore((state) => state.user);

  const [playlists, setPlaylists] = useState<M3U8Playlist[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistUrl, setNewPlaylistUrl] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  useEffect(() => {
    loadPlaylists();
  }, [user]);

  const loadPlaylists = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'm3u8_playlists'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const playlistData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as M3U8Playlist[];

      setPlaylists(playlistData);
    } catch (error: any) {
      console.error('Error loading M3U8 playlists:', error);
    }
  };

  const addPlaylist = async () => {
    if (!newPlaylistName.trim() || !newPlaylistUrl.trim() || !user) return;

    // Validate M3U8 URL
    if (!newPlaylistUrl.endsWith('.m3u8') && !newPlaylistUrl.includes('.m3u8?')) {
      toast({
        title: 'Invalid URL',
        description: 'Please provide a valid M3U8 playlist URL',
        variant: 'destructive',
      });
      return;
    }

    try {
      const playlistData = {
        name: newPlaylistName,
        url: newPlaylistUrl,
        description: newPlaylistDesc,
        userId: user.uid,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'm3u8_playlists'), playlistData);

      toast({
        title: 'Playlist added!',
        description: `"${newPlaylistName}" is ready to stream`,
      });

      setNewPlaylistName('');
      setNewPlaylistUrl('');
      setNewPlaylistDesc('');
      setShowAddForm(false);
      loadPlaylists();
    } catch (error: any) {
      toast({
        title: 'Failed to add playlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deletePlaylist = async (playlistId: string, name: string) => {
    if (!confirm(`Delete M3U8 playlist "${name}"?`)) return;

    try {
      await deleteDoc(doc(db, 'm3u8_playlists', playlistId));

      toast({
        title: 'Playlist deleted',
        description: `"${name}" has been removed`,
      });

      if (currentUrl) {
        const deletedPlaylist = playlists.find((p) => p.id === playlistId);
        if (deletedPlaylist && deletedPlaylist.url === currentUrl) {
          setCurrentUrl(null);
        }
      }

      loadPlaylists();
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const playPlaylist = (url: string) => {
    setCurrentUrl(url);
  };

  return (
    <div className="space-y-6">
      {/* Current Player */}
      {currentUrl && (
        <div className="bg-white rounded-lg p-6">
          <M3U8Player m3u8Url={currentUrl} />
        </div>
      )}

      {/* Playlist Manager */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <List className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">M3U8 Playlists</h3>
          </div>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add M3U8
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Input
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="M3U8 URL (https://example.com/playlist.m3u8)"
              value={newPlaylistUrl}
              onChange={(e) => setNewPlaylistUrl(e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Description (optional)"
              value={newPlaylistDesc}
              onChange={(e) => setNewPlaylistDesc(e.target.value)}
              className="mb-3"
            />
            <div className="flex space-x-2">
              <Button
                onClick={addPlaylist}
                disabled={!newPlaylistName.trim() || !newPlaylistUrl.trim()}
              >
                Add Playlist
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Playlist List */}
        {playlists.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <List className="h-12 w-12 mx-auto mb-2" />
            <p>No M3U8 playlists yet</p>
            <p className="text-sm">Add IPTV or HLS stream URLs</p>
          </div>
        ) : (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  currentUrl === playlist.url
                    ? 'bg-purple-50 border border-purple-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{playlist.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {playlist.description || playlist.url}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => playPlaylist(playlist.url)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(playlist.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletePlaylist(playlist.id, playlist.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
