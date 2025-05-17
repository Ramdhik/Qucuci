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

const ITEMS_PER_PAGE = 4;

const RiwayatList: React.FC<RiwayatListProps> = ({ riwayat, loading, error, isLoggedIn }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRiwayatItems = riwayat ? riwayat.slice(startIndex, endIndex) : [];

  const totalPages = riwayat ? Math.ceil(riwayat.length / ITEMS_PER_PAGE) : 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [riwayat]);

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return dateString;
    }
  };

  return (
    <div className="mb-8 w-full max-w-4xl mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-gray-800 text-center">Riwayat Transaksi Anda</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading riwayat...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : !isLoggedIn ? (
        <p className="text-center text-orange-500">Silakan masuk untuk melihat riwayat transaksi Anda.</p>
      ) : riwayat && riwayat.length > 0 ? (
        // Added min-h-[XXXpx] to ensure minimum height for the grid container
        // Adjust the pixel value (XXX) based on the approximate height of two rows + gap
        // You might need to inspect the height of your cards + gap in the browser
        // A common value might be around min-h-[400px] to min-h-[600px] depending on card content
        // Using a responsive min-height might also be beneficial if card height varies by breakpoint
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 min-h-[400px] sm:min-h-[300px] md:min-h-[300px]">
          {' '}
          {/* Adjusted min-height based on 2x2 grid */}
          {currentRiwayatItems.map((item) => (
            <Link key={item.id_riwayat} href={`/pembayaran/${item.id_order}`} passHref>
              <div className="block rounded-md border border-gray-200 p-4 shadow-sm hover:shadow-md transition cursor-pointer h-full bg-white">
                <p className="text-sm text-gray-500 mb-2">Tanggal: {formatDate(item.tanggal_transaksi)}</p>
                <p>
                  <span className="font-semibold">ID Order:</span> {item.id_order}
                </p>
                <p>
                  <span className="font-semibold">Status:</span> {item.status_transaksi}
                </p>
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
