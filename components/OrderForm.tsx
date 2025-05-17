// components/OrderForm.tsx
'use client';

import { useState } from 'react';
import useSession from '@/hooks/useSession';
import useCreateOrder from '@/hooks/useCreateOrder';
import { OrderData } from '@/types';
import { useRouter } from 'next/navigation';
import { Shirt, MapPin, Calendar, Phone, DollarSign, Clock } from 'lucide-react'; // Banknote icon removed
import Link from 'next/link';
import { Button } from './ui/button';
// Remove this incorrect import: import setInsertError from '@/hooks/useCreateOrder';

interface OrderFormProps {
  onOrderCreated?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderCreated }) => {
  const session = useSession();
  // Destructure setInsertError from the hook
  const { loading, insertError, createOrder, setInsertError } = useCreateOrder();
  const router = useRouter();

  const PRICE_PER_KG = 5000;

  const [newOrderData, setNewOrderData] = useState<OrderData>({
    jenis_layanan: 'Normal',
    berat_pakaian: '',
    metode_pembayaran: '', // Keep this state for backend
    alamat_penjemputan: '',
    tanggal_pesanan: '',
    total_harga: '', // Keep this state for calculation and display
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // Helper function to format number as Indonesian Rupiah
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === 'phone_number') {
      setPhoneNumber(value);
    } else if (id === 'berat_pakaian') {
      const weight = parseFloat(value);
      let calculatedPrice = '';

      if (!isNaN(weight) && weight > 0) {
        calculatedPrice = (weight * PRICE_PER_KG).toString();
      }

      setNewOrderData({
        ...newOrderData,
        berat_pakaian: value,
        total_harga: calculatedPrice,
      });
    } else {
      setNewOrderData({ ...newOrderData, [id]: value });
    }
  };

  const handleServiceTypeChange = (type: 'Normal' | 'Instant') => {
    const currentWeight = parseFloat(newOrderData.berat_pakaian as string);
    let calculatedPrice = '';
    if (!isNaN(currentWeight) && currentWeight > 0) {
      calculatedPrice = (currentWeight * PRICE_PER_KG).toString();
    }

    setNewOrderData({
      ...newOrderData,
      jenis_layanan: type,
      total_harga: calculatedPrice,
    });
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    // newOrderData.metode_pembayaran will be updated in handleSubmitOrder
  };

  const handleSubmitOrder = async () => {
    const userId = session?.user?.id;

    if (!userId) {
      setInsertError('User not logged in. Cannot create order.');
      return;
    }

    const parsedTotalHarga = parseFloat(newOrderData.total_harga as string);

    if (isNaN(parsedTotalHarga) || parsedTotalHarga <= 0) {
      setInsertError('Total harga tidak valid. Masukkan berat pakaian.');
      return;
    }

    if (!selectedPaymentMethod) {
      setInsertError('Pilih metode pembayaran.');
      return;
    }
    // Add other required fields validation if necessary
    if (!newOrderData.jenis_layanan || !newOrderData.berat_pakaian || !newOrderData.alamat_penjemputan.trim() || !newOrderData.tanggal_pesanan || !phoneNumber.trim()) {
      setInsertError('Semua field harus diisi.');
      return;
    }

    const orderDataToSend: OrderData = {
      ...newOrderData,
      metode_pembayaran: selectedPaymentMethod, // Use the selected state here
      total_harga: parsedTotalHarga,
      // If phoneNumber needs to be sent, update OrderData type and pass it
      // phoneNumber: phoneNumber,
    };

    const createdOrderId = await createOrder(orderDataToSend, userId);

    if (createdOrderId) {
      setNewOrderData({
        jenis_layanan: 'Normal',
        berat_pakaian: '',
        metode_pembayaran: '', // Resetting, will be set on next selection
        alamat_penjemputan: '',
        tanggal_pesanan: '',
        total_harga: '',
      });
      setSelectedPaymentMethod('');
      setPhoneNumber('');

      if (onOrderCreated) {
        onOrderCreated();
      }
      router.push(`/pembayaran/${createdOrderId}`);
    }
  };

  const isFormDisabled = loading || !session?.user?.id;

  const isSubmitDisabled =
    isFormDisabled ||
    !newOrderData.jenis_layanan ||
    newOrderData.berat_pakaian === '' ||
    isNaN(parseFloat(newOrderData.berat_pakaian as string)) ||
    parseFloat(newOrderData.berat_pakaian as string) <= 0 ||
    !selectedPaymentMethod || // Check if a payment method is selected
    !newOrderData.alamat_penjemputan.trim() ||
    !newOrderData.tanggal_pesanan ||
    !phoneNumber.trim() ||
    // Check if the calculated total_harga is valid and positive
    newOrderData.total_harga === '' ||
    isNaN(parseFloat(newOrderData.total_harga as string)) ||
    parseFloat(newOrderData.total_harga as string) <= 0;

  return (
    // Wrap the two cards in a Fragment
    <div className="flex flex-row">
      {/* Left Card: Form Pengisian */}
      <div key="order-form-card" className="rounded-lg border ml-40 mt-10 mb-10 border-gray-200 p-6 shadow-lg w-full md:w-1/2 lg:w-2/3">
        {/* ... content of the left card ... */}
        <h2 className="mb-6 text-2xl font-bold text-primary">Form Pengisian</h2>

        {/* ... rest of the left card content (Jenis Layanan, Berat, Alamat, Info Kontak, Tanggal/Waktu, Metode Bayar, Terms, Errors) ... */}

        {/* Pilih Jenis Layanan */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Pilih Jenis Layanan</h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleServiceTypeChange('Normal')}
              className={`flex-1 rounded-md border px-6 py-3 text-center font-medium transition ${newOrderData.jenis_layanan === 'Normal' ? 'border-primary text-primary' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              disabled={isFormDisabled}
            >
              Normal
              <p className="mt-1 text-sm text-gray-500">
                <Calendar className="inline mb-1 mr-1 size-4" /> 2-3 hari
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleServiceTypeChange('Instant')}
              className={`flex-1 rounded-md border px-6 py-3 text-center font-medium transition ${newOrderData.jenis_layanan === 'Instant' ? 'border-primary text-primary' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              disabled={isFormDisabled}
            >
              Instant
              <p className="mt-1 text-sm text-gray-500">
                <Clock className="inline mr-1 size-4" /> 3-4 jam
              </p>
            </button>
          </div>
        </div>

        {/* Masukkan Berat Pakaian */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Masukkan Berat Pakaian</h3>
          <div className="relative flex items-center">
            <Shirt size={20} className="absolute left-3 text-gray-400" />
            <input
              id="berat_pakaian"
              type="number"
              step="0.1"
              value={newOrderData.berat_pakaian}
              onChange={handleInputChange}
              placeholder="Masukkan berat / jumlah pakaian Anda"
              className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-16 text-gray-700 placeholder-gray-400 focus:border-primary focus:ring-primary"
              disabled={isFormDisabled}
            />
            <span className="absolute right-3 text-gray-600">Kg</span>
          </div>
        </div>

        {/* Masukkan Alamat Penjemputan */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Masukkan Alamat Penjemputan</h3>
          <div className="relative flex items-center">
            <MapPin size={20} className="absolute left-3 text-gray-400" />
            <input
              id="alamat_penjemputan"
              type="text"
              value={newOrderData.alamat_penjemputan}
              onChange={handleInputChange}
              placeholder="Masukkan Alamat Anda"
              className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-gray-700 placeholder-gray-400 focus:border-primary focus:ring-primary"
              disabled={isFormDisabled}
            />
          </div>
        </div>

        {/* Masukkan Info Kontak (Assuming this is for phone number) */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Masukkan Info Kontak</h3>
          <div className="relative flex items-center">
            <Phone size={20} className="absolute left-3 text-gray-400" />
            <input
              id="phone_number"
              type="tel"
              value={phoneNumber}
              onChange={handleInputChange}
              placeholder="Masukkan Nomor Telepon Anda"
              className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-gray-700 placeholder-gray-400 focus:border-primary focus:ring-primary"
              disabled={isFormDisabled}
            />
          </div>
        </div>
        {/* Tanggal & Waktu Penjemputan */}
        <div className="mb-6">
          {' '}
          {/* mb-6 instead of mt-4 for consistent spacing */}
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Tanggal & Waktu Penjemputan</h3>
          <div className="relative flex items-center">
            <Calendar size={20} className="absolute left-3 text-gray-400" />
            <input
              id="tanggal_pesanan"
              type="datetime-local"
              value={newOrderData.tanggal_pesanan}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-gray-700 focus:border-primary focus:ring-primary"
              disabled={isFormDisabled}
            />
          </div>
        </div>

        {/* Pilih Metode Bayar - Dipindahkan ke sini di card kiri */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Pilih Metode Bayar</h3>
          <p className="mb-3 text-sm text-gray-500">Virtual Account</p>
          <div className="grid grid-cols-2 gap-4">
            {/* BCA */}
            <button
              type="button"
              onClick={() => handlePaymentMethodSelect('BCA Virtual Account')}
              className={`flex items-center justify-center rounded-md border p-4 transition ${selectedPaymentMethod === 'BCA Virtual Account' ? 'border-primary shadow' : 'border-gray-300 hover:border-gray-400'}`}
              disabled={isFormDisabled}
            >
              <img src="/bca-logo.png" alt="BCA" className="mr-2 h-10" />
            </button>
            {/* BNI */}
            <button
              type="button"
              onClick={() => handlePaymentMethodSelect('BNI Virtual Account')}
              className={`flex items-center justify-center rounded-md border p-4 transition ${selectedPaymentMethod === 'BNI Virtual Account' ? 'border-primary shadow' : 'border-gray-300 hover:border-gray-400'}`}
              disabled={isFormDisabled}
            >
              <img src="/bni-logo.png" alt="BNI" className="mr-2 h-10" />
            </button>
            {/* Mandiri */}
            <button
              type="button"
              onClick={() => handlePaymentMethodSelect('Mandiri Virtual Account')}
              className={`flex items-center justify-center rounded-md border p-4 transition ${selectedPaymentMethod === 'Mandiri Virtual Account' ? 'border-primary shadow' : 'border-gray-300 hover:border-gray-400'}`}
              disabled={isFormDisabled}
            >
              <img src="/mandiri-logo.png" alt="Mandiri" className="mr-2 h-10" />
            </button>
            {/* Cash */}
            <button
              type="button"
              onClick={() => handlePaymentMethodSelect('Cash')}
              className={`flex items-center justify-center rounded-md border p-4 transition ${selectedPaymentMethod === 'Cash' ? 'border-primary shadow' : 'border-gray-300 hover:border-gray-400'}`}
              disabled={isFormDisabled}
            >
              <h1 className="text-2xl font-bold">
                <img src="/money.png" alt="Cash" className="mr-1 h-10 inline-flex" /> Cash
              </h1>
            </button>
          </div>
        </div>

        {/* Terms and Conditions - Dipindahkan ke card kiri juga */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Dengan melanjutkan, kamu menyetujui{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Syarat & Ketentuan
          </Link>{' '}
          yang berlaku.
        </p>

        {/* Error and Not Logged In Messages - Dipindahkan ke card kiri */}
        {insertError && <p className="mt-4 text-red-500">{insertError}</p>}
        {!session?.user?.id && <p className="mt-4 text-orange-500">Silakan masuk untuk membuat pesanan.</p>}
      </div>

      <div key="order-summary-card" className="rounded-lg border border-gray-200 p-6 shadow-md ml-8 mt-10 self-start md:sticky md:top-8">
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Total Harga</h3>
          <div className="relative flex items-center">
            <input
              id="total_harga_display"
              type="text"
              value={formatRupiah(newOrderData.total_harga)}
              readOnly
              placeholder="Harga "
              className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-3 text-gray-700 placeholder-gray-400 bg-gray-100 cursor-not-allowed text-lg font-bold"
              disabled={isFormDisabled}
            />
          </div>
        </div>
        {/* Submit Button menggunakan komponen Button Shadcn UI */}
        <Button type="button" onClick={handleSubmitOrder} disabled={isSubmitDisabled} className={`w-full py-3 text-lg font-semibold ${isSubmitDisabled ? 'cursor-not-allowed opacity-50' : ''}`}>
          {loading ? 'Memproses...' : 'Bayar Sekarang'}
        </Button>
      </div>
    </div> // Close the Fragment
  );
};

export default OrderForm;
