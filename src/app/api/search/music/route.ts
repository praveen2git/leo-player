import { NextRequest, NextResponse } from 'next/server';

/**
 * Search for music across multiple sources
 * YouTube Music, Spotify, SoundCloud, etc.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ error: 'Query required' }, { status: 400 });
    }

    // Use YouTube Data API v3 for searching
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        new URLSearchParams({
          part: 'snippet',
          q: query,
          type: 'video',
          videoCategoryId: '10', // Music category
          maxResults: '20',
          key: YOUTUBE_API_KEY,
        })
    );

    if (!response.ok) {
      throw new Error('YouTube API error');
    }

    const data = await response.json();

    // Transform YouTube results to our format
    const results = data.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      duration: 'Unknown', // Would need additional API call to get duration
      thumbnail: item.snippet.thumbnails.high.url,
      source: 'youtube',
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    })) || [];

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Music search error:', error);
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}
