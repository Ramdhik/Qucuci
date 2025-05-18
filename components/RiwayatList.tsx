// components/RiwayatList.tsx
'use client';

import { RiwayatData } from '@/types';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface RiwayatListProps {
  riwayat: RiwayatData[] | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const ITEMS_PER_PAGE = 4; // Correct spelling

const RiwayatList: React.FC<RiwayatListProps> = ({ riwayat, loading, error, isLoggedIn }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Corrected the variable name here
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRiwayatItems = riwayat ? riwayat.slice(startIndex, endIndex) : [];

  // Corrected the variable name here
  const totalPages = riwayat ? Math.ceil(riwayat.length / ITEMS_PER_PAGE) : 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [riwayat]);

  const formatDate = (dateString: string): string => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      // Format to dd Month yyyy - hh:mm
      // Replace '.' with ':' if needed for consistency, but ':' is more standard for time
      return new Date(dateString).toLocaleDateString('id-ID', options).replace('.', ':');
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return dateString;
    }
  };

  // Helper function to format currency (Assuming Rupiah)
  const formatRupiah = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) {
      return '';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="mb-8 w-full min-w-4xl mx-auto ">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">Riwayat Transaksi Anda</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading riwayat...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : !isLoggedIn ? (
        <p className="text-center text-orange-500">Silakan masuk untuk melihat riwayat transaksi Anda.</p>
      ) : riwayat && riwayat.length > 0 ? (
        // Added min-h for layout stability
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[400px] sm:min-h-[300px] md:min-h-[300px] ">
          {currentRiwayatItems.map((item) => (
            <Link key={item.id_riwayat} href={`/pembayaran/${item.id_order}`} passHref>
              {/* Removed 'block' class as 'flex' is already present and sets display */}
              <div className="rounded-md border border-gray-200 p-4 shadow-sm hover:shadow-md transition cursor-pointer h-full bg-white flex flex-col justify-between ">
                {' '}
                {/* Use flex-col and justify-between */}
                <div>
                  {' '}
                  {/* Container for top section */}
                  <div className="flex justify-between items-center mb-3">
                    {' '}
                    {/* Date on left, Status on right */}
                    <p className="text-sm text-gray-500">{formatDate(item.tanggal_transaksi)}</p>
                    {/* Adjusted status display to be like a badge */}
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        item.status_transaksi === 'Order Created'
                          ? 'bg-yellow-100 text-yellow-800' // Example: Pending/Created
                          : item.status_transaksi === 'Completed'
                            ? 'bg-green-100 text-green-800' // Example: Success (like BERHASIL)
                            : 'bg-gray-100 text-gray-800' // Default/Other
                      }`}
                    >
                      {item.status_transaksi.toUpperCase()}
                    </span>
                  </div>
                  {/* Detail rows */}
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold text-gray-500 text-sm mr-2">Jenis Layanan:</span>
                    <span className="text-gray-800 text-sm">{item.jenis_layanan}</span>
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold text-gray-500 text-sm mr-2">Berat Pakaian:</span>
                    <span className="text-gray-800 text-sm">
                      {typeof item.berat_pakaian === 'number'
                        ? item.berat_pakaian.toFixed(1) // Format jika numeric
                        : item.berat_pakaian}{' '}
                      Kg
                    </span>
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold text-gray-500 text-sm mr-2">Alamat Penjemputan:</span>
                    <span className="text-gray-800 text-sm">{item.alamat_penjemputan}</span>
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold text-gray-500 text-sm mr-2">No. Telepon:</span>
                    <span className="text-gray-800 text-sm">{item.no_telepon}</span>
                  </p>
                </div>
                {/* Bottom section: ID Order on left, Total Price (if available) on right */}
                <div className="flex justify-between items-end mt-4">
                  <p className="text-gray-600 text-sm font-mono break-all">
                    #{item.id_order ? item.id_order.substring(0, 12) : 'N/A'}... {/* Show truncated ID */}
                  </p>
                  {/* Placeholder for Total Price if not in RiwayatData */}
                  <p className="text-xl font-bold text-primary">{formatRupiah(item.jumlah_pembayaran)} </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">Tidak ada catatan riwayat ditemukan untuk akun Anda.</p>
      )}

      {/* Pagination Controls */}
      {riwayat && totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Previous
          </button>
          <span className="flex items-center text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || loading}
            className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RiwayatList;
