'use client';

import { useEffect, useState } from 'react';
import { useDriveStore } from '@/store/driveStore';
import { useAuthStore } from '@/store/authStore';
import { DriveAPI } from '@/lib/drive';
import { Breadcrumb } from './Breadcrumb';
import { SearchBar } from './SearchBar';
import { FilterTabs } from './FilterTabs';
import { FileGrid } from './FileGrid';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function FileBrowser() {
  const {
    currentFolderId,
    files,
    loading,
    error,
    nextPageToken,
    setFiles,
    appendFiles,
    setLoading,
    setError,
    setNextPageToken,
    setBreadcrumb,
  } = useDriveStore();

  const getActiveDriveToken = useAuthStore((state) => state.getActiveDriveToken);
  const [driveAPI, setDriveAPI] = useState<DriveAPI | null>(null);

  // Initialize Drive API
  useEffect(() => {
    const token = getActiveDriveToken();
    if (token) {
      setDriveAPI(new DriveAPI(token));
    }
  }, [getActiveDriveToken]);

  // Load files when folder changes
  useEffect(() => {
    if (!driveAPI) return;

    const loadFiles = async () => {
      setLoading(true);
      setError(null);

      try {
        const { files: newFiles, nextPageToken: token } = await driveAPI.listFiles(
          currentFolderId
        );
        setFiles(newFiles);
        setNextPageToken(token || null);

        // Load breadcrumb
        const breadcrumb = await driveAPI.getBreadcrumb(currentFolderId);
        setBreadcrumb(breadcrumb);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [currentFolderId, driveAPI]);

  const loadMoreFiles = async () => {
    if (!driveAPI || !nextPageToken || loading) return;

    setLoading(true);
    try {
      const { files: newFiles, nextPageToken: token } = await driveAPI.listFiles(
        currentFolderId,
        nextPageToken
      );
      appendFiles(newFiles);
      setNextPageToken(token || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <SearchBar />
      <FilterTabs />

      {loading && files.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <>
          <FileGrid />

          {/* Load More */}
          {nextPageToken && (
            <div className="flex justify-center pt-8">
              <Button onClick={loadMoreFiles} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
