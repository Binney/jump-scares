'use client';

import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

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
  const supabase = createClient();

  const { data: countries = [] } = useSWR<string[]>('countries', async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('country')
      .order('country');
    
    if (error) throw error;
    return [...new Set(data.map((room: { country: string | null }) => room.country).filter(Boolean))] as string[];
  });

  const { data: warningTypesData = [] } = useSWR('warning-types', async () => {
    const { data, error } = await supabase
      .from('warning_types')
      .select('id, name')
      .order('name');
    
    if (error) throw error;
    return data;
  });

  const [excludedWarningTypes, setExcludedWarningTypes] = useState<string[]>([]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get("search") as string;
    const selectedCountry = formData.get("country") as string;
    onSearchChanged(searchTerm, selectedCountry, excludedWarningTypes);
  }

  function handleWarningTypeChange(warningTypeId: string) {
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
  }

  return (
    <form onSubmit={handleSearch} className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            name="search"
            defaultValue={search}
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
            defaultValue={country}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exclude rooms with warnings
        </label>
        <div className="space-y-2">
          {warningTypesData.map((warningType) => (
            <div key={warningType.id} className="flex items-center">
              <input
                type="checkbox"
                id={`warning-${warningType.id}`}
                checked={excludedWarningTypes.includes(warningType.id)}
                onChange={() => handleWarningTypeChange(warningType.id)}
                className="mr-2"
              />
              <label htmlFor={`warning-${warningType.id}`} className="text-gray-700">
                {warningType.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full md:w-auto"
      >
        Search
      </button>
    </form>
  );
}
