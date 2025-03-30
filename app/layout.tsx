import HeaderAuth from '@/components/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import Image from 'next/image';
import Footer from '@/components/footer';

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
        <main className="min-h-screen flex flex-col items-center">
          <div className="flex-1 w-full flex flex-col items-center">
            {/* Navbar */}
            <nav className="w-full flex justify-center border-b border-b-foreground/10 sticky top-0 bg-background z-10">
              <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                <Link href="/home">
                  <Image src="/logo.png" alt="Logo" width={200} height={200} style={{ cursor: 'pointer' }} />
                </Link>
                <div className="flex items-center gap-4">
                  <HeaderAuth /> {/* Komponen untuk login/logout */}
                </div>
              </div>
            </nav>

            {/* Page Content */}
            <div className="w-full">{children}</div>

            {/* Footer */}
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
