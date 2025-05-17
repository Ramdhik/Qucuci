// app/riwayat/page.tsx
'use client';

import RiwayatList from '@/components/RiwayatList';
import useRiwayat from '@/hooks/useRiwayat';
import useSession from '@/hooks/useSession';

export default function RiwayatPage() {
  const session = useSession();
  const userId = session?.user?.id || null;

  const { riwayat, loading, error, fetchRiwayat } = useRiwayat({ userId: userId, fetchImmediately: userId !== null });

  const isLoggedIn = !!userId;

  return (
    <div className="flex flex-col items-center py-8">
      <RiwayatList riwayat={riwayat} loading={loading} error={error} isLoggedIn={isLoggedIn} />
      {/* SessionDisplay component removed for brevity, add back if needed */}
    </div>
  );
}
