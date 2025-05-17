// hooks/useRiwayat.ts
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { RiwayatData } from '@/types'; // Import the type

interface UseRiwayatOptions {
  userId?: string | null; // Optional user ID to filter by
  fetchImmediately?: boolean; // Option to control immediate fetching
}

const useRiwayat = (options?: UseRiwayatOptions) => {
  const { userId = null, fetchImmediately = true } = options || {};

  const [riwayat, setRiwayat] = useState<RiwayatData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchRiwayat = async () => {
    setLoading(true);
    setError(null);
    setRiwayat(null);

    let query = supabase.from('Riwayat').select('*');

    // Apply filter if userId is provided and not null/undefined
    if (userId) {
      query = query.eq('id_user', userId);
      console.log(`Fetching riwayat for user ID: ${userId}`);
    } else {
      // WARNING: Fetching all data without RLS can be UNSAFE
      console.warn('Fetching ALL riwayat data (no user filter). Ensure RLS is configured correctly.');
    }

    const { data: riwayatData, error: riwayatError } = await query;

    if (riwayatError) {
      console.error('Error fetching riwayat:', riwayatError);
      setError(`Error fetching riwayat: ${riwayatError.message}`);
      setRiwayat([]);
    } else {
      console.log(`Successfully fetched ${riwayatData.length} riwayat records.`, userId ? '' : '(All users)');
      setRiwayat(riwayatData as RiwayatData[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (fetchImmediately) {
      // Fetch only if userId is available OR if fetching all (no userId filter)
      if (userId !== null || !options?.hasOwnProperty('userId')) {
        fetchRiwayat();
      } else {
        // If fetchImmediately is true but userId is explicitly null, maybe skip fetching
        setLoading(false); // Ensure loading state is false
        setRiwayat([]); // Set to empty if not fetching due to null userId
      }
    }
  }, [userId, fetchImmediately]); // Re-run effect if userId or fetchImmediately changes

  return { riwayat, loading, error, fetchRiwayat }; // Return fetchRiwayat for manual refresh
};

export default useRiwayat;
