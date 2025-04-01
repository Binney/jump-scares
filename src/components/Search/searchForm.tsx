'use client';

import useSWR from 'swr';
import WarningTypeahead from './WarningTypeahead';
import { useState, useEffect } from 'react';
import supabase from '@/utils/supabase';

export default function Search({
  search,
  country,
  onSearchChanged,
  warningTypes,
  onWarningTypeChange,
}: {
  search: string;
  country: string;
  onSearchChanged: (search: string, country: string, excludedWarningTypes: string[]) => void;
  warningTypes: string[];
  onWarningTypeChange: (warningTypeId: string) => void;
}) {
  const [localSearch, setLocalSearch] = useState(search);

  const { data: countries = [] } = useSWR<string[]>('countries', async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('country')
      .order('country');
    
    if (error) throw error;
    return [...new Set(data.map((room: { country: string | null }) => room.country).filter(Boolean))] as string[];
  });

  const [excludedWarningTypes, setExcludedWarningTypes] = useState<string[]>([]);

  // Debounce search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChanged(localSearch, country, excludedWarningTypes);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, country, excludedWarningTypes, onSearchChanged]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    onSearchChanged(localSearch, selectedCountry, excludedWarningTypes);
  };

  const handleWarningTypeChange = (warningTypeId: string) => {
    setExcludedWarningTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(warningTypeId)) {
        newSet.delete(warningTypeId);
      } else {
        newSet.add(warningTypeId);
      }
      return Array.from(newSet);
    });
    onWarningTypeChange(warningTypeId);
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            name="search"
            value={localSearch}
            onChange={handleSearchChange}
            placeholder="Search rooms..."
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            name="country"
            value={country}
            onChange={handleCountryChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <WarningTypeahead
          selectedWarnings={warningTypes}
          onSelect={handleWarningTypeChange}
          onRemove={handleWarningTypeChange}
        />
      </div>
    </div>
  );
}
