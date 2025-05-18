// components/header-auth.tsx atau AuthButton.tsx (tergantung nama file Anda)
import { signOutAction } from '@/app/actions';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/server'; // Server client
import { Bell, User } from 'lucide-react';
import { Popover, PopoverTrigger } from './ui/popover';
import { PopoverContent } from '@radix-ui/react-popover'; // Using Radix PopoverContent
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Tentukan email admin yang diizinkan
const ADMIN_EMAIL = 'qucuciid@gmail.com';
const DEFAULT_LOGO_SRC = '/logo.png'; // Definisikan logo src

export default async function AuthButton({ showRoutes = true }) {
  const supabase = await createClient(); // Server client

  const {
    data: { user },
  } = await supabase.auth.getUser(); // Get user on the server

  // Helper function for initials
  const getInitials = (name: string) => {
    return (
      name
        ?.split(' ') // Gunakan optional chaining jika nama bisa null/undefined
        .map((word) => word[0]?.toUpperCase()) // Gunakan optional chaining
        .join('')
        .slice(0, 2) || 'UN'
    ); // Default ke 'UN' jika nama kosong/null
  };

  // Cek apakah user adalah admin
  const isAdmin = user?.email === ADMIN_EMAIL; // Cek email user

  if (!hasEnvVars) {
    return (
      // ... (existing EnvVars warning block) ...
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <Button asChild size="sm" variant={'ghost'} disabled className="opacity-75 cursor-none pointer-events-none">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={'default'} disabled className="opacity-75 cursor-none pointer-events-none">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (user) {
    // User is logged in - display user specific layout
    return (
      <div className="flex items-center justify-between w-full">
        {/* Left section: Logo */}
        <div className="flex items-center">
          <img src={DEFAULT_LOGO_SRC} alt="Logo" className="w-auto h-10 max-h-10 object-contain" /> {/* Use alt="Logo" and general image styling */}
        </div>

        {/* Middle Section: Routing */}
        {/* Conditional render routes: show only if showRoutes prop is true AND user is NOT admin */}
        {showRoutes && !isAdmin && (
          <div className="flex items-center gap-5 font-medium text-xl text-gray-500">
            <Link className="hover:text-primary" href={'/home'}>
              Home
            </Link>
            <Link className="hover:text-primary" href={'/pemesanan'}>
              Pemesanan
            </Link>
            <Link className="hover:text-primary" href={'/riwayat'}>
              Riwayat
            </Link>
            {/* Add more user routes here */}
          </div>
        )}

        {/* Middle Section: Admin Dashboard Link (Optional) */}
        {/* Show admin dashboard link only if user IS admin */}
        {isAdmin && (
          <div className="flex items-center gap-5 font-medium text-xl text-gray-500">
            <Link className="hover:text-primary" href={'/admin/dashboard'}>
              Admin Dashboard
            </Link>
            {/* Add more admin routes here if needed */}
          </div>
        )}

        {/* Right Section: Notifications and Profile */}
        <div className="flex flex-row items-center gap-2">
          {/* Notification Popover - Show for all logged-in users */}
          <Popover>
            <PopoverTrigger className=" rounded-full p-2 hover:bg-slate-100 shadow-xl">
              <Bell size={20} className="text-primary" />
            </PopoverTrigger>
            <PopoverContent className="w-100 bg-[#FEFEFE] p-5 rounded-md shadow-lg ">
              {' '}
              {/* Adjusted width if needed */}
              <div className="flex flex-col">
                <h1 className="text-xl font-bold">Notifikasi</h1>
                {/* Example Notification Item */}
                <div className="flex flex-col bg-white shadow-xl rounded-md p-4 space-y-2 mt-3">
                  <div className="flex flex-row gap-4">
                    <p className="text-sm">23 Maret 2025 - 14.39</p> {/* Added text-sm */}
                    <p className="text-primary text-sm gap-4 font-mono">#alkdflkasjdfkljfdsal</p> {/* Added text-sm and font-mono */}
                  </div>
                  <div className="flex flex-row gap-6">
                    <p className="text-[#878787] text-sm">Status</p> {/* Added text-sm */}
                    <p className="text-sm">Berhasil</p> {/* Added text-sm */}
                  </div>
                </div>
                {/* Add more notification items here */}
              </div>
            </PopoverContent>
          </Popover>

          {/* Profile Dropdown */}
          <DropdownMenu>
            {/* Dropdown Trigger (Avatar/Initials) */}
            <DropdownMenuTrigger className="rounded-full p-2 hover:bg-slate-100 shadow-xl">
              {/* Show initials if name is available, otherwise show a default icon or avatar */}
              {user?.user_metadata?.name ? getInitials(user.user_metadata.name) : <User className="text-primary" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              <div className="flex flex-col mb-2">
                {' '}
                {/* Added margin-bottom */}
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuLabel>{user?.user_metadata?.name || 'No Name'}</DropdownMenuLabel> {/* Fallback if name is null */}
              </div>
              <DropdownMenuSeparator /> {/* Add separator */}
              {/* Admin Specific Menu Item */}
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              {/* Add other user specific menu items here */}
              {!isAdmin && (
                <>
                  <DropdownMenuItem>Pusat Akun</DropdownMenuItem>
                  <DropdownMenuItem>Bantuan</DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator /> {/* Add separator */}
              {/* Sign Out Button */}
              <DropdownMenuItem asChild>
                <form action={signOutAction}>
                  <Button type="submit" variant={'ghost'} className="w-full justify-start p-0">
                    Sign out
                  </Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  } else {
    // User is NOT logged in - display sign-in/sign-up buttons
    return (
      <div className="flex w-full items-center justify-between gap-3">
        {/* Left section: Logo */}
        <div className="flex items-center">
          <img src={DEFAULT_LOGO_SRC} alt="Logo" className="h-10 w-auto max-h-10 object-contain" />
        </div>

        {/* Right section: Sign In/Sign Up Buttons */}
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant={'ghost'}>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={'default'}>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }
}
