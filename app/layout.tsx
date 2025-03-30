import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Your App Name', // Ubah sesuai nama aplikasi Anda
  description: 'Description of your application', // Ubah sesuai deskripsi aplikasi Anda
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // Mengubah default theme ke light (putih)
          enableSystem={false} // Menonaktifkan system theme
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
              {/* Navbar */}
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={'/home'}>Your App Name</Link> {/* Ubah link ke /home dan nama aplikasi */}
                    <div className="flex items-center gap-4">
                      <Link href={'/home'}>Home</Link>
                      <Link href={'/about'}>About</Link>
                      <Link href={'/contact'}>Contact</Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <HeaderAuth /> {/* Komponen untuk login/logout */}
                    <ThemeSwitcher /> {/* Mempertahankan theme switcher */}
                  </div>
                </div>
              </nav>

              {/* Page Content */}
              <div className="flex flex-col gap-20 max-w-5xl p-5 w-full">{children}</div>

              {/* Footer */}
              <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
                <p>
                  © {new Date().getFullYear()} Your App Name. All rights reserved.
                  {' | '}
                  <span>
                    Powered by{' '}
                    <a href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs" target="_blank" className="font-bold hover:underline" rel="noreferrer">
                      Supabase
                    </a>
                  </span>
                </p>
              </footer>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
