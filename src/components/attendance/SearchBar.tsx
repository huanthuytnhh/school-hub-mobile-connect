
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-sm mb-4">
      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <Input
        className="pl-10 py-2 border-0"
        placeholder="Enter Name Or ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
