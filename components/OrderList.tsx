// components/OrderList.tsx
'use client';

import useOrders from '@/hooks/useOrders'; // Import the hook

const OrderList: React.FC = () => {
  const { orders } = useOrders(); // Use the hook to get orders

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>Orders:</h2>
      {orders === null ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <pre
          style={{
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '8px',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(orders, null, 2)}
        </pre>
      ) : (
        <p>No orders found. Create one above!</p>
      )}
    </div>
  );
};

export default OrderList;
