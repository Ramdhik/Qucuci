// app/pembayaran/[id_order]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import usePaymentDetails from '@/hooks/usePaymentDetails'; // Import the hook
import PaymentDetails from '@/components/PaymentDetails'; // Import the component
import SessionDisplay from '@/components/SessionDisplay'; // Import SessionDisplay

export default function PembayaranDetailPage() {
  const params = useParams();
  // Ensure orderId is a string or null if not present
  const orderId = typeof params.id_order === 'string' ? params.id_order : null;

  // Use the hook to fetch payment details and session
  const { paymentData, loading, error, session } = usePaymentDetails(orderId);

  const isLoggedIn = !!session?.user?.id; // Determine login status

  return (
    <div className="w-screen flex flex-col items-center">
      {/* Render PaymentDetails component, passing data and state */}
      <PaymentDetails
        paymentData={paymentData}
        loading={loading}
        error={error}
        orderId={orderId}
        isLoggedIn={isLoggedIn} // Pass login status
      />
    </div>
  );
}
