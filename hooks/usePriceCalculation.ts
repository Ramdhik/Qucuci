// hooks/usePriceCalculation.ts
import { useState, useEffect, useMemo } from 'react';

interface UsePriceCalculationResult {
  calculatedPrice: number;
  formattedPrice: string;
  calculatePrice: (weight: number | string, serviceType: 'Normal' | 'Instant') => number;
  formatRupiah: (number: number | string) => string; // Tambahkan formatter ke hasil hook
}

const PRICE_PER_KG = 8000; // --- HARGA PER KILO DIUBAH MENJADI 8000 ---
const INSTANT_SERVICE_FEE = 5000; // Biaya tambahan untuk layanan Instant (tetap)
const BASE_SERVICE_FEE = 10000; // --- BIAYA JASA TETAP SEBESAR 10000 ---

const usePriceCalculation = (): UsePriceCalculationResult => {
  // State internal di hook ini tidak diperlukan untuk perhitungan dasar
  // State harga akan dikelola di komponen OrderForm

  // Fungsi untuk melakukan perhitungan
  const calculatePrice = (weight: number | string, serviceType: 'Normal' | 'Instant'): number => {
    const parsedWeight = typeof weight === 'string' ? parseFloat(weight) : weight;

    // --- Perhitungan Harga ---
    let price = BASE_SERVICE_FEE; // Mulai dengan biaya jasa tetap

    if (!isNaN(parsedWeight) && parsedWeight > 0) {
      price += parsedWeight * PRICE_PER_KG; // Tambahkan biaya berdasarkan berat
    } else {
      // Jika berat tidak valid atau <= 0, harga hanya biaya jasa tetap
      // price = BASE_SERVICE_FEE; // Ini sudah tercakup di baris atas
    }

    // Tambahkan biaya tambahan jika layanan Instant
    if (serviceType === 'Instant') {
      price += INSTANT_SERVICE_FEE;
    }

    return price;
  };

  // Helper function to format number as Indonesian Rupiah (reusable)
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

  // Hook ini hanya mengembalikan fungsi perhitungan dan formatter.
  return {
    // calculatedPrice dan formattedPrice di return ini bisa dihapus/diabaikan karena state harga dikelola di OrderForm
    calculatedPrice: 0, // Set to a default or remove if not used
    formattedPrice: '', // Set to a default or remove if not used
    calculatePrice: calculatePrice, // Mengembalikan fungsi perhitungan
    formatRupiah: formatRupiah, // Mengembalikan fungsi formatter
  };
};

export default usePriceCalculation;
