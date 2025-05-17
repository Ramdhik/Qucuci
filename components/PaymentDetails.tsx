// components/PaymentDetails.tsx
'use client';

import { PembayaranData } from '@/types'; // Import the type
import React from 'react'; // Ensure React is imported

interface PaymentDetailsProps {
  paymentData: PembayaranData | null;
  loading: boolean;
  error: string | null;
  orderId: string | null; // Pass orderId for display
  isLoggedIn: boolean; // Pass login status
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ paymentData, loading, error, orderId, isLoggedIn }) => {
  // Helper function to format number as Indonesian Rupiah (can reuse from OrderForm or a utility)
  const formatRupiah = (number: number | string): string => {
    const num = typeof number === 'string' ? parseFloat(number) : number;
    if (isNaN(num)) {
      return '';
    }
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return formatter.format(num);
  };

  return (
    <div className="w-full max-w-lg mt-8">
      {' '}
      <h2 className="mb-4 text-xl font-bold text-gray-800 text-center">Payment Details:</h2>
      {loading ? (
        <p className="text-gray-600 text-center">Loading payment details...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : !isLoggedIn ? (
        <p className="text-orange-500 text-center">Silakan masuk untuk melihat detail pembayaran.</p>
      ) : paymentData ? (
        <div className="rounded-md border border-gray-200 p-6 shadow-lg space-y-4">
          {' '}
          {/* Added styling */}
          <p>
            <span className="font-semibold">Payment ID:</span> {paymentData.id_pembayaran}
          </p>
          <p>
            <span className="font-semibold">Method:</span> {paymentData.metode_pembayaran}
          </p>
          <p>
            <span className="font-semibold">Amount:</span> {formatRupiah(paymentData.jumlah_pembayaran)} {/* Format amount */}
          </p>
          <p>
            <span className="font-semibold">Status:</span> {paymentData.status_pembayaran}
          </p>
          <p>
            <span className="font-semibold">Discount:</span> {formatRupiah(paymentData.diskon_pembayaran)} {/* Format discount */}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {new Date(paymentData.tanggal_pembayaran).toLocaleString()}
          </p>
          {/* Add buttons or forms here to update status later if needed */}
        </div>
      ) : (
        <p className="text-gray-600 text-center">Tidak ada detail pembayaran tersedia untuk pesanan ini.</p>
      )}
    </div>
  );
};

export default PaymentDetails;
