import ConnectSupabaseSteps from '@/components/tutorial/connect-supabase-steps';
import SignUpUserSteps from '@/components/tutorial/sign-up-user-steps';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import { redirect } from 'next/navigation'; // Gunakan dari next/navigation, bukan next/dist/server/api-utils

export default async function Home() {
  redirect('/home');
}
