// utils/formatters.ts

/**
 * Formats a number as Indonesian Rupiah currency string.
 * @param amount - The number or string to format.
 * @returns The formatted Rupiah string, or empty string for invalid input.
 */
export const formatRupiah = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return '';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0, // Set to 0 to remove decimal places for whole numbers
    maximumFractionDigits: 2, // Allow up to 2 decimal places if needed
  }).format(num);
};

// Anda bisa tambahkan helper formatter lain di sini nanti jika perlu
// export const formatTanggal = (dateString: string): string => { ... };
