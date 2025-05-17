// hooks/usePaymentDetails.ts
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { PembayaranData } from '@/types'; // Import the type
import useSession from './useSession'; // Use the existing session hook

const usePaymentDetails = (orderId: string | null) => {
  const session = useSession(); // Use the existing session hook

  const [paymentData, setPaymentData] = useState<PembayaranData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchPaymentData = async (id: string) => {
    setLoading(true);
    setError(null);
    setPaymentData(null);

    // Wait for session to load first if needed for RLS
    // (useSession hook handles internal loading, but checking session object helps)
    if (!session) {
      setError('User not logged in or session expired. Cannot fetch payment details.');
      setLoading(false);
      return;
    }

    const { data: paymentDetails, error: paymentError } = await supabase.from('Pembayaran').select('*').eq('id_order', id).single(); // Use .single() assuming one payment record per order

    if (paymentError && paymentError.code !== 'PGRST116') {
      // PGRST116 means "no rows found"
      console.error('Error fetching payment details:', paymentError);
      setError(`Error fetching payment details: ${paymentError.message}`);
      setPaymentData(null);
    } else if (paymentDetails) {
      console.log('Fetched payment details:', paymentDetails);
      setPaymentData(paymentDetails as PembayaranData);
    } else {
      // Handle case where no payment data is found for this order ID
      console.log('No payment data found for order ID:', id);
      setError(`No payment details found for order ID: ${id}`);
      setPaymentData(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Fetch if orderId is available and session is loaded
    if (orderId && session !== undefined) {
      // Check if session has been attempted to load
      fetchPaymentData(orderId);
    } else if (!orderId) {
      setLoading(false);
      setError('Order ID not provided in the URL.');
    } else if (session === null) {
      // If session loading finished but no session found
      setLoading(false); // Ensure loading is false
      setError('User not logged in or session expired. Cannot fetch payment details.');
    }
  }, [orderId, session]); // Dependency array includes orderId and session

  return { paymentData, loading, error, session }; // Return session as well for display/checks
};

export default usePaymentDetails;
