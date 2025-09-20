'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from './icons/search';

interface SearchInputProps {
  defaultValue?: string;
}

export function SearchInput({ defaultValue = '' }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim());
        params.set('page', '1'); // Reset to first page when searching
      } else {
        params.delete('search');
      }
      
      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, router, searchParams]);

  return (
    <div className="relative">
      <SearchIcon className="w-[24px] absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search by ID or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="text-black pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}