// hooks/useAdminOrders.ts
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { OrderData } from '@/types'; // Import the type

interface UseAdminOrdersResult {
  orders: OrderData[] | null;
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>; // Function to manually refetch
}

const useAdminOrders = (): UseAdminOrdersResult => {
  const [orders, setOrders] = useState<OrderData[] | null>(null);
  const [loading, setLoading] = useState(true); // Set true initially
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    setOrders(null); // Clear previous data

    // WARNING: This fetches ALL data. Ensure RLS is configured to
    // allow only admin users to select all data.
    const { data: ordersData, error: ordersError } = await supabase.from('Order').select('*');

    if (ordersError) {
      console.error('Error fetching admin orders:', ordersError);
      setError(`Error fetching admin orders: ${ordersError.message}`);
      setOrders([]); // Set to empty array on error
    } else {
      console.log(`Fetched ${ordersData.length} orders for admin.`);
      setOrders(ordersData as OrderData[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Fetch data when the hook mounts
    fetchOrders();
  }, []); // Empty dependency array to fetch only once

  return { orders, loading, error, fetchOrders };
};

export default useAdminOrders;
