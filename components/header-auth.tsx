import { signOutAction } from '@/app/actions';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/server';
import { Bell } from 'lucide-react';
import { Popover, PopoverTrigger } from './ui/popover';
import { PopoverContent } from '@radix-ui/react-popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default async function AuthButton({ showRoutes = true }) {
  // Added prop
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('')
      .slice(0, 2);
  };

  if (!hasEnvVars) {
    return (
      <>
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
      </>
    );
  }

  if (user) {
    return (
      <div className="flex items-center lg:gap-96">
        {showRoutes && ( // Conditional rendering of routes
          <div className="flex items-center gap-5 font-semibold text-xl">
            <Link className="hover:text-primary" href={'/home'}>
              Home
            </Link>
            <Link className="hover:text-primary" href={'/pemesanan'}>
              Pemesanan
            </Link>
            <Link className="hover:text-primary" href={'/riwayat'}>
              Riwayat
            </Link>
          </div>
        )}
        <div className="flex flex-row items-center gap-2">
          {' '}
          <Popover>
            <PopoverTrigger className=" rounded-full p-2 hover:bg-slate-100 shadow-xl">
              <Bell size={20} className="text-primary" />
            </PopoverTrigger>
            <PopoverContent className="w-100 bg-[#FEFEFE] p-5 rounded-md shadow-lg ">
              <div className="flex flex-col">
                <h1 className="text-xl font-bold">Notifikasi</h1>
                <div className="flex flex-col bg-white shadow-xl rounded-md p-4 space-y-2">
                  <div className="flex flex-row gap-4">
                    <p>23 Maret 2025 - 14.39</p>
                    <p className="text-primary gap-4">#alkdflkasjdfkljfdsal</p>
                  </div>
                  <div className="flex flex-row gap-6">
                    <p className="text-[#878787]">Status</p>
                    <p>Berhasil</p>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full p-2 hover:bg-slate-100 shadow-xl">{getInitials(user?.user_metadata?.name || 'Unknown')}</DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                </div>
              </div>
              <DropdownMenuItem>Pusat Akun</DropdownMenuItem>
              <DropdownMenuItem>Bantuan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {' '}
                <form action={signOutAction}>
                  <Button type="submit" variant={'ghost'}>
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
    return (
      <div className="flex gap-3">
        <Button asChild size="sm" variant={'ghost'}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={'default'}>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }
}
