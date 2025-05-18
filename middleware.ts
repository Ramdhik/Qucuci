// import { type NextRequest, NextResponse } from 'next/server';
// import { updateSession } from '@/utils/supabase/middleware';

// export async function middleware(request: NextRequest) {
//   const protectedRoutes = ['/pemesanan', '/riwayat', '/admin/dashboard'];
//   const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

//   if (isProtectedRoute) {
//     try {
//       const { createClient } = await import('@/utils/supabase/server');
//       // Use await here to get the SupabaseClient instance
//       const supabase = await createClient();
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         const absoluteUrl = new URL('/home', request.nextUrl.origin);
//         return NextResponse.redirect(absoluteUrl.toString());
//       }
//     } catch (e) {
//       const absoluteUrl = new URL('/home', request.nextUrl.origin);
//       return NextResponse.redirect(absoluteUrl.toString());
//     }
//   }

//   return await updateSession(request);
// }

// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth|sign-in|sign-up).*)'],
// };
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

// Tentukan email admin yang diizinkan
const ADMIN_EMAIL = 'qucuciid@gmail.com';

export async function middleware(request: NextRequest) {
  // Daftar rute yang memerlukan autentikasi (login)
  const authenticatedRoutes = ['/pemesanan', '/riwayat', '/admin/dashboard'];

  // Daftar rute yang memerlukan autentikasi DAN peran admin
  const adminRoutes = ['/admin/dashboard']; // Hanya dashboard admin yang butuh cek email

  const isAuthRequired = authenticatedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  // Jika rute memerlukan autentikasi atau admin access
  if (isAuthRequired) {
    try {
      const { createClient } = await import('@/utils/supabase/server');
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Cek apakah user sudah login
      if (!user) {
        // Jika tidak login, redirect ke halaman home (atau halaman login)
        const absoluteUrl = new URL('/home', request.nextUrl.origin); // Bisa juga ke /sign-in
        console.log(`Middleware: Redirecting unauthenticated user from ${request.nextUrl.pathname} to ${absoluteUrl}`);
        return NextResponse.redirect(absoluteUrl.toString());
      }

      // Jika user login, cek apakah ini rute admin DAN emailnya cocok
      if (isAdminRoute) {
        // Periksa email user yang login
        if (user.email !== ADMIN_EMAIL) {
          // Jika email bukan email admin, redirect ke halaman home (atau halaman lain)
          const absoluteUrl = new URL('/home', request.nextUrl.origin); // Bisa juga ke dashboard user
          console.log(`Middleware: Redirecting non-admin user (${user.email}) from ${request.nextUrl.pathname} to ${absoluteUrl}`);
          return NextResponse.redirect(absoluteUrl.toString());
        }
        console.log(`Middleware: Admin user (${user.email}) accessing admin route ${request.nextUrl.pathname}`);
      } else {
        console.log(`Middleware: Authenticated user (${user.email}) accessing authenticated route ${request.nextUrl.pathname}`);
      }
    } catch (e) {
      console.error('Middleware: Error checking user auth or admin status:', e);
      // Tangani error saat cek auth/admin (misalnya masalah DB atau Supabase)
      // Redirect ke home atau halaman error
      const absoluteUrl = new URL('/home', request.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
    }
  }

  // Untuk semua rute (termasuk yang sudah diizinkan aksesnya di atas),
  // jalankan updateSession untuk refresh cookie
  console.log(`Middleware: Running updateSession for ${request.nextUrl.pathname}`);
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api routes (unless you want to protect them)
     * - authentication routes (/sign-in, /sign-up, /auth/*)
     * - halaman home (karena itu landing page)
     * Sesuaikan matcher jika Anda punya rute publik lain
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth|sign-in|sign-up|^/$).*)',
  ],
};
