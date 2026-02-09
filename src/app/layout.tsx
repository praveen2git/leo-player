import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Leo Player - Your Drive Media Player',
  description: 'A Spotify/YouTube-like experience for your Google Drive media files',
  keywords: 'Google Drive, media player, music player, video player, audio visualization',
  authors: [{ name: 'Praveen Kumar' }],
  openGraph: {
    title: 'Leo Player',
    description: 'Play your Google Drive media files with style',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
