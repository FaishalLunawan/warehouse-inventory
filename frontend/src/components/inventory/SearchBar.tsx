'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (search: string, category: string) => void;
  categories: string[];
  initialSearch?: string;
  initialCategory?: string;
}

export default function SearchBar({ 
  onSearch, 
  categories,
  initialSearch = '',
  initialCategory = ''
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm, selectedCategory);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    setSelectedCategory('');
    onSearch('', '');
  };

  const hasFilters = searchTerm || selectedCategory;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items by name or category..."
            className="input pl-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center justify-center sm:w-auto ${
            showFilters ? 'bg-gray-300' : ''
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
        
        {hasFilters && (
          <button
            onClick={handleClear}
            className="btn-danger flex items-center justify-center sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="badge bg-blue-100 text-blue-800">
              Search: {searchTerm}
            </span>
          )}
          {selectedCategory && (
            <span className="badge bg-green-100 text-green-800">
              Category: {selectedCategory}
            </span>
          )}
        </div>
      )}
    </div>
  );
}