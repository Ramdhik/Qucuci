// components/AdminOrderList.tsx
'use client';

import { OrderData } from '@/types';
import React from 'react';
import Link from 'next/link';
import { formatRupiah } from '@/utils/formatters';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AdminOrderListProps {
  orders: OrderData[] | null;
  loading: boolean;
  error: string | null;
}

const AdminOrderList: React.FC<AdminOrderListProps> = ({ orders, loading, error }) => {
  return (
    <div className="w-screen max-w-6xl mx-auto py-8">
      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : orders && orders.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Order ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Layanan</TableHead>
                <TableHead>Berat (kg)</TableHead>
                <TableHead>Metode Bayar</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Tanggal Pesanan</TableHead>
                <TableHead className="text-right">Total Harga</TableHead>
                <TableHead>No Telepon</TableHead>
                <TableHead>
                  <span className="sr-only">View</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                return (
                  // Pastikan tidak ada spasi atau baris baru di antara tag berikut:
                  <TableRow key={order.id_order}>
                    <TableCell className="font-medium break-all">{order.id_order}</TableCell>
                    <TableCell className="break-all">{order.id_user}</TableCell>
                    <TableCell>{order.jenis_layanan}</TableCell>
                    <TableCell>{order.berat_pakaian}</TableCell>
                    <TableCell>{order.metode_pembayaran}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{order.alamat_penjemputan}</TableCell>
                    <TableCell>{new Date(order.tanggal_pesanan).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatRupiah(order.total_harga)}</TableCell>
                    <TableCell>{order.no_telepon}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/orders/${order.id_order}`} className="text-primary hover:text-primary-dark">
                        View Detail
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-gray-600">Tidak ada pesanan ditemukan.</p>
      )}
    </div>
  );
};

export default AdminOrderList;
