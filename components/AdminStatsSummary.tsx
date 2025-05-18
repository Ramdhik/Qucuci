// components/AdminStatsSummary.tsx
'use client';

import { OrderData } from '@/types';
import React, { useMemo } from 'react'; // Import useMemo
import { Users, DollarSign, Package } from 'lucide-react'; // Icons
import { formatRupiah } from '@/utils/formatters'; // Formatter Rupiah

interface AdminStatsSummaryProps {
  orders: OrderData[] | null;
  loading: boolean;
  error: string | null;
}

// Helper function to calculate stats from orders
const calculateStats = (orders: OrderData[] | null) => {
  if (!orders) {
    return {
      totalCustomers: 0,
      totalRevenue: 0,
      totalOrders: 0,
      // Add more stats if needed
    };
  }

  const totalOrders = orders.length;

  // Calculate total revenue by summing up total_harga
  const totalRevenue = orders.reduce((sum, order) => {
    // Safely parse total_harga, handle potential string or invalid numbers
    const orderPrice = typeof order.total_harga === 'string' ? parseFloat(order.total_harga) : order.total_harga || 0;
    return sum + (isNaN(orderPrice) ? 0 : orderPrice);
  }, 0);

  // Calculate total unique customers based on id_user
  const uniqueUserIds = new Set(orders.map((order) => order.id_user));
  const totalCustomers = uniqueUserIds.size;

  return {
    totalCustomers,
    totalRevenue,
    totalOrders,
    // You might add logic to calculate percentage increase here based on time periods if needed
    customerIncrease: '+100%', // Placeholder from image
    revenueIncrease: '+100%', // Placeholder from image
    orderIncrease: '+100%', // Placeholder from image
  };
};

const AdminStatsSummary: React.FC<AdminStatsSummaryProps> = ({ orders, loading, error }) => {
  // Use useMemo to recalculate stats only when orders data changes
  const stats = useMemo(() => calculateStats(orders), [orders]);

  // Helper function to format large numbers (e.g., 50K) - Optional
  const formatLargeNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'; // Convert to K
    }
    return num.toString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      {' '}
      {/* Container for stats cards */}
      {/* You could add a title like "Dashboard Overview" here */}
      {/* Container for the stat cards - using grid or flex */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {' '}
        {/* Responsive grid */}
        {/* Total Customers Card */}
        <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <div className="flex items-center text-gray-600 mb-4">
            <Users size={24} className="mr-3" />
            <h3 className="text-lg font-semibold">Total Customers</h3>
          </div>
          {loading ? (
            <p className="text-xl font-bold text-gray-800">...</p>
          ) : error ? (
            <p className="text-red-500 text-lg">Error</p>
          ) : (
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold text-gray-800">{stats.totalCustomers}</p>
              {/* Optional: Percentage increase */}
              {/* {stats.customerIncrease && <span className="text-green-500 text-sm">{stats.customerIncrease}</span>} */}
            </div>
          )}
        </div>
        {/* Total Revenue Card */}
        <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <div className="flex items-center text-gray-600 mb-4">
            <DollarSign size={24} className="mr-3" />
            <h3 className="text-lg font-semibold">Total Revenue</h3>
          </div>
          {loading ? (
            <p className="text-xl font-bold text-gray-800">...</p>
          ) : error ? (
            <p className="text-red-500 text-lg">Error</p>
          ) : (
            <div className="flex flex-col">
              {' '}
              {/* Use flex-col for stacking price and currency */}
              <p className="text-3xl font-bold text-gray-800">
                {formatLargeNumber(stats.totalRevenue)}
                {/* Gunakan formatLargeNumber jika diinginkan */}
              </p>
              {/* Tampilkan "Rupiah Indonesia" di bawah angka */}
              <p className="text-sm text-blue-600">Rupiah Indonesia</p> {/* Placeholder color */}
              {/* Optional: Percentage increase */}
              {/* {stats.revenueIncrease && <span className="text-green-500 text-sm self-end">{stats.revenueIncrease}</span>} */}
            </div>
          )}
        </div>
        {/* Total Orders Card */}
        <div className="rounded-lg border border-gray-200 p-6 shadow-sm bg-white">
          <div className="flex items-center text-gray-600 mb-4">
            <Package size={24} className="mr-3" />
            <h3 className="text-lg font-semibold">Total Orders</h3>
          </div>
          {loading ? (
            <p className="text-xl font-bold text-gray-800">...</p>
          ) : error ? (
            <p className="text-red-500 text-lg">Error</p>
          ) : (
            <div className="flex justify-between items-end">
              <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              {/* Optional: Percentage increase */}
              {/* {stats.orderIncrease && <span className="text-green-500 text-sm">{stats.orderIncrease}</span>} */}
            </div>
          )}
        </div>
        {/* Add more cards here if needed */}
      </div>
      {/* Optional: Daily/Monthly/Annual buttons - requires state management for time period */}
      {/* This functionality needs more complex logic to filter orders by date range */}
      {/* <div className="flex flex-col items-end mt-4 space-y-2">
          <button className="px-4 py-2 rounded-md bg-black text-white text-sm">Daily</button>
          <button className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 text-sm">Monthly</button>
          <button className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 text-sm">Annual</button>
        </div> */}
    </div>
  );
};

export default AdminStatsSummary;
