'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePlayerStore } from '@/store/playerStore';
import { useAuthStore } from '@/store/authStore';
import { Plus, List, Trash2, Play, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Playlist {
  id: string;
  name: string;
  description?: string;
  files: any[];
  fileCount: number;
  createdAt: any;
  updatedAt: any;
  userId: string;
}

export function PlaylistManager() {
  const { toast } = useToast();
  const { queue } = usePlayerStore();
  const user = useAuthStore((state) => state.user);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  // Load playlists from Firestore
  useEffect(() => {
    loadPlaylists();
  }, [user]);

  const loadPlaylists = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const q = query(
        collection(db, 'playlists'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const playlistData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Playlist[];

      setPlaylists(playlistData);
    } catch (error: any) {
      console.error('Error loading playlists:', error);
      toast({
        title: 'Error loading playlists',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim() || !user) return;

    try {
      const playlistData = {
        name: newPlaylistName,
        description: newPlaylistDesc,
        files: queue,
        fileCount: queue.length,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'playlists'), playlistData);

      toast({
        title: 'Playlist created!',
        description: `"${newPlaylistName}" with ${queue.length} tracks`,
      });

      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateForm(false);
      loadPlaylists();
    } catch (error: any) {
      toast({
        title: 'Failed to create playlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updatePlaylist = async (playlistId: string, updates: Partial<Playlist>) => {
    try {
      await updateDoc(doc(db, 'playlists', playlistId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      toast({
        title: 'Playlist updated',
        description: 'Changes saved successfully',
      });

      loadPlaylists();
      setEditingId(null);
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deletePlaylist = async (playlistId: string, name: string) => {
    if (!confirm(`Delete playlist "${name}"?`)) return;

    try {
      await deleteDoc(doc(db, 'playlists', playlistId));

      toast({
        title: 'Playlist deleted',
        description: `"${name}" has been removed`,
      });

      loadPlaylists();
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const loadPlaylist = (playlist: Playlist) => {
    const { playFolder } = usePlayerStore.getState();
    playFolder(playlist.files);

    toast({
      title: 'Playlist loaded',
      description: `Playing ${playlist.fileCount} tracks`,
    });
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <List className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">My Playlists</h3>
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
              <Save className="h-4 w-4 mr-2" />
              Save ({queue.length} tracks)
            </Button>
            <Button variant="outline" onClick={() => setShowCreateForm(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Playlist List */}
      {loading ? (
        <div className="text-center text-gray-400 py-8">Loading playlists...</div>
      ) : playlists.length === 0 ? (
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
                {editingId === playlist.id ? (
                  <Input
                    defaultValue={playlist.name}
                    onBlur={(e) =>
                      updatePlaylist(playlist.id, { name: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updatePlaylist(playlist.id, {
                          name: (e.target as HTMLInputElement).value,
                        });
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <>
                    <p className="font-medium truncate">{playlist.name}</p>
                    <p className="text-sm text-gray-500">
                      {playlist.fileCount} tracks
                      {playlist.description && ` • ${playlist.description}`}
                    </p>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => loadPlaylist(playlist)}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingId(playlist.id)}
                >
                  <Edit2 className="h-4 w-4" />
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
  );
}
