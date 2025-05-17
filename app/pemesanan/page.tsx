'use client';

import OrderForm from '@/components/OrderForm';

import useOrders from '@/hooks/useOrders'; // Import the hook to trigger refetch

export default function Pemesanan() {
  // We only need the refetch function from useOrders here
  const { fetchOrders } = useOrders();

  // Function to handle the case when an order is successfully created
  const handleOrderCreated = () => {
    // Trigger a refetch of the order list
    fetchOrders();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Pass the refetch function to OrderForm */}
      <OrderForm onOrderCreated={handleOrderCreated} />
    </div>
  );
}
