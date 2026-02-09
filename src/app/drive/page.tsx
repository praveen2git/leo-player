'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Navbar } from '@/components/Navbar';
import { AuthGuard } from '@/components/auth/AuthGuard';

function DrivePageContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Drive</h1>
        <p className="text-gray-600">
          Drive browser implementation coming soon...
        </p>
      </main>
    </div>
  );
}

export default function DrivePage() {
  return (
    <AuthGuard>
      <DrivePageContent />
    </AuthGuard>
  );
}
