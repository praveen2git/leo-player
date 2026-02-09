import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const mimeType = searchParams.get('mimeType');
    const accessToken = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    const searchQuery = mimeType
      ? `name contains '${query}' and mimeType='${mimeType}' and trashed=false`
      : `name contains '${query}' and trashed=false`;

    const params = new URLSearchParams({
      q: searchQuery,
      fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, iconLink)',
      pageSize: '50',
    });

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Drive API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
