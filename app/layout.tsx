// app/layout.tsx

import { EnvVarWarning } from '@/components/env-var-warning';
import HeaderAuth from '@/components/header-auth';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { Geist } from 'next/font/google';
import './globals.css';
import Footer from '@/components/footer';

// const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

// export const metadata = {
//   metadataBase: new URL(defaultUrl),
//   title: 'Next.js and Supabase Starter Kit',
//   description: 'The fastest way to build apps with Next.js and Supabase',
// };

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
      {/* Use flexbox on the body to create a column layout */}
      <body className="bg-background text-foreground flex flex-col min-h-screen">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 text-sm">{!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}</div>
        </nav>

        {/* Main Content Area (will take all available space) */}
        {/* This div now wraps ONLY the children and has flex-grow */}
        <main className="relative flex-grow w-full flex flex-col items-center">
          <img src="/accent.png" alt="Logo" className="w-auto object-contain absolute left-0 -z-50" />

          {children}
        </main>

        {/* Footer (will take 'auto' height) */}
      </body>
    </html>
  );
}
