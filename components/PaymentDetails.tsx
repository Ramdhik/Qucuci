// components/PaymentDetails.tsx
'use client';

import { PembayaranData } from '@/types'; // Import the type
import { Progress } from '@radix-ui/react-progress';
import React from 'react'; // Ensure React is imported
import { Button } from './ui/button';

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
    <>
      <div className="w-1/2 mt-8">
        {loading ? (
          <p className="text-gray-600 text-center">Loading payment details...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : !isLoggedIn ? (
          <p className="text-orange-500 text-center">Silakan masuk untuk melihat detail pembayaran.</p>
        ) : paymentData ? (
          <div className="rounded-md border border-gray-200 p-6 shadow-lg space-y-4">
            <div className="flex flex-col">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  {' '}
                  <div className="w-12 h-12 rounded-full bg-[#AAF9FF] text-white flex justify-center items-center">
                    <img src="/transaksi.png" alt="BCA" className="w-8 h-8" />
                  </div>
                  <p className="text-center">Bayar</p>
                </div>

                <div className="mx-5 mt-3 rounded-full w-[35%] h-5 bg-slate-300 text-slate-300">-</div>
                <div className="flex flex-col">
                  {' '}
                  <div className="w-12 h-12 rounded-full bg-[#FF8787] text-white flex justify-center items-center">
                    <img src="/jam.png" alt="BCA" className="w-8 h-8" />
                  </div>
                  <p className="text-center">Proses</p>
                </div>
                <div className="mx-5 mt-3 rounded-full w-[35%] h-5 bg-slate-300 text-slate-300">-</div>
                <div className="flex flex-col">
                  {' '}
                  <div className="w-12 h-12 rounded-full bg-[#FF8787] text-white flex justify-center items-center">
                    <img src="/jam.png" alt="BCA" className="w-8 h-8" />
                  </div>
                  <p className="text-center">Selesai</p>
                </div>
              </div>
              <div className="h-16 w-full bg-[#AAF9FF] p-3 rounded-lg mt-3 flex flex-row">
                <img src="/transaksi.png" alt="BCA" className="w-10 h-10 " />
                <div className="flex-col ml-4 -mt-1">
                  <h3 className="text-xl font-bold">halo</h3>
                  <p className="-mt-2">halo</p>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                  {' '}
                  <p className="mt-2">
                    <span className="font-medium text-gray-500">No Transaksi : </span> {paymentData.id_pembayaran}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Date : </span> {new Date(paymentData.tanggal_pembayaran).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-500">Metode Pembayaran:</span> {paymentData.metode_pembayaran}
                  </p>
                </div>
                <Button className="mt-8 w-1/3 h-12 rounded-full text-2xl font-bold shadow-md">Bayar Sekarang</Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">Tidak ada detail pembayaran tersedia untuk pesanan ini.</p>
        )}
      </div>
      <div className="w-1/2 mt-8">
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
              <span className="font-semibold">Amount:</span> {formatRupiah(paymentData.jumlah_pembayaran)} {/* Format amount */}
            </p>
            <p>
              <span className="font-semibold">Status:</span> {paymentData.status_pembayaran}
            </p>
            <p>
              <span className="font-semibold">Discount:</span> {formatRupiah(paymentData.diskon_pembayaran)} {/* Format discount */}
            </p>
            {/* Add buttons or forms here to update status later if needed */}
          </div>
        ) : (
          <p className="text-gray-600 text-center">Tidak ada detail pembayaran tersedia untuk pesanan ini.</p>
        )}
      </div>
    </>
  );
};

export default PaymentDetails;
