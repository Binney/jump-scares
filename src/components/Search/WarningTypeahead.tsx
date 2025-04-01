'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';

interface WarningType {
  id: string;
  name: string;
}

interface WarningTypeaheadProps {
  selectedWarnings: string[];
  onSelect: (warningId: string) => void;
  onRemove: (warningId: string) => void;
  className?: string;
}

export default function WarningTypeahead({
  selectedWarnings,
  onSelect,
  onRemove,
  className = '',
}: WarningTypeaheadProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClient();

  const { data: allWarnings = [] } = useSWR('warning-types', async () => {
    const { data, error } = await supabase
      .from('warning_types')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    return data;
  }, { revalidateOnFocus: false });

  const filteredWarnings = searchTerm
    ? allWarnings.filter((warning: WarningType) =>
        warning.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.warning-typeahead')) {
      setShowDropdown(false);
      setSearchTerm('');
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className={`warning-typeahead ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Search warnings..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => {
            setShowDropdown(true);
            setSearchTerm('');
          }}
          className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          See all
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedWarnings.map((warningId) => {
          const warning = allWarnings.find((w: WarningType) => w.id === warningId);
          if (!warning) return null;
          
          return (
            <div
              key={warningId}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full"
            >
              <span>{warning.name}</span>
              <button
                type="button"
                onClick={() => onRemove(warningId)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {showDropdown && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredWarnings.length > 0 ? (
            filteredWarnings.map((warning: WarningType) => (
              <button
                key={warning.id}
                type="button"
                onClick={() => {
                  onSelect(warning.id);
                  setSearchTerm('');
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
              >
                {warning.name}
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              No warnings found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
