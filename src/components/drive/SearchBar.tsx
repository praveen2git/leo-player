'use client';

import { useState } from 'react';
import { useDriveStore } from '@/store/driveStore';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { debounce } from '@/lib/utils';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useDriveStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Search files and folders..."
        value={localQuery}
        onChange={handleChange}
        className="pl-10"
      />
    </div>
  );
}
