import { DriveFile, DriveFolder } from '@/types';

const GOOGLE_DRIVE_API = 'https://www.googleapis.com/drive/v3';

export class DriveAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${GOOGLE_DRIVE_API}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Drive API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async listFiles(folderId: string = 'root', pageToken?: string) {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, iconLink, webContentLink)',
      pageSize: '100',
      orderBy: 'folder,name',
    });

    if (pageToken) {
      params.append('pageToken', pageToken);
    }

    const data = await this.fetch(`/files?${params.toString()}`);
    return {
      files: data.files || [],
      nextPageToken: data.nextPageToken,
    };
  }

  async getFile(fileId: string) {
    return this.fetch(`/files/${fileId}?fields=*`);
  }

  async searchFiles(query: string, mimeType?: string) {
    const searchQuery = mimeType
      ? `name contains '${query}' and mimeType='${mimeType}' and trashed=false`
      : `name contains '${query}' and trashed=false`;

    const params = new URLSearchParams({
      q: searchQuery,
      fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, iconLink)',
      pageSize: '50',
    });

    const data = await this.fetch(`/files?${params.toString()}`);
    return data.files || [];
  }

  async getBreadcrumb(folderId: string): Promise<DriveFolder[]> {
    if (folderId === 'root') {
      return [{ id: 'root', name: 'My Drive' }];
    }

    const breadcrumb: DriveFolder[] = [];
    let currentId = folderId;

    while (currentId && currentId !== 'root') {
      try {
        const file = await this.fetch(`/files/${currentId}?fields=id,name,parents`);
        breadcrumb.unshift({ id: file.id, name: file.name });
        currentId = file.parents?.[0];
      } catch (error) {
        break;
      }
    }

    breadcrumb.unshift({ id: 'root', name: 'My Drive' });
    return breadcrumb;
  }

  getStreamUrl(fileId: string): string {
    return `${GOOGLE_DRIVE_API}/files/${fileId}?alt=media`;
  }

  getDownloadUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
}

export function isAudioFile(mimeType: string): boolean {
  return mimeType.startsWith('audio/');
}

export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

export function isMediaFile(mimeType: string): boolean {
  return isAudioFile(mimeType) || isVideoFile(mimeType) || isImageFile(mimeType);
}

export function isFolder(mimeType: string): boolean {
  return mimeType === 'application/vnd.google-apps.folder';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
