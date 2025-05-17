// hooks/useCreateOrder.ts
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OrderData, PembayaranData, RiwayatData } from '@/types'; // Import types

interface CreateOrderResult {
  loading: boolean;
  insertError: string | null;
  // Add setInsertError to the interface
  setInsertError: React.Dispatch<React.SetStateAction<string | null>>;
  createOrder: (orderData: OrderData, userId: string) => Promise<string | null>; // Returns order ID on success, null on failure
}

// Add React import for React.Dispatch and React.SetStateAction types
import React from 'react';

const useCreateOrder = (): CreateOrderResult => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [insertError, setInsertError] = useState<string | null>(null);

  const supabase = createClient();

  const createOrder = async (orderData: OrderData, userId: string): Promise<string | null> => {
    setLoading(true);
    setInsertError(null); // Clear previous errors at the start of the process

    // Basic validation moved to the component (OrderForm) for better user feedback
    // But you can keep some critical validation here if needed

    const parsedBeratPakaian = parseFloat(orderData.berat_pakaian as string);
    const parsedTotalHarga = parseFloat(orderData.total_harga as string);

    // Basic validation on parsed numbers before proceeding
    if (isNaN(parsedBeratPakaian) || parsedBeratPakaian <= 0 || isNaN(parsedTotalHarga) || parsedTotalHarga <= 0) {
      // This validation should ideally happen in the component for immediate feedback
      // but as a safeguard here:
      setInsertError('Invalid weight or total price provided.');
      setLoading(false);
      return null;
    }

    // --- STEP 1: INSERT INTO Order ---
    console.log('Inserting Order...');
    const orderToInsert = {
      id_user: userId,
      jenis_layanan: orderData.jenis_layanan.trim(),
      berat_pakaian: parsedBeratPakaian,
      metode_pembayaran: orderData.metode_pembayaran.trim(),
      alamat_penjemputan: orderData.alamat_penjemputan.trim(),
      tanggal_pesanan: orderData.tanggal_pesanan,
      total_harga: parsedTotalHarga,
      // Include phone number here if it's part of your OrderData type
      // phone_number: (orderData as any).phoneNumber,
    };

    const { data: orderDataResult, error: orderError } = await supabase.from('Order').insert([orderToInsert]).select();

    if (orderError) {
      console.error('Error creating order:', orderError);
      setInsertError(`Error creating order: ${orderError.message}`);
      setLoading(false);
      return null;
    }

    const createdOrder = orderDataResult[0];
    const createdOrderId = createdOrder.id_order;

    if (!createdOrderId) {
      console.error('Failed to get id_order from insert result.');
      setInsertError('Failed to retrieve order ID after creation.');
      setLoading(false);
      return null;
    }

    console.log('Order created successfully with ID:', createdOrderId);

    // --- STEP 2: INSERT INTO Pembayaran ---
    console.log('Inserting Pembayaran...');
    const pembayaranToInsert: PembayaranData = {
      id_order: createdOrderId,
      id_user: userId, // Often Pembayaran is also linked to user
      metode_pembayaran: orderData.metode_pembayaran.trim(),
      jumlah_pembayaran: parsedTotalHarga,
      status_pembayaran: 'Belum Dibayar',
      diskon_pembayaran: 0,
      tanggal_pembayaran: new Date().toISOString(),
    };

    const { error: pembayaranError } = await supabase.from('Pembayaran').insert([pembayaranToInsert]);

    if (pembayaranError) {
      console.error('Error creating payment record:', pembayaranError);
      // Add error to state, but don't necessarily stop the whole process
      setInsertError((prev) => `${prev ? prev + '\n' : ''}Order created, but failed to create payment record: ${pembayaranError.message}`);
    } else {
      console.log('Pembayaran record created successfully.');
    }

    // --- STEP 3: INSERT INTO Riwayat ---
    console.log('Inserting Riwayat...');
    const riwayatToInsert: RiwayatData = {
      id_order: createdOrderId,
      id_user: userId,
      status_transaksi: 'Order Created', // Initial status
      tanggal_transaksi: new Date().toISOString(),
    };

    const { error: riwayatError } = await supabase.from('Riwayat').insert([riwayatToInsert]);

    if (riwayatError) {
      console.error('Error creating history record:', riwayatError);
      // Add error to state
      setInsertError((prev) => `${prev ? prev + '\n' : ''}Order created, but failed to create history record: ${riwayatError.message}`);
    } else {
      console.log('Riwayat record created successfully.');
    }

    setLoading(false);
    return createdOrderId; // Return the new order ID
  };

  // Return setInsertError along with other values
  return { loading, insertError, setInsertError, createOrder };
};

export default useCreateOrder;
