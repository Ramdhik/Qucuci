// components/OrderForm.tsx
'use client';

import { useState, useEffect, useMemo } from 'react'; // Import useMemo
import useSession from '@/hooks/useSession';
import useCreateOrder from '@/hooks/useCreateOrder';
import usePriceCalculation from '@/hooks/usePriceCalculation';
import { OrderData } from '@/types';
import { useRouter } from 'next/navigation';
import { Shirt, MapPin, Calendar, Phone, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

interface OrderFormProps {
  onOrderCreated?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderCreated }) => {
  const session = useSession();
  const { loading, insertError, createOrder, setInsertError } = useCreateOrder();
  const router = useRouter();
  const { calculatePrice, formatRupiah } = usePriceCalculation();

  // Pisahkan state input dari state hasil perhitungan
  const [orderInputData, setOrderInputData] = useState({
    jenis_layanan: 'Normal' as 'Normal' | 'Instant', // Explicitly type for clarity
    berat_pakaian: '',
    alamat_penjemputan: '',
    tanggal_pesanan: '',
    // no_telepon akan dikelola di state phoneNumber terpisah
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // Gunakan useMemo untuk menghitung total harga
  // totalHarga akan diperbarui hanya ketika berat_pakaian atau jenis_layanan berubah
  const totalHarga = useMemo(() => {
    return calculatePrice(orderInputData.berat_pakaian, orderInputData.jenis_layanan);
  }, [orderInputData.berat_pakaian, orderInputData.jenis_layanan, calculatePrice]); // Dependensi useMemo

  // Hilangkan useEffect yang sebelumnya memperbarui total_harga state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === 'phone_number') {
      setPhoneNumber(value);
    } else {
      // Perbarui state input data
      setOrderInputData({ ...orderInputData, [id]: value });
    }
  };

  const handleServiceTypeChange = (type: 'Normal' | 'Instant') => {
    // Perbarui state input data
    setOrderInputData((prevData) => ({
      ...prevData,
      jenis_layanan: type,
    }));
    // useMemo akan otomatis menghitung ulang totalHarga
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleSubmitOrder = async () => {
    const userId = session?.user?.id;

    if (!userId) {
      setInsertError('User not logged in. Cannot create order.');
      return;
    }

    // Gunakan nilai totalHarga yang dihitung dari useMemo
    if (isNaN(totalHarga) || totalHarga <= 0) {
      setInsertError('Total harga tidak valid. Masukkan berat pakaian.');
      return;
    }

    if (!selectedPaymentMethod) {
      setInsertError('Pilih metode pembayaran.');
      return;
    }

    // Add other required fields validation
    if (!orderInputData.jenis_layanan || !orderInputData.berat_pakaian || !orderInputData.alamat_penjemputan.trim() || !orderInputData.tanggal_pesanan || !phoneNumber.trim()) {
      setInsertError('Semua field harus diisi.');
      return;
    }

    const orderDataToSend: OrderData = {
      // Gunakan nilai dari state inputData dan state terpisah lainnya
      jenis_layanan: orderInputData.jenis_layanan,
      berat_pakaian: orderInputData.berat_pakaian,
      metode_pembayaran: selectedPaymentMethod,
      alamat_penjemputan: orderInputData.alamat_penjemputan,
      tanggal_pesanan: orderInputData.tanggal_pesanan,
      total_harga: totalHarga, // Kirim nilai totalHarga yang dihitung
      no_telepon: phoneNumber,
    };

    const createdOrderId = await createOrder(orderDataToSend, userId);

    if (createdOrderId) {
      // Reset state input data dan state terpisah lainnya
      setOrderInputData({
        jenis_layanan: 'Normal',
        berat_pakaian: '',
        alamat_penjemputan: '',
        tanggal_pesanan: '',
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

  // Logika disabled button menggunakan nilai dari state inputData dan totalHarga
  const isSubmitDisabled =
    isFormDisabled ||
    !orderInputData.jenis_layanan ||
    orderInputData.berat_pakaian === '' ||
    isNaN(parseFloat(orderInputData.berat_pakaian as string)) ||
    parseFloat(orderInputData.berat_pakaian as string) <= 0 ||
    !selectedPaymentMethod ||
    !orderInputData.alamat_penjemputan.trim() ||
    !orderInputData.tanggal_pesanan ||
    !phoneNumber.trim() ||
    isNaN(totalHarga) || // Cek nilai totalHarga yang dihitung
    totalHarga <= 0;

  return (
    <div className="flex flex-col lg:flex-row md:flex-row">
      {/* Left Card: Form Pengisian */}
      <div key="order-form-card" className="mb-10 ml-40 mt-10 w-2/3 rounded-lg border border-gray-200 bg-white p-6 shadow-lg lg:ml-40">
        <h2 className="mb-6 text-2xl font-bold text-primary">Form Pengisian</h2>

        {/* Pilih Jenis Layanan */}
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Pilih Jenis Layanan</h3>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleServiceTypeChange('Normal')}
              className={`flex-1 rounded-md border px-6 py-3 text-center font-medium transition ${orderInputData.jenis_layanan === 'Normal' ? 'border-primary text-primary' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              disabled={isFormDisabled}
            >
              Normal
              <p className="mt-1 text-sm text-gray-500">
                <Calendar className="mb-1 mr-1 inline size-4" /> 3 - 4 hari
              </p>
            </button>
            <button
              type="button"
              onClick={() => handleServiceTypeChange('Instant')}
              className={`flex-1 rounded-md border px-6 py-3 text-center font-medium transition ${orderInputData.jenis_layanan === 'Instant' ? 'border-primary text-primary' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              disabled={isFormDisabled}
            >
              Instant
              <p className="mt-1 text-sm text-gray-500">
                <Clock className="mr-1 inline size-4" /> 2 hari
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
              value={orderInputData.berat_pakaian}
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
              value={orderInputData.alamat_penjemputan}
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
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Tanggal & Waktu Penjemputan</h3>
          <div className="relative flex items-center">
            <Calendar size={20} className="absolute left-3 text-gray-400" />
            <input
              id="tanggal_pesanan"
              type="datetime-local"
              value={orderInputData.tanggal_pesanan}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-gray-700 focus:border-primary focus:ring-primary"
              disabled={isFormDisabled}
            />
          </div>
        </div>

        {/* Pilih Metode Bayar */}
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
                <img src="/money.png" alt="Cash" className="mr-1 inline-flex h-10" /> Cash
              </h1>
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Dengan melanjutkan, kamu menyetujui{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Syarat & Ketentuan
          </Link>{' '}
          yang berlaku.
        </p>

        {/* Error and Not Logged In Messages */}
        {insertError && <p className="mt-4 text-red-500">{insertError}</p>}
        {!session?.user?.id && <p className="mt-4 text-orange-500">Silakan masuk untuk membuat pesanan.</p>}
      </div>

      {/* Right Card: Order Summary (with sticky positioning) */}
      <div key="order-summary-card" className="mb-10 w-[100%] self-start rounded-lg border border-gray-200 p-6 shadow-md md:ml-5 md:mt-10 md:sticky md:top-8 md:w-1/3 lg:ml-8 lg:mt-10">
        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold text-gray-700">Total Harga</h3>
          <div className="relative flex items-center">
            <input
              id="total_harga_display"
              type="text"
              value={formatRupiah(totalHarga)} // Tampilkan nilai totalHarga dari useMemo
              readOnly
              placeholder="Harga"
              className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 py-3 pl-4 pr-3 text-lg font-bold text-gray-700 placeholder-gray-400"
              disabled
            />
          </div>
        </div>
        {/* Submit Button */}
        <Button type="button" onClick={handleSubmitOrder} disabled={isSubmitDisabled} className={`w-full py-3 text-lg font-semibold ${isSubmitDisabled ? 'cursor-not-allowed opacity-50' : ''}`}>
          {loading ? 'Memproses...' : 'Bayar Sekarang'}
        </Button>
      </div>
    </div>
  );
};

export default OrderForm;
