'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';

export default function CountrySelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const selectedCountry = searchParams.get('country') || '';
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const { data: countries = [] } = useSWR<string[]>('countries', async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('country')
      .order('country');

    if (error) throw error;
    return [...new Set(data.map((room: { country: string | null }) => room.country).filter(Boolean))] as string[];
  });

  const handleCountrySelect = async (country: string) => {
    setIsLoading(true);
    try {
      // Navigate to rooms page with country filter
      const params = new URLSearchParams();
      params.set('country', country);
      router.push(`/search?${params.toString()}`);
    } catch (error) {
      console.error('Error selecting country:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Find a room</h2>
      <p className="text-gray-600 mb-4">
        Start by selecting a country to find escape rooms near you.
      </p>
      <div className="space-y-4">
        {countries.map((country: string) => (
          <button
            key={country}
            onClick={() => handleCountrySelect(country)}
            className={`w-full p-4 rounded-lg border hover:border-blue-500 transition-colors ${
              selectedCountry === country ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            {country}
          </button>
        ))}
      </div>
    </div>
  );
}
