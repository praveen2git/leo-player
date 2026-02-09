import { create } from 'zustand';
import { DriveFile, DriveFolder } from '@/types';

interface DriveState {
  currentFolderId: string;
  breadcrumb: DriveFolder[];
  files: DriveFile[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterType: 'all' | 'audio' | 'video' | 'image' | 'folder';
  nextPageToken: string | null;

  setCurrentFolder: (folderId: string) => void;
  setBreadcrumb: (breadcrumb: DriveFolder[]) => void;
  setFiles: (files: DriveFile[]) => void;
  appendFiles: (files: DriveFile[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: 'all' | 'audio' | 'video' | 'image' | 'folder') => void;
  setNextPageToken: (token: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentFolderId: 'root',
  breadcrumb: [{ id: 'root', name: 'My Drive' }],
  files: [],
  loading: false,
  error: null,
  searchQuery: '',
  filterType: 'all' as const,
  nextPageToken: null,
};

export const useDriveStore = create<DriveState>((set) => ({
  ...initialState,

  setCurrentFolder: (folderId) => set({ currentFolderId: folderId, files: [] }),
  setBreadcrumb: (breadcrumb) => set({ breadcrumb }),
  setFiles: (files) => set({ files }),
  appendFiles: (files) => set((state) => ({ files: [...state.files, ...files] })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterType: (type) => set({ filterType: type }),
  setNextPageToken: (token) => set({ nextPageToken: token }),
  reset: () => set(initialState),
}));
