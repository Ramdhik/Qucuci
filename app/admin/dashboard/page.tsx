// app/admin/dashboard/page.tsx
'use client';

import useAdminOrders from '@/hooks/useAdminOrders';
import AdminOrderList from '@/components/AdminOrderList';
import AdminStatsSummary from '@/components/AdminStatsSummary'; // Import the new component
// Anda mungkin juga membutuhkan hook sesi atau helper otorisasi admin di sini

export default function AdminDashboardPage() {
  // TODO: Tambahkan logika untuk memeriksa apakah user saat ini adalah admin
  // Ini KRITIS untuk keamanan halaman admin.
  // Contoh (placeholder):
  // const { session, loadingSession } = useSession();
  // const isAdmin = session?.user?.user_metadata?.role === 'admin'; // Contoh cek peran

  // Fetch semua order menggunakan hook admin
  // Hook useAdminOrders seharusnya sudah fetch semua order karena admin
  const { orders, loading, error, fetchOrders } = useAdminOrders();

  // TODO: Tampilkan pesan atau redirect jika user bukan admin atau belum login
  // Ini harus diimplementasikan sebelum merender konten dashboard yang sensitif.
  // if (loadingSession) return <p>Loading user...</p>;
  // if (!session || !isAdmin) return <p>Access Denied. You must be an admin.</p>; // Atau redirect

  // Jika user adalah admin (berdasarkan logika TODO di atas)
  // Render ringkasan statistik di atas daftar order
  return (
    <div className="flex w-screen flex-col items-center py-8">
      {/* Render ringkasan statistik */}
      {/* Pass orders data to the summary component */}
      <AdminStatsSummary orders={orders} loading={loading} error={error} />

      {/* Render daftar order (tabel) */}
      <AdminOrderList orders={orders} loading={loading} error={error} />

      {/* Optional: Refresh button (bisa ditaruh di sini atau di salah satu komponen anak) */}
      <button onClick={fetchOrders} disabled={loading} className="mt-6 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
        Refresh Data
      </button>
    </div>
  );
}
