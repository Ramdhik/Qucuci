import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/pemesanan', '/riwayat'];
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute) {
    try {
      const { createClient } = await import('@/utils/supabase/server');
      // Use await here to get the SupabaseClient instance
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const absoluteUrl = new URL('/home', request.nextUrl.origin);
        return NextResponse.redirect(absoluteUrl.toString());
      }
    } catch (e) {
      const absoluteUrl = new URL('/home', request.nextUrl.origin);
      return NextResponse.redirect(absoluteUrl.toString());
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api|auth|sign-in|sign-up).*)'],
};
