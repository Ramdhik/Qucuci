import ConnectSupabaseSteps from '@/components/tutorial/connect-supabase-steps';
import SignUpUserSteps from '@/components/tutorial/sign-up-user-steps';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { redirect } from 'next/navigation'; // Gunakan dari next/navigation, bukan next/dist/server/api-utils

export default async function Home() {
  // Redirect ke halaman /home
  redirect('/home');
  
  // Kode di bawah ini tidak akan dijalankan karena redirect menghentikan eksekusi fungsi
  // return (
  //   <>
  //     <main className="flex-1 flex flex-col gap-6 px-4">
  //       {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
  //     </main>
  //   </>
  // );
}
