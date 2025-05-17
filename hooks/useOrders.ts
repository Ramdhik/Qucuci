// hooks/useOrders.ts
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { OrderData } from '@/types'; // Import the type

const useOrders = () => {
  const [orders, setOrders] = useState<OrderData[] | null>(null);
  const supabase = createClient();

  const fetchOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase.from('Order').select();

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      setOrders([]);
    } else {
      setOrders(ordersData as OrderData[]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, fetchOrders }; // Return fetchOrders so components can refetch
};

export default useOrders;
